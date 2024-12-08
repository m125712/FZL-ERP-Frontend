import React from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { DateTime } from '@/ui';

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
											<DateTime
												date={item.production_date}
												isTime={false}
											/>
										}
									</td>
									<td className='border text-left text-xs font-medium'>
										{format(
											item.production_date,
											'ccc'
										).toLocaleUpperCase()}
									</td>

									{item.data?.map((data, index) => {
										return (
											<td>
												<QuantityCard
													data={data}
													production_date={
														production_date
													}
												/>
											</td>
										);
										return (
											<td
												key={index}
												className='border px-2 text-left text-xs font-medium'>
												{data.production_capacity_quantity >
												data.production_quantity ? (
													<button
														onClick={() =>
															navigate(
																`/dyeing-and-iron/finishing-batch/entry?production_date=${production_date}`
															)
														}
														className='btn btn-primary btn-xs min-h-8 w-full gap-1'>
														{
															data.production_quantity
														}
														<Plus className='size-4' />
													</button>
												) : (
													data.production_quantity
												)}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
