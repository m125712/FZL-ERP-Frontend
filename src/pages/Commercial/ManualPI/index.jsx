import { useEffect, useMemo } from 'react';
import { useAuth } from '@/context/auth';
import { useCommercialManualPI } from '@/state/Commercial';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, EditDelete } from '@/ui';

import PageInfo from '@/util/PageInfo';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return `all=true`;
};

export default function Index() {
	const navigate = useNavigate();
	const haveAccess = useAccess('commercial__manual_pi');
	const { user } = useAuth();
	const { data, isLoading, url } = useCommercialManualPI(
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);
	const info = new PageInfo('Manual PI', url, 'commercial__manual_pi');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'pi_number',
				header: 'PI ID',
				enableColumnFilter: true,
				width: 'w-36',
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/commercial/manual-pi/${uuid}`}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorKey: 'pi_ids',
				header: 'PI Numbers',
				width: 'w-28',
				enableColumnFilter: false,
				cell: (info) => {
					return info?.getValue()?.map((pi_number) => {
						return (
							<CustomLink
								key={pi_number}
								label={pi_number}
								url={`/commercial/pi/${pi_number}`}
								openInNewTab={true}
							/>
						);
					});
				},
			},
			{
				accessorFn: (row) => {
					const { order_number } = row;
					const orders_number = order_number?.filter(
						(order) => order.order_number
					);
					return orders_number;
				},
				id: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
				cell: ({ row }) => {
					const { order_number } = row.original;
					const links = order_number?.map((order) => {
						if (order.order_number.includes('ST')) {
							return {
								label: order.order_number,
								url: `/order/details/${order.order_number}`,
							};
						} else {
							return {
								label: order.order_number,
								url: `/commercial/order/${order.uuid}`,
							};
						}
					});

					return links?.map((link, index) => (
						<CustomLink
							key={index}
							label={link.label}
							url={link.url}
						/>
					));
				},
			},

			{
				accessorKey: 'total_value',
				header: 'Total Value',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue()?.toLocaleString(),
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
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
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

	const handelAdd = () => navigate('/commercial/manual-pi/entry');

	const handelUpdate = (idx) => {
		const uuid = data[idx]?.uuid;
		navigate(`/commercial/manual-pi/${uuid}/update`);
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
