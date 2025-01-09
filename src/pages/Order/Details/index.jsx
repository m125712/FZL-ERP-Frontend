import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useOrderDetailsByQuery } from '@/state/Order';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { StatusSelect } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { DetailsColumns } from '../columns';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_all_orders')) {
		return `?all=true`;
	}
	if (
		haveAccess.includes('show_approved_orders') &&
		haveAccess.includes('show_own_orders') &&
		userUUID
	) {
		return `/by/${userUUID}?approved=true`;
	}

	if (haveAccess.includes('show_approved_orders')) {
		return '?all=false&approved=true';
	}

	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `/by/${userUUID}`;
	}

	return `?all=false`;
};

export default function Index() {
	// const [path, setPath] = useState(null);
	const [status, setStatus] = useState('all');
	// * options for extra select in table
	const options = [
		{ value: 'bulk', label: 'Bulk' },
		{ value: 'sample', label: 'Sample' },
		{ value: 'all', label: 'All' },
	];

	const haveAccess = useAccess('order__details');
	const { user } = useAuth();

	const { data, isLoading, url } = useOrderDetailsByQuery(
		getPath(haveAccess, user?.uuid) + `&type=${status}`,
		{
			enabled: !!user?.uuid,
		}
	);

	const navigate = useNavigate();
	const info = new PageInfo('Order/Details', url, 'order__details');

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
			extraButton={
				<StatusSelect
					status={status}
					setStatus={setStatus}
					options={options}
				/>
			}
		/>
	);
}
