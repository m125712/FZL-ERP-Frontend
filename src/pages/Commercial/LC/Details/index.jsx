import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Information from './Information';
import { useCommercialLCByNumber } from '@/state/Commercial';

export default function Index() {
	const { lc_number } = useParams();
	const { data, isLoading, isError } = useCommercialLCByNumber(lc_number);

	useEffect(() => {
		document.title = `LC: ${lc_number}`;
	}, [lc_number]);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	if (!isError && !data) return <Navigate to='/not-found' />;

	return (
		<div className='container mx-auto my-2 w-full space-y-2 px-2 md:px-4'>
			<Information lc={data} />
		</div>
	);
}
