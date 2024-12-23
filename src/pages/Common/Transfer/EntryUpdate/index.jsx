import { Suspense, useCallback, useEffect, useState } from 'react';
import { useDyeingTransfer } from '@/state/Dyeing';
import { useMetalTMProduction } from '@/state/Metal';
import {
	useNylonMFProduction,
	useNylonPlasticFinishingProduction,
} from '@/state/Nylon';
import { useOtherOrderDescription } from '@/state/Other';
import { useVislonTMP } from '@/state/Vislon';
import { useAuth } from '@context/auth';
import { FormProvider } from 'react-hook-form';
import { configure, HotKeys } from 'react-hotkeys';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
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
	DYEING_TRANSFER_NULL,
	DYEING_TRANSFER_SCHEMA,
	NUMBER_DOUBLE,
	STRING,
	STRING_REQUIRED,
} from '@util/Schema';
import { exclude } from '@/util/Exclude';
import GetDateTime from '@/util/GetDateTime';

export default function Index() {
	const [orderSelected, setOrderSelected] = useState({});
	const { postData, deleteData } = useDyeingTransfer();
	const { invalidateQuery: invalidateNylonMFProduction } =
		useNylonMFProduction();
	const { invalidateQuery: invalidateNylonPFProduction } =
		useNylonPlasticFinishingProduction();
	const { invalidateQuery: invalidateMetalTMProduction } =
		useMetalTMProduction();
	const { invalidateQuery: invalidateQueryVislonTMP } = useVislonTMP();
	const { uuid, order_number, order_description_uuid } = useParams();
	const [status, setStatus] = useState(false);
	const { user } = useAuth();
	const navigate = useNavigate();

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
			dyeing_transfer_entry: yup.array().of(
				yup.object().shape({
					order_description_uuid: STRING_REQUIRED,
					colors: yup.array().of(yup.string()).nullable(),
					trx_quantity: NUMBER_DOUBLE.required('Required').transform(
						(value, originalValue) =>
							String(originalValue).trim() === '' ? null : value
					), // Transforms empty strings to null
					remarks: STRING.nullable(),
				})
			),
		},
		DYEING_TRANSFER_NULL
	);

	useEffect(() => {
		order_number !== undefined
			? (document.title = `Order: Update ${order_number}`)
			: (document.title = 'Order: Entry');
	}, []);

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

	const getTotalQty = useCallback(
		(coil_to_dyeing_entry) =>
			coil_to_dyeing_entry.reduce((acc, item) => {
				return acc + Number(item.trx_quantity);
			}, 0),
		[watch()]
	);

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
	const onClose = () => reset(DYEING_TRANSFER_NULL);

	// TODO Submit
	const onSubmit = async (data) => {
		// * Add new data entry
		const created_at = GetDateTime();

		const isOverStock = data?.dyeing_transfer_entry.map((item, index) => {
			const selectedValue = order_id?.find(
				(item) =>
					item.value ==
					watch(
						`dyeing_transfer_entry[${index}].order_description_uuid`
					)
			);
			const stock =
				Number(selectedValue?.stock || 0) -
				selectedValue?.tape_transferred;
			if (Number(item.trx_quantity) > stock) {
				return true;
			}
			return false;
		});
		if (isOverStock.includes(true)) {
			ShowLocalToast({
				type: 'error',
				message: 'Beyond Stock',
			});
			return;
		}
		const entryData = [...data.dyeing_transfer_entry].map((item) => ({
			...item,
			uuid: nanoid(),
			created_by: user?.uuid,
			created_at,
		}));

		//* Post new entry */ //
		let entryData_promises = [
			...entryData.map(
				async (item) =>
					await postData.mutateAsync({
						url: '/zipper/dyed-tape-transaction',
						newData: item,
						onClose,
					})
			),
		];
		// * All promises
		await Promise.all(entryData_promises)
			.then(() => reset(Object.assign({}, DYEING_TRANSFER_NULL)))
			.then(async () => {
				invalidateNylonMFProduction();
				invalidateNylonPFProduction();
				invalidateMetalTMProduction();
				invalidateQueryVislonTMP();
				// await OrderDetailsInvalidate(); common/tape/log
				navigate('/common/dyed-store');
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

	// * get order id and set them as value & lables for select options
	const { data: order_id } = useOtherOrderDescription(
		'is_slider_needed=false'
	);

	let excludeItem = exclude(
		watch,
		order_id,
		'dyeing_transfer_entry',
		'order_description_uuid',
		status
	);

	return (
		<FormProvider {...form}>
			<HotKeys {...{ keyMap, handlers }}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='flex flex-col gap-4'>
					<DynamicField
						title='Transfer Details'
						handelAppend={handelEntryAppend}
						tableHead={[
							'Order Desc',
							'Tape Req (MTR)',
							'Tape Req (Kg)',
							'Provided (Kg)',
							'Stock (Kg)',
							'Balance (Kg)',
							'Trx Quantity',
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
								tape_req /
									Number(selectedValue?.dyed_per_kg_meter)
							).toFixed(3);
							return (
								<tr key={item.id}>
									{/* Order Desc */}
									<td className={`w-80 ${rowClass}`}>
										<FormField
											label={`dyeing_transfer_entry[${index}].order_description_uuid`}
											title='order_description_uuid'
											is_title_needed='false'
											dynamicerror={
												errors?.dyeing_transfer_entry?.[
													index
												].order_description_uuid
											}>
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

																// getColors(e.colors);
															}}
															// isDisabled={updateCoilProd?.id !== null}
														/>
													);
												}}
											/>
										</FormField>
									</td>

									{/* Tape Req (MTR) */}
									<td>{tape_req || 0}</td>

									{/* Tape Req (Kg) */}
									<td>{tape_req_kg || 0}</td>

									{/* Provided (Kg) */}
									<td>{selectedValue?.tape_transferred}</td>

									{/* Stock (Kg) */}
									<td>
										{Number(
											Number(selectedValue?.stock || 0) -
												selectedValue?.tape_transferred
										).toFixed(3)}
									</td>
									<td>
										{Number(
											tape_req_kg -
												parseFloat(
													selectedValue?.tape_transferred
												)
										).toFixed(3)}
									</td>
									{/* Trx quantity*/}
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

									{/* Remarks*/}
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
										className={`w-20 ${rowClass} border-l-4 border-l-primary`}>
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
								colSpan='2'>
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
