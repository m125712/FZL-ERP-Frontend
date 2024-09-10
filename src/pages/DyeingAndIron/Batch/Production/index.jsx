import { ProceedModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { ShowLocalToast } from '@/components/Toast';
import {
	useFetchForRhfReset,
	useFetchForRhfResetForBatchProduct,
	useFetchForRhfResetForPlanning,
	useRHF,
} from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useDyeingBatch } from '@/state/Dyeing';
import { CheckBoxWithoutLabel, Input, Textarea } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import {
	DYEING_BATCH_PRODUCTION_NULL,
	DYEING_BATCH_PRODUCTION_SCHEMA,
} from '@util/Schema';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Header from './Header';

// UPDATE IS WORKING
export default function Index() {
	const { updateData, postData } = useDyeingBatch();
	const { batch_uuid, batch_prod_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [isAllChecked, setIsAllChecked] = useState(false);
	const [isSomeChecked, setIsSomeChecked] = useState(false);
	const isUpdate = batch_uuid !== undefined;

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
	} = useRHF(DYEING_BATCH_PRODUCTION_SCHEMA, DYEING_BATCH_PRODUCTION_NULL);

	// batch_entry
	const { fields: BatchEntryField } = useFieldArray({
		control,
		name: 'batch_entry',
	});

	// * Fetch initial data
	isUpdate
		? useFetchForRhfReset(
				`/zipper/batch-details/${batch_uuid}`,
				batch_uuid,
				reset
			)
		: useFetchForRhfResetForPlanning(`/zipper/order-batch`, reset);

	// * Fetch initial data of batch for batch production entry
	if (batch_prod_uuid) {
		useFetchForRhfResetForBatchProduct(
			// todo: fix the data to get given_production_qty for form
			`/zipper/batch-details/${batch_prod_uuid}`,
			batch_prod_uuid,
			reset
		);
	}
	// const { value } = useFetch('/zipper/order-batch');

	// TODO: Not sure if this is needed. need further checking
	let order_info_ids;
	// useEffect(() => {
	// 	if (pi_uuid !== undefined) {
	// 		setOrderInfoIds((prev) => ({
	// 			...prev,
	// 			order_info_ids,
	// 		}));
	// 	}
	// }, [getValues('order_info_ids')]);

	// TODO: Submit
	const onSubmit = async (data) => {
		// * Update
		// if (isUpdate) {
		// 	const batch_data_updated = {
		// 		...data,
		// 		updated_at: GetDateTime(),
		// 	};

		// 	const batch_entry_updated = [...data?.batch_entry]
		// 		.filter((item) => item.is_checked)
		// 		.map((item) => ({
		// 			...item,
		// 			uuid: item.batch_entry_uuid,
		// 			remarks: item.batch_remarks,
		// 			updated_at: GetDateTime(),
		// 		}));

		// 	if (batch_entry_updated.length === 0) {
		// 		alert('Select at least one item to proceed.');
		// 	} else {
		// 		await updateData.mutateAsync({
		// 			url: `/zipper/batch/${batch_data_updated?.uuid}`,
		// 			updatedData: batch_data_updated,
		// 			isOnCloseNeeded: false,
		// 		});

		// 		let batch_entry_updated_promises = [
		// 			...batch_entry_updated.map(async (item) => {
		// 				await updateData.mutateAsync({
		// 					url: `/zipper/batch-entry/${item.uuid}`,
		// 					updatedData: item,
		// 					isOnCloseNeeded: false,
		// 				});
		// 			}),
		// 		];

		// 		await Promise.all(batch_entry_updated_promises)
		// 			.then(() => reset(Object.assign({}, DYEING_BATCH_PRODUCTION_NULL)))
		// 			.then(
		// 				navigate(`/dyeing-and-iron/batch/details/${batch_uuid}`)
		// 			)
		// 			.catch((err) => console.log(err));
		// 	}

		// 	// navigate(`/dyeing-and-iron/planning-sno/details/${weeks}`);

		// 	return;
		// }

		// * ADD data
		const created_at = GetDateTime();

		const batch_entry = [...data?.batch_entry]
			.filter((item) => item.is_checked)
			.map((item) => ({
				uuid: nanoid(),
				batch_production_uuid: item.batch_production_uuid,
				batch_entry_uuid: item.batch_entry_uuid,
				production_quantity: item.production_quantity,
				production_quantity_in_kg: item.production_quantity_in_kg,
				created_by: user.uuid,
				created_at,
				remarks: item.batch_production_remarks,
			}));

		// * update the batch status
		await updateData.mutateAsync({
			url: `/zipper/batch/${batch_prod_uuid}`,
			updatedData: {
				batch_status: data.batch_status,
				updated_at: GetDateTime(),
			},
			isOnCloseNeeded: false,
		});

		if (batch_entry.length === 0) {
			ShowLocalToast({
				type: 'warning',
				message: 'Select at least one item to proceed.',
			});
		} else {
			let promises = [
				...batch_entry.map(async (item) => {
					if (item.batch_production_uuid) {
						await updateData.mutateAsync({
							url: `/zipper/batch-production/${item.batch_production_uuid}`,
							updatedData: {
								batch_production_uuid:
									item.batch_production_uuid,
								batch_entry_uuid: item.batch_entry_uuid,
								production_quantity: item.production_quantity,
								production_quantity_in_kg:
									item.production_quantity_in_kg,
								remarks: item.batch_production_remarks,
								updated_at: GetDateTime(),
							},
							isOnCloseNeeded: false,
						});
					} else {
						await postData.mutateAsync({
							url: '/zipper/batch-production',
							newData: item,
							isOnCloseNeeded: false,
						});
					}
				}),
			];

			await Promise.all(promises)
				.then(() =>
					reset(Object.assign({}, DYEING_BATCH_PRODUCTION_NULL))
				)
				.then(
					navigate(
						`/dyeing-and-iron/batch/details/${batch_prod_uuid}`
					)
				)
				.catch((err) => console.log(err));

			return;
		}
		return;
	};

	// Check if order_number is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;

	useEffect(() => {
		if (isAllChecked || isSomeChecked) {
			return BatchEntryField.forEach((item, index) => {
				if (isAllChecked) {
					setValue(`batch_entry[${index}].is_checked`, true);
				}
			});
		}
		if (!isAllChecked) {
			return BatchEntryField.forEach((item, index) => {
				setValue('is_all_checked', false);
				setValue(`batch_entry[${index}].is_checked`, false);
			});
		}
	}, [isAllChecked]);

	// Todo: fix this
	const handleRowChecked = (e, index) => {
		const isChecked = e.target.checked;
		setValue(`batch_entry[${index}].is_checked`, isChecked);

		let isEveryChecked = true,
			isSomeChecked = false;

		for (let item of watch('batch_entry')) {
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
						className={
							info.row.original.batch_production_uuid
								? 'bg-gray-400'
								: 'bg-white'
						}
						label={`batch_entry[${info.row.index}].is_checked`}
						checked={watch(
							`batch_entry[${info.row.index}].is_checked`
						)}
						onChange={(e) => handleRowChecked(e, info.row.index)}
						disabled={
							getValues(
								`batch_entry[${info.row.index}].pi_quantity`
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
				cell: (info) => Number(info.getValue()),
			},
			// {
			// 	accessorKey: 'balance_quantity',
			// 	header: 'Balanced Batch',
			// 	enableColumnFilter: true,
			// 	enableSorting: true,
			// 	cell: (info) => Number(info.getValue()),
			// },
			{
				accessorKey: 'quantity',
				header: 'Batch QTY',
				enableColumnFilter: true,
				enableSorting: true,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'production_quantity',
				header: 'Production QTY',
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => {
					const idx = info.row.index;
					const dynamicerror =
						errors?.batch_entry?.[idx]?.production_quantity;
					return (
						<Input
							label={`batch_entry[${info.row.index}].production_quantity`}
							is_title_needed='false'
							height='h-8'
							dynamicerror={dynamicerror}
							{...{ register, errors }}
						/>
					);
				},
			},
			{
				accessorKey: 'production_quantity_in_kg',
				header: 'Production QTY (KG)',
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => {
					const idx = info.row.index;
					const dynamicerror =
						errors?.batch_entry?.[idx]?.production_quantity_in_kg;
					return (
						<Input
							label={`batch_entry[${info.row.index}].production_quantity_in_kg`}
							is_title_needed='false'
							height='h-8'
							dynamicerror={dynamicerror}
							{...{ register, errors }}
						/>
					);
				},
			},
			{
				accessorKey: 'batch_remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				enableSorting: false,
				width: 'w-44',
				cell: (info) => (
					<Textarea
						label={`batch_entry[${info.row.index}].batch_remarks`}
						is_title_needed='false'
						height='h-8'
						{...{ register, errors }}
					/>
				),
			},
		],
		[isAllChecked, isSomeChecked, BatchEntryField, register, errors]
	);

	console.log(getValues());
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
						getValues,
						Controller,
						isUpdate,
					}}
				/>

				{/* todo: react-table  */}

				<ReactTable data={BatchEntryField} columns={columns} />

				<div className='modal-action'>
					<button
						type='submit'
						className='text-md btn btn-primary btn-block'>
						Save
					</button>
				</div>
			</form>

			<Suspense>
				<ProceedModal modalId={'proceed_modal'} />
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</div>
	);
}
