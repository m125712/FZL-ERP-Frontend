import { LinkWithCopy } from '@/ui';

import { cn } from '@/lib/utils';

export default function DivContent({ data }) {
	const {
		batch_no,
		batch_uuid,
		order_no,
		order_uuid,
		color,
		weight,
		total_quantity,
		expected_kg,
		batch_status,
		total_actual_production_quantity,
		received,
	} = data;

	const items = [
		{
			title: 'Batch No',
			content: (
				<LinkWithCopy
					title={batch_no}
					id={batch_uuid}
					uri={`/dyeing-and-iron/zipper-batch`}
				/>
			),
		},
		{
			title: 'Order No',
			content: (
				<LinkWithCopy
					title={order_no}
					id={order_no}
					uri={`/order/details`}
				/>
			),
		},

		{
			title: 'Color',
			content: color,
		},
		{
			title: 'Weight',
			content: weight,
		},
		{
			title: 'Total Quantity',
			content: total_quantity,
		},
		{
			title: 'Expected Weight (KG)',
			content: expected_kg,
		},
		{
			title: 'Batch Status',
			content:
				batch_status === 'completed' ? (
					<span className='badge badge-success badge-xs h-5 text-[10px]'>
						Completed
					</span>
				) : batch_status === 'pending' ? (
					<span className='badge badge-warning badge-xs h-5 text-[10px]'>
						Pending
					</span>
				) : (
					<span className='badge badge-error badge-xs h-5 text-[10px]'>
						Cancelled
					</span>
				),
		},
		{
			title: 'Total QTY',
			content: total_actual_production_quantity,
		},
		{
			title: 'Received',
			content: received,
		},
	];

	return (
		<div className='dropdown dropdown-right dropdown-hover !m-0'>
			<div
				tabIndex={0}
				className={cn(
					'my-3 flex flex-col gap-2 rounded-md px-1 py-2 text-foreground',
					batch_status === 'completed'
						? 'bg-success/10'
						: batch_status === 'pending'
							? 'bg-warning/10'
							: 'bg-error/10'
				)}>
				<div className='overflow-x-auto'>
					<table className='table table-xs'>
						<tbody>
							{items.map((item, index) => (
								<tr key={index} className='border-foreground/5'>
									<th>{item.title}</th>
									<td className='whitespace-nowrap'>
										{item.content}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<div
				tabIndex={1}
				className='menu dropdown-content z-[1] w-60 overflow-x-auto rounded-box bg-base-100 p-2 shadow'>
				<table className='table table-xs'>
					<tbody>
						{items.map((item, index) => (
							<tr key={index} className='border-foreground/5'>
								<th>{item.title}</th>
								<td className='whitespace-nowrap'>
									{item.content}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
	return (
		<div
			className={cn(
				'm-0.5 flex flex-col gap-2 rounded-md px-1 py-2 text-foreground',
				batch_status === 'completed'
					? 'bg-success/20'
					: batch_status === 'pending'
						? 'bg-warning/20'
						: 'bg-error/20'
			)}>
			<div className='overflow-x-auto'>
				<table className='table table-xs'>
					<tbody>
						{items.map((item, index) => (
							<tr key={index} className='border-foreground/5'>
								<th>{item.title}</th>
								<td className='whitespace-nowrap'>
									{item.content}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
