import { LinkWithCopy } from '@/ui';

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

	console.log(data);
	return (
		<div
			className={`flex flex-col gap-2 p-2 ${
				{
					completed: 'bg-success/80',
					pending: 'bg-yellow-300',
				}[batch_status] || 'bg-red-300'
			} `}>
			<div className='grid grid-cols-2'>
				<span>Batch No: </span>
				<LinkWithCopy
					title={batch_no}
					id={batch_uuid}
					uri={`/dyeing-and-iron/zipper-batch`}
				/>
			</div>
			<div className='grid grid-cols-2'>
				<span>Order No: </span>
				<LinkWithCopy
					title={order_no}
					id={order_no}
					uri={`/order/details`}
				/>
			</div>
			<div className='grid grid-cols-2'>
				<span>Color: </span>
				<span>{color}</span>
			</div>
			<div className='grid grid-cols-2'>
				<span>Weight: </span>
				<span>{weight}</span>
			</div>
			<div className='grid grid-cols-2'>
				<span>Total Quantity: </span>
				<span>{total_quantity}</span>
			</div>
			<div className='grid grid-cols-2'>
				<span>Expected Kg: </span>
				<span>{expected_kg}</span>
			</div>
			<div className='grid grid-cols-2'>
				<span>Batch Status: </span>
				<span>{batch_status}</span>
			</div>
			<div className='grid grid-cols-2'>
				<span>Total QTY: </span>
				<span>{total_actual_production_quantity}</span>
			</div>
			<div className='grid grid-cols-2'>
				<span>Received: </span>
				<span>{received}</span>
			</div>
		</div>
	);
}
