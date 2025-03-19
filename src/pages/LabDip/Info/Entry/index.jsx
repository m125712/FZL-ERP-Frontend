import { Suspense, useCallback, useEffect, useState } from 'react';
import { useDyeingSwatch } from '@/state/Dyeing';
import { useLabDipInfo, UseLabDipInfoByDetails } from '@/state/LabDip';
import { useOtherRecipe } from '@/state/Other';
import { useThreadSwatch } from '@/state/Thread';
import { useAuth } from '@context/auth';
import { FormProvider } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import { Footer } from '@/components/Modal/ui';
import { ActionButtons, DynamicField, FormField, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import { LAB_INFO_NULL, LAB_INFO_SCHEMA } from '@util/Schema';
import { exclude } from '@/util/Exclude';
import GetDateTime from '@/util/GetDateTime';

import Header from './Header';

export default function Index() {
	const {
		url,
		updateData,
		postData,
		deleteData,
		invalidateQuery: invalidateQueryLabDipInfo,
	} = useLabDipInfo();
	const { info_number, info_uuid } = useParams();
	const { invalidateQuery: invalidateQueryLabDipInfoByDetails } =
		UseLabDipInfoByDetails(info_uuid);
	const { invalidateQuery: invalidateQueryDyeingSwatch } =
		useDyeingSwatch(`type=all`);
	const { invalidateQuery: invalidateQueryThreadSwatch } =
		useThreadSwatch(`type=all`);

	const { user } = useAuth();
	const navigate = useNavigate();

	const [Status, setStatus] = useState(false);
	// * used for checking if it is for update*//
	const isUpdate = info_uuid !== undefined && info_number !== undefined;

	const { data } = UseLabDipInfoByDetails(info_uuid);
	const { data: rec_uuid } = useOtherRecipe();
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
	} = useRHF(LAB_INFO_SCHEMA, LAB_INFO_NULL);

	useEffect(() => {
		info_number !== undefined
			? (document.title = `Order: Update ${info_number}`)
			: (document.title = 'Order: Entry');
	}, [info_number]);

	// recipe
	const {
		fields: recipeField,
		append: recipeAppend,
		remove: recipeRemove,
	} = useFieldArray({
		control,
		name: 'recipe',
	});

	useEffect(() => {
		if (data && isUpdate) {
			reset(data);
		}
	}, [data, isUpdate]);

	const [updateItem, setUpdateItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleRecipeRemove = (index) => {
		const infoUuid = getValues(`recipe[${index}].info_entry_uuid`);
		const recipeUuid = getValues(`recipe[${index}].recipe_uuid`);
		const recipeName = rec_uuid?.find(
			(item) => item.value == getValues(`recipe[${index}].recipe_uuid`)
		);
		if (infoUuid !== undefined) {
			setUpdateItem({
				itemId: infoUuid,
				itemName: recipeName?.label,
			});
			window['recipe_update'].showModal();
		} else {
			recipeRemove(index);
		}
	};

	const handelRecipeAppend = () => {
		recipeAppend({
			recipe_uuid: '',
		});
	};

	const onClose = () => reset(LAB_INFO_NULL);

	// Submit
	const onSubmit = async (data) => {
		// * Update data * //
		if (isUpdate) {
			// * updated order description * //
			const lab_info_updated = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `/lab-dip/info/${data?.uuid}`,
				updatedData: lab_info_updated,
				isOnCloseNeeded: false,
			});

			// * updated recipe * //
			const recipe_updated = [...data.recipe].map((item) => ({
				...item,
				lab_dip_info_uuid: data?.uuid,
				approved: item.approved ? 1 : 0,
				is_pps_req: item.is_pps_req ? 1 : 0,
				approved_date: item.approved ? GetDateTime() : null,
				is_pps_req_date: item.is_pps_req ? GetDateTime() : null,
			}));

			//* Post new entry */ //
			let recipe_updated_promises = [
				...recipe_updated.map(async (item) => {
					if (item.info_entry_uuid) {
						await updateData.mutateAsync({
							url: `/lab-dip/info-entry/${item.info_entry_uuid}`,
							updatedData: {
								...item,
								uuid: item.info_entry_uuid,
								updated_at: GetDateTime(),
							},
							isOnCloseNeeded: false,
						});
					} else {
						await postData.mutateAsync({
							url: '/lab-dip/info-entry',
							newData: {
								...item,
								uuid: nanoid(),
								created_by: user?.uuid,
								created_at: GetDateTime(),
							},
							isOnCloseNeeded: false,
						});
					}
				}),
			];
			await Promise.all(recipe_updated_promises)
				.then(() => reset(LAB_INFO_NULL))
				.then(() => {
					//invalidateQueryLabDipInfo();
					invalidateQueryLabDipInfoByDetails();
					invalidateQueryDyeingSwatch();
					invalidateQueryThreadSwatch();
					navigate(`/lab-dip/info/details/${data?.uuid}`);
				})
				.catch((err) => console.log(err));

			// * old code* //

			return;
		}

		// * Add new data*//
		const lab_dip_info_uuid = nanoid();
		const created_at = GetDateTime();

		const lab_info = {
			...data,
			uuid: lab_dip_info_uuid,
			created_at,
			created_by: user?.uuid,
		};

		//* Post new order description */ //
		await postData.mutateAsync({
			url,
			newData: lab_info,
			isOnCloseNeeded: false,
		});

		const recipe = [...data.recipe].map((item) => ({
			...item,
			uuid: nanoid(),
			lab_dip_info_uuid,
			approved: item.approved ? 1 : 0,
			is_pps_req: item.is_pps_req ? 1 : 0,
			created_by: user?.uuid,
			approved_date: item.approved ? GetDateTime() : null,
			is_pps_req_date: item.is_pps_req ? GetDateTime() : null,
			created_at,
		}));

		//* Post new entry */ //
		let recipe_promises = [
			...recipe.map(
				async (item) =>
					await postData.mutateAsync({
						url: '/lab-dip/info-entry',
						newData: item,
						isOnCloseNeeded: false,
					})
			),
		];

		//* Post new entry *//

		await Promise.all(recipe_promises)
			.then(() => reset(LAB_INFO_NULL))
			.then(() => {
				invalidateQueryLabDipInfoByDetails();
				invalidateQueryDyeingSwatch();
				invalidateQueryThreadSwatch();
				navigate(`/lab-dip/info/details/${lab_dip_info_uuid}`);
			})

			.catch((err) => console.log(err));
	};

	// Check if recipe_id is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;

	const handelDuplicateDynamicField = useCallback(
		(index) => {
			const item = getValues(`recipe[${index}]`);
			recipeAppend({ ...item, uuid: undefined });
		},
		[getValues, recipeAppend]
	);

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide';

	const getApproved = (e, index) => {
		//setApproved((prevApproved) => ({ ...prevApproved, [index]: approved }));
		setValue(`recipe[${index}].approved`, e.approved);
	};

	// const status = [
	// 	{ label: 'Pending', value: 0 },
	// 	{ label: 'Approved', value: 1 },
	// ];

	const approved = [
		{ label: 'Pending', value: 0 },
		{ label: 'Approved', value: 1 },
	];

	const PPsRequired = [
		{ label: 'No', value: 0 },
		{ label: 'Yes', value: 1 },
	];

	let excludeItem = exclude(watch, rec_uuid, 'recipe', 'recipe_uuid', Status);

	return (
		<FormProvider {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className='flex flex-col gap-4'
			>
				<Header
					{...{
						register,
						errors,
						control,
						getValues,
						watch,
						Controller,
						lab_status: getValues('lab_status'),
						isUpdate,
					}}
				/>
				<DynamicField
					title='Recipe'
					handelAppend={handelRecipeAppend}
					tableHead={[
						'Recipe',
						//'Status',
						'PP Sample Required?',
						'Approved',

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
					{recipeField.map((item, index) => (
						<tr key={item.id}>
							{/* Recipe */}
							<td className={rowClass}>
								<FormField
									label={`recipe[${index}].recipe_uuid`}
									title='Recipe uuid'
									dynamicerror={
										errors?.recipe?.[index]?.recipe_uuid
									}
									is_title_needed='false'
								>
									<Controller
										name={`recipe[${index}].recipe_uuid`}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder='Select recipe uuid'
													options={rec_uuid?.filter(
														(inItem) =>
															!excludeItem?.some(
																(excluded) =>
																	excluded?.value ===
																	inItem?.value
															)
													)}
													value={rec_uuid?.find(
														(item) =>
															item.value ==
															getValues(
																`recipe[${index}].recipe_uuid`
															)
													)}
													onChange={(e) => {
														onChange(e.value);
														setValue(
															`recipe[${index}].recipe_uuid`,
															e.value
														);
													}}
													isDisabled={
														watch(
															`recipe[${index}].recipe_uuid`
														) !== '' && isUpdate
													}
													menuPortalTarget={
														document.body
													}
												/>
											);
										}}
									/>
								</FormField>
							</td>
							{/* PP Sample Required? */}
							<td className={rowClass}>
								<FormField
									label={`recipe[${index}].is_pps_req`}
									title='PP Sample Required?'
									dynamicerror={
										errors?.recipe?.[index]?.is_pps_req
									}
									is_title_needed='false'
								>
									<Controller
										name={`recipe[${index}].is_pps_req`}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder='Select PPs'
													options={PPsRequired}
													value={PPsRequired?.find(
														(item) =>
															item.value ==
															getValues(
																`recipe[${index}].is_pps_req`
															)
													)}
													onChange={(e) => {
														onChange(e.value);
														setValue(
															`recipe[${index}].is_pps_req`,
															e.value
														);
													}}
													isDisabled={
														rec_uuid == undefined ||
														!watch(
															`order_info_uuid`
														)
													}
													menuPortalTarget={
														document.body
													}
												/>
											);
										}}
									/>
								</FormField>
							</td>
							{/* approved */}
							<td className={rowClass}>
								<FormField
									label={`recipe[${index}].approved`}
									title='Approved'
									dynamicerror={
										errors?.recipe?.[index]?.approved
									}
									is_title_needed='false'
								>
									<Controller
										name={`recipe[${index}].approved`}
										control={control}
										render={({ field: { onChange } }) => {
											return (
												<ReactSelect
													placeholder='Select approved'
													options={approved}
													value={approved?.find(
														(item) =>
															item.value ==
															getValues(
																`recipe[${index}].approved`
															)
													)}
													onChange={(e) => {
														onChange(e.value);
														setValue(
															`recipe[${index}].approved`,
															e.value
														);
													}}
													isDisabled={
														rec_uuid == undefined ||
														!watch(
															`order_info_uuid`
														)
													}
													menuPortalTarget={
														document.body
													}
												/>
											);
										}}
									/>
								</FormField>
							</td>

							<td
								className={`w-16 ${rowClass} border-l-4 border-l-primary`}
							>
								<ActionButtons
									duplicateClick={() =>
										handelDuplicateDynamicField(index)
									}
									removeClick={() =>
										handleRecipeRemove(index)
									}
									showRemoveButton={true}
									showDuplicateButton={false}
								/>
							</td>
						</tr>
					))}
				</DynamicField>
				<Footer buttonClassName='!btn-primary' />
			</form>
			<Suspense>
				<DeleteModal
					modalId={'recipe_update'}
					title={'Recipe Entry'}
					url={`/lab-dip/info-entry`}
					deleteItem={updateItem}
					setDeleteItem={setUpdateItem}
					deleteData={deleteData}
					invalidateQuery={invalidateQueryLabDipInfoByDetails}
				/>
			</Suspense>

			<DevTool control={control} placement='top-left' />
		</FormProvider>
	);
}
