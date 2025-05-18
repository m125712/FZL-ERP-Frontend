import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useDeliveryReturnQuantity } from '@/state/Delivery';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import {
	BatchType,
	CustomLink,
	DateTime,
	EditDelete,
	LinkWithCopy,
	StatusSelect,
	Transfer,
} from '@/ui';

import { cn } from '@/lib/utils';
import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));

export default function Index() {
	const options = [
		{ value: 'all', label: 'All' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'completed', label: 'Completed' },
	];
	const [status, setStatus] = useState('pending');
	const { data, url, deleteData, isLoading, invalidateQuery } =
		useDeliveryReturnQuantity();

	const info = new PageInfo(
		'Quantity Return',
		url,
		'delivery__quantity_return'
	);
	const haveAccess = useAccess('delivery__quantity_return');
	const navigate = useNavigate();

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'Order ID',
				width: 'w-32',
				enableSorting: true,
				cell: (info) => {
					const { order_number, order_info_uuid, is_zipper } =
						info.row.original;
					return is_zipper ? (
						<LinkWithCopy
							title={info.getValue()}
							id={order_number}
							uri='/order/details'
						/>
					) : (
						<LinkWithCopy
							title={info.getValue()}
							id={order_info_uuid}
							uri='/thread/order-info'
						/>
					);
				},
			},
			{
				accessorKey: 'challan_number',
				header: 'Challan ID',
				width: 'w-40',
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/delivery/challan/${uuid}`}
							openInNewTab
						/>
					);
				},
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: true,
				enableSorting: true,
				cell: (info) => {
					const { order_description_uuid, order_number } =
						info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={order_description_uuid}
							uri={`/order/details/${order_number}`}
						/>
					);
				},
			},
			{
				accessorKey: 'size',
				header: 'Size',
				enableColumnFilter: true,
				enableSorting: true,
				cell: (info) => (info.getValue() ? info.getValue() : '---'),
			},
			{
				accessorKey: 'count_length_name',
				header: 'Count Length',
				enableColumnFilter: true,
				enableSorting: true,
				cell: (info) => (info.getValue() ? info.getValue() : '---'),
			},
			{
				accessorKey: 'length',
				header: 'Length',
				enableColumnFilter: true,
				enableSorting: true,
				cell: (info) => (info.getValue() ? info.getValue() : '---'),
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
				accessorKey: 'quantity',
				header: 'Quantity',
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				accessorKey: 'fresh_quantity',
				header: 'Fresh QTY',
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				accessorKey: 'repair_quantity',
				header: 'Repair QTY',
				enableColumnFilter: true,
				enableSorting: true,
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// * created_at
			{
				accessorKey: 'created_at',
				header: 'Created at',
				width: 'w-24',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			// * updated_at
			{
				accessorKey: 'updated_at',
				header: 'Updated at',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			// * remarks
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// * actions
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden:
					!haveAccess.includes('update') ||
					!haveAccess.includes('delete'),
				width: 'w-24',
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						handelDelete={handelDelete}
						showUpdate={haveAccess.includes('update')}
						showDelete={haveAccess.includes('delete')}
					/>
				),
			},
		],
		[data, status]
	);

	// Add
	const handelAdd = () => navigate('/delivery/quantity-return/entry');

	const [update, setUpdate] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdate((prev) => ({
			uuid: data[idx].uuid,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			itemId: data[idx].uuid,
			itemName: data[idx].order_number,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				handelAdd={handelAdd}
				title={info.getTitle()}
				data={data}
				columns={columns}
				accessor={haveAccess.includes('create')}
				extraButton={
					<StatusSelect
						options={options}
						status={status}
						setStatus={setStatus}
					/>
				}
			/>
			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					update={update}
					setUpdate={setUpdate}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					url={url}
					deleteData={deleteData}
					invalidateQueryArray={[invalidateQuery]}
				/>
			</Suspense>
		</div>
	);
}
