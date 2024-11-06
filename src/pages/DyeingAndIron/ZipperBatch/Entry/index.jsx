import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useDyeingBatch } from '@/state/Dyeing';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
	useFetchForRhfReset,
	useFetchForRhfResetForPlanning,
	useRHF,
} from '@/hooks';

import { ProceedModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { ShowLocalToast } from '@/components/Toast';
import { CheckBoxWithoutLabel, Input, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DYEING_BATCH_NULL, DYEING_BATCH_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import Header from './Header';

export default function Index() {
	const {
		url,
		updateData,
		postData,
		invalidateQuery: invalidateDyeingZipperBatch,
	} = useDyeingBatch();
	const { batch_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();

	const isUpdate = batch_uuid !== undefined;
	const [isAllChecked, setIsAllChecked] = useState(false);
	const [isSomeChecked, setIsSomeChecked] = useState(false);
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

	// dyeing_batch_entry
	const { fields: BatchEntryField } = useFieldArray({
		control,
		name: 'dyeing_batch_entry',
	});

	// * Fetch initial data
	isUpdate
		? useFetchForRhfReset(
				`/zipper/dyeing-batch-details/${batch_uuid}`,
				batch_uuid,
				reset
			)
		: useFetchForRhfResetForPlanning(`/zipper/dyeing-order-batch`, reset);
	const getTotalQty = useCallback(
		(dyeing_batch_entry) =>
			dyeing_batch_entry.reduce((acc, item) => {
				return item.is_checked ? acc + Number(item.quantity) : acc;
			}, 0),
		[watch()]
	);
	const isReceived = getValues('received') === 1;
	const getTotalCalTape = useCallback(
		(dyeing_batch_entry) =>
			dyeing_batch_entry.reduce((acc, item) => {
				if (!item.is_checked) return acc;

				const top = parseFloat(item.top) || 0;
				const bottom = parseFloat(item.bottom) || 0;
				const size = parseFloat(item.size) || 0;
				const quantity = parseFloat(item.quantity) || 0;
				const rawMtrPerKg = parseFloat(item.raw_mtr_per_kg) || 1;

				const itemTotal =
					((top + bottom + size) * quantity) / 100 / rawMtrPerKg;
				return acc + itemTotal;
			}, 0),
		[watch()]
	);

	const onSubmit = async (data) => {
		// return;
		// if (
		// 	getTotalCalTape(watch('dyeing_batch_entry')) > maxCapacity ||
		// 	getTotalCalTape(watch('dyeing_batch_entry')) < minCapacity
		// ) {
		// 	ShowLocalToast({
		// 		type: 'error',
		// 		message: `Machine Capacity  between ${minCapacity} and ${maxCapacity}`,
		// 	});
		// 	return;
		// }
		// * Update
		if (isUpdate) {
			const batch_data_updated = {
				...data,
				updated_at: GetDateTime(),
			};

			const dyeing_batch_entry_updated = [...data?.dyeing_batch_entry]
				.filter((item) => item.is_checked)
				.map((item) => ({
					...item,
					dyeing_batch_entry_uuid: item.dyeing_batch_entry_uuid,
					remarks: item.remarks,
					updated_at: GetDateTime(),
				}));

			if (dyeing_batch_entry_updated.length === 0) {
				ShowLocalToast({
					type: 'warning',
					message: 'Select at least one item to proceed.',
				});
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
				];

				await Promise.all(dyeing_batch_entry_updated_promises)
					.then(() => reset(Object.assign({}, DYEING_BATCH_NULL)))
					.then(() => {
						invalidateDyeingZipperBatch();
						navigate(`/dyeing-and-iron/zipper-batch/${batch_uuid}`);
					})
					.catch((err) => console.log(err));
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
			.filter((item) => item.is_checked)
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
				message: 'Select at least one item to proceed.',
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

	// * check box logic
	useEffect(() => {
		if (isAllChecked || isSomeChecked) {
			return BatchEntryField.forEach((item, index) => {
				if (isAllChecked) {
					setValue(`dyeing_batch_entry[${index}].is_checked`, true);
				}
			});
		}
		if (!isAllChecked) {
			return BatchEntryField.forEach((item, index) => {
				setValue('is_all_checked', false);
				setValue(`dyeing_batch_entry[${index}].is_checked`, false);
			});
		}
	}, [isAllChecked]);

	useEffect(() => {
		if (isUpdate) {
			setIsAllChecked(true);
			setValue('is_all_checked', true);
		}
	}, [isUpdate]);

	useEffect(() => {
		if (isAllChecked) {
			BatchEntryField.forEach((item, index) => {
				setValue(`dyeing_batch_entry[${index}].is_checked`, true);
			});
		}
	}, [isAllChecked, BatchEntryField]);

	const handleRowChecked = (e, index) => {
		const isChecked = e.target.checked;
		setValue(`dyeing_batch_entry[${index}].is_checked`, isChecked);

		let isEveryChecked = true,
			isSomeChecked = false;

		for (let item of watch('dyeing_batch_entry')) {
			if (item.is_checked) {
				isSomeChecked = true;
			} else {
				isEveryChecked = false;
				setValue('is_all_checked', false);
			}

			if (isSomeChecked && !isEveryChecked) {
				break;
			}
		}

		setIsAllChecked(isEveryChecked);
		setIsSomeChecked(isSomeChecked);
	};

	const setAllBatch = () => {
		BatchEntryField.map((item, idx) => {
			setValue(
				`dyeing_batch_entry[${idx}].quantity`,
				item.balance_quantity
			);
		});
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: 'checkbox',
				header: () => (
					<CheckBoxWithoutLabel
						className='bg-white'
						label='is_all_checked'
						checked={isAllChecked}
						onChange={(e) => {
							setIsAllChecked(e.target.checked);
							setIsSomeChecked(e.target.checked);
						}}
						{...{ register, errors }}
					/>
				),
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => (
					<CheckBoxWithoutLabel
						label={`dyeing_batch_entry[${info.row.index}].is_checked`}
						checked={watch(
							`dyeing_batch_entry[${info.row.index}].is_checked`
						)}
						onChange={(e) => handleRowChecked(e, info.row.index)}
						disabled={
							getValues(
								`dyeing_batch_entry[${info.row.index}].pi_quantity`
							) == 0
						}
						{...{ register, errors }}
					/>
				),
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				width: 'w-32',
				enableSorting: true,
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				accessorKey: 'style',
				header: 'Style',
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				accessorKey: 'bleaching',
				header: 'Bleach',
				width: 'w-36',
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				accessorKey: 'size',
				header: 'Size (CM)',
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				accessorKey: 'order_quantity',
				header: 'Order QTY',
				enableColumnFilter: true,
				enableSorting: true,
				width: 'w-20',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'top',
				header: 'Tape QTY (Kg)',
				enableColumnFilter: true,
				enableSorting: true,
				cell: ({ row }) => {
					const {
						top,
						bottom,
						raw_mtr_per_kg,
						size,
						order_quantity,
					} = row.original;

					const total_size_in_mtr =
						((parseFloat(top) +
							parseFloat(bottom) +
							parseFloat(size)) *
							parseFloat(order_quantity)) /
						100;

					return Number(
						total_size_in_mtr / parseFloat(raw_mtr_per_kg)
					).toFixed(3);
				},
			},
			{
				accessorKey: 'balance_quantity',
				header: (
					<div className='flex flex-col'>
						Balanced Batch
						<label
							className='btn btn-primary btn-xs'
							onClick={() => setAllBatch()}>
							Copy All
						</label>
					</div>
				),
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => {
					const idx = info.row.index;
					return (
						<div className='flex gap-4'>
							<label
								className='btn btn-primary btn-xs'
								onClick={() =>
									setValue(
										`dyeing_batch_entry[${idx}].quantity`,
										info.getValue()
									)
								}>
								Copy
							</label>
							{info.getValue()}
						</div>
					);
				},
			},
			{
				accessorKey: 'batch_qty',
				header: 'Batch QTY',
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => {
					const idx = info.row.index;
					const dynamicerror =
						errors?.dyeing_batch_entry?.[idx]?.quantity;
					return (
						<Input
							label={`dyeing_batch_entry[${idx}].quantity`}
							is_title_needed='false'
							height='h-8'
							dynamicerror={dynamicerror}
							{...{ register, errors }}
						/>
					);
				},
			},
			{
				accessorKey: 'top',
				header: 'Cal Tape (Kg)',
				enableColumnFilter: false,
				enableSorting: true,
				cell: ({ row }) => {
					const { top, bottom, raw_mtr_per_kg, size } = row.original;
					const idx = row.index;

					const total_size_in_mtr =
						((parseFloat(top) +
							parseFloat(bottom) +
							parseFloat(size)) *
							parseFloat(
								watch(`dyeing_batch_entry[${idx}].quantity`) ||
									0
							)) /
						100;

					return Number(
						total_size_in_mtr / parseFloat(raw_mtr_per_kg)
					).toFixed(3);
				},
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				enableSorting: false,
				width: 'w-44',
				cell: (info) => (
					<Textarea
						label={`dyeing_batch_entry[${info.row.index}].remarks`}
						is_title_needed='false'
						height='h-8'
						{...{ register, errors }}
					/>
				),
			},
		],
		[isAllChecked, isSomeChecked, BatchEntryField, register, errors]
	);

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
						totalQuantity: getTotalQty(watch('dyeing_batch_entry')),
						totalCalTape: Number(
							getTotalCalTape(watch('dyeing_batch_entry'))
						).toFixed(3),
					}}
				/>

				{/* todo: react-table  */}

				<ReactTable data={BatchEntryField} columns={columns} />

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
		</div>
	);
}
