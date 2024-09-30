import { lazy, useMemo, useState } from 'react';
import { useThreadOrderInfo } from '@/state/Thread';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete, LinkOnly, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, url, deleteData } = useThreadOrderInfo();
	const navigate = useNavigate();
	const haveAccess = useAccess('thread__order_info_details');
	const info = new PageInfo('Order Info', url, 'thread__order_info_details');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'is_sample',
				header: 'Sample/Bill/Cash',
				enableColumnFilter: false,
				cell: (info) => {
					const { is_sample, is_bill, is_cash } = info.row.original;
					return (
						<div className='flex space-x-1'>
							<StatusButton size='btn-xs' value={is_sample} />
							<StatusButton size='btn-xs' value={is_bill} />
							<StatusButton size='btn-xs' value={is_cash} />
						</div>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'ID',
				width: 'w-40',
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<LinkOnly
							uri='/thread/order-info'
							id={uuid}
							title={info.getValue()}
						/>
					);
				},
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'factory_name',
				header: 'Factory',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'merchandiser_name',
				header: 'Merchandiser',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'swatch_status',
				header: 'Swatch Approved',
				enableColumnFilter: false,
				cell: (info) => {
					const { order_entry_count, swatch_approval_count } =
						info.row.original;
					return `${swatch_approval_count} / ${order_entry_count}`;
				},
			},
			{
				accessorKey: 'is_swatches_approved',
				header: 'Status',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<div className='flex space-x-1'>
							<StatusButton
								size='btn-xs'
								value={info.getValue()}
							/>
						</div>
					);
				},
			},
			{
				accessorKey: 'delivery_date',
				header: 'Delivery Date',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'created_by_name',
				header: 'Issued By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				width: 'w-20',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
				width: 'max-w-40',
			},
			{
				accessorKey: 'action',
				header: 'Action',
				enableColumnFilter: false,
				hidden:
					!haveAccess.includes('update') &&
					!haveAccess.includes('delete'),
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							showDelete={haveAccess.includes('delete')}
							showUpdate={haveAccess.includes('update')}
						/>
					);
				},
			},
		],
		[data]
	);

	// Add
	const handelAdd = () => navigate('/thread/order-info/entry');

	const handelUpdate = (idx) => {
		const { uuid } = data[idx];
		navigate(`/thread/order-info/${uuid}/update`);
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
			itemName: data[idx].uuid,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
			/>

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
		</>
	);
}
