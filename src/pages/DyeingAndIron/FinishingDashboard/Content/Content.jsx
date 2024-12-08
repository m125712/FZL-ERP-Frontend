import React from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { DateTime } from '@/ui';

export default function Content({ data }) {
	const navigate = useNavigate();
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
									className='w-32 bg-base-200 px-4 py-2 text-left text-sm font-semibold capitalize leading-tight text-primary'>
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
											<>
												<td
													key={index}
													className='h-44 border border-gray-200 p-3 text-left text-sm'>
													{data.production_capacity_quantity >
													data.production_quantity ? (
														<div className='flex h-full flex-col justify-between'>
															<div className='space-y-1'>
																<div className='font-medium text-primary'>
																
																	{data.order_numbers?.join(
																		', '
																	)}
																</div>
																<div className='text-primary'>
																	batch numbers:
																	{data.batch_numbers?.join(
																		', '
																	)}
																</div>
																<div className='font-semibold text-primary'>
																	production quantity:
																	{
																		data.production_quantity
																	}
																</div>
															</div>

															<button
																onClick={() =>
																	navigate(
																		`/dyeing-and-iron/finishing-batch/entry?production_date=${production_date}`
																	)
																}
																className='mt-2 inline-flex items-center justify-center gap-1 rounded bg-primary px-3 py-2 text-sm font-medium text-white'>
																<Plus className='size-5' />
															</button>
														</div>
													) : (
														<div className='space-y-1'>
															<div className='font-medium text-primary'>
																{data.order_numbers?.join(
																	', '
																)}
															</div>
															<div className='text-primary'>
																{data.batch_numbers?.join(
																	', '
																)}
															</div>
															<div className='font-semibold text-primary'>
																{
																	data.production_quantity
																}
															</div>
														</div>
													)}
												</td>
											</>
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
