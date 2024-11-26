import { useEffect, useState } from 'react';
import { useThreadDetailsByUUID } from '@/state/Thread';
import OrderSheetPdf from '@components/Pdf/ThreadOrderSheet';
import { Navigate, useParams } from 'react-router-dom';
import { useFetchFunc } from '@/hooks';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { order_info_uuid } = useParams();

	const { data: orderInfo, isLoading } =
		useThreadDetailsByUUID(order_info_uuid);

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
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	if (!orderInfo) return <Navigate to='/not-found' />;

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
