import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { LinkWithCopy } from '@/ui';

import { cn } from '@/lib/utils';

export default function QuantityCard({ data, production_date }) {
	const {
		order_numbers,
		batch_numbers,
		production_capacity_quantity,
		production_quantity,
	} = data;

	const navigate = useNavigate();

	const items = [
		{
			title: 'Batch No',
			content: (
				<div className='flex flex-wrap gap-1'>
					{batch_numbers?.map((item, index) => (
						<LinkWithCopy
							id={item.value}
							key={index}
							title={item.label}
							uri='/planning/finishing-batch'
						/>
					))}
				</div>
			),
		},

		{
			title: 'Order No',
			content: (
				<div>
					{order_numbers?.map((item, index) => (
						<LinkWithCopy
							id={`${item.label}/${item.value}`}
							key={index}
							title={item.label}
							uri='/order/details'
						/>
					))}
				</div>
			),
		},
		{
			title: 'P Quantity',
			content: production_quantity,
		},
	];

	return (
		<div className='m-1 flex min-w-[160px] flex-col gap-1'>
			<div
				className={cn(
					'rounded-md py-2 text-foreground',
					production_quantity > production_capacity_quantity
						? 'bg-error/10'
						: 'bg-success/10'
				)}>
				<div className='overflow-x-auto'>
					<table className='table table-xs'>
						<tbody>
							{items.map((item, index) => (
								<tr key={index} className='border-foreground/5'>
									<th className='whitespace-nowrap'>
										{item.title}
									</th>
									<td className='whitespace-nowrap'>
										{item.content}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{production_capacity_quantity > production_quantity ? (
				<button
					onClick={() =>
						navigate(
							`/planning/finishing-batch/entry?production_date=${production_date}`
						)
					}
					className='btn btn-primary btn-xs min-h-8 w-full gap-1'>
					<Plus className='size-4' />
				</button>
			) : null}
		</div>
	);
}
