import { useEffect } from 'react';
import { BarChartHorizontal } from '@/pages/Dashboard/_components/BarChartHorizontal';

import { default as ReactTable, default as Table } from '@/components/Table';

import ProductionChart from './_components/BarChart/Production';
import StatusBarChart from './_components/BarChart/Status';
import { BarChartHorizontal2 } from './_components/BarChartHorizontal2';
import { BarChartVertical } from './_components/BarChartVertical';
import InfoCard from './_components/Card/InfoCard';
import DashboardHeader from './_components/dashboard-header';
import { TableWithTime } from './_components/TableWithTime';
import { getApproval } from './_utils';

export default function Dashboard() {
	useEffect(() => {
		document.title = 'Dashboard';
	}, []);
	const sample_lead_time_columns = [
		{
			accessorKey: 'sample_order_no',
			header: 'Sample O/N',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'issue_date',
			header: 'Issue Date',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'delivery_last_date',
			header: 'Last Delivery Date',
			enableColumnFilter: false,
			cell: (info) => (info.getValue() ? info.getValue() : 'N/A'),
		},
		{
			accessorKey: 'status',
			header: 'Status',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'delivery_order_quantity',
			header: 'Delivery Qty',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		},
	];
	const order_entry_feed_columns = [
		{
			accessorKey: 'order_no',
			header: 'O/N',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'party_name',
			header: 'Party Name',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'marketing_name',
			header: 'S & M',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'item',
			header: 'Item',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'quantity',
			header: 'Total Quantity',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		},
	];
	const pi_register_columns = [
		{
			accessorKey: 'pi_cash_number',
			header: 'PI Number',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'party_name',
			header: 'Party Name',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'bank_name',
			header: 'Bank',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'total_pi_value',
			header: 'PI Value(USD)',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: 'lc_number',
			header: 'LC No',
			enableColumnFilter: false,
			cell: (info) => info.getValue(),
		},
	];
	return (
		<div className='flex gap-4'>
			<div className='w-full space-y-4'>
				<DashboardHeader />
				{/* <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
					<InfoCard
						title='Nylon Metallic'
						notapproved={getApproval()?.nylon_metallic_not_approved}
						approved={getApproval()?.nylon_metallic_approved}
					/>
					<InfoCard
						title='Nylon Plastic'
						notapproved={getApproval()?.nylon_plastic_not_approved}
						approved={getApproval()?.nylon_plastic_approved}
					/>
					<InfoCard
						title='Vislon'
						notapproved={getApproval()?.vislon__not_approved}
						approved={getApproval()?.vislon__approved}
					/>
					<InfoCard
						title='Metal'
						notapproved={getApproval()?.metal__not_approved}
						approved={getApproval()?.metal__approved}
					/>
				</div>
				<div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
					<StatusBarChart />
					<ProductionChart />
				</div> */}

				<div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
					<BarChartHorizontal
						title='Challan Register'
						url='/dashboard/challan-register'
						total={true}
						time={true}
						total_title='Challan Count'
					/>
					<BarChartHorizontal
						title='Challans to be Collected'
						url='/dashboard/challan-register'
						time={false}
						total={true}
						total_title='Challan Count'
					/>
				</div>

				<div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
					<BarChartHorizontal
						title='Goods In Warehouse'
						url='/dashboard/goods-in-warehouse'
						time={false}
						total={true}
						total_title='Carton Count'
					/>
					<BarChartVertical />
				</div>
				<div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
					<BarChartHorizontal2 />
					<TableWithTime
						url='/dashboard/sample-lead-time'
						total={true}
						total_title='O/S Count'
						columns={sample_lead_time_columns}
					/>
				</div>
				<div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
					<TableWithTime
						url='/dashboard/order-entry-feed'
						columns={order_entry_feed_columns}
					/>
					<TableWithTime
						url='/dashboard/pi-register'
						total={true}
						time={true}
						total_title='PI Count'
						columns={pi_register_columns}
					/>
				</div>
				<div className='flex gap-4'></div>
			</div>

			<div className='flex w-64 flex-col rounded-md border bg-base-200 shadow'>
				<div className='rounded-t-md bg-secondary py-1 text-center text-primary-content'>
					ATTENDANCE FEED
				</div>
				<div className='flex flex-col'>
					<div className='flex items-center gap-4 border-b-[1px] border-gray-300 px-2.5 py-2'>
						<div className='h-12 min-w-12 rounded-full border border-black'></div>

						<div>
							<h4 className='text-xs font-semibold'>Name</h4>
							<div className='text-xs font-light'>Sale: 100$</div>
							<div className='text-xs font-light'>
								Doc collected: 200$
							</div>
						</div>
					</div>
					<div className='flex items-center gap-4 border-b-2 px-2.5 py-2'>
						<div className='h-12 min-w-12 rounded-full border border-black'></div>

						<div>
							<h4 className='text-xs font-semibold'>Name</h4>
							<div className='text-xs font-light'>Sale: 100$</div>
							<div className='text-xs font-light'>
								Doc collected: 200$
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
