import { useEffect, useMemo } from 'react';
import { useAuth } from '@/context/auth';
import { useCommercialPIByQuery } from '@/state/Commercial';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, EditDelete, LinkWithCopy } from '@/ui';

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
	const navigate = useNavigate();
	const haveAccess = useAccess('commercial__pi');
	const { user } = useAuth();

	const { data, isLoading, url } = useCommercialPIByQuery(
		getPath(haveAccess, user?.uuid),
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
				accessorKey: 'id',
				header: 'PI ID',
				enableColumnFilter: true,
				width: 'w-36',
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.getValue()}
						uri={`/commercial/pi`}
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
							uri={`/commercial/lc/details/${lc_uuid}`}
						/>
					);
				},
			},
			{
				accessorFn: (row) => {
					const { order_numbers, thread_order_numbers } = row;
					const zipper =
						order_numbers
							.map((order) => order.order_number)
							.join(', ') || '';
					const thread =
						thread_order_numbers
							.map((order) => order.thread_order_number)
							.join(', ') || '';

					if (zipper.length > 0 && thread.length > 0)
						return `${zipper}, ${thread}`;

					if (zipper.length > 0) return zipper;

					if (thread.length > 0) return thread;

					return '--';
				},
				id: 'order_numbers',
				header: 'O/N',
				enableColumnFilter: false,
				cell: ({ row }) => {
					const { order_numbers, thread_order_numbers } =
						row.original;

					let links = [];

					order_numbers
						.filter((order) => order.order_info_uuid)
						.forEach((order) => {
							links.push({
								label: order.order_number,
								url: `/order/details/${order.order_number}`,
							});
						});

					thread_order_numbers
						.filter((order) => order.thread_order_info_uuid)
						.forEach((order) => {
							links.push({
								label: order.thread_order_number,
								url: `/thread/order-info/${order.thread_order_info_uuid}`,
							});
						});

					return links.map((link, index) => (
						<CustomLink
							key={index}
							label={link.label}
							url={link.url}
						/>
					));
				},
			},
			{
				accessorFn: (row) => row.order_type.join(', ') || '--',
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
				cell: (info) => info.getValue().toLocaleString(),
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
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						showDelete={false}
					/>
				),
			},
		],
		[data]
	);

	const handelAdd = () => navigate('/commercial/pi/entry');

	const handelUpdate = (idx) => {
		const uuid = data[idx]?.uuid;
		navigate(`/commercial/pi/${uuid}/update`);
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
			/>
		</div>
	);
}
