import { Suspense } from '@/components/Feedback';
import OrderSheetPdf from '@/components/Pdf/OrderSheet';
import { useAuth } from '@/context/auth';
import { useAccess, useFetchFunc } from '@/hooks';
import { format } from 'date-fns';
import { lazy, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { OrderInformation } from '../_components/Information';

const OrderDescriptionUUID = lazy(() => import('../ByOrderDescriptionUUID'));

const getPath = (haveAccess, order_number, userId) => {
	if (haveAccess.includes('show_own_orders'))
		return `/zipper/order/details/single-order/by/${order_number}/marketing/${userId}`;

	return `/zipper/order/details/single-order/by/${order_number}`;
};

const renderHr = (showHr = false) => {
	if (!showHr) return null;

	return (
		<hr className='my-12 border-2 border-dashed border-secondary-content' />
	);
};

export default function Index() {
	const { user } = useAuth();
	const { order_number } = useParams();
	const haveAccess = useAccess('order__details');

	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [data, setData] = useState('');
	const [getPdfData, setGetPdfData] = useState(null);

	const path = getPath(haveAccess, order_number, user.id);

	useEffect(() => {
		document.title = order_number;
		useFetchFunc(path, setOrders, setLoading, setError);
	}, [order_number]);

	useEffect(() => {
		if (orders.length > 0) {
			const order_info = {
				id: orders[0]?.id,
				is_bill: orders[0]?.is_bill,
				is_cash: orders[0]?.is_cash,
				is_sample: orders[0]?.is_sample,
				order_status: orders[0]?.order_status,
				order_number: orders[0]?.order_number,
				party_name: orders[0]?.party_name,
				buyer_name: orders[0]?.buyer_name,
				marketing_name: orders[0]?.marketing_name,
				merchandiser_name: orders[0]?.merchandiser_name,
				factory_name: orders[0]?.factory_name,
				factory_address: orders[0]?.factory_address,
				user_name: orders[0]?.user_name,
				date: format(new Date(orders[0]?.created_at), 'dd/MM/yyyy'),
				updated_at: orders[0]?.updated_at,
			};

			const order_sheet = {
				order_info,
				order_entry: orders,
			};

			const res = OrderSheetPdf(order_sheet);

			setGetPdfData(res);

			res.getDataUrl((dataUrl) => {
				setData(dataUrl);
			});
			// getPdfData.download();
		}
	}, [orders]);

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	const order_info = {
		id: orders[0]?.id,
		is_bill: orders[0]?.is_bill,
		is_cash: orders[0]?.is_cash,
		is_sample: orders[0]?.is_sample,
		order_status: orders[0]?.order_status,
		order_number: orders[0]?.order_number,
		party_name: orders[0]?.party_name,
		buyer_name: orders[0]?.buyer_name,
		marketing_name: orders[0]?.marketing_name,
		merchandiser_name: orders[0]?.merchandiser_name,
		factory_name: orders[0]?.factory_name,
		factory_address: orders[0]?.factory_address,
		user_name: orders[0]?.user_name,
		created_at: orders[0]?.created_at,
		updated_at: orders[0]?.updated_at,
	};

	if (!orders) return <Navigate to='/not-found' />;
	if (orders?.length === 0)
		return (
			<div className='flex h-screen items-center justify-center text-4xl'>
				Not Found
			</div>
		);

	return (
		<div className='flex flex-col'>
			{/* <iframe
				id="iframeContainer"
				src={data}
				className="h-[40rem] w-full rounded-md border-none"
			/> */}

			<OrderInformation
				order={order_info}
				handelPdfDownload={() =>
					getPdfData?.download(`Order Sheet ${order_number}.pdf`)
				}
			/>

			{orders?.map((order, idx) => (
				<div key={idx}>
					<Suspense>
						<OrderDescriptionUUID initial_order={order} idx={idx} />
					</Suspense>

					{renderHr(idx !== orders.length - 1)}
				</div>
			))}
		</div>
	);
}
