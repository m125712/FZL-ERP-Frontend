import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { CustomLink, DateTime } from '@/ui';

import QuantityCard from './quantity-card';

export default function Content({ data }) {
	const navigate = useNavigate();
	const header = [
		'Date',
		...(data?.[0]?.data
			? data[0].data.map((item) => item.item_description_quantity)
			: []),
	];

	return (
		<div className='h-96 overflow-x-auto rounded-t-md border'>
			<table className='table table-pin-rows table-pin-cols table-xs w-full align-top'>
				<thead>
					<tr className='z-10'>
						{header?.map((item, index) => (
							<th
								key={index}
								className='min-w-28 bg-primary text-lg font-semibold text-primary-content'>
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
							<tr
								key={index}
								className='border-b-2 border-primary/30'>
								<th className='z-10 flex flex-col items-stretch gap-4'>
									<CustomLink
										label={
											<DateTime
												date={production_date}
												customizedDateFormate='ccc dd, MMM yy'
												isTime={false}
											/>
										}
										url={`/planning/finishing-dashboard/batch-report/${urlDate}`}
										showCopyButton={false}
										openInNewTab
									/>

									<button
										onClick={() =>
											navigate(
												`/planning/finishing-batch/entry?production_date=${production_date}`
											)
										}
										className='btn btn-primary btn-xs min-h-8 w-full gap-1'>
										<Plus className='size-4' />
									</button>
								</th>

								{item.data?.map((i, index) => (
									<td key={index}>
										<QuantityCard {...i} />
									</td>
								))}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
