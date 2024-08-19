import { DeleteModal } from '@/components/Modal';
import { useFetch, useFetchForRhfResetForOrder, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { usePurchaseDescription, usePurchaseEntry } from '@/state/Store';
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
import { Suspense, useCallback, useEffect, useState } from 'react';
import { HotKeys, configure } from 'react-hotkeys';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import PageContainer from '@/ui/Others/PageContainer';

export default function Index() {
	const { url: purchaseDescriptionUrl } = usePurchaseDescription();
	const { url: purchaseEntryUrl } = usePurchaseEntry();
	const { updateData, postData, deleteData } = usePurchaseDescription();

	const { purchase_description_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();

	const [unit, setUnit] = useState({});

	useEffect(() => {
		purchase_description_uuid !== undefined
			? (document.title = 'Update Purchase: ' + purchase_description_uuid)
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

	const isUpdate = purchase_description_uuid !== undefined;

	isUpdate &&
		useFetchForRhfResetForOrder(
			`/purchase/purchase-details/by/${purchase_description_uuid}`,
			purchase_description_uuid,
			reset
		);

	const { value: material } = useFetch(
		'/other/material/value/label/unit/quantity'
	);

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

	const breadcrumbs = [
		{
			label: 'Store',
			href: '/store',
			isDisabled: true,
		},
		{
			label: 'Receive',
			href: '/store/receive',
		},
		{
			label: isUpdate ? 'Update' : 'Create',
			href: isUpdate
				? `/store/receive/update/${getValues('uuid')}`
				: '/store/receive/entry',
		},
	];

	const handlePurchaseRemove = (index) => {
		if (getValues(`purchase[${index}].uuid`) !== undefined) {
			setDeleteItem({
				itemId: getValues(`purchase[${index}].uuid`),
				itemName: getValues(`purchase[${index}].material_name`),
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

	// Submit
	const onSubmit = async (data) => {
		// Update item
		if (isUpdate) {
			const purchase_description_data = {
				...data,
				updated_at: GetDateTime(),
			};

			const purchase_description_promise = await updateData.mutateAsync({
				url: `${purchaseDescriptionUrl}/${data?.uuid}`,
				updatedData: purchase_description_data,
				uuid: data.uuid,
				isOnCloseNeeded: false,
			});

			const purchase_entries_promise = data.purchase.map(async (item) => {
				if (item.uuid === undefined) {
					item.purchase_description_uuid = purchase_description_uuid;
					item.created_at = GetDateTime();
					item.uuid = nanoid();
					return await postData.mutateAsync({
						url: purchaseEntryUrl,
						newData: item,
						isOnCloseNeeded: false,
					});
				} else {
					item.updated_at = GetDateTime();
					const updatedData = {
						...item,
					};
					return await updateData.mutateAsync({
						url: `${purchaseEntryUrl}/${item.uuid}`,
						uuid: item.uuid,
						updatedData,
						isOnCloseNeeded: false,
					});
				}
			});

			try {
				await Promise.all([
					purchase_description_promise,
					...purchase_entries_promise,
				])
					.then(() => reset(PURCHASE_ENTRY_NULL))
					.then(() =>
						navigate(`/store/receive/${purchase_description_uuid}`)
					);
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		// Add new item
		const new_purchase_description_uuid = nanoid();
		const created_at = GetDateTime();
		const created_by = user.uuid;

		// Create purchase description
		const purchase_description_data = {
			...data,
			uuid: new_purchase_description_uuid,
			created_at,
			created_by,
		};

		// delete purchase field from data to be sent
		delete purchase_description_data['purchase'];

		const purchase_description_promise = await postData.mutateAsync({
			url: purchaseDescriptionUrl,
			newData: purchase_description_data,
			isOnCloseNeeded: false,
		});

		// Create purchase entries
		const purchase_entries = [...data.purchase].map((item) => ({
			...item,
			purchase_description_uuid: new_purchase_description_uuid,
			uuid: nanoid(),
			created_at,
			created_by,
		}));

		const purchase_entries_promise = [
			...purchase_entries.map(
				async (item) =>
					await postData.mutateAsync({
						url: purchaseEntryUrl,
						newData: item,
						isOnCloseNeeded: false,
					})
			),
		];

		try {
			await Promise.all([
				purchase_description_promise,
				...purchase_entries_promise,
			])
				.then(() => reset(PURCHASE_ENTRY_NULL))
				.then(() => {
					navigate(`/store/receive/${new_purchase_description_uuid}`);
				});
		} catch (err) {
			console.error(`Error with Promise.all: ${err}`);
		}
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
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide  p-3';

	const getTotalPrice = useCallback(
		(purchase) =>
			purchase.reduce((acc, item) => {
				return acc + Number(item.price);
			}, 0),
		[watch()]
	);

	return (
		<PageContainer
			breadcrumbs={breadcrumbs}
			title={isUpdate ? 'Update Purchase' : 'Create Purchase'}>
			<HotKeys {...{ keyMap, handlers }}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='flex flex-col'>
					<div className='space-y-6'>
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
									className='group cursor-pointer select-none whitespace-nowrap bg-secondary px-4 py-2 text-left font-semibold tracking-wide text-primary transition duration-300'>
									{item}
								</th>
							))}>
							{purchaseField.map((item, index) => (
								<tr key={item.id} className=''>
									<td className={`${rowClass}`}>
										<FormField
											label={`purchase[${index}].material_uuid`}
											title='Material'
											is_title_needed='false'
											errors={errors}>
											<Controller
												name={`purchase[${index}].material_uuid`}
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
																		`purchase[${index}].material_uuid`
																	)
															)}
															onChange={(e) => {
																onChange(
																	e.value
																);
																setUnit({
																	...unit,
																	[index]:
																		e.unit,
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
									<td className={`w-48 ${rowClass}`}>
										<JoinInput
											title='quantity'
											label={`purchase[${index}].quantity`}
											is_title_needed='false'
											dynamicerror={
												errors?.purchase?.[index]
													?.quantity
											}
											unit={
												material?.find(
													(inItem) =>
														inItem.value ==
														getValues(
															`purchase[${index}].material_uuid`
														)
												)?.unit
											}
											register={register}
										/>
									</td>
									<td className={`w-48 ${rowClass}`}>
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
									<td className={`w-48 ${rowClass}`}>
										<Input
											title='remarks'
											label={`purchase[${index}].remarks`}
											is_title_needed='false'
											dynamicerror={
												errors?.purchase?.[index]
													?.remarks
											}
											register={register}
										/>
									</td>
									<td className={`w-12 ${rowClass} pl-0`}>
										<RemoveButton
											className={'justify-center'}
											onClick={() =>
												handlePurchaseRemove(index)
											}
											showButton={
												purchaseField.length > 1
											}
										/>
									</td>
								</tr>
							))}
							<tr className='border-t border-primary/30'>
								<td
									className='py-4 text-right font-bold'
									colSpan='2'>
									Total Price:
								</td>
								<td className='py-4 font-bold'>
									{getTotalPrice(watch('purchase'))}
								</td>
							</tr>
						</DynamicField>
					</div>

					<div className='modal-action'>
						<button
							type='submit'
							className='text-md btn btn-primary btn-block rounded'>
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
					url={purchaseEntryUrl}
					deleteData={deleteData}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</PageContainer>
	);
}
