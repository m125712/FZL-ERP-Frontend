import { Suspense, useCallback, useEffect, useState } from 'react';
import {
	useCommonCoilSFG,
	useCommonCoilToDyeing,
	useCommonMultiColorLog,
	useCommonTapeSFG,
	useCommonTapeToDyeing,
} from '@/state/Common';
import { useDyeingOrderBatch } from '@/state/Dyeing';
import { useOrderDescription } from '@/state/Order';
import { useGetURLData } from '@/state/Other';
import { useAuth } from '@context/auth';
import { FormProvider } from 'react-hook-form';
import { configure, HotKeys } from 'react-hotkeys';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import { Footer } from '@/components/Modal/ui';
import { ShowLocalToast } from '@/components/Toast';
import {
	ActionButtons,
	DynamicField,
	FormField,
	Input,
	JoinInput,
	ReactSelect,
	Textarea,
} from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	COMMON_COIL_TO_DYEING_NULL,
	COMMON_COIL_TO_DYEING_SCHEMA,
} from '@util/Schema';
import { exclude } from '@/util/Exclude';
import GetDateTime from '@/util/GetDateTime';

export default function Index() {
	const { order_number, order_description_uuid, coil_uuid } = useParams();
	const { invalidateQuery: invalidateTapeToDyeing } = useCommonTapeToDyeing();
	const { invalidateQuery: invalidateCoilToDyeing } = useCommonCoilToDyeing();
	const { invalidateQuery: invalidateCommonCoilSFG } = useCommonCoilSFG();
	const { invalidateQuery: invalidateCommonTapeSFG } = useCommonTapeSFG();
	const { invalidateQuery: invalidateDyeingOrderBatch } =
		useDyeingOrderBatch();
	const { invalidateQuery: invalidateCommonMultiColorLog } =
		useCommonMultiColorLog();

	const location = useLocation();
	const [status, setStatus] = useState(false);
	const { postData, deleteData } = useOrderDescription();
	const { data } = useGetURLData(`/zipper/tape-coil/${coil_uuid}`);
	const { data: order_description } = useGetURLData(
		`/zipper/order/details/single-order/by/${order_description_uuid}/UUID`
	);

	const segments = location.pathname.split('/').filter((segment) => segment);

	const secondElement = segments[1];
	let MAX_QTY = 0;
	secondElement === 'coil'
		? (MAX_QTY = data?.quantity_in_coil)
		: (MAX_QTY = data?.quantity);

	const { data: order_id } = useGetURLData(
		`/other/order/order-description/value/label/by/${coil_uuid}?is_slider_needed=false`
	);

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
		context: form,
	} = useRHF(COMMON_COIL_TO_DYEING_SCHEMA, COMMON_COIL_TO_DYEING_NULL);

	const getTotalQty = useCallback(
		(coil_to_dyeing_entry) =>
			coil_to_dyeing_entry.reduce((acc, item) => {
				return acc + Number(item.trx_quantity);
			}, 0),
		[watch()]
	);
	let excludeItem = exclude(
		watch,
		order_id,
		'coil_to_dyeing_entry',
		'order_id',
		status
	);
	const MAX_TAPE_TRX_QTY =
		MAX_QTY - getTotalQty(watch('coil_to_dyeing_entry'));

	useEffect(() => {
		order_number !== undefined
			? (document.title = `Order: Update ${order_number}`)
			: (document.title = 'Order: Entry');
	}, []);

	useEffect(() => {
		if (order_description && isUpdate) {
			reset(order_description);
		}
	}, [order_description]);

	const {
		fields: EntryField,
		append: EntryAppend,
		remove: EntryRemove,
	} = useFieldArray({
		control,
		name: 'coil_to_dyeing_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleEntryRemove = (index) => {
		if (
			getValues(`coil_to_dyeing_entry[${index}].order_entry_uuid`) !==
			undefined
		) {
			setDeleteItem({
				itemId: getValues(
					`coil_to_dyeing_entry[${index}].order_entry_uuid`
				),
				itemName: getValues(
					`coil_to_dyeing_entry[${index}].order_entry_uuid`
				),
			});
			window['order_entry_delete'].showModal();
		}
		EntryRemove(index);
	};

	const handelEntryAppend = () => {
		EntryAppend({
			order_id: null,
			trx_quantity: null,
			remarks: '',
		});
	};

	// TODO Submit
	const onSubmit = async (data) => {
		// * Add new data*//
		const created_at = GetDateTime();

		if (MAX_TAPE_TRX_QTY < 0) {
			ShowLocalToast({
				type: 'error',
				message: 'Beyond Stock',
			});
			return;
		}

		const entryData = [...data.coil_to_dyeing_entry].map((item) => ({
			...item,
			uuid: nanoid(),
			tape_coil_uuid: coil_uuid,
			order_description_uuid: item.order_id,
			created_by: user?.uuid,
			created_at,
		}));

		let entryData_promises = [
			...entryData.map(
				async (item) =>
					await postData.mutateAsync({
						url: '/zipper/tape-coil-to-dyeing',
						newData: item,
						isOnCloseNeeded: false,
					})
			),
		];
		// * All promises
		await Promise.all(entryData_promises)
			.then(() => reset(Object.assign({}, COMMON_COIL_TO_DYEING_NULL)))
			.then(async () => {
				// await OrderDetailsInvalidate(); common/tape/log
				invalidateTapeToDyeing();
				invalidateCoilToDyeing();
				invalidateCommonCoilSFG();
				invalidateCommonTapeSFG();
				invalidateDyeingOrderBatch();
				invalidateCommonMultiColorLog();

				navigate(
					secondElement === 'coil'
						? '/common/coil/log'
						: `/common/tape/log`
				);
			})
			.catch((err) => console.log(err));
	};

	// Check if order_number is valid
	// if (getValues('quantity') === null) return <Navigate to='/not-found' />;

	const handelDuplicateDynamicField = useCallback(
		(index) => {
			const item = getValues(`coil_to_dyeing_entry[${index}]`);
			EntryAppend({ ...item, order_entry_uuid: undefined });
		},
		[getValues, EntryAppend]
	);

	const handleEnter = (event) => {
		event.preventDefault();
		if (Object.keys(errors).length > 0) return;
	};

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide';

	const basePath = '/common/coil/sfg/entry-to-dyeing/';
	//const isMatch = location.pathname.startsWith(basePath); // * checking if the current path matches the base path

	return (
		<FormProvider {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className='flex flex-col gap-4'>
				<DynamicField
					title={`${data?.name} (Mtr/Kg): ${data?.raw_per_kg_meter}, 
								Remaining: ${MAX_TAPE_TRX_QTY.toFixed(2)} KG`}
					handelAppend={handelEntryAppend}
					tableHead={[
						'Order Description',
						'Tape Req (MTR)',
						'Tape Req (Kg)',
						'Provided (Kg)',
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
								getValues(
									`coil_to_dyeing_entry[${index}].order_id`
								)
						);

						const mtr_per_kg = data?.raw_mtr_per_kg;

						console.log(selectedValue);

						const top_bottom =
							parseFloat(selectedValue?.total_quantity || 0) *
							parseFloat(
								parseFloat(selectedValue?.top || 0) +
									parseFloat(selectedValue?.bottom || 0)
							).toFixed(3);

						const tape_req = Number(
							(Number(selectedValue?.total_size) + top_bottom) /
								100
						).toFixed(3);

						const tape_req_kg = Number(
							tape_req / Number(data?.raw_per_kg_meter)
						).toFixed(3);

						return (
							<tr key={item.id}>
								<td className={`w-96 ${rowClass}`}>
									<FormField
										label={`coil_to_dyeing_entry[${index}].order_id`}
										title='Material'
										is_title_needed='false'
										dynamicerror={
											errors?.coil_to_dyeing_entry?.[
												index
											]?.order_id
										}>
										<Controller
											name={`coil_to_dyeing_entry[${index}].order_id`}
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
														value={selectedValue}
														onChange={(e) => {
															onChange(e.value);
															setStatus(!status);
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
								<td>{selectedValue?.tape_received}</td>
								<td>
									{Number(
										tape_req_kg -
											Number(selectedValue?.tape_received)
									).toFixed(3)}
								</td>
								<td className={`w-56 ${rowClass}`}>
									<JoinInput
										label={`coil_to_dyeing_entry[${index}].trx_quantity`}
										is_title_needed='false'
										unit='KG'
										dynamicerror={
											errors?.coil_to_dyeing_entry?.[
												index
											]?.trx_quantity
										}
										{...{ register, errors }}
									/>
								</td>
								<td className={` ${rowClass}`}>
									<Textarea
										title='remarks'
										label={`coil_to_dyeing_entry[${index}].remarks`}
										is_title_needed='false'
										dynamicerror={
											errors?.coil_to_dyeing_entry?.[
												index
											]?.remarks
										}
										register={register}
									/>
								</td>

								<td
									className={`w-20 ${rowClass} border-l-4 border-l-primary`}>
									<ActionButtons
										duplicateClick={() =>
											handelDuplicateDynamicField(index)
										}
										removeClick={() =>
											handleEntryRemove(index)
										}
										showRemoveButton={EntryField.length > 1}
									/>
								</td>
							</tr>
						);
					})}
					<tr className='border-t border-primary/30'>
						<td
							className='py-4 text-left font-bold'
							colSpan='4'></td>
						<td className='py-4 text-right font-bold'>
							Total Quantity:
						</td>
						<td className='py-4 font-bold'>
							{getTotalQty(watch('coil_to_dyeing_entry'))}
						</td>
					</tr>
				</DynamicField>

				<Footer buttonClassName='!btn-primary' />
			</form>
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
