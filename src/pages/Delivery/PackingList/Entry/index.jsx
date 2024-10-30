import { Suspense, useEffect, useState } from 'react';
import {
	useDeliveryPackingList,
	useDeliveryPackingListByOrderInfoUUID,
	useDeliveryPackingListDetailsByUUID,
	useDeliveryPackingListEntry,
} from '@/state/Delivery';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import SubmitButton from '@/ui/Others/Button/SubmitButton';
import {
	CheckBoxWithoutLabel,
	DynamicDeliveryField,
	Input,
	RemoveButton,
} from '@/ui';

import cn from '@/lib/cn';
import nanoid from '@/lib/nanoid';
import { PACKING_LIST_NULL, PACKING_LIST_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import Header from './Header';

export default function Index() {
	const { uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const {
		url: deliveryPackingListUrl,
		postData,
		updateData,
		deleteData,
		invalidateQuery: invalidateDeliveryPackingList,
	} = useDeliveryPackingList();
	const {
		url: deliveryPackingListEntryUrl,
		deleteData: deletePackingListEntry,
	} = useDeliveryPackingListEntry();

	const [isAllChecked, setIsAllChecked] = useState(false);
	const [isSomeChecked, setIsSomeChecked] = useState(false);
	const isUpdate = uuid !== undefined;

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
	} = useRHF(PACKING_LIST_SCHEMA, PACKING_LIST_NULL);

	const { data: details, invalidateQuery: invalidateDetails } =
		useDeliveryPackingListDetailsByUUID(uuid, {
			params: `is_update=true`,
		});

	const { data: packingListEntries } = useDeliveryPackingListByOrderInfoUUID(
		watch('order_info_uuid')
	);

	useEffect(() => {
		if (!isUpdate && packingListEntries?.packing_list_entry) {
			setValue(
				'packing_list_entry',
				packingListEntries?.packing_list_entry
			);
		}
		if (isUpdate && details) {
			reset(details);
		}
	}, [packingListEntries, isUpdate, details]);

	// useEffect(() => {
	// 	if (isUpdate && details) {
	// 		reset(details);
	// 	}
	// }, [details, isUpdate]);

	// packing_list_entry
	const { fields: packingListEntryField } = useFieldArray({
		control,
		name: 'packing_list_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	// Submit
	const onSubmit = async (data) => {
		// Update item
		if (isUpdate) {
			const packingListData = {
				...data,
				updated_at: GetDateTime(),
			};

			// update /packing/list/uuid
			const packingListPromise = await updateData.mutateAsync({
				url: `${deliveryPackingListUrl}/${data?.uuid}`,
				updatedData: packingListData,
				uuid: data.uuid,
				isOnCloseNeeded: false,
			});

			const updatedId = packingListPromise?.data?.[0].updatedId;

			// update /packing/list/uuid/entry
			let updatablePackingListEntryPromises = data.packing_list_entry
				.filter((item) => item.quantity > 0 && !item.isDeletable)
				.map(async (item) => {
					if (item.uuid === null && item.quantity > 0) {
						return await postData.mutateAsync({
							url: deliveryPackingListEntryUrl,
							newData: {
								...item,
								uuid: nanoid(),
								is_checked: item.is_checked,
								quantity: item?.quantity,
								packing_list_uuid: uuid,
								created_at: GetDateTime(),
							},
							isOnCloseNeeded: false,
						});
					}

					if (item.uuid && item.quantity >= 0) {
						const updatedData = {
							...item,
							quantity: item.quantity,
							is_checked: item.is_checked,
							remarks: item.remarks,
							updated_at: GetDateTime(),
						};

						return await updateData.mutateAsync({
							url: `${deliveryPackingListEntryUrl}/${item?.uuid}`,
							updatedData: updatedData,
							uuid: item.uuid,
							isOnCloseNeeded: false,
						});
					}
					return null;
				});

			let deletablePackingListEntryPromises = data.packing_list_entry
				.filter((item) => item.isDeletable)
				.map(async (item) => {
					return await deleteData.mutateAsync({
						url: `${deliveryPackingListEntryUrl}/${item?.uuid}`,
						isOnCloseNeeded: false,
					});
				});

			try {
				await Promise.all([
					packingListPromise,
					...updatablePackingListEntryPromises,
					deletablePackingListEntryPromises,
				])
					.then(() => reset(Object.assign({}, PACKING_LIST_NULL)))
					.then(() => {
						invalidateDeliveryPackingList();
						navigate(`/delivery/zipper-packing-list/${data?.uuid}`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		// Add new item
		var new_uuid = nanoid();
		const created_at = GetDateTime();

		const packingListData = {
			...data,
			uuid: new_uuid,
			created_at,
			created_by: user.uuid,
		};

		delete packingListData['is_all_checked'];
		delete packingListData['packing_list_entry'];

		const packingListEntryData = [...data.packing_list_entry]
			.filter((item) => item.is_checked && item.quantity > 0)
			.map((item) => ({
				...item,
				uuid: nanoid(),
				is_checked: true,
				packing_list_uuid: new_uuid,
				quantity: item?.quantity,
				created_at,
				remarks: item?.remarks || null,
			}));

		if (packingListEntryData.length === 0) {
			alert('Select at least one item to proceed.');
		} else {
			// create new /packing/list
			await postData.mutateAsync({
				url: deliveryPackingListUrl,
				newData: packingListData,
				isOnCloseNeeded: false,
			});

			// create new /packing/list/entry
			const commercial_packing_list_entry_promises =
				packingListEntryData.map((item) =>
					postData.mutateAsync({
						url: deliveryPackingListEntryUrl,
						newData: item,
						isOnCloseNeeded: false,
					})
				);

			try {
				await Promise.all([...commercial_packing_list_entry_promises])
					.then(() => reset(Object.assign({}, PACKING_LIST_NULL)))
					.then(() => {
						invalidateDeliveryPackingList();
						navigate(`/delivery/zipper-packing-list`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}
		}
	};

	// Check if order_number is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;
	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';

	useEffect(() => {
		if (isAllChecked || isSomeChecked) {
			return packingListEntryField.forEach((item, index) => {
				if (isAllChecked) {
					setValue(`packing_list_entry[${index}].is_checked`, true);
				}
			});
		}
		if (!isAllChecked) {
			return packingListEntryField.forEach((item, index) => {
				setValue('is_all_checked', false);
				setValue(`packing_list_entry[${index}].is_checked`, false);
			});
		}
	}, [isAllChecked]);

	const handleRowChecked = (e, index) => {
		const isChecked = e.target.checked;
		setValue(`packing_list_entry[${index}].is_checked`, isChecked);

		let isEveryChecked = true,
			isSomeChecked = false;

		for (let item of watch('packing_list_entry')) {
			if (item.is_checked) {
				isSomeChecked = true;
			} else {
				isEveryChecked = false;
				setValue('is_all_checked', false);
			}

			if (isSomeChecked && !isEveryChecked) {
				break;
			}
		}

		setIsAllChecked(isEveryChecked);
		setIsSomeChecked(isSomeChecked);
	};

	// Remove packing list entry
	const handlePackingListEntryRemove = (index) => {
		if (
			getValues(`packing_list_entry[${index}].packing_list_uuid`) !==
				null &&
			getValues(`packing_list_entry[${index}].is_checked`) === true
		) {
			setDeleteItem({
				itemId: getValues(`packing_list_entry[${index}].uuid`),
				itemName: getValues(`packing_list_entry[${index}].uuid`),
			});
			window['packing_list_entry_delete'].showModal();
		}
	};

	return (
		<div>
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
					title={`Details: `}
					tableHead={
						<>
							<th
								key='is_all_checked'
								scope='col'
								className='group w-20 cursor-pointer px-3 py-2'>
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
								'Size',
								'Unit',
								'Order QTY',
								'Balance QTY',
								// 'Warehouse',
								// 'Delivered',
								'Quantity(pcs)',
								'Poly QTY',
								'Short QTY',
								'Reject QTY',
								'Remarks',
								,
							].map((item) => (
								<th
									key={item}
									scope='col'
									className='group cursor-pointer px-3 py-2 transition duration-300'>
									{item}
								</th>
							))}

							{isUpdate && (
								<th
									key='action'
									scope='col'
									className='group cursor-pointer px-3 py-2 transition duration-300'>
									Delete
								</th>
							)}
						</>
					}>
					{packingListEntryField.map((item, index) => (
						<tr
							key={item.id}
							className={cn(
								'relative cursor-pointer bg-base-100 text-primary transition-colors duration-200 ease-in',
								isUpdate &&
									watch(
										`packing_list_entry[${index}].isDeletable`
									) &&
									'bg-error/10 text-error hover:bg-error/20 hover:text-error'
							)}>
							<td className={cn(`w-8 ${rowClass}`)}>
								<CheckBoxWithoutLabel
									label={`packing_list_entry[${index}].is_checked`}
									checked={watch(
										`packing_list_entry[${index}].is_checked`
									)}
									onChange={(e) => handleRowChecked(e, index)}
									disabled={
										getValues(
											`packing_list_entry[${index}].pi_cash_quantity`
										) == 0
									}
									{...{ register, errors }}
								/>
							</td>

							<td className={`w-32 ${rowClass}`}>
								{getValues(
									`packing_list_entry[${index}].order_number`
								)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(
									`packing_list_entry[${index}].item_description`
								)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(
									`packing_list_entry[${index}].style`
								)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(
									`packing_list_entry[${index}].color`
								)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(`packing_list_entry[${index}].size`)}
							</td>
							<td className={`w-32 ${rowClass}`}>
								{getValues(
									`packing_list_entry[${index}].is_inch`
								) &&
								getValues(
									`packing_list_entry[${index}].order_number`
								) !== ''
									? 'inch'
									: 'cm'}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`packing_list_entry[${index}].order_quantity`
								)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`packing_list_entry[${index}].balance_quantity`
								)}
							</td>
							{/* <td className={`${rowClass}`}>
								{getValues(
									`packing_list_entry[${index}].warehouse`
								)}
							</td>
							<td className={`${rowClass}`}>
								{getValues(
									`packing_list_entry[${index}].delivered`
								)}
							</td> */}
							<td className={`w-32 ${rowClass}`}>
								<Input
									label={`packing_list_entry[${index}].quantity`}
									is_title_needed='false'
									height='h-8'
									dynamicerror={
										errors?.packing_list_entry?.[index]
											?.quantity
									}
									disabled={
										getValues(
											`packing_list_entry[${index}].quantity`
										) === 0
									}
									{...{ register, errors }}
								/>
							</td>
							<td className={`w-32 ${rowClass}`}>
								<Input
									label={`packing_list_entry[${index}].poli_quantity`}
									is_title_needed='false'
									height='h-8'
									dynamicerror={
										errors?.packing_list_entry?.[index]
											?.poli_quantity
									}
									{...{ register, errors }}
								/>
							</td>
							<td className={`w-32 ${rowClass}`}>
								<Input
									label={`packing_list_entry[${index}].short_quantity`}
									is_title_needed='false'
									height='h-8'
									dynamicerror={
										errors?.packing_list_entry?.[index]
											?.short_quantity
									}
									{...{ register, errors }}
								/>
							</td>
							<td className={`w-32 ${rowClass}`}>
								<Input
									label={`packing_list_entry[${index}].reject_quantity`}
									is_title_needed='false'
									height='h-8'
									dynamicerror={
										errors?.packing_list_entry?.[index]
											?.reject_quantity
									}
									{...{ register, errors }}
								/>
							</td>

							<td className={cn(rowClass, 'w-60')}>
								<Input
									label={`packing_list_entry[${index}].remarks`}
									is_title_needed='false'
									height='h-8'
									dynamicerror={
										errors?.packing_list_entry?.[index]
											?.remarks
									}
									{...{ register, errors }}
								/>
							</td>
							{isUpdate && (
								<td
									className={cn(
										rowClass,
										'min-w-20 border-l-2 border-base-200'
									)}>
									<RemoveButton
										showButton
										onClick={() =>
											handlePackingListEntryRemove(index)
										}
									/>
								</td>
							)}
						</tr>
					))}
				</DynamicDeliveryField>
				<div className='modal-action'>
					<SubmitButton />
				</div>
			</form>

			<Suspense>
				<DeleteModal
					modalId={'packing_list_entry_delete'}
					title={'Packing List Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={packingListEntryField}
					url={deliveryPackingListEntryUrl}
					deleteData={deletePackingListEntry}
					onSuccess={invalidateDetails}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</div>
	);
}
