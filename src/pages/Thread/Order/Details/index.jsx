import { useFetchFunc } from '@/hooks';
import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { order_info_uuid } = useParams();
	const [orderInfo, setShadeRecipe] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		useFetchFunc(
			`/thread/order-info-details/by/${order_info_uuid}`,
			setShadeRecipe,
			setLoading,
			setError
		);
	}, [order_info_uuid]);

	if (!orderInfo) return <Navigate to='/not-found' />;
	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-8 py-4'>
			<Information orderInfo={orderInfo} />
			<Table {...orderInfo} />
		</div>
	);
}
