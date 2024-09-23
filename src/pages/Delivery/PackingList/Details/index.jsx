import { useEffect } from 'react';
import { useDeliveryPackingListDetailsByUUID } from '@/state/Delivery';
import { useParams } from 'react-router-dom';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { uuid } = useParams();
	const { data, isLoading, invalidateQuery } =
		useDeliveryPackingListDetailsByUUID(uuid, {
			params: 'is_update=false',
		});

	useEffect(() => {
		invalidateQuery();
		document.title = `Packing List: ${uuid}`;
	}, [uuid]);

	console.log({ data });

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-8 py-4'>
			<Information packing_list={data} />
			<Table packing_list_entry={data?.packing_list_entry} />
		</div>
	);
}
