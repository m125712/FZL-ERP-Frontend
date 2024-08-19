import { useEffect } from 'react';
import OrderTrxLog from './OrderTrxLog';
import TrxLog from './TrxLog';
import PageContainer from '@/ui/Others/PageContainer';

export default function Index() {
	useEffect(() => {
		document.title = 'Material Log';
	}, []);

	const breadcrumbs = [
		{
			label: 'Store',
			href: '/store',
			isDisabled: true,
		},
		{
			label: 'Log',
			href: '/store/log',
		},
	];

	return (
		<PageContainer title='Log Lists' breadcrumbs={breadcrumbs}>
			<TrxLog key='TrxLog' />
			<hr className='my-6 border-2 border-dashed border-secondary-content' />
			<OrderTrxLog key='OrderTrxLog' />
		</PageContainer>
	);
}
