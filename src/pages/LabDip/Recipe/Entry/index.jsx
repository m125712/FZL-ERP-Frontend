import { DeleteModal } from '@/components/Modal';
import { useFetchForRhfResetForOrder, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useLabDipRecipe } from '@/state/LabDip';
import { ActionButtons, DynamicField, Input, JoinInput, Textarea } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { LAB_RECIPE_NULL, LAB_RECIPE_SCHEMA } from '@util/Schema';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { HotKeys, configure } from 'react-hotkeys';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Header from './Header';

export default function Index() {
	const { url, updateData, postData, deleteData } = useLabDipRecipe();
	const { recipe_id, recipe_uuid } = useParams();

	const { user } = useAuth();
	const navigate = useNavigate();

	// * used for checking if it is for update*//
	const isUpdate = recipe_uuid !== undefined && recipe_id !== undefined;

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
	} = useRHF(LAB_RECIPE_SCHEMA, LAB_RECIPE_NULL);

	useEffect(() => {
		recipe_id !== undefined
			? (document.title = `Order: Update ${recipe_id}`)
			: (document.title = 'Order: Entry');
	}, []);

	if (isUpdate)
		useFetchForRhfResetForOrder(
			`/lab-dip/recipe/details/${recipe_uuid}`,
			recipe_uuid,
			reset
		);

	// recipe_entry
	const {
		fields: recipeEntryField,
		append: recipeEntryAppend,
		remove: recipeEntryRemove,
	} = useFieldArray({
		control,
		name: 'recipe_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleRecipeEntryRemove = (index) => {
		if (getValues(`recipe_entry[${index}].uuid`) !== undefined) {
			setDeleteItem({
				itemId: getValues(`recipe_entry[${index}].uuid`),
				itemName: getValues(`recipe_entry[${index}].uuid`),
			});
			window['recipe_entry_delete'].showModal();
		}
		recipeEntryRemove(index);
	};

	const handelRecipeEntryAppend = () => {
		recipeEntryAppend({
			color: '',
			quantity: '',
			remarks: '',
		});
	};
	const onClose = () => reset(LAB_RECIPE_NULL);

	// Submit
	const onSubmit = async (data) => {
		const DEFAULT_SWATCH_APPROVAL_DATE = null;

		// * Update data * //
		if (isUpdate) {
			// * updated order description * //
			const recipe_updated = {
				...data,
				// lab_dip_info_uuid: null,
				approved: data.approved ? 1 : 0,
				status: data.status ? 1 : 0,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `/lab-dip/recipe/${data?.uuid}`,
				updatedData: recipe_updated,
				isOnCloseNeeded: false,
			});

			// * updated order entry * //
			const recipe_entry_updated = [...data.recipe_entry].map((item) => ({
				...item,
				updated_at: GetDateTime(),
			}));

			//* Post new entry */ //
			let order_entry_updated_promises = [
				...recipe_entry_updated.map(async (item) => {
					if (item.uuid) {
						await updateData.mutateAsync({
							url: `/lab-dip/recipe-entry/${item.uuid}`,
							updatedData: item,
							isOnCloseNeeded: false,
						});
					} else {
						await postData.mutateAsync({
							url: '/lab-dip/recipe-entry',
							newData: {
								...item,
								uuid: nanoid(),
								recipe_uuid: data?.uuid,
								created_at: GetDateTime(),
							},
							isOnCloseNeeded: false,
						});
					}
				}),
			];

			// TODO: ReferenceError: Cannot access 'recipe_uuid' before initialization
			navigate(`/lab-dip/recipe/details/${recipe_uuid}`);

			return;
		}

		// * Add new data*//
		const recipe_uuid = nanoid();
		const created_at = GetDateTime();

		const recipe = {
			...data,
			uuid: recipe_uuid,
			lab_dip_info_uuid: null,
			approved: data.approved ? 1 : 0,
			status: data.status ? 1 : 0,
			created_at,
			created_by: user?.uuid,
		};

		//* Post new order description */ //
		await postData.mutateAsync({
			url,
			newData: recipe,
			isOnCloseNeeded: false,
		});

		const recipe_entry = [...data.recipe_entry].map((item) => ({
			...item,
			uuid: nanoid(),
			recipe_uuid,
			created_at,
		}));

		//* Post new entry */ //
		let recipe_entry_promises = [
			...recipe_entry.map(
				async (item) =>
					await postData.mutateAsync({
						url: '/lab-dip/recipe-entry',
						newData: item,
						isOnCloseNeeded: false,
					})
			),
		];

		await Promise.all(recipe_entry_promises)
			.then(() => reset(Object.assign({}, ORDER_NULL)))
			.then(navigate(`/lab-dip/recipe`))
			.catch((err) => console.log(err));
	};

	// Check if recipe_id is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;

	const handelDuplicateDynamicField = useCallback(
		(index) => {
			const item = getValues(`recipe_entry[${index}]`);
			recipeEntryAppend({ ...item, uuid: undefined });
		},
		[getValues, recipeEntryAppend]
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
		NEW_ROW: handelRecipeEntryAppend,
		COPY_LAST_ROW: () =>
			handelDuplicateDynamicField(recipeEntryField.length - 1),
		ENTER: (event) => handleEnter(event),
	};

	configure({
		ignoreTags: ['input', 'select', 'textarea'],
		ignoreEventsCondition: function () {},
	});

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide';

	return (
		<div>
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
							is_Approved: getValues('approved'),
							is_Status: getValues('status'),
						}}
					/>
					<DynamicField
						title='Recipe Entry'
						handelAppend={handelRecipeEntryAppend}
						tableHead={[
							'color',
							'quantity',
							'remarks',
							'Action',
						].map((item) => (
							<th
								key={item}
								scope='col'
								className='text-secondary-content group cursor-pointer select-none whitespace-nowrap bg-secondary py-2 text-left font-semibold tracking-wide transition duration-300 first:pl-2'>
								{item}
							</th>
						))}>
						{recipeEntryField.map((item, index) => (
							<tr key={item.id}>
								{/* Color */}
								<td className={rowClass}>
									<Textarea
										title='color'
										label={`recipe_entry[${index}].color`}
										is_title_needed='false'
										dynamicerror={
											errors?.recipe_entry?.[index]?.color
										}
										register={register}
									/>
								</td>

								{/* Quantity */}
								<td className={`w-40 ${rowClass}`}>
									<JoinInput
										title='quantity'
										label={`recipe_entry[${index}].quantity`}
										is_title_needed='false'
										unit='Liter'
										dynamicerror={
											errors?.recipe_entry?.[index]
												?.quantity
										}
										register={register}
									/>
								</td>

								{/* Remarks */}
								<td className={` ${rowClass}`}>
									<Textarea
										title='remarks'
										label={`recipe_entry[${index}].remarks`}
										is_title_needed='false'
										dynamicerror={
											errors?.recipe_entry?.[index]
												?.remarks
										}
										register={register}
									/>
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
											handleRecipeEntryRemove(index)
										}
										showRemoveButton={
											recipeEntryField.length > 1
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
					modalId={'recipe_entry_delete'}
					title={'Recipe Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={recipeEntryField}
					url={`/lab-dip/recipe-entry`}
					deleteData={deleteData}
				/>
			</Suspense>

			{/* <DevTool control={control} placement='top-left' /> */}
		</div>
	);
}
