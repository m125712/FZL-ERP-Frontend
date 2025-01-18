import {
	Suspense,
	use,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import {
	useDyeingBatch,
	useDyeingBatchDetailsByUUID,
	useDyeingOrderBatch,
} from '@/state/Dyeing';
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
	DYEING_BATCH_NULL,
	DYEING_BATCH_SCHEMA,
	DYEING_BATCH_SCHEMA_UPDATE,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';
import { getRequiredTapeKg } from '@/util/GetRequiredTapeKg';

import { Columns } from './columns';
import Header from './Header';

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
		invalidateQuery: invalidateDyeingZipperBatch,
	} = useDyeingBatch(`type=pending`);

	const { batch_uuid } = useParams();

	const isUpdate = batch_uuid !== undefined;

	const { user } = useAuth();
	const navigate = useNavigate();

	const [proceed, setProceed] = useState(false);
	const [batchData, setBatchData] = useState(null);
	const [batchEntry, setBatchEntry] = useState(null);
	const [patchBatchEntry, setPatchBatchEntry] = useState(null);
	const [status, setStatus] = useState('bulk'); // * options for extra select in table
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
	} = useRHF(isUpdate ? DYEING_BATCH_SCHEMA_UPDATE : DYEING_BATCH_SCHEMA, {
		...DYEING_BATCH_NULL,
		production_date: dyeing_date,
		machine_uuid,
		slot: slot_no,
	});

	const { fields: BatchOrdersField, remove: BatchOrdersFieldRemove } =
		useFieldArray({
			control,
			name: 'dyeing_batch_entry',
		});

	const { fields: NewBatchOrdersField } = useFieldArray({
		control,
		name: 'new_dyeing_batch_entry',
	});

	const { data, invalidateQuery: invalidateNewDyeingZipperBatchEntry } =
		isUpdate
			? useDyeingBatchDetailsByUUID(
					batch_uuid,
					`?is_update=true&type=${status}`
				)
			: watch('batch_type') === 'extra' && watch('order_info_uuid')
				? useDyeingOrderBatch(
						`batch_type=extra&order_info_uuid=${watch('order_info_uuid')}&type=${status}`
					)
				: useDyeingOrderBatch(`type=${status}`);

	useEffect(() => {
		if (isUpdate) {
			reset(data); // Reset the form with updated data
		}
	}, [isUpdate, data, reset]);

	useEffect(() => {
		if (!isUpdate) {
			setValue('dyeing_batch_entry', data?.dyeing_batch_entry);
		}

		// * on update sometimes the useFieldArray does not update so we need to set it manually
		// * this condition is need to trigger the useFieldArray to update to show the data
		if (isUpdate) {
			setValue('dyeing_batch_entry', data?.dyeing_batch_entry);
			setValue('new_dyeing_batch_entry', data?.new_dyeing_batch_entry);
		}
	}, [data, status]);

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

			// * for tape order we calculate with size as quantity
			const itemTotal =
				getRequiredTapeKg({
					row: item,
					type: 'raw',
					input_quantity: quantity,
				}) || 0;
			return acc + itemTotal;
		}, 0);
	}, []);

	const onSubmit = async (data) => {
		// * Update
		if (isUpdate) {
			const batch_data_updated = {
				uuid: data.uuid,
				batch_status: data.batch_status,
				machine_uuid: data.machine_uuid,
				slot: data.slot,
				received: data.received ? 1 : 0,
				production_date: data.production_date,
				batch_type: data.batch_type,
				order_info_uuid: data.order_info_uuid,
				remarks: data.remarks,
				updated_at: GetDateTime(),
			};

			setBatchData(batch_data_updated); // * use for modal

			let flag = false;
			data?.dyeing_batch_entry.map((item) => {
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
			const dyeing_batch_entry_updated = [
				...data?.dyeing_batch_entry,
			].map((item) => ({
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

			setPatchBatchEntry(dyeing_batch_entry_updated); // * use for modal
			setBatchEntry(new_dyeing_batch_entry); // * use for modal

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
			batch_status: data.batch_status,
			machine_uuid: data.machine_uuid,
			slot: data.slot,
			received: data.received ? 1 : 0,
			production_date: data.production_date,
			batch_type: data.batch_type,
			order_info_uuid: data.order_info_uuid,
			remarks: data.remarks,
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
			// * UPDATE
			if (isUpdate) {
				const batchDataPromise = await updateData.mutateAsync({
					url: `${url}/${batchData?.uuid}`,
					updatedData: batchData,
					isOnCloseNeeded: false,
				});

				let dyeing_batch_entry_updated_promises = [
					...patchBatchEntry.map(async (item) => {
						await updateData.mutateAsync({
							url: `/zipper/dyeing-batch-entry/${item.dyeing_batch_entry_uuid}`,
							updatedData: item,
							isOnCloseNeeded: false,
						});
					}),
					...batchEntry.map(
						async (item) =>
							await postData.mutateAsync({
								url: '/zipper/dyeing-batch-entry',
								newData: item,
								isOnCloseNeeded: false,
							})
					),
				];

				await Promise.all([
					batchDataPromise,
					...dyeing_batch_entry_updated_promises,
				])
					.then(() => reset(Object.assign({}, DYEING_BATCH_NULL)))

					.then(() => {
						invalidateDyeingZipperBatch();
						navigate(
							`/dyeing-and-iron/zipper-batch/${batchData.uuid}`
						);
					})
					.catch((err) => console.log(err));

				return;
			}

			// * ADD
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
					navigate(`/dyeing-and-iron/zipper-batch/${batchData.uuid}`);
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
		}
	};
	const currentColumns = Columns({
		setValue,
		BatchOrdersField,
		handelDelete,
		register,
		errors,
		watch,
		isUpdate,
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
				noValidate>
				<Header
					{...{
						Controller,
						register,
						errors,
						control,
						watch,
						getValues,
						setValue,
						reset,
						totalQuantity:
							getTotalQty(watch('dyeing_batch_entry')) +
							getTotalQty(watch('new_dyeing_batch_entry')),
						totalCalTape: Number(
							getTotalCalTape(watch('dyeing_batch_entry')) +
								getTotalCalTape(watch('new_dyeing_batch_entry'))
						).toFixed(3),
						isUpdate,
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
		</FormProvider>
	);
}
