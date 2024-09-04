import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Information from './Information';
import Table from './Table';
import { usePurchaseDetailsByUUID } from '@/state/Store';

export default function Index() {
	const { purchase_description_uuid } = useParams();

	const { data, isLoading } = usePurchaseDetailsByUUID(
		purchase_description_uuid
	);

	useEffect(() => {
		document.title = 'Purchase Details';
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className={'space-y-8'}>
			<Information purchase={data} />
			<Table {...data} />
		</div>
	);
}
