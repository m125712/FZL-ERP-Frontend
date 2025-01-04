import { format } from 'date-fns';

import { DateTime, LinkOnly } from '@/ui';

import QuantityCard from './quantity-card';

export default function Content({ data }) {
	const header = [
		'Date',
		...(data?.[0]?.data
			? data[0].data.map((item) => item.item_description_quantity)
			: []),
	];

	return (
		<div className='rounded-t-md border'>
			<span className='flex items-center gap-4 bg-primary p-2 text-lg font-semibold capitalize text-primary-content'>
				Item Production Quantity
			</span>

			<div className='overflow-x-auto'>
				<table className='table table-zebra w-full'>
					<thead>
						<tr className='bg-primary text-left text-lg font-semibold capitalize text-primary-content'>
							{header?.map((item, index) => (
								<th key={index} className='min-w-28'>
									{item}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data?.map((item, index) => {
							const production_date = item.production_date;

							return (
								<tr key={index} className='border'>
									<td className='border text-left font-medium'>
										<LinkOnly
											title={
												<DateTime
													date={production_date}
													customizedDateFormate='dd MMM, yy'
													isTime={false}
												/>
											}
											id={format(
												new Date(production_date),
												'yyyy-MM-dd'
											)}
											uri='/planning/finishing-dashboard/batch-report'
										/>

										{format(
											production_date,
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
