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
	sliderQuantity,
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
			}),
		[order_entry]
	);

	return (
		<ReactTable title='Details' data={order_entry} columns={columns}>
			<tr className='bg-slate-200 text-sm'>
				<td colSpan={is_inch || is_meter? 6: 5} className='text-right font-bold'>
					Total Quantity:
				</td>
				<td className='px-3 py-1'>{sliderQuantity.Quantity}</td>
				<td className='px-3 py-1'>{sliderQuantity.piQuantity}</td>
				<td className='px-3 py-1'>{sliderQuantity.rejectQuantity}</td>
				<td className='px-3 py-1'>{sliderQuantity.shortQuantity}</td>
				<td colSpan={is_inch || is_meter? 6: 4}></td>
				<td className='px-3 py-1'>{sliderQuantity.deliveryQuantity}</td>
				<td></td>
			</tr>
		</ReactTable>
	);
}
