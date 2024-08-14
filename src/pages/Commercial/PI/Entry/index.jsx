import { DeleteModal } from '@/components/Modal';
import {
	useFetchForRhfResetForOrder,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from '@/hooks';
import { CheckBoxWithoutLabel, DynamicDeliveryField, Input } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { PI_NULL, PI_SCHEMA } from '@util/Schema';
import { customAlphabet } from 'nanoid';
import { Suspense, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import Header from './Header';

const alphabet =
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 10);

// UPDATE IS WORKING
export default function Index() {
	const { pi_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [isAllChecked, setIsAllChecked] = useState(false);
	const [isSomeChecked, setIsSomeChecked] = useState(false);
	const isUpdate = pi_uuid !== undefined;
	const [orderInfoIds, setOrderInfoIds] = useState({});

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		useFieldArray,
		getValues,
		watch,
		setValue,
	} = useRHF(PI_SCHEMA, PI_NULL);

	// pi_entry
	const { fields: orderEntryField } = useFieldArray({
		control,
		name: 'pi_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const onClose = () => reset(PI_NULL);
	let order_info_ids;
	isUpdate
		? (order_info_ids = JSON.parse(getValues('order_info_ids')))
		: (order_info_ids = orderInfoIds?.order_info_ids?.join(',') || null);

	isUpdate
		? useFetchForRhfResetForOrder(
				`/commercial/pi/details/${pi_uuid}`,
				pi_uuid,
				reset
			)
		: useFetchForRhfResetForOrder(
				`/pi/details/by/order-info-ids/${order_info_ids}/${watch('party_id')}/${watch('marketing_id')}`,
				orderInfoIds,
				reset
			);

	useEffect(() => {
		if (pi_uuid !== undefined) {
			setOrderInfoIds((prev) => ({
				...prev,
				order_info_ids,
			}));
		}
	}, [getValues('order_info_ids')]);

	// Submit
	const onSubmit = async (data) => {
		// Update
		if (isUpdate) {
			// Style / Color / Size
			const pi_data = {
				...data,
				updated_at: GetDateTime(),
			};
			let pi_promise = useUpdateFunc({
				uri: `/pi/${data?.id}/${data?.order_number}`,
				itemId: data.id,
				data: data,
				updatedData: pi_data,
				onClose: onClose,
			}).catch((err) => console.error(`Error updating data: ${err}`));

			// pi entry
			let promises = data.pi_entry.map(async (item) => {
				if (item.id === null && item.pi_quantity > 0) {
					item.pi_uuid = pi_uuid;
					item.created_at = GetDateTime();

					return await usePostFunc({
						uri: '/pi-entry',
						data: item,
					}).catch((err) => console.error(`Error: ${err}`));
				}

				if (item.id && item.pi_quantity >= 0) {
					const updatedData = {
						...item,
						updated_at: GetDateTime(),
						remarks: null,
					};

					return await useUpdateFunc({
						// replace style brackets, /, #, & with space
						uri: `/pi-entry/${item?.id}/${pi_uuid}`,
						itemId: item.id,
						data: item,
						updatedData: updatedData,
						onClose: onClose,
					}).catch((err) =>
						console.error(`Error updating data: ${err}`)
					);
				}
				return null;
			});

			try {
				await Promise.all([pi_promise, ...promises])
					.then(() => reset(Object.assign({}, PI_NULL)))
					.then(() => navigate(`/commercial/pi/details/${pi_id}`));
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		// Add
		var new_pi_uuid = nanoid();
		const created_at = GetDateTime();

		const pi = {
			...data,
			pi_uuid: new_pi_uuid,
			order_info_ids: JSON.stringify(order_info_ids),
			created_at,
			issued_by: user.id,
		};

		const pi_entry = [...data.pi_entry]
			.filter((item) => item.is_checked && item.pi_quantity > 0)
			.map((item) => ({
				...item,
				pi_uuid: new_pi_uuid,
				created_at,
			}));

		if (pi_entry.length === 0) {
			alert('Select at least one item to proceed.');
		} else {
			await usePostFunc({
				uri: '/pi',
				data: pi,
			});

			let promises = [
				...pi_entry.map(
					async (item) =>
						await usePostFunc({
							uri: '/pi-entry',
							data: item,
						})
				),
			];
			await Promise.all(promises)
				.then(() => reset(Object.assign({}, PI_NULL)))
				.then(() => navigate(`/commercial/pi`))
				.catch((err) => console.log(err));
		}
	};

	// Check if order_number is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;
	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';

	useEffect(() => {
		if (isAllChecked || isSomeChecked) {
			return orderEntryField.forEach((item, index) => {
				setValue(`pi_entry[${index}].is_checked`, true);
			});
		}
		if (!isAllChecked) {
			return orderEntryField.forEach((item, index) => {
				setValue(`pi_entry[${index}].is_checked`, false);
			});
		}
	}, [isAllChecked]);

	const handleRowChecked = (e, index) => {
		const isChecked = e.target.checked;
		setValue(`pi_entry[${index}].is_checked`, isChecked);

		let isEveryChecked = true,
			isSomeChecked = false;

		for (let item of watch('pi_entry')) {
			if (item.is_checked) {
				isSomeChecked = true;
			} else {
				isEveryChecked = false;
			}

			if (isSomeChecked && !isEveryChecked) {
				break;
			}
		}

		setIsAllChecked(isEveryChecked);
		setIsSomeChecked(isSomeChecked);
	};

	return (
		<div className='container mx-auto mt-4 px-2 pb-2 md:px-4'>
			<form
				className='flex flex-col gap-4'
				onSubmit={handleSubmit(onSubmit)}
				noValidate>
				<Header
					{...{
						register,
						errors,
						control,
						getValues,
						Controller,
						isUpdate,
						orderInfoIds,
						setOrderInfoIds,
					}}
				/>
				<DynamicDeliveryField
					title={
						`Details: `
						// +
						// watch("pi_entry").filter((item) => item.is_checked)
						// 	.length +
						// "/" +
						// orderEntryField.length
					}
					// handelAppend={handelOrderEntryAppend}
					tableHead={
						<>
							<th
								key='is_all_checked'
								scope='col'
								className='group w-20 cursor-pointer select-none whitespace-nowrap bg-secondary px-3 py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300'>
								<CheckBoxWithoutLabel
									label='is_all_checked'
									checked={isAllChecked}
									onChange={(e) => {
										setIsAllChecked(e.target.checked);
										setIsSomeChecked(e.target.checked);
									}}
									{...{ register, errors }}
								/>
							</th>
							{[
								'O/N',
								'Item Description',
								'Style',
								'Color',
								'Size (CM)',
								'QTY (PCS)',
								'Given',
								'PI QTY',
								'Balance QTY',
							].map((item) => (
								<th
									key={item}
									scope='col'
									className='group cursor-pointer select-none whitespace-nowrap bg-secondary px-3 py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300'>
									{item}
								</th>
							))}
						</>
					}>
					{orderEntryField.map((item, index) => (
						<tr
							key={item.id}
							className='cursor-pointer transition-colors duration-300 ease-in even:bg-primary/10 hover:bg-primary/30 focus:bg-primary/30'>
							<td className={`w-8 ${rowClass}`}>
								<CheckBoxWithoutLabel
									label={`pi_entry[${index}].is_checked`}
									checked={watch(
										`pi_entry[${index}].is_checked`
									)}
									onChange={(e) => handleRowChecked(e, index)}
									disabled={
										getValues(
											`pi_entry[${index}].pi_quantity`
										) == 0
									}
									{...{ register, errors }}
								/>
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`pi_entry[${index}].order_number`)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(
									`pi_entry[${index}].item_description`
								)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`pi_entry[${index}].style`)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`pi_entry[${index}].color`)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(`pi_entry[${index}].size`)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(`pi_entry[${index}].quantity`)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`pi_entry[${index}].given_pi_quantity`
								)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								<Input
									label={`pi_entry[${index}].pi_quantity`}
									is_title_needed='false'
									height='h-8'
									dynamicerror={
										errors?.pi_entry?.[index]?.pi_quantity
									}
									disabled={
										getValues(
											`pi_entry[${index}].pi_quantity`
										) === 0
									}
									{...{ register, errors }}
								/>
								<Input
									label={`pi_entry[${index}].sfg_uuid`}
									is_title_needed='false'
									className='hidden'
									{...{ register, errors }}
								/>
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`pi_entry[${index}].balance_quantity`
								)}
							</td>
						</tr>
					))}
				</DynamicDeliveryField>
				<div className='modal-action'>
					<button
						type='submit'
						className='text-md btn btn-primary btn-block'>
						Save
					</button>
				</div>
			</form>

			<Suspense>
				<DeleteModal
					modalId={'pi_entry_delete'}
					title={'Order Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={orderEntryField}
					uri={`/order/entry`}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</div>
	);
}
