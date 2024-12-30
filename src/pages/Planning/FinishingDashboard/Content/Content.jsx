import { format } from 'date-fns';

import { DateTime, LinkOnly } from '@/ui';

import QuantityCard from './quantity-card';

export default function Content({ data }) {
	const header = [
		'Date',
		'Day',
		...(data?.[0]?.data
			? data[0].data.map((item) => item.item_description_quantity)
			: []),
	];

	return (
		<div className='overflow-hidden rounded-t-md border'>
			<span className='flex items-center gap-4 bg-primary px-4 py-3 text-lg font-semibold capitalize text-primary-content'>
				Item Production Quantity
			</span>

			<div className='overflow-x-auto'>
				<table className='w-full text-sm'>
					<thead>
						<tr>
							{header?.map((item, index) => (
								<th
									key={index}
									className='w-24 bg-base-200 px-4 py-2 text-left text-sm font-semibold capitalize leading-tight text-primary'>
									{item}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data?.map((item, index) => {
							const production_date = item.production_date;

							return (
								<tr key={index} className='border text-lg'>
									<td className='border px-4 py-2 text-left font-medium'>
										{
											<LinkOnly
												title={
													<DateTime
														date={
															item.production_date
														}
														isTime={false}
													/>
												}
												id={format(
													new Date(
														item.production_date
													),
													'yyyy-MM-dd'
												)}
												uri='/planning/finishing-dashboard/batch-report'
											/>
										}
									</td>
									<td className='border text-left text-xs font-medium'>
										{format(
											item.production_date,
											'ccc'
										).toLocaleUpperCase()}
									</td>

									{item.data?.map((data, index) => (
										<td>
											<QuantityCard
												data={data}
												production_date={
													production_date
												}
											/>
										</td>
									))}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
