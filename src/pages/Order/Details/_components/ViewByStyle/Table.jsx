import { useMemo } from 'react';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';

import getColumn from './Column';

export default function Table({ order_entry, sliderQuantity }) {
	const haveAccess = useAccess('order__details_by_uuid');

	const columns = useMemo(
		() =>
			getColumn({
				show_price: haveAccess?.includes('show_price'),
			}),
		[order_entry]
	);

    console.log(order_entry);
	return (
		<ReactTable title='Details' data={order_entry} columns={columns}>
			<tr className='text-sm'>
				<td colSpan={5} className='text-center'>
					Total Quantity:
				</td>
				<td className='px-3 py-1'>{sliderQuantity}</td>
			</tr>
		</ReactTable>
	);
}
