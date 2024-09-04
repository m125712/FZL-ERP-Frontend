import { DeleteModal } from '@/components/Modal';
import { useFetch, useFetchForRhfResetForOrder, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import {
	useLabDipShadeRecipeDescription,
	useLabDipShadeRecipeEntry,
} from '@/state/LabDip';

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
import { SHADE_RECIPE_NULL, SHADE_RECIPE_SCHEMA } from '@util/Schema';
import { Suspense, useEffect, useState } from 'react';
import { HotKeys, configure } from 'react-hotkeys';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Header from './Header';

export default function Index() {
	const { url: shadeRecipeDescriptionUrl } =
		useLabDipShadeRecipeDescription();
	const { url: shadeRecipeEntryUrl } = useLabDipShadeRecipeEntry();
	const { updateData, postData, deleteData } =
		useLabDipShadeRecipeDescription();
	//const { invalidateQuery: invalidateMaterialInfo } = useMaterialInfo();

	const { shade_recipe_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();

	const [unit, setUnit] = useState({});

	useEffect(() => {
		shade_recipe_uuid !== undefined
			? (document.title = 'Update Shade Recipe: ' + shade_recipe_uuid)
			: (document.title = 'Shade Recipe Entry');
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
	} = useRHF(SHADE_RECIPE_SCHEMA, SHADE_RECIPE_NULL);

	const isUpdate = shade_recipe_uuid !== undefined;

	isUpdate &&
		useFetchForRhfResetForOrder(
			`/lab-dip/shade-recipe-details/by/${shade_recipe_uuid}`,
			shade_recipe_uuid,
			reset
		);

	const { value: material } = useFetch(
		'/other/material/value/label/unit/quantity'
	);

	// shade_recipe
	const {
		fields: shadeRecipeField,
		append: shadeRecipeAppend,
		remove: shadeRecipeRemove,
	} = useFieldArray({
		control,
		name: 'shade_recipe_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleShadeRecipeRemove = (index) => {
		if (getValues(`shade_recipe_entry[${index}].uuid`) !== undefined) {
			setDeleteItem({
				itemId: getValues(`shade_recipe_entry[${index}].uuid`),
				itemName: getValues(
					`shade_recipe_entry[${index}].material_name`
				),
			});
			window['shade_recipe_delete'].showModal();
		}

		shadeRecipeRemove(index);
	};

	const handleShadeRecipeAppend = () => {
		shadeRecipeAppend({
			shade_recipe_uuid: '',
			material_uuid: '',
			quantity: '',
			remarks: '',
		});
	};

	// Submit
	const onSubmit = async (data) => {
		// Update item

		if (isUpdate) {
			const shade_recipe_description_data = {
				...data,
				lab_status: data.lab_status ? 1 : 0,
				updated_at: GetDateTime(),
			};

			const shade_recipe_description_promise =
				await updateData.mutateAsync({
					url: `${shadeRecipeDescriptionUrl}/${data?.uuid}`,
					updatedData: shade_recipe_description_data,
					uuid: data.uuid,
					isOnCloseNeeded: false,
				});

			const shade_recipe_entries_promise = data.shade_recipe_entry.map(
				async (item) => {
					if (item.uuid === undefined) {
						item.shade_recipe_uuid = shade_recipe_uuid;
						item.created_at = GetDateTime();
						item.uuid = nanoid();
						return await postData.mutateAsync({
							url: shadeRecipeEntryUrl,
							newData: item,
							isOnCloseNeeded: false,
						});
					} else {
						item.updated_at = GetDateTime();
						const updatedData = {
							...item,
						};
						return await updateData.mutateAsync({
							url: `${shadeRecipeEntryUrl}/${item.uuid}`,
							uuid: item.uuid,
							updatedData,
							isOnCloseNeeded: false,
						});
					}
				}
			);

			try {
				await Promise.all([
					shade_recipe_description_promise,
					...shade_recipe_entries_promise,
				])
					.then(() => reset(SHADE_RECIPE_NULL))
					.then(() => {
						navigate(
							`/lab-dip/shade_recipe/details/${shade_recipe_uuid}`
						);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
			}

			return;
		}

		// Add new item
		const new_shade_recipe_uuid = nanoid();
		const created_at = GetDateTime();
		const created_by = user.uuid;

		// Create Shade Recipe description
		const shade_recipe_description_data = {
			...data,

			uuid: new_shade_recipe_uuid,
			lab_status: data.lab_status ? 1 : 0,
			created_at,
			created_by,
		};

		// delete shade_recipe field from data to be sent
		delete shade_recipe_description_data['shade_recipe_entry'];

		const shade_recipe_description_promise = await postData.mutateAsync({
			url: shadeRecipeDescriptionUrl,
			newData: shade_recipe_description_data,
			isOnCloseNeeded: false,
		});

		// Create Shade Recipe entries
		const shade_recipe_entries = [...data.shade_recipe_entry].map(
			(item) => ({
				...item,
				shade_recipe_uuid: new_shade_recipe_uuid,
				uuid: nanoid(),
				created_at,
				created_by,
			})
		);

		const shade_recipe_entries_promise = [
			...shade_recipe_entries.map(
				async (item) =>
					await postData.mutateAsync({
						url: shadeRecipeEntryUrl,
						newData: item,
						isOnCloseNeeded: false,
					})
			),
		];

		try {
			await Promise.all([
				shade_recipe_description_promise,
				...shade_recipe_entries_promise,
			])
				.then(() => reset(SHADE_RECIPE_NULL))
				.then(() => {
					navigate(
						`/lab-dip/shade_recipe/details/${new_shade_recipe_uuid}`
					);
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
		NEW_ROW: handleShadeRecipeAppend,
	};

	configure({
		ignoreTags: ['input', 'select', 'textarea'],
		ignoreEventsCondition: function () {},
	});

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide  p-3';

	return (
		<>
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
							handelAppend={handleShadeRecipeAppend}
							tableHead={[
								'Material',
								'Quantity',
								'Remarks',
								'Action',
							].map((item) => (
								<th
									key={item}
									scope='col'
									className='group cursor-pointer select-none whitespace-nowrap bg-secondary px-4 py-2 text-left font-semibold tracking-wide text-primary-content transition duration-300'>
									{item}
								</th>
							))}>
							{shadeRecipeField.map((item, index) => (
								<tr key={item.id} className=''>
									<td className={`${rowClass}`}>
										<FormField
											label={`shade_recipe_entry[${index}].material_uuid`}
											title='Material'
											is_title_needed='false'
											dynamicerror={
												errors?.shade_recipe_entry?.[
													index
												]?.material_uuid
											}>
											<Controller
												name={`shade_recipe_entry[${index}].material_uuid`}
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
																		`shade_recipe_entry[${index}].material_uuid`
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
														/>
													);
												}}
											/>
										</FormField>
									</td>

									<td className={`w-48 ${rowClass}`}>
										<JoinInput
											title='quantity'
											label={`shade_recipe_entry[${index}].quantity`}
											is_title_needed='false'
											dynamicerror={
												errors?.shade_recipe_entry?.[
													index
												]?.quantity
											}
											unit={
												material?.find(
													(inItem) =>
														inItem.value ==
														getValues(
															`shade_recipe_entry[${index}].material_uuid`
														)
												)?.unit
											}
											register={register}
										/>
									</td>
									<td className={`w-48 ${rowClass}`}>
										<Input
											title='remarks'
											label={`shade_recipe_entry[${index}].remarks`}
											is_title_needed='false'
											dynamicerror={
												errors?.shade_recipe?.[index]
													?.remarks
											}
											register={register}
										/>
									</td>
									<td className={`w-12 ${rowClass} pl-0`}>
										<RemoveButton
											className={'justify-center'}
											onClick={() =>
												handleShadeRecipeRemove(index)
											}
											showButton={
												shadeRecipeField.length > 1
											}
										/>
									</td>
								</tr>
							))}
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
					modalId={'shade_recipe_delete'}
					title={'Shade Recipe Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={shadeRecipeField}
					url={shadeRecipeEntryUrl}
					deleteData={deleteData}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</>
	);
}
