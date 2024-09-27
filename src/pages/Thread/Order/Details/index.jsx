import { useEffect, useState } from 'react';
import OrderSheetPdf from '@components/Pdf/ThreadOrderSheet';
import { Navigate, useParams } from 'react-router-dom';
import { useFetchFunc } from '@/hooks';

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

	// ! FOR TESTING
	const [data, setData] = useState('');

	useEffect(() => {
		if (orderInfo && orderInfo?.order_info_entry) {
			OrderSheetPdf(orderInfo)?.getDataUrl((dataUrl) => {
				setData(dataUrl);
			});
		}
	}, [orderInfo]);
	// ! FOR TESTING

	if (!orderInfo) return <Navigate to='/not-found' />;
	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-8 py-4'>
			<iframe
				src={data}
				className='h-[40rem] w-full rounded-md border-none'
			/>
			<Information orderInfo={orderInfo} />
			<Table {...orderInfo} />
		</div>
	);
}
