import { format } from 'date-fns';

import { CustomLink, DateTime } from '@/ui';

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

			<div className='h-96 overflow-x-auto'>
				<table className='table table-pin-rows table-xs w-full'>
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
							const urlDate = format(
								new Date(production_date),
								'yyyy-MM-dd'
							);

							return (
								<tr key={index} className='border'>
									<td className='border text-left font-medium'>
										<CustomLink
											label={
												<DateTime
													date={production_date}
													customizedDateFormate='ccc dd, MMM yy'
													isTime={false}
												/>
											}
											url={`/planning/finishing-dashboard/batch-report/${urlDate}`}
											openInNewTab
										/>
									</td>

									{item.data?.map((data, index) => (
										<td key={index}>
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
