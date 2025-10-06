import React from 'react';
import { format } from 'date-fns';

import GetDateTime from '@/util/GetDateTime';

export default function MaintenanceDashboard() {
	return (
		<div className='min-h-screen p-6'>
			{/* Date Display */}
			<div className='mb-6 text-primary'>
				<span className='text-xl font-bold'>
					{format(GetDateTime(), 'dd MMM, yyyy')}
				</span>
			</div>

			<div className='grid grid-cols-1 gap-6 text-primary lg:grid-cols-3'>
				{/* Left Column - Main Table */}
				<div className='lg:col-span-2'>
					{/* Status Table */}
					<div className='overflow-hidden rounded-sm border border-secondary-light'>
						<table className='w-full text-sm'>
							<thead>
								<tr className='border border-secondary bg-secondary-light'>
									<th className='border-r border-secondary p-3 text-left'>
										Time and Status
									</th>
									<th className='border-r border-secondary p-3 text-center'>
										Today
									</th>
									<th className='border-r border-secondary p-3 text-center'>
										Yesterday
									</th>
									<th className='border-r border-secondary p-3 text-center'>
										Last 7 day
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
								<tr className='border-b border-secondary-light bg-slate-50 text-slate-800'>
									<td className='border-r border-secondary-light p-3 font-medium'>
										Submitted
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										0
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										3
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										33
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										128
									</td>
									<td className='p-3 text-center'>4009</td>
								</tr>
								<tr className='border-b border-secondary-light bg-green-50 text-green-800'>
									<td className='border-r border-secondary-light p-3 font-medium'>
										Resolved
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										0
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										0
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										0
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										1
									</td>
									<td className='p-3 text-center'>3872</td>
								</tr>
								<tr className='border-b border-secondary-light bg-red-50 text-red-800'>
									<td className='border-r border-secondary-light p-3 font-medium'>
										Awaiting Response
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										0
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										3
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										13
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										15
									</td>
									<td className='p-3 text-center'>16</td>
								</tr>
								<tr className='border-b border-secondary-light bg-yellow-50 text-yellow-800'>
									<td className='border-r border-secondary-light p-3 font-medium'>
										Ongoing
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										0
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										0
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										20
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										112
									</td>
									<td className='p-3 text-center'>121</td>
								</tr>
								<tr className='bg-blue-50 text-blue-800'>
									<td className='border-r border-secondary-light p-3 font-medium'>
										Average resolution time (H)
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										X
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										0.00
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										9.88
									</td>
									<td className='border-r border-secondary-light p-3 text-center'>
										28.98
									</td>
									<td className='p-3 text-center'>-</td>
								</tr>
							</tbody>
						</table>
					</div>

					{/* Bottom Cards */}
					<div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
						{/* Issues Unresolved for Over a Week */}
						<div className='flex items-center justify-between rounded-lg border border-secondary-light p-4'>
							<div className='font-medium'>
								Issues unresolved for over a{' '}
								<span className='font-bold'>week</span>
							</div>
							<div className='rounded px-4 py-2 text-2xl font-bold'>
								101
							</div>
						</div>

						{/* Issues Unresolved for Over a Month */}
						<div className='flex items-center justify-between rounded-lg border border-secondary-light p-4'>
							<div className='font-medium'>
								Issues unresolved for over a month
							</div>
							<div className='rounded px-4 py-2 text-2xl font-bold'>
								9
							</div>
						</div>
					</div>
				</div>

				{/* Right Column - Metrics Cards */}
				<div className='space-y-6'>
					<div className='rounded-lg border border-secondary-light'>
						<div className='border-b border-secondary-light p-3 text-center'>
							<span className='font-medium'>From</span>
						</div>
						<div className='p-6 text-center'>
							<div className='mb-2 text-3xl font-bold'>
								12 Sep 24
							</div>
							<div className='mb-4 h-20 rounded border border-secondary-light'></div>
							<div className='text-4xl font-bold'>389</div>
						</div>
						<div className='text-magenta-400 border-t border-secondary-light p-3 text-center font-medium'>
							Total age in days
						</div>
					</div>

					{/* Average Resolution Time Card */}
					<div className='rounded-lg border border-secondary-light'>
						<div className='border-b border-secondary-light p-3 text-center'>
							<span className='font-medium'>
								Average Resolution Time – Last 1 Month
							</span>
						</div>
						<div className='p-6 text-center'>
							<div className='rounded border px-6 py-4 text-4xl font-bold'>
								28.98
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
