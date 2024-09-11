import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import { useMemo } from 'react';
import getColumn from './Column';

export default function Index({
	item_name,
	end_type_name,
	stopper_type_name,
	zipper_number_name,
	order_entry,
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

	return <ReactTable title='Details' data={order_entry} columns={columns} />;
}
