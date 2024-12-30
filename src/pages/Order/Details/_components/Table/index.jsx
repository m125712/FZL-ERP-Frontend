import { useMemo } from 'react';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';

import getColumn from './Column';

export default function Index({
	item_name,
	end_type_name,
	stopper_type_name,
	zipper_number_name,
	order_entry,
	order_type,
	is_cm,
	is_inch,
	is_meter,
	is_sample,
	total,
	bleaching,
}) {
	const haveAccess = useAccess('order__details');
	const columns = useMemo(
		() =>
			getColumn({
				item_name: item_name?.toLowerCase(),
				end_type_name,
				stopper_type_name,
				zipper_number_name,
				show_price: haveAccess?.includes('show_price'),
				bleaching: bleaching,
				sizes: { is_cm, is_inch, is_meter },
				order_type,
				is_sample,
			}),
		[order_entry]
	);

	return (
		<ReactTable title='Details' data={order_entry} columns={columns}>
			<tr className='bg-slate-200 text-lg font-bold'>
				<td colSpan={6} className='text-right'>
					Total:
				</td>
				<td className='px-3 py-1'>{total.Quantity}</td>
				<td className='px-3 py-1'>{total.piQuantity}</td>
				<td className='px-3 py-1'>{total.rejectQuantity}</td>
				<td className='px-3 py-1'>{total.shortQuantity}</td>
				<td></td>
				<td className='px-3 py-1'>{total.deliveryQuantity}</td>
				<td></td>
			</tr>
		</ReactTable>
	);
}
