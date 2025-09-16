import { Suspense, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useCommercialPIByQuery } from '@/state/Commercial';
import { useNavigate } from 'react-router';
import { useAccess } from '@/hooks';

import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { CustomLink, DateTime, EditDelete, StatusSelect } from '@/ui';

import { cn } from '@/lib/utils';
import PageInfo from '@/util/PageInfo';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_all_orders')) {
		return `?is_cash=false`;
	}

	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `?is_cash=false&own_uuid=${userUUID}`;
	}

	return `?is_cash=false`;
};

export default function Index() {
	const [status, setStatus] = useState('pending');
	const options = [
		{ value: 'all', label: 'All' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'completed', label: 'Completed' },
	];

	const navigate = useNavigate();
	const haveAccess = useAccess('commercial__pi');
	const { user } = useAuth();

	const { data, isLoading, url, deleteData } = useCommercialPIByQuery(
		getPath(haveAccess, user?.uuid) + `&type=${status}`,
		{
			enabled: !!user?.uuid,
		}
	);

	const info = new PageInfo('PI', url, 'commercial__pi');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
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
						showDelete={haveAccess.includes('delete')}
						showUpdate={haveAccess.includes('update')}
					/>
				),
			},
			{
				accessorKey: 'id',
				header: 'PI ID',
				enableColumnFilter: true,
				width: 'w-36',
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/commercial/pi/${info.getValue()}`}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorFn: (row) => row?.lc_number || '--',
				id: 'lc_number',
				header: 'LC Number',
				enableColumnFilter: false,
				cell: (info) => {
					const { lc_uuid } = info.row.original;

					return (
						<CustomLink
							label={
								info.getValue() === '--'
									? null
									: info.getValue()
							}
							url={`/commercial/lc/details/${lc_uuid}`}
						/>
					);
				},
			},
			{
				accessorFn: (row) => {
					const { order_numbers, thread_order_numbers } = row;
					const zipper =
						order_numbers
							?.map((order) => order?.order_number)
							?.join(', ') || '';
					const thread =
						thread_order_numbers
							?.map((order) => order?.thread_order_number)
							?.join(', ') || '';

					if (zipper?.length > 0 && thread?.length > 0)
						return `${zipper}, ${thread}`;

					if (zipper?.length > 0) return zipper;

					if (thread?.length > 0) return thread;

					return '--';
				},
				id: 'order_numbers',
				header: 'O/N & Status',
				enableColumnFilter: false,
				cell: (info) => {
					const { order_numbers, thread_order_numbers } =
						info.row.original;

					let links = [];

					order_numbers
						?.filter((order) => order.order_info_uuid)
						?.forEach((order) => {
							links.push({
								quantity: order.quantity,
								delivered: order.delivered,
								packing_list: order.packing_list,
								label: order.order_number,
								url: `/order/details/${order.order_number}`,
							});
						});

					thread_order_numbers
						?.filter((order) => order.thread_order_info_uuid)
						?.forEach((order) => {
							links.push({
								quantity: order.quantity,
								delivered: order.delivered,
								packing_list: order.packing_list,
								label: order.thread_order_number,
								url: `/thread/order-info/${order.thread_order_info_uuid}`,
							});
						});

					return (
						<table
							className={cn(
								'table table-xs rounded-md border-2 border-primary/20 align-top'
							)}
						>
							<thead>
								<tr>
									<th>O/N</th>
									<th>P/Q</th>
									<th>D/Q</th>
								</tr>
							</thead>
							<tbody>
								{links?.map((item, index) => {
									const getPercentage = (qty) =>
										Number(
											(qty / item.quantity) * 100 || 0
										).toFixed(1);
									return (
										<tr key={index}>
											<td>
												<CustomLink
													label={item.label}
													url={item.url}
													showCopyButton={false}
													openInNewTab
												/>
											</td>
											<td>
												{getPercentage(
													item.packing_list
												)}
												%
											</td>
											<td>
												{getPercentage(item.delivered)}%
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					);
				},
			},
			{
				accessorFn: (row) => row?.order_type?.join(', ') || '--',
				id: 'order_type',
				header: 'Type',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'total_amount',
				header: (
					<>
						Total Value <br />
						(USD)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
				accessorKey: 'merchandiser_name',
				header: 'Merchandiser',
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
				accessorKey: 'bank_name',
				header: 'Bank',
				enableColumnFilter: false,
				width: 'w-32',
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
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
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
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	const handelAdd = () => navigate('/commercial/pi/entry');

	const handelUpdate = (idx) => {
		const uuid = data[idx]?.uuid;
		window.open(`/commercial/pi/${uuid}/update`, '_blank');
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
			itemName: data[idx].id,
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
				accessor={haveAccess.includes('create')}
				handelAdd={handelAdd}
				extraButton={
					<StatusSelect
						options={options}
						status={status}
						setStatus={setStatus}
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
						url: '/commercial/pi-cash',
						deleteData,
					}}
					// invalidateQuery={invalidateQuery}
				/>
			</Suspense>
		</div>
	);
}
