import { useCallback, useEffect, useMemo, useState } from 'react';
import { BarChartHorizontal } from '@/pages/Dashboard/_components/BarChartHorizontal';
import { Pie } from 'react-chartjs-2';
import { defaultFetch, useFetch } from '@/hooks';

import { default as ReactTable, default as Table } from '@/components/Table';

import ProductionChart from './_components/BarChart/Production';
import StatusBarChart from './_components/BarChart/Status';
import { BarChartHorizontal2 } from './_components/BarChartHorizontal2';
import { BarChartOverall } from './_components/BarChartOverall';
import { BarChartVertical } from './_components/BarChartVertical';
import InfoCard from './_components/Card/InfoCard';
import DashboardHeader from './_components/dashboard-header';
import { PieChartDashboard } from './_components/PieChartDashboard';
import { TableWithRowHeader } from './_components/TableWithRowHeader';
import { TableWithTime } from './_components/TableWithTime';
import { TopTenSalesMan } from './_components/TopTenSalesMan';
import { getApproval } from './_utils';
import {
	doc_rcv_columns,
	order_entry_feed_columns,
	pi_register_columns,
	pi_to_be_submitted_columns,
	sample_lead_time_columns,
	stock_status_columns,
} from './columns';

export default function Dashboard() {
	const [refreshStatus, setRefreshStatus] = useState({
		payment_due: false,
		maturity_due: false,
		acceptance_due: false,
		document_rcv_due: false,
	});

	const payment_due = useFetch('/dashboard/payment-due', [
		refreshStatus.payment_due,
	]);
	const maturity_due = useFetch('/dashboard/maturity-due', [
		refreshStatus.maturity_due,
	]);
	const acceptance_due = useFetch('/dashboard/acceptance-due', [
		refreshStatus.acceptance_due,
	]);
	const document_rcv_due = useFetch('/dashboard/document-rcv-due', [
		refreshStatus.document_rcv_due,
	]);

	useEffect(() => {
		document.title = 'Dashboard';
	}, []);

	const handleRefresh = (key) => {
		setRefreshStatus((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	return (
		<div className='container px-4 py-8'>
			<DashboardHeader />

			<div className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-2'>
				<div className='col-span-1 md:col-span-2'>
					<BarChartOverall url='/dashboard/order-entry' />
				</div>

				<div className='col-span-2 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap'>
					<TableWithRowHeader
						title='Payment Due'
						data={payment_due.value}
						isLoading={payment_due.loading}
						onRefresh={() => handleRefresh('payment_due')}
					/>

					<TableWithRowHeader
						title='Maturity Due'
						data={maturity_due.value}
						isLoading={maturity_due.loading}
						onRefresh={() => handleRefresh('maturity_due')}
					/>

					<TableWithRowHeader
						title='Acceptance Due'
						data={acceptance_due.value}
						isLoading={acceptance_due.loading}
						onRefresh={() => handleRefresh('acceptance_due')}
					/>

					<TableWithRowHeader
						title='Document Receive Due'
						data={document_rcv_due.value}
						isLoading={document_rcv_due.loading}
						onRefresh={() => handleRefresh('document_rcv_due')}
					/>
				</div>

				<div className='col-span-1 md:col-span-2'>
					<PieChartDashboard />
				</div>
				<div>
					<BarChartHorizontal
						title='Challan Register'
						url='/dashboard/challan-register'
						total={true}
						time={true}
						total_title='Challan Count'
						label1='amount'
						label2='number_of_challan'
					/>
				</div>

				<div>
					<BarChartHorizontal
						title='Challans to be Collected'
						url='/dashboard/challan-register'
						time={false}
						total={true}
						total_title='Challan Count'
						label1='amount'
						label2='number_of_challan'
					/>
				</div>

				<div>
					<BarChartHorizontal
						title='Goods In Warehouse'
						url='/dashboard/goods-in-warehouse'
						time={false}
						total={true}
						total_title='Carton Count'
						label1='amount'
						label2='number_of_carton'
					/>
				</div>

				<div>
					<BarChartVertical />
				</div>

				<div>
					<BarChartHorizontal2 />
				</div>

				<div>
					<TableWithTime
						title='Sample Lead Time'
						url='/dashboard/sample-lead-time'
						total={true}
						total_title='O/S Count'
						columns={sample_lead_time_columns}
					/>
				</div>

				<div>
					<TableWithTime
						title='Order Entry Feed'
						url='/dashboard/order-entry-feed'
						columns={order_entry_feed_columns}
					/>
				</div>

				<div>
					<TableWithTime
						title='PI Register'
						url='/dashboard/pi-register'
						total={true}
						time={true}
						total_title='PI Count'
						columns={pi_register_columns}
					/>
				</div>

				<div>
					<TableWithTime
						title='Document Receive Log'
						url='/dashboard/document-rcv-log'
						total={true}
						time={true}
						total_title='Doc. Count'
						columns={doc_rcv_columns}
					/>
				</div>

				<div>
					<TableWithTime
						title='LC Feed'
						url='/dashboard/lc-feed'
						columns={doc_rcv_columns}
					/>
				</div>

				<div>
					<TableWithTime
						title='Stock Status'
						url='/dashboard/stock-status'
						columns={stock_status_columns}
					/>
				</div>

				<div>
					<TableWithTime
						title='PI Due/Cash Aging/PI to be Submitted'
						url='/dashboard/pi-to-be-submitted'
						columns={pi_to_be_submitted_columns}
						total={true}
						total_title='PI Count'
						total2={true}
						total2_title='Total Amount'
					/>
				</div>

				<div>
					<TopTenSalesMan url='/dashboard/top-sales' />
				</div>
			</div>
		</div>
	);
}
