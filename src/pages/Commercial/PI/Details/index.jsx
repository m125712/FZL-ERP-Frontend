import { useFetch } from '@/hooks';
import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Information from './Information';
import Table from './Table';

export default function Index() {
	const { pi_uuid } = useParams();

	const { value: data, loading } = useFetch(
		`/commercial/pi/details/${pi_uuid}`,
		[pi_uuid]
	);

	useEffect(() => {
		document.title = `PI: ${pi_uuid}`;
	}, [pi_uuid]);

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;

	if (!data) return <Navigate to='/not-found' />;

	// return <>Hello</>;
	return (
		<div className='space-y-2'>
			<Information pi={data} />
			<Table pi={data?.pi_entry} />
		</div>
	);
}
