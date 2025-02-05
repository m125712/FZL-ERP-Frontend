import { Suspense, useEffect, useMemo, useState } from 'react';
import {
	useThreadChallan,
	useThreadChallanDetailsByUUID,
	useThreadOrderDetailsForChallanByUUID,
} from '@/state/Thread';
import { useAuth } from '@context/auth';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useAccess, useRHF } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { ShowLocalToast } from '@/components/Toast';
import { EditDelete, Input, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	NUMBER,
	NUMBER_DOUBLE,
	STRING,
	THREAD_CHALLAN_NULL,
	THREAD_CHALLAN_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

import columns from './columns';
import Header from './Header';

const haveAccess = useAccess('delivery__challan');

// UPDATE IS WORKING
export default function Index() {
	const { challan_uuid } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const isUpdate = challan_uuid !== undefined;
	const { invalidateQuery: invalidateThreadChallan } = useThreadChallan();

	// * if can_trx_quty exist koray taholay etar
	const SCHEMA = {
		...THREAD_CHALLAN_SCHEMA,
		batch_entry: yup.array().of(
			yup.object().shape({
				quantity: NUMBER.nullable()
					.test('required', 'Must be greater than 0', (value) => {
						if (value === 0) {
							return false;
						}
						return true;
					})
					.transform((value, originalValue) =>
						String(originalValue).trim() === '' ? null : value
					)
					.max(yup.ref('max_quantity'), 'Beyond Max Quantity'),
				short_quantity: NUMBER_DOUBLE.default(0)
					.nullable()
					.transform((value, originalValue) =>
						String(originalValue).trim() === '' ? 0 : value
					)
					.max(yup.ref('quantity'), 'Beyond Max Quantity'),
				reject_quantity: NUMBER_DOUBLE.default(0)
					.nullable()
					.transform((value, originalValue) =>
						String(originalValue).trim() === '' ? 0 : value
					)
					.max(yup.ref('quantity'), 'Beyond Max Quantity'),
				batch_remarks: STRING.nullable(),
			})
		),
		new_batch_entry: yup.array().of(
			yup.object().shape({
				quantity: NUMBER.nullable()
					.test('required', 'Must be greater than 0', (value) => {
						if (value === 0) {
							return false;
						}
						return true;
					})
					.transform((value, originalValue) =>
						String(originalValue).trim() === '' ? null : value
					)
					.max(yup.ref('max_quantity'), 'Beyond Max Quantity'),
				short_quantity: NUMBER_DOUBLE.default(0)
					.nullable()
					.transform((value, originalValue) =>
						String(originalValue).trim() === '' ? 0 : value
					)
					.max(yup.ref('quantity'), 'Beyond Max Quantity'),
				reject_quantity: NUMBER_DOUBLE.default(0)
					.nullable()
					.transform((value, originalValue) =>
						String(originalValue).trim() === '' ? 0 : value
					)
					.max(yup.ref('quantity'), 'Beyond Max Quantity'),
				batch_remarks: STRING.nullable(),
			})
		),
	};

	const SCHEMA_NULL = {
		...THREAD_CHALLAN_NULL,
		batch_entry: [
			{
				quantity: null,
				short_quantity: null,
				reject_quantity: null,
				remarks: '',
			},
		],
		new_batch_entry: [
			{
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

	const { fields: NewBatchEntryField } = useFieldArray({
		control,
		name: 'new_batch_entry',
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

			// * updating existing batch entry
			const batch_entry_updated = [...data?.batch_entry]
				.filter((item) => item.quantity > 0)
				.map((item) => ({
					...item,
					uuid: item.uuid,
					remarks: item.batch_remarks,
				}));

			// * add new_batch_entry on update
			const new_batch_entry_updated = [...data?.new_batch_entry]
				.filter((item) => item.quantity > 0)
				.map((item) => ({
					...item,
					uuid: item.uuid,
					remarks: item.batch_remarks,
				}));

			await updateData.mutateAsync({
				url: `/thread/challan/${batch_data_updated?.uuid}`,
				updatedData: batch_data_updated,
				isOnCloseNeeded: false,
			});

			let batch_entry_updated_promises = [
				...batch_entry_updated.map(async (item) => {
					await updateData.mutateAsync({
						url: `/thread/challan-entry/${item.uuid}`,
						updatedData: {
							...item,
							updated_at: GetDateTime(),
						},
						isOnCloseNeeded: false,
					});
				}),
			];

			let new_batch_entry_updated_promises = [
				...new_batch_entry_updated.map(async (item) => {
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

			try {
				await Promise.all([
					...batch_entry_updated_promises,
					...new_batch_entry_updated_promises,
				])
					.then(() => reset(Object.assign({}, THREAD_CHALLAN_NULL)))
					.then(() => {
						invalidateThreadChallan();
						navigate(`/thread/challan/${batch_data_updated?.uuid}`);
					});
			} catch (err) {
				console.error(`Error with Promise.all: ${err}`);
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
			.filter((item) => item.quantity > 0)
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
				.then(() => {
					invalidateThreadChallan();
					navigate(`/thread/challan/${challan_data.uuid}`);
				})
				.catch((err) => console.log(err));

			return;
		}
		return;
	};

	// Check if order_number is valid
	if (getValues('quantity') === null) return <Navigate to='/not-found' />;

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

	const currentColumn = columns({
		setValue,
		BatchEntryField,
		NewBatchEntryField,
		register,
		errors,
		handelDelete,
	});

	const newColumn = columns({
		setValue,
		BatchEntryField,
		NewBatchEntryField,
		register,
		errors,
		is_new: true,
	});

	return (
		<div>
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
						getValues,
						Controller,
						isUpdate,
						setValue,
						watch,
					}}
				/>

				<div className='flex flex-col gap-8'>
					<ReactTable
						title={isUpdate ? 'Current Entries' : 'Entries'}
						data={BatchEntryField}
						columns={currentColumn}
					/>
					{isUpdate && (
						<ReactTable
							title='New Entries'
							data={NewBatchEntryField}
							columns={newColumn}
						/>
					)}
				</div>
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
