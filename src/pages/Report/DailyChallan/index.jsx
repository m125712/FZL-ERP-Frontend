import { useEffect, useMemo } from 'react';
import { useDailyChallan, useZipperProduction } from '@/state/Report';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, isLoading, url } = useDailyChallan();
	const info = new PageInfo(
		'Daily Challan Status',
		url,
		'report__daily_challan'
	);

	const haveAccess = useAccess('report__daily_challan');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => format(row.challan_date, 'dd/MM/yy'),
				id: 'challan_date',
				header: 'Challan Date',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.challan_date}
						isTime={false}
					/>
				),
			},
			{
				accessorKey: 'challan_id',
				header: 'Challan No.',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'gate_pass',
				header: 'Gate Pass',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-xs' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'total_quantity',
				header: 'Total Quantity',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'receive_status',
				header: 'Received',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-xs' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Prepared By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'pi_cash_number',
				header: 'PI No.',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'lc_number',
				header: 'LC No.',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'marketing_name',
				header: 'S&M',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			title={info.getTitle()}
			accessor={false}
			data={data}
			columns={columns}
			extraClass={'py-0.5'}
		/>
	);
}
