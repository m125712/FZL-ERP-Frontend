import { useEffect, useMemo, useState } from 'react';
import { useMarketReport } from '@/state/Report';
import { format } from 'date-fns';

import ReactTable from '@/components/Table';
import { SimpleDatePicker } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const [from, setFrom] = useState(() => new Date());
	const [to, setTo] = useState(() => new Date());

	const { data, isLoading } = useMarketReport(
		format(from, 'yyyy-MM-dd'),
		format(to, 'yyyy-MM-dd'),
		{
			enabled: !!(from && to),
		}
	);

	const info = new PageInfo(
		'Market Report',
		'/report/market-report',
		'report__market_report'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
			},
			{
				accessorFn: (row) =>
					row.order_details
						?.map((order) => order.order_number)
						?.join(', '),
				id: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
				width: 'w-40',
			},
			{
				accessorKey: 'opening',
				header: `Opening Due`,
				enableColumnFilter: false,
			},
			{
				accessorKey: 'total_produced_value_company_bdt',
				header: 'Sales',
				enableColumnFilter: false,
				cell: (info) => info.getValue()?.toFixed(2),
			},
			{
				accessorKey: 'total_produced_value_company_deleted_bdt',
				header: 'Sales (Deleted)',
				enableColumnFilter: false,
				cell: (info) => info.getValue()?.toFixed(2),
			},
			{
				accessorFn: (row) =>
					Number(row.opening || 0) +
					Number(row.total_produced_value_company_bdt || 0),
				id: 'gross_due',
				header: 'Gross Due',
				enableColumnFilter: false,
				cell: (info) => Number(info.getValue()).toFixed(2),
			},
			// {
			// 	accessorKey: 'running_total_lc_value',
			// 	header: (
			// 		<>
			// 			LC Value <br></br> (USD)
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue().toFixed(2),
			// },
			{
				accessorKey: 'running_total_cash_received',
				header: 'Cash',
				enableColumnFilter: false,
				cell: (info) => info.getValue()?.toFixed(2),
			},
			{
				accessorFn: (row) => row.running_pi_cash_ids.join(', '),
				id: 'running_pi_cash_ids',
				header: 'Cash Number',
				enableColumnFilter: false,
				width: 'w-40',
			},
			{
				accessorKey: 'running_total_lc_value_bdt',
				header: 'LC',
				enableColumnFilter: false,
				cell: (info) => info.getValue()?.toFixed(2),
			},
			{
				accessorFn: (row) => row.running_lc_file_numbers.join(', '),
				id: 'running_lc_file_numbers',
				header: 'LC Number',
				enableColumnFilter: false,
				width: 'w-40',
			},
			// {
			// 	accessorKey: 'total_produced_quantity',
			// 	header: (
			// 		<>
			// 			Produced <br></br> Qty
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// },
			// {
			// 	accessorKey: 'total_produced_value_company',
			// 	header: (
			// 		<>
			// 			Produced Value <br></br> (Com USD)
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue().toFixed(2),
			// },

			// {
			// 	accessorKey: 'total_produced_quantity_deleted',
			// 	header: (
			// 		<>
			// 			Produced Qty <br></br> (Deleted)
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// },
			// {
			// 	accessorKey: 'total_produced_value_company_deleted',
			// 	header: (
			// 		<>
			// 			Produced Value <br></br> Com (Deleted USD)
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue().toFixed(2),
			// },
			{
				accessorKey: 'net_due',
				header: 'Net Due',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'period_of_due_year',
				header: 'Period of Due Year',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'period_of_due_month',
				header: 'Period of Due Month',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'remarks_amount',
				header: 'Remarks Amount',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'marketing_name',
				header: 'O.C.',
				enableColumnFilter: false,
			},
			// {
			// 	accessorKey: 'total_produced_value_party',
			// 	header: (
			// 		<>
			// 			Produced Value <br></br> (Party USD)
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue().toFixed(2),
			// },
			// {
			// 	accessorKey: 'total_produced_value_party_bdt',
			// 	header: (
			// 		<>
			// 			Produced Value <br></br> (Party BDT)
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue().toFixed(2),
			// },
			// {
			// 	accessorKey: 'total_produced_value_party_deleted',
			// 	header: (
			// 		<>
			// 			Produced Value <br></br> (Party USD)
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue().toFixed(2),
			// },
			// {
			// 	accessorKey: 'total_produced_value_party_deleted_bdt',
			// 	header: (
			// 		<>
			// 			Produced Value <br></br> Party (Deleted BDT)
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// 	cell: (info) => info.getValue().toFixed(2),
			// },
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex flex-col gap-8'>
			<ReactTable
				title={info.getTitle()}
				accessor={false}
				data={data}
				columns={columns}
				extraClass={'py-0.5'}
				showXlsx={true}
				showExport={false}
				extraButton={
					<div className='flex items-center gap-2'>
						<SimpleDatePicker
							className='h-[2.34rem] w-32'
							key={'from'}
							value={from}
							placeholder='From'
							selected={from}
							onChange={(data) => {
								setFrom(data);
							}}
						/>
						<SimpleDatePicker
							className='h-[2.34rem] w-32'
							key={'to'}
							value={to}
							placeholder='To'
							selected={to}
							onChange={(data) => {
								setTo(data);
							}}
						/>
					</div>
				}
			/>
		</div>
	);
}
