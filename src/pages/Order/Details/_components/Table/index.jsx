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

	let colspan = 0; // * colspan for delivery quantity

	if (!is_sample) {
		colspan += 1;

		// if (item_name?.toLowerCase() === 'vislon') colspan += 1;
		// if (item_name?.toLowerCase() === 'metal') colspan += 2;
	}

	return (
		<ReactTable
			title='Details'
			subtitle={
				<div className='flex flex-col'>
					<span>
						warehouse = when the packing list is warehouse received
					</span>
					<span>
						delivered = when the packing list is warehouse out
					</span>
				</div>
			}
			data={order_entry}
			columns={columns}
		>
			<tr className='bg-slate-200 font-bold'>
				<td colSpan={6} className='text-right'>
					Total:
				</td>
				<td className='px-3 py-1'>{total.Quantity}</td>
				<td className='px-3 py-1'>{total.piQuantity}</td>
				<td className='px-3 py-1'>{total.rejectQuantity}</td>
				<td className='px-3 py-1'>{total.shortQuantity}</td>
				{!is_sample && (
					<td className='px-3 py-1'>{total.tapeQuantity}</td>
				)}
				{!is_sample && item_name?.toLowerCase() !== 'nylon' && (
					<td className='px-3 py-1'></td>
				)}
				{!is_sample && item_name?.toLowerCase() === 'metal' && (
					<td className='px-3 py-1'></td>
				)}
				{!is_sample && (
					<td className='px-3 py-1'>{total.sliderQuantity}</td>
				)}
				{!is_sample && <td colSpan={colspan}></td>}
				<td className='px-3 py-1'>{total.warehouseQuantity}</td>
				<td className='px-3 py-1'>{total.deliveryQuantity}</td>
				<td className='px-3 py-1'>
					{total.companyPrice.toFixed(2)}/
					{total.partyPrice.toFixed(2)}
				</td>
				<td></td>
			</tr>
		</ReactTable>
	);
}
