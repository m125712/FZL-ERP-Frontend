import { Suspense, useCallback, useEffect, useState } from 'react';
import { useCommonCoilSFG, useCommonTapeSFG } from '@/state/Common';
import { useDyeingTransfer } from '@/state/Dyeing';
import { useGetURLData } from '@/state/Other';
import { useAuth } from '@context/auth';
import { FormProvider } from 'react-hook-form';
import { configure, HotKeys } from 'react-hotkeys';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router';
import * as yup from 'yup';
import { useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import { Footer } from '@/components/Modal/ui';
import { ShowLocalToast } from '@/components/Toast';
import {
	ActionButtons,
	DynamicField,
	FormField,
	JoinInput,
	ReactSelect,
	Textarea,
} from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	DYEING_TRANSFER_FROM_STOCK_NULL,
	DYEING_TRANSFER_FROM_STOCK_SCHEMA,
	NUMBER_DOUBLE,
	STRING,
	STRING_REQUIRED,
} from '@util/Schema';
import { exclude } from '@/util/Exclude';
import GetDateTime from '@/util/GetDateTime';

export default function Index() {
	const [orderSelected, setOrderSelected] = useState({});

	const { postData, deleteData } = useDyeingTransfer();
	const { invalidateQuery: invalidateCommonTapeSFG } = useCommonTapeSFG();
	const { invalidateQuery: invalidateCommonCoilSFG } = useCommonCoilSFG();
	const { uuid, order_number, order_description_uuid } = useParams();
	const { data } = useGetURLData(`/zipper/tape-coil/${uuid}`);
	const { data: dyed_tape_trx } = useGetURLData(
		`/zipper/dyed-tape-transaction/${uuid}/UUID`
	);
	const location = useLocation();
	const [status, setStatus] = useState(false);

	const segments = location.pathname.split('/').filter((segment) => segment);

	const secondElement = segments[1];

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
		setValue,
		watch,
		context: form,
	} = useRHF(
		{
			...DYEING_TRANSFER_FROM_STOCK_SCHEMA,
			dyeing_transfer_entry: yup.array().of(
				yup.object().shape({
					sfg_uuid: STRING.when({
						is: () => orderSelected?.order_type === 'tape',
						then: (schema) => schema.required('Required'),
						otherwise: (schema) => schema.nullable(),
					}),
					order_description_uuid: STRING_REQUIRED,
					trx_quantity_in_meter: NUMBER_DOUBLE.when({
						is: () => orderSelected?.order_type === 'tape',
						then: (schema) =>
							schema
								.required('Required')
								.moreThan(0, 'Must be greater than 0'),
						otherwise: (schema) => schema.nullable(),
					}),
					trx_quantity: NUMBER_DOUBLE.required('Required').transform(
						(value, originalValue) =>
							String(originalValue).trim() === '' ? null : value
					), // Transforms empty strings to null
					remarks: STRING.nullable(),
				})
			),
		},
		DYEING_TRANSFER_FROM_STOCK_NULL
	);

	useEffect(() => {
		order_number !== undefined
			? (document.title = `Order: Update ${order_number}`)
			: (document.title = 'Order: Entry');
	}, []);
	const { data: order_id } = useGetURLData(
		`/other/order/order-description/value/label/by/${uuid}?is_slider_needed=false`
	);

	let excludeItem = exclude(
		watch,
		order_id,
		'dyeing_transfer_entry',
		'order_description_uuid',
		status
	);

	const MAX_QTY = data?.stock_quantity;
	const getTotalQty = useCallback(
		(coil_to_dyeing_entry) =>
			coil_to_dyeing_entry.reduce((acc, item) => {
				return acc + Number(item.trx_quantity);
			}, 0),
		[watch()]
	);
	const MAX_TAPE_TRX_QTY =
		MAX_QTY - getTotalQty(watch('dyeing_transfer_entry'));

	useEffect(() => {
		if (dyed_tape_trx && isUpdate) {
			reset(dyed_tape_trx);
		}
	}, [dyed_tape_trx]);

	// order_entry
	const {
		fields: EntryField,
		append: EntryAppend,
		remove: EntryRemove,
	} = useFieldArray({
		control,
		name: 'dyeing_transfer_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleEntryRemove = (index) => {
		if (
			getValues(
				`dyeing_transfer_entry[${index}].order_description_uuid`
			) !== undefined
		) {
			setDeleteItem({
				itemId: getValues(
					`dyeing_transfer_entry[${index}].order_description_uuid`
				),
				itemName: getValues(
					`dyeing_transfer_entry[${index}].order_description_uuid`
				),
			});
			window['order_entry_delete'].showModal();
		}
		EntryRemove(index);
	};

	const handelEntryAppend = () => {
		EntryAppend({
			order_id: null,
			trx_quantity: 0,
			remarks: '',
		});
	};
	const onClose = () => reset(DYEING_TRANSFER_FROM_STOCK_NULL);

	// TODO Submit
	const onSubmit = async (data) => {
		if (MAX_TAPE_TRX_QTY < 0) {
			ShowLocalToast({
				type: 'error',
				message: 'Beyond Stock',
			});
			return;
		}

		// * Add new data entry
		const created_at = GetDateTime();

		const entryData = [...data.dyeing_transfer_entry].map((item) => ({
			...item,
			uuid: nanoid(),
			tape_coil_uuid: uuid,
			created_by: user?.uuid,
			created_at,
		}));

		//* Post new entry */ //
		let entryData_promises = [
			...entryData.map(
				async (item) =>
					await postData.mutateAsync({
						url: '/zipper/dyed-tape-transaction-from-stock',
						newData: item,
						onClose,
					})
			),
		];
		// * All promises
		await Promise.all(entryData_promises)
			.then(() =>
				reset(Object.assign({}, DYEING_TRANSFER_FROM_STOCK_NULL))
			)
			.then(async () => {
				// await OrderDetailsInvalidate(); common/tape/log
				invalidateCommonTapeSFG();
				invalidateCommonCoilSFG();
				navigate(`/common/${secondElement}/sfg`);
			})
			.catch((err) => console.log(err));
	};

	// Check if order_number is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;

	const handelDuplicateDynamicField = useCallback(
		(index) => {
			const item = getValues(`dyeing_transfer_entry[${index}]`);
			EntryAppend({
				...item,
				order_description_uuid: undefined,
				// section: watch(`dyeing_transfer_entry[${index}].section`),
			});
		},
		[getValues, EntryAppend]
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
		NEW_ROW: handelEntryAppend,
		COPY_LAST_ROW: () => handelDuplicateDynamicField(EntryField.length - 1),
		ENTER: (event) => handleEnter(event),
	};

	configure({
		ignoreTags: ['input', 'select', 'textarea'],
		ignoreEventsCondition: function () {},
	});

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide';

	return (
		<FormProvider {...form}>
			<HotKeys {...{ keyMap, handlers }}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='flex flex-col gap-4'
				>
					<DynamicField
						title={`${data?.name} (Mtr/Kg): ${data?.dyed_per_kg_meter}, 
								Remaining: ${MAX_TAPE_TRX_QTY} KG`}
						handelAppend={handelEntryAppend}
						tableHead={[
							'Order Entry ID',
							'Tape Required (MTR)',
							'Tape Required (Kg)',
							'Provided (Kg)',
							'Balance (Kg)',
							...(orderSelected?.order_type === 'tape'
								? ['Style-Color', 'Trx Qty (M)']
								: []),
							'Trx Quantity',
							'Remarks',
							'Action',
						].map((item) => (
							<th
								key={item}
								scope='col'
								className='group cursor-pointer select-none whitespace-nowrap bg-secondary py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300 first:pl-2'
							>
								{item}
							</th>
						))}
					>
						{EntryField.map((item, index) => {
							const selectedValue = order_id?.find(
								(item) =>
									item.value ==
									watch(
										`dyeing_transfer_entry[${index}].order_description_uuid`
									)
							);

							const top_bottom =
								Number(selectedValue?.total_quantity || 0) *
								Number(
									Number(selectedValue?.top || 0) +
										Number(selectedValue?.bottom || 0)
								).toFixed(3);

							const tape_req = Number(
								(Number(selectedValue?.total_size) +
									top_bottom) /
									100
							).toFixed(3);

							const tape_req_kg = Number(
								tape_req / Number(data?.dyed_per_kg_meter)
							).toFixed(3);

							return (
								<tr key={item.id}>
									{/* order entry id */}
									<td className={`w-80 ${rowClass}`}>
										<FormField
											label={`dyeing_transfer_entry[${index}].order_description_uuid`}
											title='order_description_uuid'
											is_title_needed='false'
											dynamicerror={
												errors?.dyeing_transfer_entry?.[
													index
												].order_description_uuid
											}
										>
											<Controller
												name={`dyeing_transfer_entry[${index}].order_description_uuid`}
												control={control}
												render={({
													field: { onChange },
												}) => {
													return (
														<ReactSelect
															menuPortalTarget={
																document.body
															}
															placeholder='Select Order Entry ID'
															options={order_id?.filter(
																(inItem) =>
																	!excludeItem?.some(
																		(
																			excluded
																		) =>
																			excluded?.value ===
																			inItem?.value
																	)
															)}
															value={
																selectedValue
															}
															onChange={(e) => {
																onChange(
																	e.value
																);
																setValue(
																	`dyeing_transfer_entry[${index}].tape_received`,
																	e.tape_received
																);
																setStatus(
																	!status
																);
																setOrderSelected(
																	e
																);
															}}
															// isDisabled={updateCoilProd?.id !== null}
														/>
													);
												}}
											/>
										</FormField>
									</td>
									<td>{tape_req || 0}</td>
									<td>{tape_req_kg || 0}</td>
									<td>{selectedValue?.tape_transferred}</td>
									<td>
										{Number(
											tape_req_kg -
												parseFloat(
													selectedValue?.tape_transferred
												)
										).toFixed(3)}
									</td>
									{orderSelected?.order_type === 'tape' && (
										<>
											<td className={`w-36 ${rowClass}`}>
												<FormField
													label={`dyeing_transfer_entry[${index}].sfg_uuid`}
													title='Style'
													is_title_needed='false'
													dynamicerror={
														errors
															?.dyeing_transfer_entry?.[
															index
														].sfg_uuid
													}
												>
													<Controller
														name={`dyeing_transfer_entry[${index}].sfg_uuid`}
														control={control}
														render={({
															field: { onChange },
														}) => {
															return (
																<ReactSelect
																	menuPortalTarget={
																		document.body
																	}
																	placeholder='Select Style'
																	options={
																		orderSelected?.style_color_object
																	}
																	value={orderSelected?.style_color_object?.filter(
																		(
																			item
																		) =>
																			item.value ===
																			getValues(
																				`dyeing_transfer_entry[${index}].sfg_uuid`
																			)
																	)}
																	onChange={(
																		e
																	) => {
																		onChange(
																			e.value
																		);
																	}}
																	// isDisabled={updateCoilProd?.id !== null}
																/>
															);
														}}
													/>
												</FormField>
											</td>
											<td className={`w-52 ${rowClass}`}>
												<JoinInput
													label={`dyeing_transfer_entry[${index}].trx_quantity_in_meter`}
													is_title_needed='false'
													// placeholder={`Max: ${}`}  // TODO: fix this with schema
													unit='M'
													dynamicerror={
														errors
															?.dyeing_transfer_entry?.[
															index
														].trx_quantity_in_meter
													}
													{...{ register, errors }}
												/>
											</td>
										</>
									)}
									{/* Trx quantity */}
									<td className={`w-52 ${rowClass}`}>
										<JoinInput
											label={`dyeing_transfer_entry[${index}].trx_quantity`}
											is_title_needed='false'
											// placeholder={`Max: ${}`}  // TODO: fix this with schema
											unit='KG'
											dynamicerror={
												errors?.dyeing_transfer_entry?.[
													index
												].trx_quantity
											}
											{...{ register, errors }}
										/>
									</td>
									<td className={`w-56 ${rowClass}`}>
										<Textarea
											title='remarks'
											label={`dyeing_transfer_entry[${index}].remarks`}
											is_title_needed='false'
											dynamicerror={
												errors?.dyeing_transfer_entry?.[
													index
												]?.remarks
											}
											register={register}
										/>
									</td>
									{/* Action*/}
									<td
										className={`w-20 ${rowClass} border-l-4 border-l-primary`}
									>
										<ActionButtons
											duplicateClick={() =>
												handelDuplicateDynamicField(
													index
												)
											}
											removeClick={() =>
												handleEntryRemove(index)
											}
											showRemoveButton={
												EntryField.length > 1
											}
										/>
									</td>
								</tr>
							);
						})}
						<tr className='border-t border-primary/30'>
							<td
								className='py-4 text-right font-bold'
								colSpan='2'
							>
								Total Quantity:
							</td>
							<td className='py-4 font-bold'>
								{getTotalQty(watch('dyeing_transfer_entry'))}
							</td>
						</tr>
					</DynamicField>
					<Footer buttonClassName='!btn-primary' />
				</form>
			</HotKeys>
			<Suspense>
				<DeleteModal
					modalId={'order_entry_delete'}
					title={'Order Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={EntryField}
					url={`/zipper/order-entry`}
					deleteData={deleteData}
				/>
			</Suspense>

			<DevTool control={control} placement='top-left' />
		</FormProvider>
	);
}
