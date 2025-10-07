import { useDashboard } from '@/state/Maintenance';
import { format } from 'date-fns';

import GetDateTime from '@/util/GetDateTime';

export default function MaintenanceDashboard() {
	const { data: dashboard, isLoading } = useDashboard();

	// Loading state
	if (isLoading) {
		return (
			<div className='flex min-h-screen items-center justify-center p-6'>
				<div className='text-lg font-medium'>Loading dashboard...</div>
			</div>
		);
	}

	// Extract data with fallbacks matching your API structure
	const data = dashboard;

	// Table rows configuration
	const rows = [
		{
			label: 'Submitted',
			stats: data?.submitted,
			bg: 'bg-slate-50',
			text: 'text-slate-800',
		},
		{
			label: 'Resolved',
			stats: data?.resolved,
			bg: 'bg-green-50',
			text: 'text-green-800',
		},
		{
			label: 'Awaiting Response',
			stats: data?.awaiting_response,
			bg: 'bg-red-50',
			text: 'text-red-800',
		},
		{
			label: 'Rejected',
			stats: data?.rejected,
			bg: 'bg-red-500',
			text: 'text-white',
		},
		{
			label: 'Ongoing',
			stats: data?.ongoing,
			bg: 'bg-yellow-50',
			text: 'text-yellow-800',
		},
		{
			label: 'Average resolution time (H)',
			stats: data?.avg_resolution_time_seconds,
			bg: 'bg-blue-50',
			text: 'text-blue-800',
		},
	];
	function secondsToHours(seconds) {
		if (seconds === 0) return 0;
		const hours = seconds / 3600;
		return hours.toFixed(2);
	}
	// Format values for display
	const fmt = (value) => {
		if (typeof value === 'string') return value;
		if (value === 0) return '0';
		return value?.toLocaleString();
	};

	return (
		<div className='min-h-screen p-6 text-primary'>
			{/* Date Display */}
			<div className='mb-6 text-primary'>
				<span className='text-xl font-bold'>
					{format(GetDateTime(), 'dd MMM, yyyy')}
				</span>
			</div>

			<div className='grid grid-cols-1 gap-6 text-xs text-primary lg:grid-cols-3 lg:text-base'>
				{/* Left Column - Main Table */}
				<div className='lg:col-span-2'>
					<div className='overflow-hidden rounded-sm border border-secondary-light'>
						<table className='w-full text-sm'>
							<thead>
								<tr className='border border-secondary bg-secondary-light'>
									<th className='border-r border-secondary p-3 text-left'>
										Time and Status
									</th>
									<th className='border-r border-secondary bg-accent p-3 text-center'>
										Today
									</th>
									<th className='border-r border-secondary p-3 text-center'>
										Yesterday
									</th>
									<th className='border-r border-secondary p-3 text-center'>
										Last 7 days
									</th>
									<th className='border-r border-secondary p-3 text-center'>
										Last One month
									</th>
									<th className='p-3 text-center'>
										Last One year
									</th>
								</tr>
							</thead>
							<tbody>
								{rows.map((row, i) => (
									<tr
										key={i}
										className={`border-b border-secondary-light ${row.bg} ${row.text} ${
											i === rows.length - 1
												? 'border-b-0'
												: ''
										}`}
									>
										<td className='border-r border-secondary-light p-3 font-medium'>
											{row.label}
										</td>
										<td className='border-r border-secondary-light p-3 text-center'>
											{row.label ==
											'Average resolution time (H)'
												? '---'
												: fmt(row.stats?.today)}
										</td>
										<td className='border-r border-secondary-light p-3 text-center'>
											{row.label ==
											'Average resolution time (H)'
												? secondsToHours(
														row.stats?.yesterday
													)
												: fmt(row.stats?.yesterday)}
										</td>
										<td className='border-r border-secondary-light p-3 text-center'>
											{row.label ==
											'Average resolution time (H)'
												? secondsToHours(
														row.stats
															?.last_seven_day
													)
												: fmt(
														row.stats
															?.last_seven_day
													)}
										</td>
										<td className='border-r border-secondary-light p-3 text-center'>
											{row.label ==
											'Average resolution time (H)'
												? secondsToHours(
														row.stats
															?.last_one_month
													)
												: fmt(
														row.stats
															?.last_one_month
													)}
										</td>
										<td className='p-3 text-center'>
											{row.label ==
											'Average resolution time (H)'
												? secondsToHours(
														row.stats?.last_one_year
													)
												: fmt(row.stats?.last_one_year)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Bottom Cards */}
					<div className='mt-6 grid grid-cols-1 gap-4 text-primary md:grid-cols-2'>
						<div className='flex items-center justify-between rounded-lg border border-secondary-light p-4'>
							<div className='font-medium'>
								Issues unresolved for over a{' '}
								<span className='font-bold'>week</span>
							</div>
							<div className='rounded px-4 py-2 text-2xl font-bold'>
								{fmt(data?.unresolved.over_one_week)}
							</div>
						</div>
						<div className='flex items-center justify-between rounded-lg border border-secondary-light p-4'>
							<div className='font-medium'>
								Issues unresolved for over a{' '}
								<span className='font-bold'>month</span>
							</div>
							<div className='rounded px-4 py-2 text-2xl font-bold'>
								{fmt(data?.unresolved.over_one_month)}
							</div>
						</div>
					</div>
				</div>

				{/* Right Column - Metrics Cards */}
				<div className='space-y-6 text-primary'>
					{/* Average Resolution Time Card */}
					<div className='rounded-lg border border-secondary-light text-primary'>
						<div className='border-b border-secondary-light p-3 text-center'>
							<span className='font-medium'>
								Average Resolution Time – Last 1 Month
							</span>
						</div>
						<div className='p-6 text-center'>
							<div className='rounded px-6 py-4 text-4xl font-bold'>
								{secondsToHours(
									data?.avg_resolution_time_seconds
										?.last_one_month
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
