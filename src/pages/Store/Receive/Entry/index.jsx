import { DeleteModal } from '@/components/Modal';
import {
	useFetch,
	useFetchForRhfResetForOrder,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from '@/hooks';
import {
	DynamicField,
	FormField,
	Input,
	JoinInput,
	ReactSelect,
	RemoveButton,
} from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { PURCHASE_ENTRY_NULL, PURCHASE_ENTRY_SCHEMA } from '@util/Schema';
import { customAlphabet } from 'nanoid';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { HotKeys, configure } from 'react-hotkeys';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Header from './Header';

const alphabet =
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 10);

// UPDATE IS NOT WORKING
export default function Index() {
	const { id, purchase_description_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();

	const [unit, setUnit] = useState({});

	useEffect(() => {
		id !== undefined
			? (document.title = 'Update Purchase: ' + id)
			: (document.title = 'Purchase Entry');
	}, []);

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
	} = useRHF(PURCHASE_ENTRY_SCHEMA, PURCHASE_ENTRY_NULL);

	const isUpdate =
		purchase_description_uuid !== undefined && id !== undefined;

	isUpdate &&
		useFetchForRhfResetForOrder(
			`/purchase-details/by/${purchase_description_uuid}`,
			purchase_description_uuid,
			reset
		);

	const { value: material } = useFetch(
		'/other/material/value/label/unit/quantity'
	);
	const { value: vendor } = useFetch('/other/vendor/value/label');

	// purchase
	const {
		fields: purchaseField,
		append: purchaseAppend,
		remove: purchaseRemove,
	} = useFieldArray({
		control,
		name: 'purchase',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handlePurchaseRemove = (index) => {
		if (getValues(`purchase[${index}].uuid`) !== undefined) {
			setDeleteItem({
				itemId: getValues(`purchase[${index}].material_uuid`),
				itemName: getValues(`purchase[${index}].material_uuid`),
			});
			window['purchase_delete'].showModal();
		}
		purchaseRemove(index);
	};

	const handelPurchaseAppend = () => {
		purchaseAppend({
			material_uuid: '',
			quantity: '',
			price: '',
			remarks: '',
		});
	};
	const onClose = () => reset(PURCHASE_ENTRY_NULL);

	// Submit
	const onSubmit = async (data) => {
		const vendor_name = vendor?.find(
			(item) => item.value == data?.vendor_uuid
		)?.label;
		// Update
		if (isUpdate) {
			const purchase_description_data = {
				...data,
				vendor_name: vendor_name,
				updated_at: GetDateTime(),
			};

			let purchase_description_promise = useUpdateFunc({
				uri: `/purchase/description/${data?.id}/${purchase_description_data?.vendor_name}`,
				itemId: data.id,
				data: data,
				updatedData: purchase_description_data,
				onClose: onClose,
			}).catch((err) => console.error(`Error updating data: ${err}`));
			let promises = data.purchase.map(async (item) => {
				const material_name = material?.find(
					(inItem) => inItem.value == item.material_id
				).label;
				if (item.id === undefined) {
					item.purchase_description_uuid = purchase_description_uuid;
					item.created_at = GetDateTime();
					return await usePostFunc({
						uri: '/purchase',
						data: item,
					}).catch((err) => console.error(`Error: ${err}`));
				} else {
					item.updated_at = GetDateTime();
					const updatedData = {
						...item,
						material_name: material_name,
					};
					return await useUpdateFunc({
						uri: `/purchase/${
							item?.id
							// replace #,/, & from material_name
						}/${updatedData?.material_name.replace(/[#&/]/g, '')}`,
						itemId: item.id,
						data: item,
						updatedData: updatedData,
						onClose: onClose,
					}).catch((err) =>
						console.error(`Error updating data: ${err}`)
					);
				}
			});
			// console.log(promises);

			try {
				await Promise.all([purchase_description_promise, ...promises])
					.then(() => reset(Object.assign({}, PURCHASE_ENTRY_NULL)))
					.then(() =>
						navigate(`/store/receive/${purchase_description_uuid}`)
					);
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		// Add
		var new_purchase_description_uuid = nanoid();

		const created_at = GetDateTime();
		const special_requirement = JSON.stringify({
			values: data?.special_requirement || [],
		});

		const purchase_details = {
			...data,
			special_requirement,
			purchase_description_uuid: new_purchase_description_uuid,
			created_at,
			issued_by: user.id,
		};
		await usePostFunc({
			uri: '/purchase/description',
			data: purchase_details,
		});

		const purchase = [...data.purchase].map((item) => ({
			...item,
			purchase_description_uuid: new_purchase_description_uuid,
			created_at,
		}));
		let promises = [
			...purchase.map((item) =>
				usePostFunc({
					uri: '/purchase',
					data: item,
				})
			),
		];
		await Promise.all(promises)
			.then(() => reset(Object.assign({}, PURCHASE_ENTRY_NULL)))
			.then(() =>
				navigate(`/store/receive/${new_purchase_description_uuid}`)
			)
			.catch((err) => console.log(err));
	};

	// Check if id is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;

	const keyMap = {
		NEW_ROW: 'alt+n',
		COPY_LAST_ROW: 'alt+c',
	};

	const handlers = {
		NEW_ROW: handelPurchaseAppend,
	};

	configure({
		ignoreTags: ['input', 'select', 'textarea'],
		ignoreEventsCondition: function () {},
	});

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide';

	const getTotalPrice = useCallback(
		(purchase) =>
			purchase.reduce((acc, item) => {
				return acc + Number(item.price);
			}, 0),
		[watch()]
	);

	return (
		<div className='container mx-auto mt-4 px-2 pb-2 md:px-4'>
			<HotKeys {...{ keyMap, handlers }}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='flex flex-col gap-8'>
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
						handelAppend={handelPurchaseAppend}
						tableHead={[
							'Material',
							'Quantity',
							'Total Price',
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
						{purchaseField.map((item, index) => (
							<tr key={item.id} className='w-full'>
								<td className={`pl-1 ${rowClass}`}>
									<FormField
										label={`purchase[${index}].material_id`}
										title='Material'
										is_title_needed='false'
										errors={errors}>
										<Controller
											name={`purchase[${index}].material_id`}
											control={control}
											render={({
												field: { onChange },
											}) => {
												return (
													<ReactSelect
														placeholder='Select Material'
														options={material}
														value={material?.find(
															(inItem) =>
																inItem.value ==
																getValues(
																	`purchase[${index}].material_id`
																)
														)}
														onChange={(e) => {
															onChange(
																parseInt(
																	e.value
																)
															);
															setUnit({
																...unit,
																[index]: e.unit,
															});
														}}
														menuPortalTarget={
															document.body
														}
														// isDisabled={
														// 	purchase_description_uuid !==
														// 	undefined
														// }
													/>
												);
											}}
										/>
									</FormField>
								</td>
								<td className='w-40'>
									<JoinInput
										title='quantity'
										label={`purchase[${index}].quantity`}
										is_title_needed='false'
										dynamicerror={
											errors?.purchase?.[index]?.quantity
										}
										unit={
											material?.find(
												(inItem) =>
													inItem.value ==
													getValues(
														`purchase[${index}].material_id`
													)
											)?.unit
										}
										register={register}
									/>
								</td>
								<td className={`w-40 ${rowClass}`}>
									<Input
										title='price'
										label={`purchase[${index}].price`}
										is_title_needed='false'
										dynamicerror={
											errors?.purchase?.[index]?.price
										}
										register={register}
									/>
								</td>
								<td className={`w-40 ${rowClass}`}>
									<Input
										title='remarks'
										label={`purchase[${index}].remarks`}
										is_title_needed='false'
										dynamicerror={
											errors?.purchase?.[index]?.remarks
										}
										register={register}
									/>
								</td>
								<td
									className={`w-16 border-l-4 border-l-primary ${rowClass}`}>
									<RemoveButton
										onClick={() =>
											handlePurchaseRemove(index)
										}
										showButton={purchaseField.length > 1}
									/>
								</td>
							</tr>
						))}
						<tr>
							<td
								className='py-2 text-right font-bold'
								colSpan='2'>
								Total Price:
							</td>
							<td className='py-2 font-bold'>
								{getTotalPrice(watch('purchase'))}
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
					modalId={'purchase_delete'}
					title={'Purchase Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={purchaseField}
					uri={`/purchase`}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</div>
	);
}
