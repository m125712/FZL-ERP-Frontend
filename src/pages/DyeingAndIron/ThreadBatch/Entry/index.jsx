import { DeleteModal, ProceedModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import {
	useFetch,
	useFetchForRhfResetForOrder,
	useFetchForRhfResetForPlanning,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useDyeingThreadBatch } from '@/state/Dyeing';
import {
	CheckBoxWithoutLabel,
	DynamicDeliveryField,
	Input,
	Textarea,
} from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import {
	DYEING_THREAD_BATCH_NULL,
	DYEING_THREAD_BATCH_SCHEMA,
	NUMBER,
	STRING,
} from '@util/Schema';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import Header from './Header';

// UPDATE IS WORKING
export default function Index() {
	const {
		data,
		url,
		updateData,
		postData,
		deleteData,
		isLoading,
		invalidateQuery: invalidateDyeingThreadBatch,
	} = useDyeingThreadBatch();
	const { batch_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [isAllChecked, setIsAllChecked] = useState(false);
	const [isSomeChecked, setIsSomeChecked] = useState(false);
	const isUpdate = batch_uuid !== undefined;
	const [orderInfoIds, setOrderInfoIds] = useState({});
	const [proceed, setProceed] = useState(false);
	const [batchData, setBatchData] = useState(null);
	const [batchEntry, setBatchEntry] = useState(null);

	// * if can_trx_quty exist koray taholay etar
	const SCHEMA = {
		...DYEING_THREAD_BATCH_SCHEMA,
		batch_entry: yup.array().of(
			yup.object().shape({
				quantity: NUMBER.nullable() // Allows the field to be null
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
	const { fields: BatchEntryField } = useFieldArray({
		control,
		name: 'batch_entry',
	});

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const onClose = () => reset(DYEING_THREAD_BATCH_NULL);

	// * Fetch initial data
	isUpdate
		? useFetchForRhfResetForOrder(
				`/thread/batch-details/by/${batch_uuid}`,
				batch_uuid,
				reset
			)
		: useFetchForRhfResetForPlanning(`/thread/order-batch`, reset);

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
	//console.log(getValues());
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
				alert('Select at least one item to proceed.');
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
					.then(() =>
						reset(Object.assign({}, DYEING_THREAD_BATCH_NULL))
					)
					.then(() => invalidateDyeingThreadBatch())
					.then(
						navigate(
							`/dyeing-and-iron/thread-batch/details/${batch_uuid}`
						)
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
		setBatchData(batch_data); // * use for modal
		setBatchEntry(batch_entry); // * use for modal

		if (batch_entry.length === 0) {
			alert('Select at least one item to proceed.');
		} else {
			if (
				// * check if all colors are same
				!batch_entry.every(
					(item) =>
						item.shade_recipe_uuid ===
						batch_entry[0].shade_recipe_uuid
				)
			) {
				window['proceed_modal'].showModal(); // * if not then show modal
			} else if (
				!batch_entry.every(
					(item) => item.bleaching === batch_entry[0].bleaching
				)
			) {
				window['proceed_modal_2'].showModal();
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
					.then(() => invalidateDyeingThreadBatch())
					.then(
						navigate(
							`/dyeing-and-iron/thread-batch/details/${batch_data.uuid}`
						)
					)
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
				.then(() => invalidateDyeingThreadBatch())
				.then(
					navigate(
						`/dyeing-and-iron/thread-batch/details/${batchData.uuid}`
					)
				)
				.catch((err) => console.log(err));

			return;
		};

		if (proceed) proceedSubmit();
	}, [proceed]);

	// Check if order_number is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;
	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';

	useEffect(() => {
		if (isAllChecked || isSomeChecked) {
			return BatchEntryField.forEach((item, index) => {
				setValue(`batch_entry[${index}].is_checked`, true);
			});
		}
		if (!isAllChecked) {
			return BatchEntryField.forEach((item, index) => {
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
				accessorKey: 'shade_recipe_name',
				header: 'Shade Recipe',
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
				accessorKey: 'count_length',
				header: 'Count Length',
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				accessorKey: 'bleaching',
				header: 'Bleaching',
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				accessorKey: 'po',
				header: 'PO',
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
			{
				accessorKey: 'balance_quantity',
				header: 'Balance',
				enableColumnFilter: true,
				enableSorting: true,
				cell: (info) => Number(info.getValue()),
			},
			{
				accessorKey: 'quantity',
				header: 'QTY',
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => {
					const idx = info.row.index;
					const dynamicerror = errors?.batch_entry?.[idx]?.quantity;
					return (
						<Input
							label={`batch_entry[${info.row.index}].quantity`}
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

				<ReactTable
					data={BatchEntryField}
					columns={columns}
					extraClass='py-2'
				/>

				<div className='modal-action'>
					<button
						className='text-md btn btn-primary btn-block'
						onClick={() => setProceed(true)}>
						Save
					</button>
				</div>
			</form>

			<Suspense>
				<ProceedModal
					text='Shade'
					modalId={'proceed_modal'}
					setProceed={setProceed}
				/>
			</Suspense>
			<Suspense>
				<ProceedModal
					text='bleach'
					modalId={'proceed_modal_2'}
					setProceed={setProceed}
				/>
			</Suspense>
			<DevTool control={control} placement='top-left' />
		</div>
	);
}
