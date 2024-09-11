import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import { useOrderDetails } from '@/state/Order';
import PageInfo from '@/util/PageInfo';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailsColumns } from '../columns';

export default function Index() {
	const { data, isLoading, url } = useOrderDetails();
	const navigate = useNavigate();
	const info = new PageInfo('Order/Details', url, 'order__details');
	const haveAccess = useAccess('order__details');

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => navigate('/order/entry');

	// Update
	const handelUpdate = (idx) => {
		const { order_description_uuid, order_number } = data[idx];

		navigate(`/order/${order_number}/${order_description_uuid}/update`);
	};

	const columns = DetailsColumns({
		handelUpdate,
		haveAccess,
		data,
	});

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			title={info.getTitle()}
			accessor={haveAccess.includes('create')}
			data={data}
			columns={columns}
			handelAdd={handelAdd}
		/>
	);
}
