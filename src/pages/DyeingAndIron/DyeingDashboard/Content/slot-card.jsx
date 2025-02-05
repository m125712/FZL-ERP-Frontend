import { CustomLink } from '@/ui';

import { cn } from '@/lib/utils';

export default function SlotCard({ data }) {
	const {
		batch_no,
		batch_uuid,
		order_no,
		is_zipper,
		color,
		total_quantity,
		expected_kg,
		batch_status,
		total_actual_production_quantity,
		received,
		order_uuid,
	} = data;

	let batchUrl = `/dyeing-and-iron/thread-batch/${batch_uuid}`,
		orderNumberUrl = `/thread/order-info/${order_uuid}`;

	if (is_zipper === 1) {
		batchUrl = `/dyeing-and-iron/zipper-batch/${batch_uuid}`;
		orderNumberUrl = `/order/details/${order_no}`;
	}

	const items = [
		{
			title: 'B/N',
			content: (
				<CustomLink
					label={batch_no}
					url={batchUrl}
					openInNewTab
					showCopyButton={false}
				/>
			),
		},
		{
			title: 'O/N',
			content: (
				<CustomLink
					label={order_no}
					url={orderNumberUrl}
					openInNewTab
					showCopyButton={false}
				/>
			),
		},

		{
			title: 'Color',
			content: color,
		},
		{
			title: 'QTY',
			content: total_quantity,
		},
		{
			title: 'Exp (KG)',
			content: expected_kg,
		},
		{
			title: 'Prod QTY',
			content: total_actual_production_quantity,
		},
		{
			title: 'Status',
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
			title: 'Received',
			content: received,
		},
	];

	return (
		<div className='dropdown dropdown-right dropdown-hover w-full'>
			<div
				tabIndex={0}
				className={cn(
					'm-1 flex flex-col gap-2 rounded-md px-1 py-2 text-foreground',
					batch_status === 'completed'
						? 'bg-success/10'
						: batch_status === 'pending'
							? 'bg-warning/10'
							: 'bg-error/10'
				)}
			>
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
		</div>
	);
}
