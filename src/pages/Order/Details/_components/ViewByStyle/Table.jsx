import { useMemo } from 'react';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';

import getColumn from './Column';

export default function Table({ order_entry, sliderQuantity }) {
	const haveAccess = useAccess('order__details');

	const columns = useMemo(
		() =>
			getColumn({
				show_price: haveAccess?.includes('show_price'),
				is_sample: order_entry?.[0]?.is_sample,
			}),
		[order_entry]
	);

	return (
		<ReactTable title='Details' data={order_entry} columns={columns}>
			<tr className='bg-slate-200 text-sm'>
				<td colSpan={6} className='text-right font-bold'>
					Total Quantity:
				</td>
				<td className='px-3 py-1'>{sliderQuantity.Quantity}</td>
				<td className='px-3 py-1'>{sliderQuantity.piQuantity}</td>
				<td className='px-3 py-1'>{sliderQuantity.rejectQuantity}</td>
				<td className='px-3 py-1'>{sliderQuantity.shortQuantity}</td>
				<td colSpan={7}></td>
				<td className='px-3 py-1'>{sliderQuantity.deliveryQuantity}</td>
				<td></td>
			</tr>
		</ReactTable>
	);
}
