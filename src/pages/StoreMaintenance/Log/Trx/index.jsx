import { lazy, useMemo, useState } from 'react';
import { useMaterialTrx } from '@/state/Store';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete, SimpleDatePicker } from '@/ui';

import PageInfo from '@/util/PageInfo';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());
	const { data, isLoading, url, deleteData } = useMaterialTrx(
		'maintenance',
		format(date, 'yyyy-MM-dd'),
		format(toDate, 'yyyy-MM-dd')
	);
	const info = new PageInfo('Store (Maintenance) / Transfer', url);
	const haveAccessRm = useAccess('store_maintenance__log');
	const haveAccessAccessor = useAccess('store_maintenance__log');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Name',
				enableColumnFilter: false,
				width: 'w-20',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => {
					return row?.trx_to
						.replace(/_/g, ' ')
						.replace(/^\w/, (c) => c.toUpperCase());
				},
				id: 'trx_to',
				header: 'Section',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'trx_quantity',
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
				hidden: !(
					haveAccessRm?.includes('update_log') ||
					haveAccessAccessor?.includes('update_log') ||
					haveAccessRm?.includes('delete_log') ||
					haveAccessAccessor?.includes('delete_log')
				),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showUpdate={
								haveAccessRm?.includes('update_log') ||
								haveAccessAccessor?.includes('update_log')
							}
							showDelete={
								haveAccessRm?.includes('delete_log') ||
								haveAccessAccessor?.includes('delete_log')
							}
						/>
					);
				},
			},
		],
		[data]
	);

	// Update
	const [updateMaterialTrx, setUpdateMaterialTrx] = useState({
		uuid: null,
		material_name: null,
		stock: null,
		trx_quantity: null,
	});

	const handelUpdate = (idx) => {
		setUpdateMaterialTrx((prev) => ({
			...prev,
			uuid: data[idx]?.uuid,
			material_name: data[idx]?.material_name
				.replace(/#/g, '')
				.replace(/\//g, '-'),
			stock: data[idx]?.stock,
			trx_quantity: data[idx]?.trx_quantity,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
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
	//invalidateMaterialInfo();

	if (isLoading)
		return (
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				isLoading={isLoading}
			/>
		);

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
						updateMaterialTrx,
						setUpdateMaterialTrx,
					}}
				/>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url: '/material/trx',
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}
