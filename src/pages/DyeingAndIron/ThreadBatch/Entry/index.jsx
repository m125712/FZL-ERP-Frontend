import { Suspense, useCallback, useEffect, useState } from 'react';
import {
	useDyeingThreadBatch,
	useDyeingThreadBatchDetailsByUUID,
	useDyeingThreadOrderBatch,
} from '@/state/Dyeing';
import { useOtherMachines } from '@/state/Other';
import { useAuth } from '@context/auth';
import { FormProvider } from 'react-hook-form';
import {
	Navigate,
	useNavigate,
	useParams,
	useSearchParams,
} from 'react-router-dom';
import { useRHF } from '@/hooks';

import { DeleteModal, ProceedModal } from '@/components/Modal';
import { Footer } from '@/components/Modal/ui';
import ReactTable from '@/components/Table';
import { ShowLocalToast } from '@/components/Toast';
import { StatusSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	DYEING_THREAD_BATCH_NULL,
	DYEING_THREAD_BATCH_SCHEMA,
	DYEING_THREAD_BATCH_SCHEMA_UPDATE,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import { Columns } from './columns';
import Header from './Header';

// UPDATE IS WORKING
export default function Index() {
	let [searchParams] = useSearchParams();
	const machine_uuid = searchParams.get('machine_uuid');
	const slot_no = searchParams.get('slot_no');
	const dyeing_date = searchParams.get('dyeing_date');

	const {
		url,
		updateData,
		postData,
		deleteData,
		invalidateQuery: invalidateDyeingThreadBatch,
	} = useDyeingThreadBatch(`type=pending`);

	const { batch_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const isUpdate = batch_uuid !== undefined;

	const [proceed, setProceed] = useState(false);
	const [batchData, setBatchData] = useState(null);
	const [batchEntry, setBatchEntry] = useState(null);
	const [patchEntry, setPatchBatchEntry] = useState(null);
	const [status, setStatus] = useState('bulk');

	// * options for extra select in table
	const options = [
		{ value: 'bulk', label: 'Bulk' },
		{ value: 'sample', label: 'Sample' },
		{ value: 'all', label: 'All' },
	];

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
		setValue,
		context: form,
	} = useRHF(
		isUpdate
			? DYEING_THREAD_BATCH_SCHEMA_UPDATE
			: DYEING_THREAD_BATCH_SCHEMA,
		{
			...DYEING_THREAD_BATCH_NULL,
			machine_uuid: machine_uuid,
			slot: slot_no,
			production_date: dyeing_date,
		}
	); // TODO: need to fix the form validation for quantity

	const { data: batch, invalidateQuery: invalidateDyeingThreadBatchDetails } =
		isUpdate
			? useDyeingThreadBatchDetailsByUUID(
					batch_uuid,
					`?is_update=true&type=${status}`
				)
			: watch('batch_type') === 'extra' && watch('order_info_uuid')
				? useDyeingThreadOrderBatch(
						`batch_type=extra&order_info_uuid=${watch('order_info_uuid')}&type=${status}`
					)
				: useDyeingThreadOrderBatch(`type=${status}`);

	// batch_entry
	const [deleteEntry, setDeleteEntry] = useState({
		itemId: null,
		itemName: null,
	});

	const handelDelete = (index) => {
		const UUID = getValues(`batch_entry[${index}].batch_entry_uuid`);
		if (UUID !== undefined) {
			setDeleteEntry({
				itemId: UUID,
				itemName: UUID,
			});
			window['finishing_batch_entry_delete'].showModal();
		}
	};

	//const onClose = () => reset(DYEING_THREAD_BATCH_NULL);
	const { fields: BatchOrdersField, remove: BatchOrdersFieldRemove } =
		useFieldArray({
			control,
			name: 'batch_entry',
		});

	const { fields: NewBatchOrdersField } = useFieldArray({
		control,
		name: 'new_batch_entry',
	});

	useEffect(() => {
		if (!isUpdate) {
			setValue('batch_entry', batch?.batch_entry);
		}

		// * on update sometimes the useFieldArray does not update so we need to set it manually
		// * this condition is need to trigger the useFieldArray to update to show the data
		if (isUpdate) {
			setValue('batch_entry', batch?.batch_entry);
			setValue('new_batch_entry', batch?.new_batch_entry);
		}
	}, [batch, status]);

	useEffect(() => {
		if (isUpdate) {
			reset(batch); // Reset the form with updated data
		}
	}, [isUpdate, batch, reset]);

	const [minCapacity, setMinCapacity] = useState(0);
	const [maxCapacity, setMaxCapacity] = useState(0);
	const { data: machine } = useOtherMachines();

	useEffect(() => {
		const machine_uuid = getValues('machine_uuid');

		if (machine_uuid !== undefined || machine_uuid !== null) {
			setMaxCapacity(
				machine?.find((item) => item.value === machine_uuid)
					?.max_capacity
			);
			setMinCapacity(
				machine?.find((item) => item.value === machine_uuid)
					?.min_capacity
			);
		}
	}, [watch()]);

	const getTotalQty = useCallback(
		(batch_entry) => {
			if (!batch_entry || !Array.isArray(batch_entry)) {
				return 0;
			}

			return batch_entry.reduce((acc, item) => {
				if (!item || !item.quantity) {
					return acc;
				}
				return acc + Number(item.quantity);
			}, 0);
		},
		[watch()]
	);
	const getTotalCalTape = useCallback(
		(batch_entry) => {
			if (!batch_entry || !Array.isArray(batch_entry)) {
				return 0;
			}
			return batch_entry.reduce((acc, item) => {
				const expected_weight =
					parseFloat(item.quantity || 0) *
					parseFloat(item.max_weight);

				return acc + expected_weight;
			}, 0);
		},
		[watch()]
	);

	const onSubmit = async (data) => {
		// * Update
		if (isUpdate) {
			const {
				batch_entry,
				new_batch_entry: new_batch_entries,
				...rest
			} = data;
			const batch_data_updated = {
				...rest,
				updated_at: GetDateTime(),
			};

			let flag = false;
			data?.batch_entry.map((item) => {
				if (item.quantity < 1) {
					ShowLocalToast({
						type: 'error',
						message:
							'Quantity should greater than zero in batch orders.',
					});
					flag = true;
					return;
				}
			});

			if (flag) return;

			const batch_entry_updated = [...batch_entry]
				.filter((item) => item.quantity > 0)
				.map((item) => ({
					...item,
					uuid: item.batch_entry_uuid,
					remarks: item.batch_remarks,
					updated_at: GetDateTime(),
				}));

			const new_batch_entry = [...new_batch_entries]
				.filter((item) => item.quantity > 0)
				.map((item) => ({
					...item,
					uuid: nanoid(),
					batch_uuid: batch_data_updated.uuid,
					remarks: item.remarks,
					created_at: GetDateTime(),
				}));

			setBatchData(batch_data_updated); // * use for modal
			setBatchEntry(new_batch_entry); // * use for modal
			setPatchBatchEntry(batch_entry_updated); // * use for modal

			if (
				batch_entry_updated.length === 0 &&
				new_batch_entry.length === 0
			) {
				ShowLocalToast({
					type: 'warning',
					message: 'Select at least one item to proceed.',
				});
			} else {
				if (
					// * check if all colors and bleaching are same
					(batch_entry_updated.length > 0 &&
						(!new_batch_entry.every(
							(item) =>
								item.color === batch_entry_updated[0].color
						) ||
							!new_batch_entry.every(
								(item) =>
									item.bleaching ===
									batch_entry_updated[0].bleaching
							))) ||
					(new_batch_entry.length > 0 &&
						!new_batch_entry.every(
							(item) => item.color === new_batch_entry[0].color
						)) ||
					!new_batch_entry.every(
						(item) =>
							item.bleaching === new_batch_entry[0].bleaching
					)
				) {
					window['proceed_modal'].showModal(); // * if not then show modal
				} else {
					await updateData.mutateAsync({
						url: `/thread/batch/${batch_data_updated?.uuid}`,
						updatedData: batch_data_updated,
						isOnCloseNeeded: false,
					});

					let batch_entry_updated_promises = [
						...batch_entry_updated.map(async (item) => {
							await updateData.mutateAsync({
								url: `/thread/batch-entry/${item.uuid}`,
								updatedData: item,
								isOnCloseNeeded: false,
							});
						}),

						new_batch_entry.length > 0 &&
							(await postData.mutateAsync({
								url: '/thread/batch-entry',
								newData: new_batch_entry,
								isOnCloseNeeded: false,
							})),
					];

					await Promise.all(batch_entry_updated_promises)
						.then(() =>
							reset(Object.assign({}, DYEING_THREAD_BATCH_NULL))
						)
						.then(() => {
							invalidateDyeingThreadBatch();
							navigate(
								`/dyeing-and-iron/thread-batch/${batch_uuid}`
							);
						})
						.catch((err) => console.log(err));
				}
			}

			return;
		}

		// * ADD data
		const { batch_entry: batch_entries, ...rest } = data;
		const created_at = GetDateTime();
		const batch_data = {
			...rest,
			uuid: nanoid(),
			created_at,
			created_by: user.uuid,
		};

		const batch_entry = [...batch_entries]
			.filter((item) => item.quantity > 0)
			.map((item) => ({
				...item,
				uuid: nanoid(),
				batch_uuid: batch_data.uuid,
				transfer_quantity: 0,
				remarks: item.batch_remarks,
				created_at,
			}));
		setBatchData(batch_data); // * use for modal
		setBatchEntry(batch_entry); // * use for modal

		if (batch_entry.length === 0) {
			ShowLocalToast({
				type: 'warning',
				message: 'Select at least one item to proceed.',
			});
		} else {
			if (
				// * check if all colors are same
				!batch_entry.every(
					(item) => item.recipe_uuid === batch_entry[0].recipe_uuid
				) ||
				!batch_entry.every(
					// * check if all bleaching are same
					(item) => item.bleaching === batch_entry[0].bleaching
				)
			) {
				window['proceed_modal'].showModal(); // * if not then show modal
			} else {
				await postData.mutateAsync({
					url,
					newData: batch_data,
					isOnCloseNeeded: false,
				});

				let promises = [
					await postData.mutateAsync({
						url: '/thread/batch-entry',
						newData: batch_entry,
						isOnCloseNeeded: false,
					}),
				];

				await Promise.all(promises)
					.then(() =>
						reset(Object.assign({}, DYEING_THREAD_BATCH_NULL))
					)
					.then(() => {
						invalidateDyeingThreadBatch();
						navigate(
							`/dyeing-and-iron/thread-batch/${batch_data.uuid}`
						);
					})
					.catch((err) => console.log(err));

				return;
			}
		}
		return;
	};

	// * useEffect for modal procees submit
	useEffect(() => {
		const proceedSubmit = async () => {
			// * UPDATE
			if (isUpdate) {
				const batchDataPromise = await updateData.mutateAsync({
					url: `/thread/batch/${batchData?.uuid}`,
					updatedData: batchData,
					isOnCloseNeeded: false,
				});

				let batch_entry_updated_promises = [
					...patchEntry.map(async (item) => {
						await updateData.mutateAsync({
							url: `/thread/batch-entry/${item.uuid}`,
							updatedData: item,
							isOnCloseNeeded: false,
						});
					}),

					batchEntry.length > 0 &&
						(await postData.mutateAsync({
							url: '/thread/batch-entry',
							newData: batchEntry,
							isOnCloseNeeded: false,
						})),
				];

				await Promise.all([
					batchDataPromise,
					...batch_entry_updated_promises,
				])
					.then(() =>
						reset(Object.assign({}, DYEING_THREAD_BATCH_NULL))
					)
					.then(() => {
						invalidateDyeingThreadBatch();
						navigate(
							`/dyeing-and-iron/thread-batch/${batchData.uuid}`
						);
					})
					.catch((err) => console.log(err));

				return;
			}

			// * ADD data
			await postData.mutateAsync({
				url,
				newData: batchData,
				isOnCloseNeeded: false,
			});

			let promises = [
				await postData.mutateAsync({
					url: '/thread/batch-entry',
					newData: batchEntry,
					isOnCloseNeeded: false,
				}),
			];

			await Promise.all(promises)
				.then(() => reset(Object.assign({}, DYEING_THREAD_BATCH_NULL)))
				.then(() => {
					invalidateDyeingThreadBatch();
					navigate(`/dyeing-and-iron/thread-batch/${batchData.uuid}`);
				})
				.catch((err) => console.log(err));

			return;
		};

		if (proceed) proceedSubmit();
	}, [proceed]);

	// Check if order_number is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;
	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';

	const currentColumns = Columns({
		isUpdate,
		setValue,
		BatchOrdersField,
		handelDelete,
		register,
		errors,
		watch,
		status: status,
	});

	// * table columns for adding new finishing field on update
	const NewColumns = Columns({
		setValue,
		NewBatchOrdersField,
		register,
		errors,
		watch,
		status: status,
		is_new: true,
	});
	return (
		<FormProvider {...form}>
			<form
				className='flex flex-col gap-4'
				onSubmit={handleSubmit(onSubmit)}
				noValidate
			>
				<Header
					{...{
						register,
						errors,
						control,
						watch,
						getValues,
						setValue,
						Controller,
						isUpdate,
						minCapacity,
						maxCapacity,
						totalQuantity:
							getTotalQty(watch('batch_entry')) +
							getTotalQty(watch('new_batch_entry')),
						totalWeight: Number(
							getTotalCalTape(watch('batch_entry')) +
								getTotalCalTape(watch('new_batch_entry'))
						).toFixed(3),
					}}
				/>

				{/* todo: react-table  */}

				<ReactTable
					title={'Batch Orders'}
					data={BatchOrdersField}
					columns={currentColumns}
					extraButton={
						!isUpdate && (
							<StatusSelect
								status={status}
								setStatus={setStatus}
								options={options}
							/>
						)
					}
				/>

				{isUpdate && (
					<ReactTable
						title={'Add New Batch'}
						data={NewBatchOrdersField}
						columns={NewColumns}
						extraButton={
							<StatusSelect
								status={status}
								setStatus={setStatus}
								options={options}
							/>
						}
					/>
				)}

				<Footer buttonClassName='!btn-primary' />
			</form>

			<Suspense>
				<ProceedModal
					text='Shade or Bleach'
					modalId={'proceed_modal'}
					setProceed={setProceed}
				/>
			</Suspense>

			<DevTool control={control} placement='top-left' />
			<Suspense>
				<DeleteModal
					modalId={'finishing_batch_entry_delete'}
					title={'Batch Entry Delete'}
					deleteItem={deleteEntry}
					setDeleteItem={setDeleteEntry}
					setItems={BatchOrdersField}
					deleteData={deleteData}
					url={`/thread/batch-entry`}
					invalidateQuery={invalidateDyeingThreadBatchDetails}
				/>
			</Suspense>
		</FormProvider>
	);
}
