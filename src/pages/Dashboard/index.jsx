import { useEffect, useState } from 'react';
import { BarChartHorizontal } from '@/pages/Dashboard/_components/BarChartHorizontal';

import { BarChartHorizontal2 } from './_components/BarChartHorizontal2';
import { BarChartOverall } from './_components/BarChartOverall';
import { BarChartVertical } from './_components/BarChartVertical';
import DashboardCard from './_components/dashboard-card/dashboard-card';
import DashboardHeader from './_components/dashboard-header';
import { PieChartDashboard } from './_components/PieChartDashboard';
import { TableWithTime } from './_components/TableWithTime';
import {
	doc_rcv_columns,
	order_entry_feed_columns,
	pi_register_columns,
	pi_to_be_submitted_columns,
	sample_lead_time_columns,
	stock_status_columns,
} from './columns';
import { fake_order_entry } from './fakeData';
import useDashboardData from './hooks/useDashboardData';

export default function Dashboard() {
	const [dataPreview, setDataPreview] = useState('real');
	const {
		amount_and_doc,
		order_entry,
		amount_percentage,
		no_of_doc,
		refreshAll,
	} = useDashboardData(dataPreview);

	useEffect(() => {
		document.title = 'Dashboard';
	}, []);

	return (
		<div className='relative'>
			<DashboardHeader
				dataPreview={dataPreview}
				setDataPreview={setDataPreview}
				handleRefresh={refreshAll}
			/>
			<div className='space-y-6 p-6 px-4 lg:px-8'>
				<BarChartOverall
					data={
						dataPreview === 'demo' ? fake_order_entry : order_entry
					}
				/>

				<div className='flex flex-col gap-4 md:flex-row'>
					<BarChartHorizontal2 />
				</div>
				<div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
					<div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
						<DashboardCard
							title='Payment Due'
							subtitle='# Pending'
							totalValue={amount_and_doc?.total_payment_due}
							pendingValue={
								amount_and_doc?.number_of_pending_payment_due
							}
						/>
						<DashboardCard
							title='Maturity Due'
							subtitle='# Pending'
							totalValue={amount_and_doc?.total_maturity_due}
							pendingValue={
								amount_and_doc?.number_of_pending_maturity_due
							}
						/>
						<DashboardCard
							title='Acceptance Due'
							subtitle='# Pending'
							totalValue={amount_and_doc?.total_acceptance_due}
							pendingValue={
								amount_and_doc?.number_of_pending_acceptance_due
							}
						/>
						<DashboardCard
							title='Document Receive Due'
							subtitle='# Pending'
							totalValue={amount_and_doc?.total_doc_rcv_due}
							pendingValue={
								amount_and_doc?.number_of_pending_doc_rcv
							}
						/>
					</div>

					<PieChartDashboard
						amount_percentage={amount_percentage}
						no_of_doc={no_of_doc}
					/>
				</div>

				<div className='flex flex-col gap-4 md:flex-row'>
					<BarChartHorizontal
						title='Challan: Issued'
						url='/dashboard/challan-register'
						total={true}
						time={true}
						total_title='Challan Count'
						label1='amount'
						label2='number_of_challan'
					/>
					<BarChartHorizontal
						title='Challan: Outstanding'
						url='/dashboard/challan-register'
						time={false}
						total={true}
						total_title='Challan Count'
						label1='amount'
						label2='number_of_challan'
					/>
				</div>

				<div className='flex flex-col gap-4 md:flex-row'>
					<BarChartHorizontal
						title='Warehouse: Status'
						url='/dashboard/goods-in-warehouse'
						time={false}
						total={true}
						total_title='Carton Count'
						label1='amount'
						label2='number_of_carton'
					/>
					<BarChartVertical />
				</div>

				<div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
					<TableWithTime
						title='Sample: Status'
						url='/dashboard/sample-lead-time'
						total={true}
						total_title='O/S Count'
						columns={sample_lead_time_columns}
					/>
					<TableWithTime
						title='Order Entry Feed with number of count'
						url='/dashboard/order-entry-feed'
						columns={order_entry_feed_columns}
					/>
				</div>

				<div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
					<TableWithTime
						title='PI: Issued'
						url='/dashboard/pi-register'
						total={true}
						time={true}
						total_title='PI Count'
						columns={pi_register_columns}
					/>
					<TableWithTime
						title='Document Receive Log'
						url='/dashboard/document-rcv-log'
						total={true}
						time={true}
						total_title='Doc. Count'
						columns={doc_rcv_columns}
					/>
				</div>

				<div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
					<TableWithTime
						title='LC Feed with number of count'
						url='/dashboard/lc-feed'
						columns={doc_rcv_columns}
					/>

					<TableWithTime
						title='Stock: Status'
						url='/dashboard/stock-status'
						columns={stock_status_columns}
					/>
				</div>

				<div className='grid grid-cols-1'>
					<TableWithTime
						title='Credit Sales Status'
						url='/dashboard/pi-to-be-submitted'
						columns={pi_to_be_submitted_columns}
						total={true}
						total_title='PI Count'
						total2={true}
						total2_title='Total Amount'
					/>
				</div>
			</div>
			{/* <TopTenSalesMan url='/dashboard/top-sales' /> */}
		</div>
	);
}
