import { useEffect } from 'react';
import Information from './Information';
import { useCommercialLCByNumber } from '@/state/Commercial';
import { useParams } from 'react-router-dom';

export default function Index() {
	const { lc_number } = useParams();
	const { data, isLoading, invalidateQuery } =
		useCommercialLCByNumber(lc_number);

	useEffect(() => {
		invalidateQuery();
		document.title = `LC: ${lc_number}`;
	}, [lc_number]);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return <Information lc={data} />;
}
