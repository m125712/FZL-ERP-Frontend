import { DeleteModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast';
import { useFetch, useFetchForRhfReset, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useOrderDescription } from '@/state/Order';
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
import {
	COMMON_COIL_TO_DYEING_NULL,
	COMMON_COIL_TO_DYEING_SCHEMA,
} from '@util/Schema';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { HotKeys, configure } from 'react-hotkeys';
import {
	Navigate,
	useLocation,
	useNavigate,
	useParams,
} from 'react-router-dom';

export default function Index() {
	const { order_number, order_description_uuid, coil_uuid } = useParams();
	const location = useLocation();

	const { postData, deleteData } = useOrderDescription();
	const { value: data } = useFetch(`/zipper/tape-coil/${coil_uuid}`, [
		coil_uuid,
	]);

	const segments = location.pathname.split('/').filter((segment) => segment);

	const secondElement = segments[1];
	let MAX_QTY = 0;
	secondElement === 'coil'
		? (MAX_QTY = data?.quantity_in_coil)
		: (MAX_QTY = data?.quantity);
	console.log(coil_uuid);
	const { value: order_id } = useFetch(
		`/other/order/order-description/value/label/by/${coil_uuid}`,
		[coil_uuid]
	);
	console.log(order_id);
	// let schema = {};
	// if (secondElement === 'coil') {
	// 	schema = {
	// 		coil_to_dyeing_entry: yup.array().of(
	// 			yup.object().shape({
	// 				order_id: UUID_REQUIRED,
	// 				trx_quantity: NUMBER_DOUBLE_REQUIRED.max(
	// 					data?.quantity_in_coil,
	// 					'Beyond Stock'
	// 				),
	// 				// .max(yup.ref('max_trf_qty'), 'Beyond Stock'), // Transforms empty strings to null
	// 				remarks: STRING.nullable(),
	// 			})
	// 		),
	// 	};
	// } else {
	// 	schema = {
	// 		coil_to_dyeing_entry: yup.array().of(
	// 			yup.object().shape({
	// 				order_id: UUID_REQUIRED,
	// 				trx_quantity: NUMBER_DOUBLE_REQUIRED.max(
	// 					data?.quantity,
	// 					'Beyond Stock'
	// 				),
	// 				// .max(yup.ref('max_trf_qty'), 'Beyond Stock'), // Transforms empty strings to null
	// 				remarks: STRING.nullable(),
	// 			})
	// 		),
	// 	};
	// }

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
		context,
	} = useRHF(COMMON_COIL_TO_DYEING_SCHEMA, COMMON_COIL_TO_DYEING_NULL);

	const getTotalQty = useCallback(
		(coil_to_dyeing_entry) =>
			coil_to_dyeing_entry.reduce((acc, item) => {
				return acc + Number(item.trx_quantity);
			}, 0),
		[watch()]
	);
	const MAX_TAPE_TRX_QTY =
		MAX_QTY - getTotalQty(watch('coil_to_dyeing_entry'));

	useEffect(() => {
		order_number !== undefined
			? (document.title = `Order: Update ${order_number}`)
			: (document.title = 'Order: Entry');
	}, []);

	if (isUpdate)
		useFetchForRhfReset(
			`/zipper/order/details/single-order/by/${order_description_uuid}/UUID`,
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
	//const isMatch = location.pathname.startsWith(basePath); // * checking if the current path matches the base path

	return (
		<div>
			<HotKeys {...{ keyMap, handlers }}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='flex flex-col gap-4'>
					<DynamicField
						title={`Remaining: ${MAX_TAPE_TRX_QTY} KG`}
						handelAppend={handelEntryAppend}
						tableHead={[
							'Order Entry ID',
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
														options={order_id}
														value={order_id?.find(
															(item) =>
																item.value ==
																getValues(
																	'order_id'
																)
														)}
														onChange={(e) =>
															onChange(e.value)
														}
														// isDisabled={updateCoilProd?.id !== null}
													/>
												);
											}}
										/>
									</FormField>
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
						))}
						<tr className='border-t border-primary/30'>
							<td
								className='py-4 text-right font-bold'
								colSpan='2'>
								Total Quantity:
							</td>
							<td className='py-4 font-bold'>
								{getTotalQty(watch('coil_to_dyeing_entry'))}
							</td>
						</tr>
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
