import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import { useOrderDetails } from '@/state/Order';
import { DateTime, EditDelete, LinkWithCopy, StatusButton } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const Progress = ({ value }) => {
	let cls = 'progress-error tooltip-error';
	if (value >= 100) cls = 'progress-success tooltip-success';
	else if (value >= 75) cls = 'progress-primary tooltip-primary';
	else if (value >= 50) cls = 'progress-info tooltip-info';
	else if (value >= 25) cls = 'progress-warning tooltip-warning';

	return (
		<div className={`tooltip text-xs ${cls}`} data-tip={value + '%'}>
			<progress
				className={`progress w-20 ${cls}`}
				value={value}
				max='100'
			/>
		</div>
	);
};

export default function Index() {
	const { data, isLoading, isError, url } = useOrderDetails();
	const navigate = useNavigate();
	const info = new PageInfo('Order/Details', url, 'order__details');
	const haveAccess = useAccess('order__details');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				width: 'w-12',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={info.getValue()}
							uri='/order/details'
						/>
					);
				},
			},
			{
				accessorKey: 'order_number_wise_rank',
				header: 'Count',
				enableColumnFilter: false,
				width: 'w-12',
				cell: (info) => {
					const { order_number_wise_count } = info.row.original;
					return `${info.getValue()} / ${order_number_wise_count}`;
				},
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: false,
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
				accessorKey: 'production_percentage',
				header: 'Progress',
				enableColumnFilter: false,
				cell: (info) => <Progress value={info.getValue() || 0} />,
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer',
				width: 'w-20',
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
				header: 'Updated',
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
				accessorKey: 'price_approval_status',
				header: 'Status',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<StatusButton size='btn-sm' value={info.getValue()} />
					);
				},
			},
			{
				accessorKey: 'action',
				header: 'Action',
				enableColumnFilter: false,
				hidden:
					!haveAccess.includes('update') &&
					!haveAccess.includes('delete'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							showEdit={haveAccess.includes('update')}
							showDelete={haveAccess.includes('delete')} // TODO: need to add delete logic
						/>
					);
				},
			},
		],
		[data]
	);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => navigate('/order/entry');

	// Update
	const handelUpdate = (idx) => {
		const { order_description_uuid, order_number } = data[idx];

		navigate(`/order/update/${order_number}/${order_description_uuid}`);
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			title={info.getTitle()}
			accessor={haveAccess.includes('create')}
			data={data}
			columns={columns}
			handelAdd={handelAdd}
		/>
	);
}
