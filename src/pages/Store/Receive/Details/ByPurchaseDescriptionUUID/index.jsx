import { useFetch } from '@/hooks';
import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Information from './Information';
import Table from './Table';

export default function Index() {
	const { purchase_description_uuid } = useParams();

	const { value: data, loading } = useFetch(
		`/purchase/purchase-details/by/${purchase_description_uuid}`,
		[purchase_description_uuid]
	);

	useEffect(() => {
		document.title = 'Purchase Details';
	}, []);

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	if (!data) return <Navigate to='/not-found' />;

	return (
		<div className='container mx-auto my-2 w-full space-y-2 px-2 md:px-4'>
			<Information purchase={data} />
			<Table {...data} />
		</div>
	);
}
