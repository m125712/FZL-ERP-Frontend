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
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'opening',
				header: 'Opening',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'running_total_lc_value',
				header: (
					<>
						LC Value <br></br> (USD)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue().toFixed(2),
			},
			{
				accessorKey: 'running_total_lc_value_bdt',
				header: (
					<>
						LC Value <br></br> (BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue().toFixed(2),
			},
			{
				accessorFn: (row) => row.running_lc_file_numbers.join(', '),
				id: 'running_lc_file_numbers',
				header: 'LC Number',
				enableColumnFilter: false,
				width: 'w-40',
			},
			{
				accessorKey: 'running_total_cash_received',
				header: 'Cash Value (BDT)',
				enableColumnFilter: false,
				cell: (info) => info.getValue().toFixed(2),
			},
			{
				accessorFn: (row) => row.running_pi_cash_ids.join(', '),
				id: 'running_pi_cash_ids',
				header: 'Cash Number',
				enableColumnFilter: false,
				width: 'w-40',
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
				accessorKey: 'total_produced_quantity',
				header: (
					<>
						Produced <br></br> Qty
					</>
				),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'total_produced_value_company',
				header: (
					<>
						Produced Value <br></br> (Com USD)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue().toFixed(2),
			},
			{
				accessorKey: 'total_produced_value_company_bdt',
				header: (
					<>
						Produced Value <br></br> (Com BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue().toFixed(2),
			},
			{
				accessorKey: 'total_produced_quantity_deleted',
				header: (
					<>
						Produced Qty <br></br> (Deleted)
					</>
				),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'total_produced_value_company_deleted',
				header: (
					<>
						Produced Value <br></br> Com (Deleted USD)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue().toFixed(2),
			},
			{
				accessorKey: 'total_produced_value_company_deleted_bdt',
				header: (
					<>
						Produced Value <br></br> Com (Deleted BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue().toFixed(2),
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
				accessorKey: 'closing',
				header: 'Closing Qty',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'total_produced_value_party',
				header: (
					<>
						Produced Value <br></br> (Party USD)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue().toFixed(2),
			},
			{
				accessorKey: 'total_produced_value_party_bdt',
				header: (
					<>
						Produced Value <br></br> (Party BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue().toFixed(2),
			},
			{
				accessorKey: 'total_produced_value_party_deleted',
				header: (
					<>
						Produced Value <br></br> (Party USD)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue().toFixed(2),
			},
			{
				accessorKey: 'total_produced_value_party_deleted_bdt',
				header: (
					<>
						Produced Value <br></br> Party (Deleted BDT)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue().toFixed(2),
			},
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
