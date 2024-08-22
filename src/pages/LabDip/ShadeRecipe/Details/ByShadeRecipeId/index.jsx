import { useFetch } from '@/hooks';
import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Information from './Information';
import Table from './Table';
import PageContainer from '@/ui/Others/PageContainer';

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

	const breadcrumbs = [
		{
			label: 'Store',
			href: '/store',
			isDisabled: true,
		},
		{
			label: 'Receive',
			href: '/store/receive',
		},

		{
			label: 'Details',
			href: `/store/receive/${purchase_description_uuid}`,
		},
	];

	return (
		<PageContainer
			title='Purchase Details'
			breadcrumbs={breadcrumbs}
			className={'space-y-8'}>
			<Information purchase={data} />
			<Table {...data} />
		</PageContainer>
	);
}
