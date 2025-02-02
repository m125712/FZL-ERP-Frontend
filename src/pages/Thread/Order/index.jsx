import { lazy, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useThreadOrderInfoByQuery } from '@/state/Thread';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import {
	CustomLink,
	DateTime,
	EditDelete,
	LinkOnly,
	StatusButton,
	StatusSelect,
} from '@/ui';

import PageInfo from '@/util/PageInfo';

const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_all_orders')) {
		return `?all=true`;
	}
	if (
		haveAccess.includes('show_approved_orders') &&
		haveAccess.includes('show_own_orders') &&
		userUUID
	) {
		return `?own_uuid=${userUUID}&approved=true`;
	}

	if (haveAccess.includes('show_approved_orders')) {
		return '?all=false&approved=true';
	}

	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `?own_uuid=${userUUID}`;
	}

	return `?all=false`;
};

export default function Index() {
	const [status, setStatus] = useState('all');
	// * options for extra select in table
	const options = [
		{ value: 'bulk', label: 'Bulk' },
		{ value: 'sample', label: 'Sample' },
		{ value: 'all', label: 'All' },
	];

	const navigate = useNavigate();
	const haveAccess = useAccess('thread__order_info_details');
	const { user } = useAuth();

	const { data, isLoading, url, deleteData } = useThreadOrderInfoByQuery(
		getPath(haveAccess, user?.uuid) + `&type=${status}`,
		{
			enabled: !!user?.uuid,
		}
	);

	const info = new PageInfo('Order Info', url, 'thread__order_info_details');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'is_sample',
				header: () =>
					haveAccess.includes('show_cash_bill_lc')
						? 'Sample/Bill/Cash'
						: 'Sample',
				enableColumnFilter: false,
				width: 'w-28',
				cell: (info) => {
					const { is_sample, is_bill, is_cash } = info.row.original;
					return (
						<div className='flex gap-6'>
							<StatusButton size='btn-xs' value={is_sample} />
							{haveAccess.includes('show_cash_bill_lc') && (
								<>
									<StatusButton
										size='btn-xs'
										value={is_bill}
									/>
									<StatusButton
										size='btn-xs'
										value={is_cash}
									/>
								</>
							)}
						</div>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/thread/order-info/${uuid}`}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'factory_name',
				header: 'Factory',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'merchandiser_name',
				header: 'Merchandiser',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					`${row.swatch_approval_count || 0}/${row.order_entry_count || 0}`,
				id: 'swatch_status',
				header: 'Swatch',
				enableColumnFilter: false,
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
				accessorFn: (row) =>
					`${row.price_approval_count || 0}/${row.order_entry_count || 0}`,
				id: 'price_approval_count',
				header: 'Price App',
				enableColumnFilter: false,
			},
			{
				accessorFn: (row) => (row.is_bleached ? 'Yes' : 'No'),
				id: 'is_bleached',
				header: 'Bleached',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<div className='flex space-x-1'>
							<StatusButton
								size='btn-xs'
								value={info.getValue() === 'Yes' ? 1 : 0}
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
				header: 'Created By',
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
				extraButton={
					<StatusSelect
						status={status}
						setStatus={setStatus}
						options={options}
					/>
				}
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
