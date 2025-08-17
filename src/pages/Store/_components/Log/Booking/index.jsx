import { lazy, useMemo, useState } from 'react';
import { useMaterialBooking, useMaterialInfo } from '@/state/Store';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete, SimpleDatePicker, Transfer } from '@/ui';

import PageInfo from '@/util/PageInfo';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));
const AgainstOrderTransfer = lazy(() => import('./AgainstOrderTransfer'));
const MaterialTrx = lazy(() => import('./MaterialTrx'));

export default function Index({ type, accessor }) {
	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());
	const { data, isLoading, deleteData } = useMaterialBooking(
		type,
		format(date, 'yyyy-MM-dd'),
		format(toDate, 'yyyy-MM-dd')
	);
	const { invalidateQuery: invalidateMaterialInfo } = useMaterialInfo();

	const info = new PageInfo(
		`Store (${type.toUpperCase()}) / Booking`,
		`/store-${type}/log`
	);

	const haveAccess = useAccess(accessor);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'trx_quantity',
				header: 'Transaction QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'action_trx',
				header: 'Material Trx',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: haveAccess.includes('click_action'),
				width: 'w-24',
				cell: (info) => (
					<Transfer onClick={() => handleTrx(info.row.index)} />
				),
			},
			{
				accessorKey: 'action_trx_against_order',
				header: 'Trx Against Order',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: haveAccess.includes('click_trx_against_order'),
				width: 'w-32',
				cell: (info) => (
					<Transfer
						onClick={() => handleTrxAgainstOrder(info.row.index)}
					/>
				),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update_log_against_order'),
				width: 'w-24',
				cell: (info) => {
					const { trx_quantity } = info.row.original;
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showUpdate={haveAccess.includes('update_booking')}
							showDelete={
								haveAccess.includes('delete_booking') &&
								!trx_quantity > 0
							}
						/>
					);
				},
			},
		],
		[data]
	);

	// Update
	const [updateMaterialDetails, setUpdateMaterialDetails] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateMaterialDetails((prev) => ({
			...prev,
			...data[idx],
			uuid: data[idx]?.uuid,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	const handleTrx = (idx) => {
		setUpdateMaterialDetails((prev) => ({
			...prev,
			...data[idx],
			uuid: data[idx].uuid,
			stock: data[idx].stock,
			name: data[idx].material_name,
		}));
		window['MaterialTrx'].showModal();
	};

	const handleTrxAgainstOrder = (idx) => {
		setUpdateMaterialDetails((prev) => ({
			...prev,
			...data[idx],
			uuid: data[idx].uuid,
			stock: data[idx].stock,
			name: data[idx].material_name,
		}));
		window['MaterialTrxAgainstOrder'].showModal();
	};

	// Delete
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: data[idx].uuid,
			itemName: data[idx].material_name
				.replace(/#/g, '')
				.replace(/\//g, '-'),
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				showDateRange={false}
				extraButton={
					<div className='flex items-center gap-2'>
						<SimpleDatePicker
							className='h-[2.34rem] w-32'
							key={'Date'}
							value={date}
							placeholder='Date'
							onChange={(data) => {
								setDate(data);
							}}
							selected={date}
						/>
						<SimpleDatePicker
							className='h-[2.34rem] w-32'
							key={'toDate'}
							value={toDate}
							placeholder='To'
							onChange={(data) => {
								setToDate(data);
							}}
							selected={toDate}
						/>
					</div>
				}
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateMaterialDetails,
						setUpdateMaterialDetails,
					}}
				/>
				<MaterialTrx
					modalId={'MaterialTrx'}
					updateMaterialDetails={updateMaterialDetails}
					setUpdateMaterialDetails={setUpdateMaterialDetails}
				/>
				<AgainstOrderTransfer
					modalId={'MaterialTrxAgainstOrder'}
					updateMaterialDetails={updateMaterialDetails}
					setUpdateMaterialDetails={setUpdateMaterialDetails}
				/>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url: '/material/booking',
						deleteData,
					}}
					invalidateQuery={invalidateMaterialInfo}
				/>
			</Suspense>
		</div>
	);
}
