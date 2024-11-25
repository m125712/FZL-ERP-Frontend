import { Suspense, useCallback, useEffect, useState } from 'react';
import {
	useDyeingThreadBatch,
	useDyeingThreadBatchDetailsByUUID,
	useDyeingThreadOrderBatch,
} from '@/state/Dyeing';
import { useGetURLData, useOtherMachines } from '@/state/Other';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useRHF } from '@/hooks';

import { DeleteModal, ProceedModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { ShowLocalToast } from '@/components/Toast';

import nanoid from '@/lib/nanoid';
import {
	DYEING_THREAD_BATCH_NULL,
	DYEING_THREAD_BATCH_SCHEMA,
	NUMBER,
	STRING,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import { Columns } from './columns';
import Header from './Header';

// UPDATE IS WORKING
export default function Index() {
	const {
		url,
		updateData,
		postData,
		deleteData,
		invalidateQuery: invalidateDyeingThreadBatch,
	} = useDyeingThreadBatch();

	const { batch_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const isUpdate = batch_uuid !== undefined;
	const { data: batch, invalidateQuery: invalidateDyeingThreadBatchDetails } =
		isUpdate
			? useDyeingThreadBatchDetailsByUUID(batch_uuid, '?is_update=true')
			: useDyeingThreadOrderBatch();
	const [proceed, setProceed] = useState(false);
	const [batchData, setBatchData] = useState(null);
	const [batchEntry, setBatchEntry] = useState(null);

	// * if can_trx_quty exist koray taholay etar
	const SCHEMA = {
		...DYEING_THREAD_BATCH_SCHEMA,
		batch_entry: yup.array().of(
			yup.object().shape({
				quantity: NUMBER.nullable()
					.max(yup.ref('max_quantity'), 'Beyond Balance Quantity')
					.transform((value, originalValue) =>
						String(originalValue).trim() === '' ? null : value
					)
					.max(yup.ref('max_quantity'), 'Beyond Balance Quantity'),
				batch_remarks: STRING.nullable(),
			})
		),
	};

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
	} = useRHF(SCHEMA, DYEING_THREAD_BATCH_NULL); // TODO: need to fix the form validation for quantity

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
	}, [batch]);

	// * Fetch initial data
	// isUpdate
	// 	? useFetchForRhfReset(
	// 			`/thread/batch-details/by/${batch_uuid}?is_update=true`,
	// 			batch_uuid,
	// 			reset
	// 		)
	// 	: useFetchForRhfResetForPlanning(`/thread/order-batch`, reset);

	const { data } = useGetURLData(
		isUpdate
			? `/thread/batch-details/by/${batch_uuid}?is_update=true`
			: `/thread/order-batch`
	);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

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
			const batch_data_updated = {
				...data,
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
			const batch_entry_updated = [...data?.batch_entry]
				.filter((item) => item.quantity > 0)
				.map((item) => ({
					...item,
					uuid: item.batch_entry_uuid,
					remarks: item.batch_remarks,
					updated_at: GetDateTime(),
				}));
			const new_batch_entry = [...data?.new_batch_entry]
				.filter((item) => item.quantity > 0)
				.map((item) => ({
					...item,
					uuid: nanoid(),
					batch_uuid: batch_data_updated.uuid,
					remarks: item.remarks,
					created_at: GetDateTime(),
				}));
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
						...new_batch_entry.map(
							async (item) =>
								await postData.mutateAsync({
									url: '/thread/batch-entry',
									newData: item,
									isOnCloseNeeded: false,
								})
						),
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
		const created_at = GetDateTime();
		const batch_data = {
			...data,
			uuid: nanoid(),
			created_at,
			created_by: user.uuid,
		};

		const batch_entry = [...data?.batch_entry]
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
					...batch_entry.map(
						async (item) =>
							await postData.mutateAsync({
								url: '/thread/batch-entry',
								newData: item,
								isOnCloseNeeded: false,
							})
					),
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
			await postData.mutateAsync({
				url,
				newData: batchData,
				isOnCloseNeeded: false,
			});

			let promises = [
				...batchEntry.map(
					async (item) =>
						await postData.mutateAsync({
							url: '/thread/batch-entry',
							newData: item,
							isOnCloseNeeded: false,
						})
				),
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
	});

	// * table columns for adding new finishing field on update
	const NewColumns = Columns({
		setValue,
		NewBatchOrdersField,
		register,
		errors,
		watch,
		is_new: true,
	});
	return (
		<div>
			<form
				className='flex flex-col gap-4'
				onSubmit={handleSubmit(onSubmit)}
				noValidate>
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
						isUpdate,
					}}
				/>

				{/* todo: react-table  */}

				<ReactTable
					title={'Batch Orders'}
					data={BatchOrdersField}
					columns={currentColumns}
				/>

				{isUpdate && (
					<ReactTable
						title={'Add New Batch'}
						data={NewBatchOrdersField}
						columns={NewColumns}
					/>
				)}

				<div className='modal-action'>
					<button className='text-md btn btn-primary btn-block'>
						Save
					</button>
				</div>
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
		</div>
	);
}
