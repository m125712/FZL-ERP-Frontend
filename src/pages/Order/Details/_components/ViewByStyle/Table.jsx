import { useMemo } from 'react';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';

import getColumn from './Column';

export default function Table({ order_entry, total }) {
	const haveAccess = useAccess('order__details');
	const is_sample = order_entry?.[0]?.is_sample;

	const columns = useMemo(
		() =>
			getColumn({
				show_price: haveAccess?.includes('show_price'),
				is_sample: is_sample,
			}),
		[order_entry]
	);

	// let colspan = 1; // * colspan for delivery quantity

	// if (!order_entry?.[0]?.is_sample) {
	// 	colspan += 5;
	// }

	return (
		<ReactTable title='Details' data={order_entry} columns={columns}>
			<tr className='text bg-slate-200 font-bold text-primary'>
				<td colSpan={12} className='text-right'>
					Total:
				</td>
				<td className='px-3 py-1'>{total.Quantity}</td>
				<td className='px-3 py-1'>{total.piQuantity}</td>
				<td className='px-3 py-1'>{total.rejectQuantity}</td>
				<td className='px-3 py-1'>{total.shortQuantity}</td>
				{!is_sample && (
					<td className='px-3 py-1'>{total.tapeQuantity}</td>
				)}
				{!is_sample && <td className='px-3 py-1'></td>}
				{!is_sample && <td className='px-3 py-1'></td>}
				{!is_sample && (
					<td className='px-3 py-1'>{total.sliderQuantity}</td>
				)}
				{!is_sample && <td className='px-3 py-1'></td>}
				<td className='px-3 py-1'>{total.warehouseQuantity}</td>
				<td className='px-3 py-1'>{total.deliveryQuantity}</td>
				<td className='px-3 py-1'></td>
				<td className='px-3 py-1'></td>
				<td className='px-3 py-1'></td>
			</tr>
		</ReactTable>
	);
}
