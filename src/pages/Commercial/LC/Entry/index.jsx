import { Suspense, useCallback, useEffect, useState } from 'react';
import {
	useCommercialLC,
	useCommercialLCByQuery,
	useCommercialLCPIByUUID,
} from '@/state/Commercial';
import { useOtherPiValues } from '@/state/Other';
import { useAuth } from '@context/auth';
import { format } from 'date-fns';
import { FormProvider, useFieldArray } from 'react-hook-form';
import { configure, HotKeys } from 'react-hotkeys';
import { useNavigate, useParams } from 'react-router-dom';
import { useAccess, useRHF } from '@/hooks';

import { DeleteModal, UpdateModal } from '@/components/Modal';
import { Footer } from '@/components/Modal/ui';
import { ShowLocalToast } from '@/components/Toast';
import { DynamicField, FormField, ReactSelect, RemoveButton } from '@/ui';

import cn from '@/lib/cn';
import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import { LC_NULL, LC_SCHEMA } from '@util/Schema';
import { exclude } from '@/util/Exclude';
import GetDateTime from '@/util/GetDateTime';

import Header from './Header';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `?own_uuid=${userUUID}`;
	}

	return ``;
};

export default function Index() {
	const haveAccess = useAccess('commercial__lc');
	const { user } = useAuth();
	const navigate = useNavigate();
	const { lc_uuid } = useParams();
	const { invalidateQuery: invalidate } = useCommercialLCByQuery(
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);

	const {
		url: commercialLcUrl,
		postData,
		updateData,
		deleteData,
	} = useCommercialLC();

	const { data, invalidateQuery } = useCommercialLCPIByUUID(lc_uuid);

	const [deletablePi, setDeletablePi] = useState([]);
	const [updateItem, setUpdateItem] = useState({
		itemId: null,
		itemName: null,
	});

	const [status, setStatus] = useState(false);

	const isUpdate = lc_uuid !== undefined;

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		getValues,
		watch,
		context: form,
	} = useRHF(LC_SCHEMA, LC_NULL);

	let { data: pi } = useOtherPiValues(
		isUpdate
			? `party_uuid=${watch('party_uuid')}&is_update=true`
			: `party_uuid=${watch('party_uuid')}&is_update=false&page=lc`
	);

	const excludeItem = exclude(watch, pi, 'pi', 'uuid', status);
	// purchase
	const {
		fields: piFields,
		append: PiAppend,
		remove: PiRemove,
	} = useFieldArray({
		control,
		name: 'pi',
	});

	// * UD dynamic field
	const {
		fields: udField,
		append: udAppend,
		remove: udRemove,
	} = useFieldArray({
		control,
		name: 'lc_entry_others',
	});

	// * progression dynamic field
	const {
		fields: progressionField,
		append: progressionAppend,
		remove: progressionRemove,
	} = useFieldArray({
		control,
		name: 'lc_entry',
	});

	useEffect(() => {
		if (data && isUpdate) {
			reset(data);
		}
	}, [data]);

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide';

	const handelPiAppend = () => {
		PiAppend({
			lc_uuid,
		});
	};

	const keyMap = {
		NEW_ROW: 'alt+n',
		COPY_LAST_ROW: 'alt+c',
	};

	const handlers = {
		NEW_ROW: handelPiAppend,
	};

	configure({
		ignoreTags: ['input', 'select', 'textarea'],
		ignoreEventsCondition: function () {},
	});

	const handleDeletePi = (uuid) => {
		if (!isUpdate || !uuid || deletablePi.includes(uuid)) return;

		setDeletablePi((prev) => [...prev, uuid]);
	};

	const getTotalValue = useCallback(
		(piArray) => {
			if (!piArray || !Array.isArray(piArray)) {
				return 0;
			}

			return piArray.reduce((acc, item, index) => {
				if (item.uuid === null || item.uuid === undefined) return acc;
				const piIdxValue = pi?.find((e) => e.value === item.uuid);
				return acc + piIdxValue?.pi_value;
			}, 0);
		},
		[watch()]
	);
	// Submit
	const onSubmit = async (data) => {
		if (
			data?.lc_entry[0]?.ldbc_fdbc === null ||
			data?.lc_entry[0]?.amount === 0
		) {
			ShowLocalToast({
				type: 'warning',
				message: 'Must add Amount & LDBC/FDBC in Progression Section',
			});
			return;
		} else if (data?.is_old_pi === false && data?.pi[0]?.uuid === null) {
			ShowLocalToast({
				type: 'warning',
				message: 'Select at least one PI',
			});
			return;
		}
		const formatDate = (dateString) =>
			dateString ? format(new Date(dateString), 'yyyy-MM-dd') : null;

		const lc_uuid = data.uuid;

		// Update
		if (isUpdate) {
			const updated_at = GetDateTime();
			const lc_updated_data = {
				...data,
				lc_date: formatDate(data?.lc_date),
				payment_date: formatDate(data?.payment_date),
				acceptance_date: formatDate(data?.acceptance_date),
				maturity_date: formatDate(data?.maturity_date),
				handover_date: formatDate(data?.handover_date),
				shipment_date: formatDate(data?.shipment_date),
				expiry_date: formatDate(data?.expiry_date),
				ud_received: formatDate(data?.ud_received),
				ud_no: data.ud_no ? 1 : 0,
				problematical: data.problematical ? 1 : 0,
				epz: data.epz ? 1 : 0,
				is_rtgs: data.is_rtgs ? 1 : 0,
				is_old_pi: data.is_old_pi ? 1 : 0,
				production_complete: data.production_complete ? 1 : 0,
				lc_cancel: data.lc_cancel ? 1 : 0,
				updated_at,
			};

			// Update LC data
			const res = await updateData.mutateAsync({
				url: `${commercialLcUrl}/${data?.uuid}`,
				updatedData: lc_updated_data,
				isOnCloseNeeded: false,
			});

			const lc_number = res?.data?.[0].updatedId;

			// Update Deletable Pi
			if (deletablePi.length > 0) {
				const deletable_pi_promises = deletablePi.map(async (item) => {
					await updateData.mutateAsync({
						url: `/commercial/pi-cash-lc-null/${item}`,
						isOnCloseNeeded: false,
					});
				});

				await Promise.all(deletable_pi_promises)
					.then(() => {
						setDeletablePi([]);
						invalidateQuery();
					})
					.catch((err) => console.log(err));
			}

			// Update Pi Numbers

			const pi_numbers = [...data.pi].map((item) => ({
				...item,
				lc_uuid,
			}));

			const pi_numbers_promise = [
				...pi_numbers.map(
					async (item) =>
						await updateData.mutateAsync({
							url: `/commercial/pi-cash-lc-uuid/${item.uuid}`,
							updatedData: item,
							isOnCloseNeeded: false,
						})
				),
			];

			// * Dynamic ud/lc_entry_others
			const lc_entry_others_update_promise = [
				...data.lc_entry_others,
			].map(async (item) => {
				if (item.ud_no) {
					if (item.uuid) {
						await updateData.mutateAsync({
							url: `/commercial/lc-entry-others/${item.uuid}`,
							updatedData: {
								...item,
								updated_at: GetDateTime(),
							},
							isOnCloseNeeded: false,
						});
					} else {
						await postData.mutateAsync({
							url: `/commercial/lc-entry-others`,
							newData: {
								...item,
								lc_uuid: data.uuid,
								uuid: nanoid(),
								created_at: GetDateTime(),
							},
							isOnCloseNeeded: false,
						});
					}
				}
			});
			// * Dynamic progresson/Lc_entry
			const lc_entry_update_promise = [...data.lc_entry].map(
				async (item) => {
					if (item.amount > 0) {
						if (item.uuid) {
							await updateData.mutateAsync({
								url: `/commercial/lc-entry/${item.uuid}`,
								updatedData: {
									...item,
									updated_at: GetDateTime(),
								},
								isOnCloseNeeded: false,
							});
						} else {
							await postData.mutateAsync({
								url: `/commercial/lc-entry`,
								newData: {
									...item,
									lc_uuid: data.uuid,
									uuid: nanoid(),
									created_at: GetDateTime(),
								},
								isOnCloseNeeded: false,
							});
						}
					}
				}
			);

			await Promise.all(pi_numbers_promise)
				.then(() => {
					reset(LC_NULL);
					invalidateQuery();
					invalidate();
					navigate(`/commercial/lc/details/${lc_updated_data.uuid}`);
				})
				.catch((err) => console.log(err));
			return;
		}

		// Add new item
		const new_lc_uuid = nanoid();
		const created_at = GetDateTime();
		const created_by = user.uuid;

		const lc_new_data = {
			...data,
			uuid: new_lc_uuid,
			lc_date: formatDate(data?.lc_date),

			// handover_date: formatDate(data?.handover_date),
			// document_receive_date: formatDate(data?.document_receive_date),
			// acceptance_date: formatDate(data?.acceptance_date),
			// maturity_date: formatDate(data?.maturity_date),
			// payment_date: formatDate(data?.payment_date),

			shipment_date: formatDate(data?.shipment_date),
			expiry_date: formatDate(data?.expiry_date),
			ud_received: data.ud_received ? 1 : 0,
			ud_no: data.ud_no ? 1 : 0,
			problematical: data.problematical ? 1 : 0,
			epz: data.epz ? 1 : 0,
			is_rtgs: data.is_rtgs ? 1 : 0,
			is_old_pi: data.is_old_pi ? 1 : 0,
			production_complete: data.production_complete ? 1 : 0,
			lc_cancel: data.lc_cancel ? 1 : 0,
			created_at,
			created_by,
		};

		// delete pi field from data to be sent
		delete lc_new_data['pi'];

		await postData.mutateAsync({
			url: commercialLcUrl,
			newData: lc_new_data,
			isOnCloseNeeded: false,
		});

		// * Dynamic Ud/lc_entry_others
		const lc_entry_others_promise = [...data.lc_entry_others].map(
			async (item) => {
				if (item.ud_no) {
					await postData.mutateAsync({
						url: `/commercial/lc-entry-others`,
						newData: {
							...item,
							lc_uuid: new_lc_uuid,
							uuid: nanoid(),
							created_at: GetDateTime(),
						},
						isOnCloseNeeded: false,
					});
				}
			}
		);

		// * Dynamic progresson/Lc_entry
		const lc_entry_promise = [...data.lc_entry].map(async (item) => {
			if (item.amount > 0) {
				await postData.mutateAsync({
					url: `/commercial/lc-entry`,
					newData: {
						...item,
						lc_uuid: new_lc_uuid,
						uuid: nanoid(),
						created_at: GetDateTime(),
					},
					isOnCloseNeeded: false,
				});
			}
		});

		// const new_lc_number = res?.data?.[0].insertedId;

		// * check if is_old_pi is true
		if (!lc_new_data.is_old_pi) {
			// Update Pi Numbers
			const pi_numbers = [...data.pi].map((item) => ({
				uuid: item.uuid,
				lc_uuid: new_lc_uuid,
			}));

			const pi_numbers_promise = [
				...pi_numbers.map(
					async (item, index) =>
						await updateData.mutateAsync({
							url: `/commercial/pi-cash-lc-uuid/${item.uuid}`,
							updatedData: item,
							isOnCloseNeeded: false,
						})
				),
			];

			await Promise.all(pi_numbers_promise)
				.then(() => reset(LC_NULL))
				.then(() => {
					invalidate();
					navigate(`/commercial/lc`);
				})
				.catch((err) => console.log(err));
		} else {
			reset(LC_NULL);
			navigate(`/commercial/lc`);
		}
	};

	const handlePIRemove = (index) => {
		if (getValues(`pi[${index}].id`) !== undefined) {
			setUpdateItem({
				itemId: getValues(`pi[${index}].uuid`),
				itemName: getValues(`pi[${index}].id`),
			});
			window['lc_pi_delete'].showModal();
		}

		PiRemove(index);
	};

	// delete lc_entry_others or UD dynamic field
	const [deleteLCEntryUD, setDeleteLCEntryUD] = useState({
		itemId: null,
		itemName: null,
	});

	// delete lc_entry or Progression dynamic field
	const [deleteLCEntry, setDeleteLCEntry] = useState({
		itemId: null,
		itemName: null,
	});

	return (
		<FormProvider {...form}>
			<HotKeys {...{ keyMap, handlers }}>
				<form
					className='flex flex-col gap-4'
					onSubmit={handleSubmit(onSubmit)}
					noValidate>
					<Header
						{...{
							register,
							errors,
							control,
							getValues,
							Controller,
							watch,

							progressionField,
							progressionAppend,
							progressionRemove,
							setDeleteLCEntry,

							udField,
							udAppend,
							udRemove,
							setDeleteLCEntryUD,
						}}
					/>

					{!watch('is_old_pi') && (
						<DynamicField
							title={`Details(Total Value: ${Number(
								getTotalValue(watch('pi'))
							)
								.toFixed(2)
								.toLocaleString()})`}
							handelAppend={handelPiAppend}
							tableHead={[
								'PI',
								'Bank',
								'Value($)',
								'Marketing',
								'O/N',
								'Action',
							].map((item) => (
								<th
									key={item}
									scope='col'
									className='group cursor-pointer select-none whitespace-nowrap bg-secondary py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300 first:pl-2'>
									{item}
								</th>
							))}>
							{piFields.map((item, index) => {
								const piIdxValue = pi?.find(
									(e) =>
										e.value === watch(`pi[${index}].uuid`)
								);
								return (
									<tr key={item.id} className='w-full'>
										<td className={cn(`pl-1 ${rowClass}`)}>
											<FormField
												label={`pi[${index}].uuid`}
												title='Material'
												is_title_needed='false'
												dynamicerror={
													errors?.pi?.[index]?.uuid
												}>
												<Controller
													name={`pi[${index}].uuid`}
													control={control}
													render={({
														field: { onChange },
													}) => {
														return (
															<ReactSelect
																placeholder='Select PI'
																options={pi?.filter(
																	(inItem) =>
																		!excludeItem?.some(
																			(
																				excluded
																			) =>
																				excluded?.value ===
																				inItem?.value
																		)
																)}
																value={pi?.filter(
																	(inItem) =>
																		inItem.value ===
																		getValues(
																			`pi[${index}].uuid`
																		)
																)}
																onChange={(
																	e
																) => {
																	handleDeletePi(
																		getValues(
																			`pi[${index}].uuid`
																		)
																	);
																	onChange(
																		e.value
																	);
																	setStatus(
																		!status
																	);
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

										<td className={cn(`pl-1 ${rowClass}`)}>
											{piIdxValue?.pi_bank}
										</td>
										<td className={cn(`pl-1 ${rowClass}`)}>
											{piIdxValue?.pi_value}
										</td>
										<td className={cn(`pl-1 ${rowClass}`)}>
											{piIdxValue?.marketing_name}
										</td>
										<td className={cn(`pl-1 ${rowClass} `)}>
											<div className='flex flex-wrap items-center gap-2'>
												{piIdxValue?.order_number
													?.filter((e) => !!e)
													?.map((e) => (
														<span
															key={e}
															className='badge badge-accent badge-sm'>
															{e}
														</span>
													))}
											</div>
										</td>

										<td
											className={`w-16 border-l-4 border-l-primary ${rowClass}`}>
											<RemoveButton
												onClick={() => {
													handlePIRemove(index);
												}}
												showButton={piFields.length > 1}
											/>
										</td>
									</tr>
								);
							})}
						</DynamicField>
					)}
					{/* <tr
						className={cn(
							'relative cursor-pointer transition-colors duration-300 ease-in even:bg-primary/10 hover:bg-primary/30 focus:bg-primary/30'
						)}>
						<td className='font-semibold' colSpan={11}>
							Total Value:
							{Number(getTotalValue(watch('pi')))
								.toFixed(2)
								.toLocaleString()}
							$ 
						</td>
					</tr> */}
					<Footer buttonClassName='!btn-primary' />
				</form>
			</HotKeys>

			<Suspense>
				<UpdateModal
					modalId={'lc_pi_delete'}
					title={'PI'}
					updateItem={updateItem}
					setUpdateItem={setUpdateItem}
					url={`/commercial/pi-cash-lc-null`}
					updateData={updateData}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={'lc_entry_delete'}
					title={'Lc Entry Delete'}
					deleteItem={deleteLCEntry}
					setDeleteItem={setDeleteLCEntry}
					setItems={progressionField}
					deleteData={deleteData}
					url={`/commercial/lc-entry`}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={'lc_entry_details_delete'}
					title={'UD Delete'}
					deleteItem={deleteLCEntryUD}
					setDeleteItem={setDeleteLCEntryUD}
					setItems={udField}
					deleteData={deleteData}
					url={`/commercial/lc-entry-others`}
				/>
			</Suspense>

			<DevTool control={control} placement='top-left' />
		</FormProvider>
	);
}
