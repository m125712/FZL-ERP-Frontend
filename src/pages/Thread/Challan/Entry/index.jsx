import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useDyeingThreadBatch } from '@/state/Dyeing';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useFetchForRhfResetForThreadChallan } from '@/hooks/CRUD/useFetch';
import {
	useFetch,
	useFetchForRhfReset,
	useFetchForRhfResetForPlanning,
	useRHF,
} from '@/hooks';

import { ProceedModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { ShowLocalToast } from '@/components/Toast';
import { CheckBoxWithoutLabel, Input, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	BOOLEAN,
	NUMBER,
	NUMBER_REQUIRED,
	STRING,
	THREAD_CHALLAN_NULL,
	THREAD_CHALLAN_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import Header from './Header';

// UPDATE IS WORKING
export default function Index() {
	const {
		url,
		updateData,
		postData,
		invalidateQuery: invalidateDyeingThreadBatch,
	} = useDyeingThreadBatch();

	const { batch_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [isAllChecked, setIsAllChecked] = useState(false);
	const [isSomeChecked, setIsSomeChecked] = useState(false);
	const isUpdate = batch_uuid !== undefined;
	const [proceed, setProceed] = useState(false);
	const [batchData, setBatchData] = useState(null);
	const [batchEntry, setBatchEntry] = useState(null);

	// * if can_trx_quty exist koray taholay etar
	const SCHEMA = {
		...THREAD_CHALLAN_SCHEMA,
		entries: yup.array().of(
			yup.object().shape({
				is_checked: BOOLEAN,
				quantity: NUMBER.when('is_checked', {
					is: true,
					then: (schema) => schema.required('Required'),
					otherwise: (schema) => schema.nullable(),
				})
					.transform((value, originalValue) =>
						String(originalValue).trim() === '' ? null : value
					)
					.max(
						yup.ref(
							isUpdate ? 'can_trx_quantity' : 'balance_quantity'
						),
						isUpdate
							? 'Beyond Transaction Quantity'
							: 'Beyond Balance Quantity'
					),
				// batch_remarks: STRING.nullable(),
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
	} = useRHF(SCHEMA, THREAD_CHALLAN_NULL); // TODO: need to fix the form validation for quantity

	// batch_entry
	const { fields: BatchEntryField } = useFieldArray({
		control,
		name: 'entries',
	});

	// * Fetch initial data
	isUpdate
		? useFetchForRhfReset(
				`/thread/batch-details/by/${batch_uuid}`,
				batch_uuid,
				reset
			)
		: useFetchForRhfResetForThreadChallan(
				`/thread/order-details-for-challan/by/${watch('order_info_uuid')}`,
				reset,
				watch
			);

	console.log('getValues:', getValues());
	const onSubmit = async (data) => {
		// * Update
		if (isUpdate) {
			const batch_data_updated = {
				...data,
				updated_at: GetDateTime(),
			};

			const batch_entry_updated = [...data?.batch_entry]
				.filter((item) => item.is_checked)
				.map((item) => ({
					...item,
					uuid: item.batch_entry_uuid,
					remarks: item.batch_remarks,
					updated_at: GetDateTime(),
				}));

			if (batch_entry_updated.length === 0) {
				ShowLocalToast({
					type: 'warning',
					message: 'Select at least one item to proceed.',
				});
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
				];

				await Promise.all(batch_entry_updated_promises)
					.then(() => reset(Object.assign({}, THREAD_CHALLAN_NULL)))
					.then(() => invalidateDyeingThreadBatch())
					.then(
						navigate(`/dyeing-and-iron/thread-batch/${batch_uuid}`)
					)
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

		const batch_entry = [...data?.batch_entry]
			.filter((item) => item.is_checked)
			.map((item) => ({
				...item,
				uuid: nanoid(),
				batch_uuid: batch_data.uuid,
				transfer_quantity: 0,
				remarks: item.batch_remarks,
				created_at,
			}));

		if (batch_entry.length === 0) {
			ShowLocalToast({
				type: 'warning',
				message: 'Select at least one item to proceed.',
			});
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
				.then(() => reset(Object.assign({}, THREAD_CHALLAN_NULL)))
				.then(() => invalidateDyeingThreadBatch())
				.then(
					navigate(`/dyeing-and-iron/thread-batch/${batch_data.uuid}`)
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

	useEffect(() => {
		if (isUpdate) {
			setIsAllChecked(true);
			setValue('is_all_checked', true);
		}
	}, [isUpdate]);

	useEffect(() => {
		if (isAllChecked) {
			BatchEntryField.forEach((item, index) => {
				setValue(`batch_entry[${index}].is_checked`, true);
			});
		}
	}, [isAllChecked, BatchEntryField]);

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
			// {
			// 	accessorKey: 'checkbox',
			// 	header: () => (
			// 		<CheckBoxWithoutLabel
			// 			className='bg-white'
			// 			label='is_all_checked'
			// 			checked={isAllChecked}
			// 			onChange={(e) => {
			// 				setIsAllChecked(e.target.checked);
			// 				setIsSomeChecked(e.target.checked);
			// 			}}
			// 			{...{ register, errors }}
			// 		/>
			// 	),
			// 	enableColumnFilter: false,
			// 	enableSorting: false,
			// 	cell: (info) => (
			// 		<CheckBoxWithoutLabel
			// 			label={`batch_entry[${info.row.index}].is_checked`}
			// 			checked={watch(
			// 				`batch_entry[${info.row.index}].is_checked`
			// 			)}
			// 			onChange={(e) => handleRowChecked(e, info.row.index)}
			// 			disabled={
			// 				getValues(
			// 					`batch_entry[${info.row.index}].pi_quantity`
			// 				) == 0
			// 			}
			// 			{...{ register, errors }}
			// 		/>
			// 	),
			// },
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				accessorKey: 'count',
				header: 'Count',
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
				accessorKey: 'length',
				header: 'Length',
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
			// 	accessorKey: 'quantity',
			// 	header: 'QTY',
			// 	enableColumnFilter: false,
			// 	enableSorting: false,
			// 	cell: (info) => {
			// 		const idx = info.row.index;
			// 		const dynamicerror = errors?.batch_entry?.[idx]?.quantity;
			// 		return (
			// 			<Input
			// 				label={`batch_entry[${info.row.index}].quantity`}
			// 				is_title_needed='false'
			// 				height='h-8'
			// 				dynamicerror={dynamicerror}
			// 				{...{ register, errors }}
			// 			/>
			// 		);
			// 	},
			// },
			// {
			// 	accessorKey: 'batch_remarks',
			// 	header: 'Remarks',
			// 	enableColumnFilter: false,
			// 	enableSorting: false,
			// 	width: 'w-44',
			// 	cell: (info) => (
			// 		<Textarea
			// 			label={`batch_entry[${info.row.index}].batch_remarks`}
			// 			is_title_needed='false'
			// 			height='h-8'
			// 			{...{ register, errors }}
			// 		/>
			// 	),
			// },
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
						register,
						errors,
						control,
						getValues,
						Controller,
						isUpdate,
					}}
				/>

				<ReactTable data={BatchEntryField} columns={columns} />

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
		</div>
	);
}
