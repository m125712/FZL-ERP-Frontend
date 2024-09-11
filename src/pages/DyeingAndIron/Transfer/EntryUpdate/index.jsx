import { DeleteModal } from '@/components/Modal';
import { useFetch, useFetchForRhfReset, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useDyeingTransfer } from '@/state/Dyeing';
import { useOrderDescription, useOrderDetails } from '@/state/Order';
import {
	ActionButtons,
	DynamicField,
	FormField,
	Input,
	JoinInput,
	ReactSelect,
	Textarea,
} from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { DYEING_TRANSFER_NULL, DYEING_TRANSFER_SCHEMA } from '@util/Schema';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { HotKeys, configure } from 'react-hotkeys';
import {
	Navigate,
	useLocation,
	useNavigate,
	useParams,
} from 'react-router-dom';

export default function Index({ sfg }) {
	const { postData, deleteData } = useDyeingTransfer();
	const { uuid, order_number, order_description_uuid, coil_uuid } =
		useParams();
	const urlPath = useLocation();

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
	} = useRHF(DYEING_TRANSFER_SCHEMA, DYEING_TRANSFER_NULL);

	useEffect(() => {
		order_number !== undefined
			? (document.title = `Order: Update ${order_number}`)
			: (document.title = 'Order: Entry');
	}, []);

	if (isUpdate)
		useFetchForRhfReset(
			`/zipper/dyed-tape-transaction/${uuid}/UUID`,
			order_description_uuid,
			reset
		);

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
	const onClose = () => reset(DYEING_TRANSFER_NULL);

	// TODO Submit
	const onSubmit = async (data) => {
		const DEFAULT_SWATCH_APPROVAL_DATE = null;

		// * Add new data entry
		const created_at = GetDateTime();

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
				// await OrderDetailsInvalidate(); common/tape/log
				navigate('/dyeing-and-iron/transfer');
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

	const basePath = '/common/coil/sfg/entry-to-dyeing/';
	const isMatch = location.pathname.startsWith(basePath); // * checking if the current path matches the base path

	const [colors, setColors] = useState([]);
	const [colorsSelect, setColorsSelect] = useState([]);
	const { value: order_id } = useFetch(
		`/other/order/description/value/label?tape_received=true`
	); // * get order id and set them as value & lables for select options

	const getTransferArea = [
		// * get transfer area and set them as value & lables for transfer select options
		{ label: 'Nylon Plastic Finishing', value: 'nylon_plastic_finishing' },
		{
			label: 'Nylon Metallic Finishing',
			value: 'nylon_metallic_finishing',
		},
		{ label: 'Vislon Teeth Molding', value: 'vislon_teeth_molding' },
		{ label: 'Metal Teeth Molding', value: 'metal_teeth_molding' },
	];

	const getColors = (colors) => {
		// * get colors and set them as value & lables for select options
		setColors([]);
		colors.map((item) => {
			setColors((prev) => [...prev, { label: item, value: item }]);
		});
	};

	console.log(order_id);
	return (
		<div>
			<HotKeys {...{ keyMap, handlers }}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='flex flex-col gap-4'>
					<DynamicField
						title='Transfer Details'
						handelAppend={handelEntryAppend}
						tableHead={[
							'Order Entry ID',
							'Colors',
							'Transfer',
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
						{EntryField.map((item, index) => (
							<tr key={item.id}>
								{/* order entry id */}
								<td className={`w-80 ${rowClass}`}>
									<Controller
										name={`dyeing_transfer_entry[${index}].order_description_uuid`}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													menuPortalTarget={
														document.body
													}
													placeholder='Select Order Entry ID'
													options={order_id}
													value={order_id?.find(
														(item) =>
															item.value ==
															getValues(
																'order_description_uuid'
															)
													)}
													onChange={(e) => {
														onChange(e.value);
														setValue(
															`dyeing_transfer_entry[${index}].tape_received`,
															e.tape_received
														);
														getColors(e.colors);
													}}
													// isDisabled={updateCoilProd?.id !== null}
												/>
											);
										}}
									/>
								</td>

								{/* color*/}
								<td className={`w-96 ${rowClass}`}>
									<FormField
										label='colors'
										is_title_needed='false'
										title='colors'
										errors={errors}>
										<Controller
											name={`dyeing_transfer_entry[${index}].colors`}
											control={control}
											render={({
												field: { onChange },
											}) => {
												return (
													<ReactSelect
														placeholder='Select Multi Requirement'
														options={colors}
														value={colors?.filter(
															(item) =>
																colorsSelect?.includes(
																	item.value
																)
														)}
														onChange={(e) => {
															const newSelections =
																e
																	? e.map(
																			(
																				item
																			) =>
																				item.value
																		)
																	: [];
															setColorsSelect(
																newSelections
															);

															onChange(
																newSelections
															);
														}}
														isMulti={true}
														menuPortalTarget={
															document.body
														}
													/>
												);
											}}
										/>
									</FormField>
								</td>

								{/* Transfer*/}
								<td className={`w-80 ${rowClass}`}>
									<Controller
										name={`dyeing_transfer_entry[${index}].section`}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													menuPortalTarget={
														document.body
													}
													placeholder='Select Transfer'
													options={getTransferArea}
													value={getTransferArea.find(
														(item) =>
															item.value ==
															getValues('section')
													)}
													onChange={(e) =>
														onChange(e.value)
													}
													// isDisabled={updateCoilProd?.id !== null}
												/>
											);
										}}
									/>
								</td>

								{/* Trx quantity*/}
								<td className={`w-32 ${rowClass}`}>
									<JoinInput
										label={`dyeing_transfer_entry[${index}].trx_quantity`}
										is_title_needed='false'
										// sub_label={`Maximum For this Order: ${getMaxQuantity()}`}
										unit='KG'
										// placeholder={`Max: ${
										// 	getMaxQuantity() <
										// 	updateCoilProd?.quantity_in_coil
										// 		? getMaxQuantity()
										// 		: updateCoilProd?.quantity_in_coil
										// }`}
										dynamicerror={
											errors?.dyeing_transfer_entry?.[
												index
											].trx_quantity
										}
										{...{ register, errors }}
									/>
								</td>

								{/* Remarks*/}
								<td className={` ${rowClass}`}>
									<Textarea
										title='color'
										label={`dyeing_transfer_entry[${index}].remarks`}
										is_title_needed='false'
										dynamicerror={
											errors?.dyeing_transfer_entry?.[
												index
											]?.color
										}
										register={register}
									/>
								</td>

								{/* Action*/}
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
					setItems={EntryField}
					url={`/zipper/order-entry`}
					deleteData={deleteData}
				/>
			</Suspense>

			<DevTool control={control} placement='top-left' />
		</div>
	);
}
