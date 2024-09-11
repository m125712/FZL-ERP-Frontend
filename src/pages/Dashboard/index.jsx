import { useEffect } from 'react';
import ProductionChart from './_components/BarChart/Production';
import StatusBarChart from './_components/BarChart/Status';
import InfoCard from './_components/Card/InfoCard';
import { getApproval } from './_utils';
import DashboardHeader from './_components/dashboard-header';

export default function Dashboard() {
	useEffect(() => {
		document.title = 'Dashboard';
	}, []);
	return (
		<div className='space-y-4'>
			<DashboardHeader />
			<div className='grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
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
			</div>
		</div>
	);
}
