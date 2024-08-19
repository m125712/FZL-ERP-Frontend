import { DeleteModal } from '@/components/Modal';
import { useFetchForRhfResetForOrder, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useOrderDescription, useOrderDetails } from '@/state/Order';
import { ActionButtons, DynamicField, Input, JoinInput, Textarea } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { ORDER_NULL, ORDER_SCHEMA } from '@util/Schema';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { HotKeys, configure } from 'react-hotkeys';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import Header from './Header';

export default function Index() {
	const { url, updateData, postData, deleteData } = useOrderDescription();
	const { invalidateQuery: OrderDetailsInvalidate } = useOrderDetails();
	const { order_number, order_description_uuid } = useParams();

	const { user } = useAuth();
	const navigate = useNavigate();
	const isUpdate =
		order_description_uuid !== undefined && order_number !== undefined;

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
	} = useRHF(ORDER_SCHEMA, ORDER_NULL);

	useEffect(() => {
		order_number !== undefined
			? (document.title = `Order: Update ${order_number}`)
			: (document.title = 'Order: Entry');
	}, []);

	if (isUpdate)
		useFetchForRhfResetForOrder(
			`/zipper/order/details/single-order/by/${order_description_uuid}/UUID`,
			order_description_uuid,
			reset
		);

	// order_entry
	const {
		fields: orderEntryField,
		append: orderEntryAppend,
		remove: orderEntryRemove,
	} = useFieldArray({
		control,
		name: 'order_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleOrderEntryRemove = (index) => {
		if (getValues(`order_entry[${index}].order_entry_uuid`) !== undefined) {
			setDeleteItem({
				itemId: getValues(`order_entry[${index}].order_entry_uuid`),
				itemName: getValues(`order_entry[${index}].order_entry_uuid`),
			});
			window['order_entry_delete'].showModal();
		}
		orderEntryRemove(index);
	};

	const handelOrderEntryAppend = () => {
		orderEntryAppend({
			style: '',
			color: '',
			size: '',
			quantity: '',
			company_price: 0,
			party_price: 0,
			status: 1,
			remarks: '',
		});
	};
	const onClose = () => reset(ORDER_NULL);

	// Submit
	const onSubmit = async (data) => {
		const DEFAULT_SWATCH_APPROVAL_DATE = null;

		// * Update data * //
		if (isUpdate) {
			// * updated order description * //
			const order_description_updated = {
				...data,
				is_slider_provided: data?.is_slider_provided ? 1 : 0,
				is_logo_body: data?.is_logo_body ? 1 : 0,
				is_logo_puller: data?.is_logo_puller ? 1 : 0,
				hand: data?.hand,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `/zipper/order-description/${data?.order_description_uuid}`,
				updatedData: order_description_updated,
				isOnCloseNeeded: false,
			});

			// * updated order entry * //
			const order_entry_updated = [...data.order_entry].map((item) => ({
				...item,
				status: item.order_entry_status ? 1 : 0,
				swatch_status: 'pending',
				swatch_approval_date: DEFAULT_SWATCH_APPROVAL_DATE,
				updated_at: GetDateTime(),
			}));

			//* Post new entry */ //
			let order_entry_updated_promises = [
				...order_entry_updated.map(async (item) => {
					if (item.order_entry_uuid) {
						await updateData.mutateAsync({
							url: `/zipper/order-entry/${item.order_entry_uuid}`,
							updatedData: item,
							isOnCloseNeeded: false,
						});
					} else {
						await postData.mutateAsync({
							url: '/zipper/order-entry',
							newData: {
								...item,
								uuid: nanoid(),
								status: item.order_entry_status ? 1 : 0,
								swatch_status: 'pending',
								swatch_approval_date:
									DEFAULT_SWATCH_APPROVAL_DATE,
								order_description_uuid:
									data?.order_description_uuid,
								created_at: GetDateTime(),
							},
							isOnCloseNeeded: false,
						});
					}
				}),
			];

			navigate(
				`/order/details/${order_number}/${order_description_uuid}`
			);

			return;
		}

		// * Add new data*//
		const new_order_description_uuid = nanoid();
		const created_at = GetDateTime();
		const special_requirement = JSON.stringify({
			values: data?.special_requirement || [],
		});

		const order_description = {
			...data,
			is_slider_provided: data?.is_slider_provided ? 1 : 0,
			is_logo_body: data?.is_logo_body ? 1 : 0,
			is_logo_puller: data?.is_logo_puller ? 1 : 0,
			hand: data?.hand,
			status: 0,
			special_requirement,
			uuid: new_order_description_uuid,
			created_at,
			created_by: user?.uuid,
			// issued_by: user.uuid,
		};

		//* Post new order description */ //
		await postData.mutateAsync({
			url,
			newData: order_description,
			isOnCloseNeeded: false,
		});

		const order_entry = [...data.order_entry].map((item) => ({
			...item,
			uuid: nanoid(),
			status: item.order_entry_status ? 1 : 0,
			swatch_status: 'pending',
			swatch_approval_date: DEFAULT_SWATCH_APPROVAL_DATE,
			order_description_uuid: new_order_description_uuid,
			created_at,
		}));

		//* Post new entry */ //
		let order_entry_promises = [
			...order_entry.map(
				async (item) =>
					await postData.mutateAsync({
						url: '/zipper/order-entry',
						newData: item,
						isOnCloseNeeded: false,
					})
			),
		];

		// * Slider
		const slider_quantity = [...data.order_entry].reduce(
			(prev, curr) => prev + curr.quantity
		);

		const slider_info = {
			order_info_uuid: data.order_info_uuid,
			item: data.item,
			zipper_number: data.zipper_number,
			end_type: data.end_type,
			lock_type: data.lock_type,
			puller_type: data.puller_type,
			puller_color: data.puller_color,
			puller_link: data.puller_link,
			slider: data?.slider,
			slider_body_shape: data?.slider_body_shape,
			slider_link: data?.slider_link,
			logo_type: data.logo_type,
			is_logo_body: data?.is_logo_body ? 1 : 0,
			is_logo_puller: data?.is_logo_puller ? 1 : 0,
			order_quantity: slider_quantity,
			created_at: GetDateTime(),
		};

		// * All promises
		await Promise.all(order_entry_promises)
			.then(() => reset(Object.assign({}, ORDER_NULL)))
			.then(async () => {
				await OrderDetailsInvalidate();
				navigate(`/order/details`);
			})
			.catch((err) => console.log(err));
	};

	// Check if order_number is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;

	const handelDuplicateDynamicField = useCallback(
		(index) => {
			const item = getValues(`order_entry[${index}]`);
			orderEntryAppend({ ...item, order_entry_uuid: undefined });
		},
		[getValues, orderEntryAppend]
	);

	const handleEnter = (event) => {
		event.preventDefault();
		if (Object.keys(errors).length > 0) return;
	};

	const keyMap = {
		NEW_ROW: 'alt+n',
		COPY_LAST_ROW: 'alt+c',
		ENTER: 'enter',
	};

	const handlers = {
		NEW_ROW: handelOrderEntryAppend,
		COPY_LAST_ROW: () =>
			handelDuplicateDynamicField(orderEntryField.length - 1),
		ENTER: (event) => handleEnter(event),
	};

	configure({
		ignoreTags: ['input', 'select', 'textarea'],
		ignoreEventsCondition: function () {},
	});

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide';

	return (
		<div className='container mx-auto mt-2 px-2 pb-2 md:px-4'>
			<HotKeys {...{ keyMap, handlers }}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='flex flex-col gap-4'>
					<Header
						{...{
							register,
							errors,
							control,
							getValues,
							Controller,
							watch,
							is_logo_body: getValues('is_logo_body'),
							is_logo_puller: getValues('is_logo_puller'),
						}}
					/>
					<DynamicField
						title='Details'
						handelAppend={handelOrderEntryAppend}
						tableHead={[
							'Style',
							'Color',
							'Size',
							'Quantity',
							'Price (USD) (Com/Party)',
							'Action',
						].map((item) => (
							<th
								key={item}
								scope='col'
								className='group cursor-pointer select-none whitespace-nowrap bg-secondary py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300 first:pl-2'>
								{item}
							</th>
						))}>
						{orderEntryField.map((item, index) => (
							<tr key={item.id}>
								<td className={`pl-1 ${rowClass}`}>
									<Textarea
										title='style'
										label={`order_entry[${index}].style`}
										is_title_needed='false'
										dynamicerror={
											errors?.order_entry?.[index]?.style
										}
										register={register}
									/>
								</td>
								<td className={rowClass}>
									<Textarea
										title='color'
										label={`order_entry[${index}].color`}
										is_title_needed='false'
										dynamicerror={
											errors?.order_entry?.[index]?.color
										}
										register={register}
									/>
								</td>
								<td className={`w-40 ${rowClass}`}>
									<JoinInput
										title='size'
										label={`order_entry[${index}].size`}
										is_title_needed='false'
										unit='cm'
										dynamicerror={
											errors?.order_entry?.[index]?.size
										}
										register={register}
									/>
								</td>
								<td className={`w-40 ${rowClass}`}>
									<JoinInput
										title='quantity'
										label={`order_entry[${index}].quantity`}
										is_title_needed='false'
										unit='pcs'
										dynamicerror={
											errors?.order_entry?.[index]
												?.quantity
										}
										register={register}
									/>
								</td>
								<td className={`w-24 ${rowClass}`}>
									<div className='flex'>
										<Input
											label={`order_entry[${index}].company_price`}
											is_title_needed='false'
											dynamicerror={
												errors?.order_entry?.[index]
													?.company_price
											}
											{...{ register, errors }}
										/>
										<Input
											label={`order_entry[${index}].party_price`}
											is_title_needed='false'
											dynamicerror={
												errors?.order_entry?.[index]
													?.party_price
											}
											{...{ register, errors }}
										/>
									</div>
								</td>
								{/* <td className={`w-16 ${rowClass}`}>
									<Switch
										title="status"
										label={`order_entry[${index}].order_entry_status`}
										is_title_needed="false"
										dynamicerror={
											errors?.order_entry?.[index]
												?.order_entry_status
										}
										register={register}
										defaultChecked={
											item.order_entry_status === 1
										}
										disabled={isSwatchButtonDisabled(index)}
									/>
								</td> */}
								<td
									className={`w-16 ${rowClass} border-l-4 border-l-primary`}>
									<ActionButtons
										duplicateClick={() =>
											handelDuplicateDynamicField(index)
										}
										removeClick={() =>
											handleOrderEntryRemove(index)
										}
										showRemoveButton={
											orderEntryField.length > 1
										}
									/>
								</td>
							</tr>
						))}
					</DynamicField>
					<div className='modal-action'>
						<button
							type='submit'
							className='text-md btn btn-primary btn-block'>
							Save
						</button>
					</div>
				</form>
			</HotKeys>
			<Suspense>
				<DeleteModal
					modalId={'order_entry_delete'}
					title={'Order Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={orderEntryField}
					url={`/zipper/order-entry`}
					deleteData={deleteData}
				/>
			</Suspense>

			<DevTool control={control} placement='top-left' />
		</div>
	);
}
