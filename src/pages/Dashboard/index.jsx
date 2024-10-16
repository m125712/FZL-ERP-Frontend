import { useEffect } from 'react';

import ProductionChart from './_components/BarChart/Production';
import StatusBarChart from './_components/BarChart/Status';
import InfoCard from './_components/Card/InfoCard';
import DashboardHeader from './_components/dashboard-header';
import { getApproval } from './_utils';

export default function Dashboard() {
	useEffect(() => {
		document.title = 'Dashboard';
	}, []);
	return (
		<div className='flex gap-4'>
			<div className='w-full space-y-4'>
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
				<div className='flex gap-4'></div>
			</div>

			<div className='flex w-64 flex-col rounded-md border shadow  bg-base-200'>
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
