import { useAccess } from '@/hooks';
import PageContainer from '@/ui/Others/PageContainer';

import Tabs from '@/ui/Others/Tabs';

import AgainstOrder from './AgainstOrder';
import AgainstStock from './AgainstStock';

const Index = () => {
	useAccess('slider__die_casting_transfer_entry');

	const breadcrumbs = [
		{
			label: 'Slider',
			isDisabled: true,
		},
		{
			label: 'Die Casting',
			isDisabled: true,
		},
		{
			label: 'Transfer',
			href: '/slider/die-casting/transfer',
		},
		{
			label: 'Create',
			href: '/slider/die-casting/transfer/entry',
		},
	];

	const tabs = [
		{
			label: 'Against Order',
			content: <AgainstOrder />,
		},
		{
			label: 'Against Stock',
			content: <AgainstStock />,
		},
	];

	return (
		<PageContainer title={'Create Transfer'} breadcrumbs={breadcrumbs}>
			<Tabs tabs={tabs} tabSize={'md'} className='mb-8' />
		</PageContainer>
	);
};

export default Index;
