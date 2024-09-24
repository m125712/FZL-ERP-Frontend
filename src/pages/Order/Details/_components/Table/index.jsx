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
	sliderQuantity,
}) {
	const haveAccess = useAccess('order__details_by_uuid');

	

	const columns = useMemo(
		() =>
			getColumn({
				item_name: item_name.toLowerCase(),
				end_type_name,
				stopper_type_name,
				zipper_number_name,
				show_price: haveAccess?.includes('show_price'),
			}),
		[order_entry]
	);

	return (
		<ReactTable title='Details' data={order_entry} columns={columns}>
			<tr className='text-sm'>
				<td colSpan={5} className=' text-center'>
					Total Quantity:
				</td>
				<td className='px-3 py-1'>{sliderQuantity}</td>
			</tr>
		</ReactTable>
	);
}
