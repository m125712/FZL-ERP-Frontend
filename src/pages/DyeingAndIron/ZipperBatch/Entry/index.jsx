import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import {
	useDyeingBatch,
	useDyeingBatchDetailsByUUID,
	useDyeingOrderBatch,
} from '@/state/Dyeing';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { get } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
	useFetchForRhfReset,
	useFetchForRhfResetForPlanning,
	useRHF,
} from '@/hooks';

import { DeleteModal, ProceedModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { ShowLocalToast } from '@/components/Toast';
import { CheckBoxWithoutLabel, Input, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DYEING_BATCH_NULL, DYEING_BATCH_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import { Columns } from './columns';
import Header from './Header';

export default function Index() {
	const {
		url,
		updateData,
		postData,
		deleteData,
		invalidateQuery: invalidateDyeingZipperBatch,
	} = useDyeingBatch();

	const { batch_uuid } = useParams();
	const isUpdate = batch_uuid !== undefined;
	const { data, invalidateQuery: invalidateNewDyeingZipperBatchEntry } =
		isUpdate
			? useDyeingBatchDetailsByUUID(batch_uuid, '?is_update=true')
			: useDyeingOrderBatch();
	const { user } = useAuth();
	const navigate = useNavigate();

	const [proceed, setProceed] = useState(false);
	const [batchData, setBatchData] = useState(null);
	const [batchEntry, setBatchEntry] = useState(null);

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
	} = useRHF(DYEING_BATCH_SCHEMA, DYEING_BATCH_NULL);
	// useEffect(() => {
	// 	if (isUpdate) {
	// 		reset(data); // Reset the form with updated data
	// 	}
	// }, [isUpdate, data, reset]);
	const { fields: BatchOrdersField, remove: BatchOrdersFieldRemove } =
		useFieldArray({
			control,
			name: 'dyeing_batch_entry',
		});

	const { fields: NewBatchOrdersField } = useFieldArray({
		control,
		name: 'new_dyeing_batch_entry',
	});
	useEffect(() => {
		if (!isUpdate) {
			setValue('dyeing_batch_entry', data?.length > 0 ? data : []);
		}

		// * on update sometimes the useFieldArray does not update so we need to set it manually
		// * this condition is need to trigger the useFieldArray to update to show the data
		if (isUpdate) {
			setValue('dyeing_batch_entry', data?.dyeing_batch_entry);
			setValue('new_dyeing_batch_entry', data?.new_dyeing_batch_entry);
		}
	}, [data]);
	// * Fetch initial data
	isUpdate
		? useFetchForRhfReset(
				`/zipper/dyeing-batch-details/${batch_uuid}?is_update=true`,
				batch_uuid,
				reset
			)
		: useFetchForRhfResetForPlanning(`/zipper/dyeing-order-batch`, reset);
	const getTotalQty = useCallback(
		(dyeing_batch_entry) => {
			if (!dyeing_batch_entry || !Array.isArray(dyeing_batch_entry)) {
				return 0;
			}
			return dyeing_batch_entry?.reduce((acc, item) => {
				return acc + Number(item.quantity);
			}, 0);
		},
		[watch()]
	);
	const isReceived = getValues('received') === 1;
	const getTotalCalTape = useCallback((dyeing_batch_entry) => {
		if (!dyeing_batch_entry || !Array.isArray(dyeing_batch_entry)) {
			return 0;
		}

		return dyeing_batch_entry.reduce((acc, item) => {
			const top = parseFloat(item.top) || 0;
			const bottom = parseFloat(item.bottom) || 0;
			const size = parseFloat(item.size) || 0;
			const quantity = parseFloat(item.quantity) || 0;
			const rawMtrPerKg = parseFloat(item.raw_mtr_per_kg) || 1;

			const itemTotal =
				((top + bottom + size) * quantity) / 100 / rawMtrPerKg;
			return acc + itemTotal;
		}, 0);
	}, []);

	const onSubmit = async (data) => {
		// * Update
		if (isUpdate) {
			const batch_data_updated = {
				...data,
				updated_at: GetDateTime(),
			};

			const dyeing_batch_entry_updated = [...data?.dyeing_batch_entry]
				.filter((item) => item.quantity > 0)
				.map((item) => ({
					...item,
					dyeing_batch_entry_uuid: item.dyeing_batch_entry_uuid,
					remarks: item.remarks,
					updated_at: GetDateTime(),
				}));
			const new_dyeing_batch_entry = [...data?.new_dyeing_batch_entry]
				.filter((item) => item.quantity > 0)
				.map((item) => ({
					...item,
					uuid: nanoid(),
					dyeing_batch_uuid: batch_data_updated.uuid,
					remarks: item.remarks,
					created_at: GetDateTime(),
				}));

			if (
				dyeing_batch_entry_updated.length === 0 &&
				new_dyeing_batch_entry.length === 0
			) {
				ShowLocalToast({
					type: 'warning',
					message:
						'There should one or more item quantity greater than zero to proceed.',
				});
			} else {
				if (
					// * check if all colors and bleaching are same
					(dyeing_batch_entry_updated.length > 0 &&
						(!new_dyeing_batch_entry.every(
							(item) =>
								item.color ===
								dyeing_batch_entry_updated[0].color
						) ||
							!new_dyeing_batch_entry.every(
								(item) =>
									item.bleaching ===
									dyeing_batch_entry_updated[0].bleaching
							))) ||
					(new_dyeing_batch_entry.length > 0 &&
						!new_dyeing_batch_entry.every(
							(item) =>
								item.color === new_dyeing_batch_entry[0].color
						)) ||
					!new_dyeing_batch_entry.every(
						(item) =>
							item.bleaching ===
							new_dyeing_batch_entry[0].bleaching
					)
				) {
					window['proceed_modal'].showModal(); // * if not then show modal
				} else {
					await updateData.mutateAsync({
						url: `/zipper/dyeing-batch/${batch_data_updated?.uuid}`,
						updatedData: batch_data_updated,
						isOnCloseNeeded: false,
					});
					let dyeing_batch_entry_updated_promises = [
						...dyeing_batch_entry_updated.map(async (item) => {
							await updateData.mutateAsync({
								url: `/zipper/dyeing-batch-entry/${item.dyeing_batch_entry_uuid}`,
								updatedData: item,
								isOnCloseNeeded: false,
							});
						}),
						...new_dyeing_batch_entry.map(
							async (item) =>
								await postData.mutateAsync({
									url: '/zipper/dyeing-batch-entry',
									newData: item,
									isOnCloseNeeded: false,
								})
						),
					];

					await Promise.all(dyeing_batch_entry_updated_promises)
						.then(() => reset(Object.assign({}, DYEING_BATCH_NULL)))
						.then(() => {
							invalidateDyeingZipperBatch();
							navigate(
								`/dyeing-and-iron/zipper-batch/${batch_uuid}`
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

		const dyeing_batch_entry = [...data?.dyeing_batch_entry]
			.filter((item) => item.quantity > 0)
			.map((item) => ({
				...item,
				uuid: nanoid(),
				dyeing_batch_uuid: batch_data.uuid,
				remarks: item.remarks,
				created_at,
			}));
		setBatchData(batch_data); // * use for modal
		setBatchEntry(dyeing_batch_entry); // * use for modal

		if (dyeing_batch_entry.length === 0) {
			ShowLocalToast({
				type: 'warning',
				message:
					'There should one or more item quantity greater than zero to proceed.',
			});
		} else {
			if (
				// * check if all colors and bleaching are same
				!dyeing_batch_entry.every(
					(item) => item.color === dyeing_batch_entry[0].color
				) ||
				!dyeing_batch_entry.every(
					(item) => item.bleaching === dyeing_batch_entry[0].bleaching
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
					...dyeing_batch_entry.map(
						async (item) =>
							await postData.mutateAsync({
								url: '/zipper/dyeing-batch-entry',
								newData: item,
								isOnCloseNeeded: false,
							})
					),
				];

				await Promise.all(promises)
					.then(() => {
						reset(Object.assign({}, DYEING_BATCH_NULL));
					})

					.then(() => {
						invalidateDyeingZipperBatch();
						navigate(
							`/dyeing-and-iron/zipper-batch/${batch_data.uuid}`
						);
					})
					.catch((err) => console.log(err));

				return;
			}
		}
		return;
	};

	// * useEffect for modal process submit
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
							url: '/zipper/dyeing-batch-entry',
							newData: item,
							isOnCloseNeeded: false,
						})
				),
			];

			await Promise.all(promises)
				.then(() => reset(Object.assign({}, DYEING_BATCH_NULL)))

				.then(() => {
					invalidateDyeingZipperBatch();
					navigate(`/dyeing-and-iron/batch/${batchData.uuid}`);
				})
				.catch((err) => console.log(err));

			return;
		};

		if (proceed) proceedSubmit();
	}, [proceed]);

	// Check if order_number is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;

	const [deleteEntry, setDeleteEntry] = useState({
		itemId: null,
		itemName: null,
	});

	const handelDelete = (index) => {
		const UUID = getValues(
			`dyeing_batch_entry[${index}].dyeing_batch_entry_uuid`
		);
		if (UUID !== undefined) {
			setDeleteEntry({
				itemId: UUID,
				itemName: UUID,
			});
			window['finishing_batch_entry_delete'].showModal();
			BatchOrdersFieldRemove(index);
		}
	};
	const currentColumns = Columns({
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
						Controller,
						register,
						errors,
						control,
						getValues,
						totalQuantity:
							getTotalQty(watch('dyeing_batch_entry')) +
							getTotalQty(watch('new_dyeing_batch_entry')),
						totalCalTape: Number(
							getTotalCalTape(watch('dyeing_batch_entry')) +
								getTotalCalTape(watch('new_dyeing_batch_entry'))
						).toFixed(3),
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
					<button
						type='submit'
						disabled={isReceived}
						className='text-md btn btn-primary btn-block'>
						Save
					</button>
				</div>
			</form>

			<Suspense>
				<ProceedModal
					text='Color or Bleach'
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
					url={`/zipper/dyeing-batch-entry`}
					invalidateQuery={invalidateNewDyeingZipperBatchEntry}
				/>
			</Suspense>
		</div>
	);
}
