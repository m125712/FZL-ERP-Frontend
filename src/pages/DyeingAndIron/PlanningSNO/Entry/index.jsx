import { DeleteModal } from '@/components/Modal';
import {
	useFetchForRhfResetForOrder,
	usePostFunc,
	useRHF,
	useFetch,
	useUpdateFunc,
	useFetchForRhfResetForPlanning,
} from '@/hooks';
import {
	CheckBoxWithoutLabel,
	DynamicDeliveryField,
	Input,
	Textarea,
} from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import {
	DYEING_PLANNING_SNO_SCHEMA,
	DYEING_PLANNING_SNO_NULL,
} from '@util/Schema';
import { Suspense, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useDyeingPlanningSNO } from '@/state/Dyeing';
import nanoid from '@/lib/nanoid';

import Header from './Header';

// UPDATE IS WORKING
export default function Index() {
	const { data, url, updateData, postData, deleteData, isLoading } =
		useDyeingPlanningSNO();
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
	} = useRHF(DYEING_PLANNING_SNO_SCHEMA, DYEING_PLANNING_SNO_NULL);

	// planning_entry
	const { fields: PlanningEntryField } = useFieldArray({
		control,
		name: 'planning_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const onClose = () => reset(DYEING_PLANNING_SNO_NULL);

	// * Fetch initial data
	isUpdate
		? useFetchForRhfResetForOrder(
				`/commercial/pi/details/${pi_uuid}`,
				pi_uuid,
				reset
			)
		: useFetchForRhfResetForPlanning(`/zipper/order-planning`, reset);

	// const { value: data } = useFetch('/zipper/order-planning');

	// console.log('Form array fields:', PlanningEntryField);
	// console.log('Form data:', getValues());

	// TODO: Not sure if this is needed. need further checking
	let order_info_ids;
	useEffect(() => {
		if (pi_uuid !== undefined) {
			setOrderInfoIds((prev) => ({
				...prev,
				order_info_ids,
			}));
		}
	}, [getValues('order_info_ids')]);

	// todo: Submit
	const onSubmit = async (data) => {
		// * Update
		// if (isUpdate) {
		// 	// Style / Color / Size
		// 	const pi_data = {
		// 		...data,
		// 		updated_at: GetDateTime(),
		// 	};
		// 	let pi_promise = useUpdateFunc({
		// 		uri: `/pi/${data?.id}/${data?.order_number}`,
		// 		itemId: data.id,
		// 		data: data,
		// 		updatedData: pi_data,
		// 		onClose: onClose,
		// 	}).catch((err) => console.error(`Error updating data: ${err}`));
		// 	// pi entry
		// 	let promises = data.planning_entry.map(async (item) => {
		// 		if (item.id === null && item.pi_quantity > 0) {
		// 			item.pi_uuid = pi_uuid;
		// 			item.created_at = GetDateTime();
		// 			return await usePostFunc({
		// 				uri: '/pi-entry',
		// 				data: item,
		// 			}).catch((err) => console.error(`Error: ${err}`));
		// 		}
		// 		if (item.id && item.pi_quantity >= 0) {
		// 			const updatedData = {
		// 				...item,
		// 				updated_at: GetDateTime(),
		// 				remarks: null,
		// 			};
		// 			return await useUpdateFunc({
		// 				// replace style brackets, /, #, & with space
		// 				uri: `/pi-entry/${item?.id}/${pi_uuid}`,
		// 				itemId: item.id,
		// 				data: item,
		// 				updatedData: updatedData,
		// 				onClose: onClose,
		// 			}).catch((err) =>
		// 				console.error(`Error updating data: ${err}`)
		// 			);
		// 		}
		// 		return null;
		// 	});
		// 	try {
		// 		await Promise.all([pi_promise, ...promises])
		// 			.then(() => reset(Object.assign({}, PI_NULL)))
		// 			.then(() => navigate(`/commercial/pi/details/${pi_id}`));
		// 	} catch (err) {
		// 		console.error(`Error with Promise.all: ${err}`);
		// 	}
		// 	return;
		// }

		// * ADD data
		var planning_uuid = nanoid();
		const created_at = GetDateTime();
		const planning_data = {
			...data,
			uuid: planning_uuid,
			created_at,
			created_by: user.uuid,
		};

		console.log('planning_data:', planning_data);

		const planning_entry = [...data.planning_entry]
			.filter((item) => item.is_checked)
			.map((item) => ({
				...item,
				uuid: nanoid(),
				planning_uuid: planning_data.uuid,
				remarks: item.plan_entry_remarks,
				created_at,
			}));

		console.log('planning_entry_data:', planning_entry);

		if (planning_entry.length === 0) {
			alert('Select at least one item to proceed.');
		} else {
			// await postData.mutateAsync({
			// 	url,
			// 	newData: planning_data,
			// 	isOnCloseNeeded: false,
			// });

			let promises = [
				...planning_entry.map(
					async (item) =>
						await postData.mutateAsync({
							url: '/zipper/planning-entry',
							newData: item,
							isOnCloseNeeded: false,
						})
				),
			];

			// await Promise.all(promises)
			// 	.then(() => reset(Object.assign({}, PI_NULL)))
			// 	.then(() => navigate(`/commercial/pi`))
			// 	.catch((err) => console.log(err));
		}
	};

	// Check if order_number is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;
	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';

	useEffect(() => {
		if (isAllChecked || isSomeChecked) {
			return PlanningEntryField.forEach((item, index) => {
				setValue(`planning_entry[${index}].is_checked`, true);
			});
		}
		if (!isAllChecked) {
			return PlanningEntryField.forEach((item, index) => {
				setValue(`planning_entry[${index}].is_checked`, false);
			});
		}
	}, [isAllChecked]);

	const handleRowChecked = (e, index) => {
		const isChecked = e.target.checked;
		setValue(`planning_entry[${index}].is_checked`, isChecked);

		let isEveryChecked = true,
			isSomeChecked = false;

		for (let item of watch('planning_entry')) {
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
					}}
				/>
				<DynamicDeliveryField
					title={
						`Planning Entries: `
						// +
						// watch("planning_entry").filter((item) => item.is_checked)
						// 	.length +
						// "/" +
						// PlanningEntryField.length
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
								'Order QTY (PCS)',
								'SNO QTY',
								'Factory QTY',
								'Production QTY',
								'Batch production QTY',
								'Remarks',
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
					{PlanningEntryField?.map((item, index) => (
						<tr
							key={item.id}
							className='cursor-pointer transition-colors duration-300 ease-in even:bg-primary/10 hover:bg-primary/30 focus:bg-primary/30'>
							<td className={`w-8 ${rowClass}`}>
								<CheckBoxWithoutLabel
									label={`planning_entry[${index}].is_checked`}
									checked={watch(
										`planning_entry[${index}].is_checked`
									)}
									onChange={(e) => handleRowChecked(e, index)}
									disabled={
										getValues(
											`planning_entry[${index}].pi_quantity`
										) == 0
									}
									{...{ register, errors }}
								/>
							</td>
							<td className={`w-32 ${rowClass}`}>
								{/* {getValues(
									`planning_entry[${index}].order_number`
								)} */}
								{item.order_number}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(
									`planning_entry[${index}].item_description`
								)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`planning_entry[${index}].style`)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`planning_entry[${index}].color`)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(`planning_entry[${index}].size`)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`planning_entry[${index}].order_quantity`
								)}
							</td>
							<td className={`${rowClass}`}>
								<Input
									label={`planning_entry[${index}].sno_quantity`}
									is_title_needed='false'
									height='h-8'
									dynamicerror={
										errors?.planning_entry?.[index]
											?.sno_quantity
									}
									disabled={
										getValues(
											`planning_entry[${index}].sno_quantity`
										) === 0
									}
									{...{ register, errors }}
								/>
							</td>
							<td className={`w-32 ${rowClass}`}>
								<Input
									label={`planning_entry[${index}].factory_quantity`}
									is_title_needed='false'
									height='h-8'
									dynamicerror={
										errors?.planning_entry?.[index]
											?.factory_quantity
									}
									disabled={
										getValues(
											`planning_entry[${index}].factory_quantity`
										) === 0
									}
									{...{ register, errors }}
								/>
							</td>
							<td className={`w-32 ${rowClass}`}>
								<Input
									label={`planning_entry[${index}].production_quantity`}
									is_title_needed='false'
									height='h-8'
									dynamicerror={
										errors?.planning_entry?.[index]
											?.production_quantity
									}
									disabled={
										getValues(
											`planning_entry[${index}].production_quantity`
										) === 0
									}
									{...{ register, errors }}
								/>
							</td>
							<td className={`w-32 ${rowClass}`}>
								<Input
									label={`planning_entry[${index}].batch_production_quantity`}
									is_title_needed='false'
									height='h-8'
									dynamicerror={
										errors?.planning_entry?.[index]
											?.batch_production_quantity
									}
									disabled={
										getValues(
											`planning_entry[${index}].batch_production_quantity`
										) === 0
									}
									{...{ register, errors }}
								/>
							</td>
							<td className={`w-32 ${rowClass}`}>
								<Textarea
									label={`planning_entry[${index}].plan_entry_remarks`}
									is_title_needed='false'
									height='h-8'
									dynamicerror={
										errors?.planning_entry?.[index]
											?.plan_entry_remarks
									}
									disabled={
										getValues(
											`planning_entry[${index}].plan_entry_remarks`
										) === 0
									}
									{...{ register, errors }}
								/>
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
					modalId={'planning_entry_delete'}
					title={'Order Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={PlanningEntryField}
					uri={`/order/entry`}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</div>
	);
}
