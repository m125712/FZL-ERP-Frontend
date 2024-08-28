import { DeleteModal } from '@/components/Modal';
import { useFetchForRhfResetForOrder, useRHF } from '@/hooks';
import { CheckBoxWithoutLabel, DynamicDeliveryField, Input } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import {
	DYEING_THREAD_CONNEING_NULL,
	DYEING_THREAD_CONNEING_SCHEMA,
} from '@util/Schema';
import { Suspense, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import cn from '@/lib/cn';
import nanoid from '@/lib/nanoid';
import { useCommercialPI, useCommercialPIEntry } from '@/state/Commercial';
import {
	useDyeingThreadBatch,
	useDyeingThreadBatchByUUID,
	useDyeingThreadBatchEntry,
} from '@/state/Dyeing';
import isJSON from '@/util/isJson';
import Header from './Header';

export default function Index() {
	const { url: commercialPiEntryUrl } = useDyeingThreadBatchEntry();
	const {
		url: commercialPiUrl,
		postData,
		updateData,
		deleteData,
	} = useDyeingThreadBatch();
	const { pi_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [isAllChecked, setIsAllChecked] = useState(false);
	const [isSomeChecked, setIsSomeChecked] = useState(false);
	const isUpdate = pi_uuid !== undefined;
	const [orderInfoIds, setOrderInfoIds] = useState('');

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
		getFieldState,
	} = useRHF(DYEING_THREAD_CONNEING_SCHEMA, DYEING_THREAD_CONNEING_NULL);

	// batch_entry
	const { fields: orderEntryField } = useFieldArray({
		control,
		name: 'batch_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	// isUpdate
	// 	? useFetchForRhfResetForOrder(
	// 			`/commercial/pi/details/${pi_uuid}`,
	// 			pi_uuid,
	// 			reset
	// 		)
	// 	:
	useFetchForRhfResetForOrder(
		`/thread/batch-details/by/${orderInfoIds}`,
		orderInfoIds,
		reset
	);

	// useEffect(() => {
	// 	if (!isUpdate) return;
	// 	if (orderInfoIds === null) return;

	// 	const updatedPiEntries = getValues('batch_entry').map((item) => {
	// 		if (!orderInfoIds.includes(item.order_info_uuid)) {
	// 			return {
	// 				...item,
	// 				isDeletable: true,
	// 			};
	// 		}

	// 		return item;
	// 	});

	// 	setValue('batch_entry', updatedPiEntries);
	// }, [isUpdate, orderInfoIds]);

	useEffect(() => {
		const uuid = getValues('uuid');

		if (uuid === null || uuid === '') {
			setOrderInfoIds(null);
		} else {
			if (isJSON(uuid)) {
				setOrderInfoIds(() => JSON.parse(uuid).split(',').join(','));
			} else {
				const uuid = getValues('uuid');
				if (!Array.isArray(uuid)) {
					setOrderInfoIds(() => uuid);
				} else {
					setOrderInfoIds(() => uuid.join(','));
				}
			}
		}
	}, [watch('uuid')]);

	// Submit
	const onSubmit = async (data) => {
		// Update item

		const commercialPiData = {
			coning_operator: data?.coning_operator,
			coning_supervisor: data?.coning_supervisor,
			coning_machines: data?.coning_machines,
			updated_at: GetDateTime(),
		};
		// update /commercial/pi/{uuid}
		const commercialPiPromise = await updateData.mutateAsync({
			url: `${commercialPiUrl}/${data?.uuid}`,
			updatedData: commercialPiData,
			uuid: orderInfoIds,
			isOnCloseNeeded: false,
		});

		// pi entry
		let updatedableCommercialPiEntryPromises = data.batch_entry.map(
			async (item) => {
				// if (item.uuid === null && item.pi_quantity > 0) {
				// 	return await postData.mutateAsync({
				// 		url: commercialPiEntryUrl,
				// 		newData: {
				// 			uuid: nanoid(),
				// 			is_checked: item.is_checked,
				// 			sfg_uuid: item?.sfg_uuid,
				// 			pi_quantity: item?.pi_quantity,
				// 			pi_uuid: pi_uuid,
				// 			created_at: GetDateTime(),
				// 			remarks: item?.remarks || null,
				// 		},
				// 		isOnCloseNeeded: false,
				// 	});
				// }

				const updatedData = {
					coning_production_quantity: item.coning_production_quantity,
					coning_production_quantity_in_kg:
						item?.coning_production_quantity_in_kg,
					updated_at: GetDateTime(),
				};

				return await updateData.mutateAsync({
					url: `${commercialPiEntryUrl}/${item?.batch_entry_uuid}`,
					updatedData: updatedData,
					uuid: item.batch_entry_uuid,
					isOnCloseNeeded: false,
				});
			}
		);
		// let deleteableCommercialPiEntryPromises = data.batch_entry
		// 	.filter((item) => item.isDeletable)
		// 	.map(async (item) => {
		// 		return await deleteData.mutateAsync({
		// 			url: `${commercialPiEntryUrl}/${item?.uuid}`,
		// 			isOnCloseNeeded: false,
		// 		});
		// 	});
		try {
			await Promise.all([
				commercialPiPromise,
				...updatedableCommercialPiEntryPromises,
			])
				.then(() =>
					reset(Object.assign({}, DYEING_THREAD_CONNEING_NULL))
				)
				.then(() => navigate(`/dyeing-and-iron/thread-batch`));
		} catch (err) {
			console.error(`Error with Promise.all: ${err}`);
		}
		return;

		// // Add new item
		// var new_pi_uuid = nanoid();
		// const created_at = GetDateTime();
		// const commercialPiData = {
		// 	...data,
		// 	uuid: new_pi_uuid,
		// 	uuid: JSON.stringify(orderInfoIds),
		// 	created_at,
		// 	created_by: user.uuid,
		// };
		// delete commercialPiData['is_all_checked'];
		// delete commercialPiData['batch_entry'];
		// const commercialPiEntryData = [...data.batch_entry]
		// 	.filter((item) => item.is_checked && item.pi_quantity > 0)
		// 	.map((item) => ({
		// 		uuid: nanoid(),
		// 		is_checked: true,
		// 		sfg_uuid: item?.sfg_uuid,
		// 		pi_quantity: item?.pi_quantity,
		// 		pi_uuid: new_pi_uuid,
		// 		created_at,
		// 		remarks: item?.remarks || null,
		// 	}));
		// if (commercialPiEntryData.length === 0) {
		// 	alert('Select at least one item to proceed.');
		// } else {
		// 	// create new /commercial/pi
		// 	await postData.mutateAsync({
		// 		url: commercialPiUrl,
		// 		newData: commercialPiData,
		// 		isOnCloseNeeded: false,
		// 	});
		// 	// create new /commercial/pi-entry
		// 	const commercial_batch_entry_promises = commercialPiEntryData.map(
		// 		(item) =>
		// 			postData.mutateAsync({
		// 				url: commercialPiEntryUrl,
		// 				newData: item,
		// 				isOnCloseNeeded: false,
		// 			})
		// 	);
		// 	try {
		// 		await Promise.all([...commercial_batch_entry_promises])
		// 			.then(() => reset(Object.assign({}, PI_NULL)))
		// 			.then(() => navigate(`/commercial/pi`));
		// 	} catch (err) {
		// 		console.error(`Error with Promise.all: ${err}`);
		// 	}
		// }
	};

	// Check if order_number is valid
	// if (getValues('quantity') === null) return <Navigate to='/not-found' />;
	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';

	// useEffect(() => {
	// 	if (isAllChecked || isSomeChecked) {
	// 		return orderEntryField.forEach((item, index) => {
	// 			setValue(`batch_entry[${index}].is_checked`, true);
	// 		});
	// 	}
	// 	if (!isAllChecked) {
	// 		return orderEntryField.forEach((item, index) => {
	// 			setValue(`batch_entry[${index}].is_checked`, false);
	// 		});
	// 	}
	// }, [isAllChecked]);

	// const handleRowChecked = (e, index) => {
	// 	const isChecked = e.target.checked;
	// 	setValue(`batch_entry[${index}].is_checked`, isChecked);

	// 	let isEveryChecked = true,
	// 		isSomeChecked = false;

	// 	for (let item of watch('batch_entry')) {
	// 		if (item.is_checked) {
	// 			isSomeChecked = true;
	// 		} else {
	// 			isEveryChecked = false;
	// 		}

	// 		if (isSomeChecked && !isEveryChecked) {
	// 			break;
	// 		}
	// 	}

	// 	setIsAllChecked(isEveryChecked);
	// 	setIsSomeChecked(isSomeChecked);
	// };

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
						`Details: `
						// +
						// watch("batch_entry").filter((item) => item.is_checked)
						// 	.length +
						// "/" +
						// orderEntryField.length
					}
					// handelAppend={handelOrderEntryAppend}
					tableHead={
						<>
							{/* {!isUpdate && (
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
							)} */}
							{[
								'order number',
								'color',
								'po',
								'style',
								'count length',
								'order quantity',
								'quantity',
								'coning production quantity',
								'coning production quantity in kg',
								'total quantity',
								'balance quantity',
								'remarks',
							].map((item) => (
								<th
									key={item}
									scope='col'
									className='group cursor-pointer select-none whitespace-nowrap bg-secondary px-3 py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300'>
									{item}
								</th>
							))}

							{isUpdate && (
								<th
									key='action'
									scope='col'
									className='group cursor-pointer select-none whitespace-nowrap bg-secondary px-3 py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300'>
									Delete
								</th>
							)}
						</>
					}>
					{orderEntryField.map((item, index) => (
						<tr
							key={item.id}
							className={cn(
								'relative cursor-pointer transition-colors duration-300 ease-in even:bg-primary/10 hover:bg-primary/30 focus:bg-primary/30',
								isUpdate &&
									watch(
										`batch_entry[${index}].isDeletable`
									) &&
									'bg-red-400 text-white even:bg-red-400 hover:bg-red-300'
							)}>
							{/* {!isUpdate && (
								<td className={cn(`w-8 ${rowClass}`)}>
									<CheckBoxWithoutLabel
										label={`batch_entry[${index}].is_checked`}
										checked={watch(
											`batch_entry[${index}].is_checked`
										)}
										onChange={(e) =>
											handleRowChecked(e, index)
										}
										disabled={
											getValues(
												`batch_entry[${index}].pi_quantity`
											) == 0
										}
										{...{ register, errors }}
									/>
								</td>
							)} */}
							{/* {isUpdate &&
								getValues(`batch_entry[${index}].isDeletable`) && (
									<div className='absolute left-0 top-0 z-50 block h-full w-0 bg-red-500'>
										<span className=''></span>
									</div>
								)} */}

							<td className={`w-32 ${rowClass}`}>
								{getValues(
									`batch_entry[${index}].order_number`
								)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`batch_entry[${index}].color`)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`batch_entry[${index}].po`)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`batch_entry[${index}].style`)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`batch_entry[${index}].count_length`
								)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`batch_entry[${index}].order_quantity`
								)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(`batch_entry[${index}].quantity`)}
							</td>
							{/* <td className={`w-32 ${rowClass}`}>
								<Input
									label={`batch_entry[${index}].pi_quantity`}
									is_title_needed='false'
									height='h-8'
									dynamicerror={
										errors?.batch_entry?.[index]
											?.pi_quantity
									}
									disabled={
										getValues(
											`batch_entry[${index}].pi_quantity`
										) === 0
									}
									{...{ register, errors }}
								/>
								<Input
									label={`batch_entry[${index}].sfg_uuid`}
									is_title_needed='false'
									className='hidden'
									{...{ register, errors }}
								/>
							</td> */}
							<td className={rowClass}>
								<Input
									label={`batch_entry[${index}].coning_production_quantity`}
									is_title_needed='false'
									dynamicerror={
										errors?.batch_entry?.[index]
											?.coning_production_quantity
									}
									register={register}
								/>
							</td>
							<td className={rowClass}>
								<Input
									label={`batch_entry[${index}].coning_production_quantity_in_kg`}
									is_title_needed='false'
									dynamicerror={
										errors?.batch_entry?.[index]
											?.coning_production_quantity_in_kg
									}
									register={register}
								/>
							</td>

							<td className={`${rowClass}`}>
								{getValues(
									`batch_entry[${index}].total_quantity`
								)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`batch_entry[${index}].balance_quantity`
								)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(`batch_entry[${index}].remarks`)}
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
					modalId={'batch_entry_delete'}
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
