import { lazy, useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { Navigate, useParams } from 'react-router-dom';
import { useAccess, useFetchFunc } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import OrderSheetPdf from '@/components/Pdf/OrderSheet';

import { OrderInformation } from '../_components/Information';

const OrderDescriptionUUID = lazy(() => import('../ByOrderDescriptionUUID'));
const ViewByStyle = lazy(() => import('../_components/ViewByStyle'));

const getPath = (haveAccess, order_number, userId) => {
	if (haveAccess.includes('show_own_orders'))
		return `/zipper/order/details/single-order/by/${order_number}/marketing/${userId}`;

	return `/zipper/order/details/single-order/by/${order_number}`;
};

const renderHr = (showHr = false) => {
	if (!showHr) return null;

	return (
		<hr className='my-8 border-[1px] border-dashed border-secondary/30' />
	);
};

export default function Index() {
	const { user } = useAuth();
	const { order_number } = useParams();
	const haveAccess = useAccess('order__details');

	const [orders, setOrders] = useState([]);
	const [garments, setGarments] = useState([]);
	const [sr, setSr] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [data, setData] = useState('');
	const [getPdfData, setGetPdfData] = useState(null);
	const [updateView, setUpdateView] = useState(false);

	const path = getPath(haveAccess, order_number, user?.uuid);

	useEffect(() => {
		document.title = order_number;
		useFetchFunc(path, setOrders, setLoading, setError);
		useFetchFunc(
			`/other/order-properties/by/garments_wash`,
			setGarments,
			setLoading,
			setError
		);
		useFetchFunc(
			`/other/order-properties/by/special_requirement`,
			setSr,
			setLoading,
			setError
		);
	}, [order_number]);

	useEffect(() => {
		if (orders.length > 0) {
			const order_info = {
				id: orders[0]?.id,
				pi_numbers: orders[0]?.pi_numbers,
				is_bill: orders[0]?.is_bill,
				is_cash: orders[0]?.is_cash,
				is_sample: orders[0]?.is_sample,
				is_inch: orders[0]?.is_inch,
				order_status: orders[0]?.order_status,
				order_number: orders[0]?.order_number,
				party_name: orders[0]?.party_name,
				buyer_name: orders[0]?.buyer_name,
				marketing_name: orders[0]?.marketing_name,
				merchandiser_name: orders[0]?.merchandiser_name,
				factory_name: orders[0]?.factory_name,
				factory_address: orders[0]?.factory_address,
				user_name: orders[0]?.user_name,
				marketing_priority: orders[0]?.marketing_priority,
				factory_priority: orders[0]?.factory_priority,
				// date: format(new Date(orders[0]?.created_at), 'dd/MM/yyyy'),
				updated_at: orders[0]?.updated_at,
				created_at: orders[0]?.created_at,
			};

			const order_sheet = {
				order_info,
				order_entry: orders,
				garments,
				sr,
			};

			const res = OrderSheetPdf(order_sheet);

			setGetPdfData(res);

			res.getDataUrl((dataUrl) => {
				setData(dataUrl);
			});
			// getPdfData.download();
		}
	}, [orders, garments, sr]);

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	const order_info = {
		id: orders[0]?.id,
		pi_numbers: orders[0]?.pi_numbers,
		is_bill: orders[0]?.is_bill,
		is_cash: orders[0]?.is_cash,
		is_sample: orders[0]?.is_sample,
		is_inch: orders[0]?.is_inch,
		order_status: orders[0]?.order_status,
		order_number: orders[0]?.order_number,
		party_name: orders[0]?.party_name,
		buyer_name: orders[0]?.buyer_name,
		marketing_name: orders[0]?.marketing_name,
		merchandiser_name: orders[0]?.merchandiser_name,
		marketing_priority: orders[0]?.marketing_priority,
		factory_priority: orders[0]?.factory_priority,
		factory_name: orders[0]?.factory_name,
		factory_address: orders[0]?.factory_address,
		user_name: orders[0]?.user_name,
		created_at: orders[0]?.created_at,
		updated_at: orders[0]?.updated_at,
		created_by_name: orders[0]?.created_by_name,
		order_info_uuid: orders[0]?.order_info_uuid,
		reference_order: orders[0]?.reference_order,
		print_in: orders[0]?.print_in,
	};

	// if (!orders) return <Navigate to='/not-found' />;
	// if (orders?.length === 0)
	// 	return (
	// 		<div className='flex h-screen items-center justify-center text-4xl'>
	// 			Not Found
	// 		</div>
	// 	);

	return (
		<div className='flex flex-col py-4'>
			<iframe
				id='iframeContainer'
				src={data}
				className='h-[40rem] w-full rounded-md border-none'
			/>

			<OrderInformation
				order={order_info}
				// handelPdfDownload={() =>
				// 	getPdfData?.download(`Order Sheet ${order_number}.pdf`)
				// }
				handleViewChange={() =>
					updateView ? setUpdateView(false) : setUpdateView(true)
				}
				updateView
			/>

			{!updateView &&
				orders?.map((order, idx) => (
					<div key={idx}>
						<Suspense>
							<OrderDescriptionUUID
								initial_order={order}
								idx={idx}
							/>
						</Suspense>

						{renderHr(idx !== orders.length - 1)}
					</div>
				))}

			{updateView && (
				<div>
					<Suspense>
						<ViewByStyle initial_orders={orders} />
					</Suspense>
				</div>
			)}
		</div>
	);
}
