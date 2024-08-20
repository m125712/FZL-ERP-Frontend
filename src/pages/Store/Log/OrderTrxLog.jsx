import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import {
	useMaterialInfo,
	useMaterialStockToSFG,
	useMaterialTrxAgainstOrderDescription,
} from '@/state/Store';

import { DateTime, EditDelete } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useMemo, useState } from 'react';

const OrderTrxLogAddOrUpdate = lazy(() => import('./OrderTrxLogAddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, url, deleteData } =
		useMaterialTrxAgainstOrderDescription();
	const { invalidateQuery: invalidateMaterialInfo } = useMaterialInfo();
	const info = new PageInfo('Log Against Order', url);
	const haveAccess = useAccess('store__log');
	console.log(data);
	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'order_number',
				header: 'Order Number',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'style_color_size',
			// 	header: 'Style / Size / Color',
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'trx_to',
				header: 'Section',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>
						{/* replace _ with space */}
						{info.getValue().replace(/_/g, ' ')}
					</span>
				),
			},
			{
				accessorKey: 'trx_quantity',
				header: 'Transferred QTY',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()),
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
				accessorKey: 'remarks',
				header: 'Remarks',
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
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update_log_against_order'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes(
								'delete_log_against_order'
							)}
						/>
					);
				},
			},
		],
		[data]
	);

	// Update
	const [updateMaterialTrxToOrder, setUpdateMaterialTrxToOrder] = useState({
		uuid: null,
		material_name: null,
		trx_quantity: null,
		stock: null,
	});

	const handelUpdate = (idx) => {
		setUpdateMaterialTrxToOrder((prev) => ({
			...prev,
			uuid: data[idx]?.uuid,
			material_name: data[idx]?.material_name
				.replace(/#/g, '')
				.replace(/\//g, '-'),
			trx_quantity: data[idx]?.trx_quantity,
			stock: data[idx]?.stock,
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
	invalidateMaterialInfo();

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='container px-2 md:px-4'>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				extraClass='py-2'
			/>

			<Suspense>
				<OrderTrxLogAddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateMaterialTrxToOrder,
						setUpdateMaterialTrxToOrder,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url,
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}
