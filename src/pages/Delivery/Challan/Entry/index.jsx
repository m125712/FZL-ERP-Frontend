import { Suspense, useEffect, useState } from 'react';
import {
	useDeliveryChallan,
	useDeliveryChallanByUUID,
	useDeliveryChallanDetailsByUUID,
	useDeliveryChallanEntry,
	useDeliveryPackingListEntryByPackingListUUID,
} from '@/state/Delivery';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { useNavigate, useParams } from 'react-router-dom';
import { useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import SubmitButton from '@/ui/Others/Button/SubmitButton';
import { DynamicDeliveryField, LinkWithCopy } from '@/ui';

import cn from '@/lib/cn';
import nanoid from '@/lib/nanoid';
import { CHALLAN_NULL, CHALLAN_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import Header from './Header';

export default function Index() {
	const { uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const {
		url: deliveryChallanUrl,
		postData,
		updateData,
		deleteData,
	} = useDeliveryChallan();
	const { url: deliveryChallanEntryUrl, deleteData: deleteChallanEntry } =
		useDeliveryChallanEntry();

	const { data: challan } = useDeliveryChallanDetailsByUUID(uuid);

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
	} = useRHF(CHALLAN_SCHEMA, CHALLAN_NULL);

	useEffect(() => {
		if (challan && isUpdate) {
			reset(challan);
		}
	}, [challan, isUpdate]);

	const { data: packingListEntry } =
		useDeliveryPackingListEntryByPackingListUUID(
			watch('packing_list_uuids')
		);

	useEffect(() => {
		if (packingListEntry?.packing_list_entry) {
			setValue('challan_entry', packingListEntry?.packing_list_entry);
			setValue(
				'carton_quantity',
				packingListEntry?.packing_list_entry.length
			);
		}
	}, [packingListEntry]);

	// challan_entry
	const { fields: challanEntryField } = useFieldArray({
		control,
		name: 'challan_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	// Submit
	const onSubmit = async (data) => {
		// Update item
		if (isUpdate) {
			const challanData = {
				...data,
				updated_at: GetDateTime(),
				receive_status: data.receive_status === true ? 1 : 0,
				gate_pass: data.gate_pass === true ? 1 : 0,
			};

			// update /packing/list/uuid
			const challanPromise = await updateData.mutateAsync({
				url: `${deliveryChallanUrl}/${data?.uuid}`,
				updatedData: challanData,
				uuid: data.uuid,
				isOnCloseNeeded: false,
			});

			console.log({
				challanPromise,
			});

			const updatedId = challanPromise?.data?.[0]?.updatedUuid;

			// update challan_entry
			let updatableChallanEntryPromises = data.challan_entry.map(
				async (item) => {
					if (item.uuid === null) {
						return await postData.mutateAsync({
							url: deliveryChallanEntryUrl,
							newData: {
								...item,
								uuid: nanoid(),
								challan_uuid: new_uuid,
								quantity: item?.quantity,
								created_at,
								remarks: item?.remarks,
							},
							isOnCloseNeeded: false,
						});
					}

					if (item.uuid) {
						const updatedData = {
							...item,
							updated_at: GetDateTime(),
						};

						return await updateData.mutateAsync({
							url: `${deliveryChallanEntryUrl}/${item?.uuid}`,
							updatedData: updatedData,
							uuid: item.uuid,
							isOnCloseNeeded: false,
						});
					}
					return null;
				}
			);

			try {
				await Promise.all([
					challanPromise,
					...updatableChallanEntryPromises,
				])
					.then(() => reset(Object.assign({}, CHALLAN_NULL)))
					.then(() => {
						// navigate(`/delivery/challan/${updatedId}`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		// Add new item
		var new_uuid = nanoid();
		const created_at = GetDateTime();

		const challanData = {
			...data,
			uuid: new_uuid,
			created_at,
			created_by: user.uuid,
			receive_status: data.receive_status === true ? 1 : 0,
			gate_pass: data.gate_pass === true ? 1 : 0,
		};

		delete challanData['challan_entry'];

		const challanEntryData = [...data.challan_entry]
			.filter((item) => item.is_checked && item.quantity > 0)
			.map((item) => ({
				...item,
				uuid: nanoid(),
				challan_uuid: new_uuid,
				quantity: item?.quantity,
				created_at,
				remarks: item?.remarks,
			}));

		if (challanEntryData.length === 0) {
			alert('Select at least one item to proceed.');
		} else {
			// create new /packing/list
			await postData.mutateAsync({
				url: deliveryChallanUrl,
				newData: challanData,
				isOnCloseNeeded: false,
			});

			// create new /packing/list/entry
			const challan_entry_promises = challanEntryData.map((item) =>
				postData.mutateAsync({
					url: deliveryChallanEntryUrl,
					newData: item,
					isOnCloseNeeded: false,
				})
			);

			try {
				await Promise.all([...challan_entry_promises])
					.then(() => reset(Object.assign({}, CHALLAN_NULL)))
					.then(() => {
						navigate(`/delivery/challan`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}
		}
	};

	// Check if order_number is valid
	// if (getValues('quantity') === null) return <Navigate to='/not-found' />;
	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';

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
						watch,
						setValue,
					}}
				/>
				<DynamicDeliveryField
					title={`Details: `}
					tableHead={
						<>
							{[
								'PL No.',
								'Item Description',
								'Style/Color/Size',
								'Delivered',
								'Quantity',
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
						</>
					}>
					{challanEntryField.map((item, index) => {
						return (
							<tr
								key={item.id}
								className={cn(
									'relative cursor-pointer bg-base-100 text-primary transition-colors duration-200 ease-in',
									isUpdate &&
										watch(
											`challan_entry[${index}].isDeletable`
										) &&
										'bg-error/10 text-error hover:bg-error/20 hover:text-error'
								)}>
								<td className={`w-32 ${rowClass}`}>
									<LinkWithCopy
										title={getValues(
											`challan_entry[${index}].packing_number`
										)}
										id={getValues(
											`challan_entry[${index}].packing_list_uuid`
										)}
										uri='/delivery/packing-list'
									/>
								</td>
								<td className={`w-32 ${rowClass}`}>
									{getValues(
										`challan_entry[${index}].item_description`
									)}
								</td>
								<td className={`w-32 ${rowClass}`}>
									{getValues(
										`challan_entry[${index}].style_color_size`
									)}
								</td>

								<td className={`${rowClass}`}>
									{getValues(
										`challan_entry[${index}].delivered`
									)}
								</td>
								<td className={`${rowClass}`}>
									{getValues(
										`challan_entry[${index}].quantity`
									)}
								</td>
								<td className={`${rowClass}`}>
									{getValues(
										`challan_entry[${index}].short_quantity`
									)}
								</td>
								<td className={`${rowClass}`}>
									{/* <Input
										label={`packing_list_entry[${index}].reject_quantity`}
										is_title_needed='false'
										height='h-8'
										dynamicerror={
											errors?.packing_list_entry?.[index]	
												?.reject_quantity
										}
										disabled={
											getValues(
												`packing_list_entry[${index}].reject_quantity`
											) === 0
										}
										{...{ register, errors }}
									/> */}
									{getValues(
										`challan_entry[${index}].reject_quantity`
									)}
								</td>

								<td className={`${rowClass}`}>
									{getValues(
										`challan_entry[${index}].remarks`
									)}
								</td>
							</tr>
						);
					})}
				</DynamicDeliveryField>
				<div className='modal-action'>
					<SubmitButton />
				</div>
			</form>

			<Suspense>
				<DeleteModal
					modalId={'challan_entry_delete'}
					title={'Challan Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={challanEntryField}
					url={deliveryChallanEntryUrl}
					deleteData={deleteChallanEntry}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</div>
	);
}
