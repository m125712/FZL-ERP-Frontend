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
		achieved_quantity,
	} = data;

	const navigate = useNavigate();

	const items = [
		{
			title: 'B/N',
			content: (
				<div>
					{batch_numbers?.map((item, index) => (
						<LinkWithCopy
							key={index}
							id={item.value}
							title={item.label}
							uri='/planning/finishing-batch'
						/>
					))}
				</div>
			),
		},
		{
			title: 'O/N',
			content: (
				<div>
					{order_numbers?.map((item, index) => (
						<LinkWithCopy
							key={index}
							id={`${item.label}/${item.value}`}
							title={item.label}
							uri='/order/details'
						/>
					))}
				</div>
			),
		},
		{
			title: 'P/Q',
			content: production_quantity,
		},
		{
			title: 'A/Q',
			content: achieved_quantity || 0,
		},
	];

	return (
		<div className='flex flex-col'>
			<div
				className={cn(
					'rounded-md border border-secondary/30 bg-base-100 text-foreground',
					production_quantity > production_capacity_quantity
						? 'bg-error/10'
						: ''
				)}>
				<div className='overflow-x-auto'>
					<table className='table table-zebra table-xs'>
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
		</div>
	);
}
