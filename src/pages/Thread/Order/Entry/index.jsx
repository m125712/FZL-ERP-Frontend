import { DeleteModal } from '@/components/Modal';
import {
	useFetch,
	useFetchForRhfResetForOrder,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useThreadOrderInfo, useThreadOrderInfoEntry } from '@/state/Thread';
import {
	ActionButtons,
	DynamicField,
	FormField,
	Input,
	ReactSelect,
} from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import {
	THREAD_ORDER_INFO_ENTRY_NULL,
	THREAD_ORDER_INFO_ENTRY_SCHEMA,
} from '@util/Schema';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { HotKeys, configure } from 'react-hotkeys';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Header from './Header';

export default function Index() {
	const { url: threadOrderInfoUrl } = useThreadOrderInfo();
	const { url: threadOrderEntryUrl } = useThreadOrderInfoEntry();
	const { updateData, postData, deleteData } = useThreadOrderInfo();
	const { uuid, order_info_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const isUpdate = order_info_uuid !== undefined || uuid !== undefined;
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
	} = useRHF(THREAD_ORDER_INFO_ENTRY_SCHEMA, THREAD_ORDER_INFO_ENTRY_NULL);

	useEffect(() => {
		uuid !== undefined
			? (document.title = `Thread Shade Recipe: Update ${uuid}`)
			: (document.title = 'Thread Shade Recipe: Entry');
	}, []);

	const { value: countLength } = useFetch(
		`/other/thread/count-length/value/label`
	);
	const { value: shadeRecipe } = useFetch(
		`/other/lab-dip/shade-recipe/value/label`
	);

	if (isUpdate)
		useFetchForRhfResetForOrder(
			`/thread/order-info-details/by/${order_info_uuid}`,
			order_info_uuid,
			reset
		);

	// order_info_entry
	const {
		fields: threadOrderInfoEntryField,
		append: threadOrderInfoEntryAppend,
		remove: threadOrderInfoEntryRemove,
	} = useFieldArray({
		control,
		name: 'order_info_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleThreadOrderInfoEntryRemove = (index) => {
		if (getValues(`order_info_entry[${index}].uuid`) !== undefined) {
			setDeleteItem({
				itemId: getValues(`order_info_entry[${index}].uuid`),
				itemName: getValues(`order_info_entry[${index}].uuid`),
			});
			window['order_info_entry_delete'].showModal();
		}
		threadOrderInfoEntryRemove(index);
	};

	const handleThreadOrderInfoEntryAppend = () => {
		threadOrderInfoEntryAppend({
			order_info_uuid: null,
			lab_ref: '',
			po: '',
			shade_recipe_uuid: null,
			style: '',
			color: '',
			count_length_uuid: null,
			type: '',
			quantity: null,
			company_price: 0,
			party_price: 0,
			swatch_status: '',
			swatch_approval_date: null,
			remarks: '',
		});
	};
	const onClose = () => reset(THREAD_ORDER_INFO_ENTRY_NULL);

	// Submit
	const onSubmit = async (data) => {
		// Update
		if (isUpdate) {
			const order_info_data = {
				...data,
				is_sample: data.is_sample ? 1 : 0,
				is_bill: data.is_bill ? 1 : 0,
				updated_at: GetDateTime(),
			};

			const order_info_promise = await updateData.mutateAsync({
				url: `${threadOrderInfoUrl}/${data?.uuid}`,
				updatedData: order_info_data,
				uuid: data.uuid,
				isOnCloseNeeded: false,
			});

			const order_info_entries_promise = data.order_info_entry.map(
				async (item) => {
					if (item.uuid === undefined) {
						item.swatch_approval_date =
							item.shade_recipe_uuid === null
								? null
								: GetDateTime();
						item.order_info_uuid = order_info_uuid;
						item.created_at = GetDateTime();
						item.uuid = nanoid();
						return await postData.mutateAsync({
							url: threadOrderEntryUrl,
							newData: item,
							isOnCloseNeeded: false,
						});
					} else {
						item.updated_at = GetDateTime();
						const updatedData = {
							...item,
							swatch_approval_date:
								item.shade_recipe_uuid === null
									? null
									: item.swatch_approval_date === null
										? GetDateTime()
										: item.swatch_approval_date,
						};
						return await updateData.mutateAsync({
							url: `${threadOrderEntryUrl}/${item.uuid}`,
							uuid: item.uuid,
							updatedData,
							isOnCloseNeeded: false,
						});
					}
				}
			);

			try {
				await Promise.all([
					order_info_promise,
					...order_info_entries_promise,
				])
					.then(() => reset(THREAD_ORDER_INFO_ENTRY_NULL))
					.then(() => {
						navigate(
							`/thread/order-info/details/${order_info_uuid}`
						);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		// Add new item
		const new_order_info_uuid = nanoid();
		const created_at = GetDateTime();
		const created_by = user.uuid;

		// Create Shade Recipe description
		const order_info_data = {
			...data,
			is_sample: data.is_sample ? 1 : 0,
			is_bill: data.is_bill ? 1 : 0,
			uuid: new_order_info_uuid,
			created_at,
			created_by,
		};

		// delete shade_recipe field from data to be sent
		delete order_info_data['order_info_entry'];

		const order_info_promise = await postData.mutateAsync({
			url: threadOrderInfoUrl,
			newData: order_info_data,
			isOnCloseNeeded: false,
		});

		// Create Shade Recipe entries
		const order_info_entries = [...data.order_info_entry].map((item) => ({
			...item,
			order_info_uuid: new_order_info_uuid,
			uuid: nanoid(),
			created_at,
			created_by,
			swatch_approval_date:
				item.shade_recipe_uuid === null ? null : GetDateTime(),
		}));
		console.log(order_info_entries);
		const order_info_entries_promise = [
			...order_info_entries.map(
				async (item) =>
					await postData.mutateAsync({
						url: threadOrderEntryUrl,
						newData: item,
						isOnCloseNeeded: false,
					})
			),
		];

		try {
			await Promise.all([
				order_info_promise,
				...order_info_entries_promise,
			])
				.then(() => reset(THREAD_ORDER_INFO_ENTRY_NULL))
				.then(() => {
					navigate(
						`/thread/order-info/details/${new_order_info_uuid}`
					);
				});
		} catch (err) {
			console.error(`Error with Promise.all: ${err}`);
		}
	};

	// Check if uuid is valuuid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;

	const handelDuplicateDynamicField = useCallback(
		(index) => {
			const item = getValues(`order_info_entry[${index}]`);
			threadOrderInfoEntryAppend({ ...item, uuid: undefined });
		},
		[getValues, threadOrderInfoEntryAppend]
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
		NEW_ROW: handleThreadOrderInfoEntryAppend,
		COPY_LAST_ROW: () =>
			handelDuplicateDynamicField(threadOrderInfoEntryField.length - 1),
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
						}}
					/>
					<DynamicField
						title='Details'
						handelAppend={handleThreadOrderInfoEntryAppend}
						tableHead={[
							'Color',
							'Shade',
							'PO',
							'Style',
							'Count Length',
							'Quantity',
							'Price (USD) (Com/Party)',
							'Remarks',
							'Action',
						].map((item) => (
							<th
								key={item}
								scope='col'
								className='group cursor-pointer select-none whitespace-nowrap bg-secondary py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300 first:pl-2'>
								{item}
							</th>
						))}>
						{threadOrderInfoEntryField.map((item, index) => (
							<tr key={item.uuid}>
								<td className={`pl-1 ${rowClass}`}>
									<Input
										title='Color'
										label={`order_info_entry[${index}].color`}
										is_title_needed='false'
										dynamicerror={
											errors?.order_info_entry?.[index]
												?.color
										}
										register={register}
									/>
								</td>
								<td className={rowClass}>
									<FormField
										label={`order_info_entry[${index}].shade_recipe_uuid`}
										title='Shade'
										errors={errors}
										is_title_needed='false'>
										<Controller
											name={`order_info_entry[${index}].shade_recipe_uuid`}
											control={control}
											render={({
												field: { onChange },
											}) => {
												return (
													<ReactSelect
														placeholder='Select Shade'
														options={shadeRecipe}
														value={shadeRecipe?.find(
															(item) =>
																item.value ==
																getValues(
																	`order_info_entry[${index}].shade_recipe_uuid`
																)
														)}
														onChange={(e) => {
															onChange(e.value);
														}}
														// isDisabled={
														// 	order_info_uuid !==
														// 	undefined
														// }
														menuPortalTarget={
															document.body
														}
													/>
												);
											}}
										/>
									</FormField>
								</td>
								<td className={rowClass}>
									<Input
										title='po'
										label={`order_info_entry[${index}].po`}
										is_title_needed='false'
										dynamicerror={
											errors?.order_info_entry?.[index]
												?.po
										}
										register={register}
									/>
								</td>

								<td className={rowClass}>
									<Input
										title='style'
										label={`order_info_entry[${index}].style`}
										is_title_needed='false'
										dynamicerror={
											errors?.order_info_entry?.[index]
												?.style
										}
										register={register}
									/>
								</td>
								<td className={rowClass}>
									<FormField
										label={`order_info_entry[${index}].count_length_uuid`}
										title='Count Length'
										dynamicerror={
											errors?.order_info_entry?.[index]
												?.count_length_uuid
										}
										is_title_needed='false'>
										<Controller
											name={`order_info_entry[${index}].count_length_uuid`}
											control={control}
											render={({
												field: { onChange },
											}) => {
												return (
													<ReactSelect
														placeholder='Select Count Length'
														options={countLength}
														value={countLength?.find(
															(item) =>
																item.value ==
																getValues(
																	`order_info_entry[${index}].count_length_uuid`
																)
														)}
														onChange={(e) => {
															onChange(e.value);
														}}
														// isDisabled={
														// 	order_info_uuid !==
														// 	undefined
														// }
														menuPortalTarget={
															document.body
														}
													/>
												);
											}}
										/>
									</FormField>
								</td>
								<td className={rowClass}>
									<Input
										title='quantity'
										label={`order_info_entry[${index}].quantity`}
										is_title_needed='false'
										dynamicerror={
											errors?.order_info_entry?.[index]
												?.quantity
										}
										register={register}
									/>
								</td>
								<td className={rowClass}>
									<div className='flex'>
										<Input
											label={`order_info_entry[${index}].company_price`}
											is_title_needed='false'
											dynamicerror={
												errors?.order_info_entry?.[
													index
												]?.company_price
											}
											register={register}
										/>
										<Input
											label={`order_info_entry[${index}].party_price`}
											is_title_needed='false'
											dynamicerror={
												errors?.order_info_entry?.[
													index
												]?.party_price
											}
											register={register}
										/>
									</div>
								</td>
								<td className={rowClass}>
									<Input
										label={`order_info_entry[${index}].remarks`}
										is_title_needed='false'
										dynamicerror={
											errors?.order_info_entry?.[index]
												?.remarks
										}
										register={register}
									/>
								</td>

								<td
									className={`w-16 ${rowClass} border-l-4 border-l-primary`}>
									<ActionButtons
										duplicateClick={() =>
											handelDuplicateDynamicField(index)
										}
										removeClick={() =>
											handleThreadOrderInfoEntryRemove(
												index
											)
										}
										showRemoveButton={
											threadOrderInfoEntryField.length > 1
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
					modalId={'order_info_entry_delete'}
					title={'Order info Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={threadOrderInfoEntryField}
					url={threadOrderEntryUrl}
					deleteData={deleteData}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</div>
	);
}
