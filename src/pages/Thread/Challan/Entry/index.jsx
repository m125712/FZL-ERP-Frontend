import { Suspense, useEffect, useMemo, useState } from 'react';
import {
	useThreadChallan,
	useThreadChallanDetailsByUUID,
	useThreadOrderDetailsForChallanByUUID,
} from '@/state/Thread';
import { useAuth } from '@context/auth';
import { DevTool } from '@hookform/devtools';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useAccess, useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { ShowLocalToast } from '@/components/Toast';
import { CheckBoxWithoutLabel, EditDelete, Input, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	BOOLEAN,
	NUMBER,
	NUMBER_DOUBLE,
	STRING,
	THREAD_CHALLAN_NULL,
	THREAD_CHALLAN_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';
import { BOOLEAN_DEFAULT_VALUE } from '@/util/Schema/utils';

import Header from './Header';

const haveAccess = useAccess('delivery__challan');

// UPDATE IS WORKING
export default function Index() {
	const { challan_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [isAllChecked, setIsAllChecked] = useState(false);
	const [isSomeChecked, setIsSomeChecked] = useState(false);
	const isUpdate = challan_uuid !== undefined;
	const { invalidateQuery: invalidateThreadChallan } = useThreadChallan();

	// * if can_trx_quty exist koray taholay etar
	const SCHEMA = {
		...THREAD_CHALLAN_SCHEMA,
		batch_entry: yup.array().of(
			yup.object().shape({
				is_checked: BOOLEAN.default(false),
				quantity: NUMBER.when('is_checked', {
					is: true,
					then: (schema) => schema.required('Required'),
					otherwise: (schema) => schema.nullable(),
				})
					.transform((value, originalValue) =>
						String(originalValue).trim() === '' ? null : value
					)
					.max(
						yup.ref('balance_quantity'),
						'Beyond Balance Quantity'
					),
				short_quantity: NUMBER_DOUBLE.default(0).transform(
					(value, originalValue) =>
						String(originalValue).trim() === '' ? 0 : value
				),
				reject_quantity: NUMBER_DOUBLE.default(0).transform(
					(value, originalValue) =>
						String(originalValue).trim() === '' ? 0 : value
				),
				batch_remarks: STRING.nullable(),
			})
		),
	};

	const SCHEMA_NULL = {
		...THREAD_CHALLAN_NULL,
		batch_entry: [
			{
				is_checked: false,
				quantity: null,
				short_quantity: null,
				reject_quantity: null,
				remarks: '',
			},
		],
	};
	const haveAccess = useAccess('thread__challan_update');
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
	} = useRHF(SCHEMA, SCHEMA_NULL); // TODO: need to fix the form validation for quantity

	// entry
	const { fields: BatchEntryField } = useFieldArray({
		control,
		name: 'batch_entry',
	});

	// * Fetch initial data

	// * get data if isUpdate
	const { data: udata, invalidateQuery: invalidateUpdate } =
		useThreadChallanDetailsByUUID(
			challan_uuid ? challan_uuid + '?is_update=true' : null
		);

	// * reset data if isUpdate
	useEffect(() => {
		if (udata && isUpdate) {
			reset(udata);
		}
	}, [udata]);

	// * get data if not isUpdate
	const { data, postData, updateData, deleteData } =
		useThreadOrderDetailsForChallanByUUID(
			isUpdate
				? null
				: watch('order_info_uuid')
					? watch('order_info_uuid')
					: null
		);

	// * reset data if not isUpdate
	useEffect(() => {
		if (data && !isUpdate) {
			setValue('batch_entry', data?.batch_entry);
		}
	}, [data]);

	const onSubmit = async (data) => {
		// * Update
		if (isUpdate) {
			const batch_data_updated = {
				...data,
				received: data.received ? 1 : 0,
				gate_pass: data.gate_pass ? 1 : 0,
				updated_at: GetDateTime(),
			};

			const batch_entry_updated = [...data?.batch_entry]
				.filter((item) => item.is_checked)
				.map((item) => ({
					...item,
					uuid: item.uuid,
					remarks: item.batch_remarks,
				}));

			if (batch_entry_updated.length === 0) {
				ShowLocalToast({
					type: 'warning',
					message: 'Select at least one item to proceed.',
				});
			} else {
				await updateData.mutateAsync({
					url: `/thread/challan/${batch_data_updated?.uuid}`,
					updatedData: batch_data_updated,
					isOnCloseNeeded: false,
				});

				let batch_entry_updated_promises = [
					...batch_entry_updated.map(async (item) => {
						if (item.uuid)
							await updateData.mutateAsync({
								url: `/thread/challan-entry/${item.uuid}`,
								updatedData: {
									...item,
									updated_at: GetDateTime(),
								},
								isOnCloseNeeded: false,
							});
						else
							await postData.mutateAsync({
								url: `/thread/challan-entry`,
								newData: {
									...item,
									uuid: nanoid(),
									challan_uuid: batch_data_updated?.uuid,
									created_at: GetDateTime(),
								},
								isOnCloseNeeded: false,
							});
					}),
				];

				await Promise.all(batch_entry_updated_promises).then(() =>
					reset(Object.assign({}, THREAD_CHALLAN_NULL))
				);
				// .then(() => invalidateDyeingThreadBatch())
				// .then(
				invalidateThreadChallan();
				navigate(`/thread/challan/${batch_data_updated?.uuid}`)
					// )
					.catch((err) => console.log(err));
			}

			return;
		}

		// * ADD data
		const created_at = GetDateTime();
		const challan_data = {
			...data,
			received: data.received ? 1 : 0,
			gate_pass: data.gate_pass ? 1 : 0,
			uuid: nanoid(),
			created_at,
			created_by: user.uuid,
		};

		const batch_entry = [...data?.batch_entry]
			.filter((item) => item.is_checked)
			.map((item) => ({
				...item,
				uuid: nanoid(),
				challan_uuid: challan_data.uuid,
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
				url: '/thread/challan',
				newData: challan_data,
				isOnCloseNeeded: false,
			});

			let promises = [
				...batch_entry.map(
					async (item) =>
						await postData.mutateAsync({
							url: '/thread/challan-entry',
							newData: item,
							isOnCloseNeeded: false,
						})
				),
			];

			await Promise.all(promises)
				.then(() => reset(Object.assign({}, THREAD_CHALLAN_NULL)))
				.then(navigate(`/thread/challan/${challan_data.uuid}`))
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
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'warehouse',
				header: 'Warehouse',
				enableColumnFilter: true,
				enableSorting: true,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'balance_quantity',
				header: 'Balance QTY',
				enableColumnFilter: true,
				enableSorting: true,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity',
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
				accessorKey: 'short_quantity',
				header: 'Short QTY',
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => {
					const idx = info.row.index;
					const dynamicerror =
						errors?.batch_entry?.[idx]?.short_quantity;
					return (
						<Input
							label={`batch_entry[${info.row.index}].short_quantity`}
							is_title_needed='false'
							height='h-8'
							dynamicerror={dynamicerror}
							{...{ register, errors }}
						/>
					);
				},
			},
			{
				accessorKey: 'reject_quantity',
				header: 'Reject QTY',
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => {
					const idx = info.row.index;
					const dynamicerror =
						errors?.batch_entry?.[idx]?.reject_quantity;
					return (
						<Input
							label={`batch_entry[${info.row.index}].reject_quantity`}
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
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('delete'),
				width: 'w-24',
				cell: (info) => (
					<EditDelete
						idx={info.row.original}
						handelDelete={handelDelete}
						showDelete={haveAccess.includes('delete')}
						showUpdate={false}
					/>
				),
			},
		],
		[isAllChecked, isSomeChecked, BatchEntryField, register, errors]
	);

	// Delete
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});
	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: idx.uuid,
			itemName: idx.order_number,
		}));

		window['deleteModal Challan Entry'].showModal();
	};

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
						setValue,
						watch,
					}}
				/>

				<ReactTable data={BatchEntryField} columns={columns} />

				<div className='modal-action'>
					<button className='text-md btn btn-primary btn-block'>
						Save
					</button>
				</div>
			</form>

			<DevTool control={control} placement='top-left' />

			<Suspense>
				<DeleteModal
					modalId={'deleteModal Challan Entry'}
					title={deleteItem?.itemName}
					{...{
						deleteItem,
						setDeleteItem,
						url: '/thread/challan-entry',
						deleteData,
					}}
					invalidateQuery={invalidateUpdate}
				/>
			</Suspense>
		</div>
	);
}
