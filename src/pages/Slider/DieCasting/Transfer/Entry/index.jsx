import { useAccess } from '@/hooks';
import PageContainer from '@/ui/Others/PageContainer';

import Tabs from '@/ui/Others/Tabs';

import AgainstOrder from './AgainstOrder';
import AgainstStock from './AgainstStock';
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
		label: 'Against Stock',
		content: <AgainstStock />,
	},
	{
		label: 'Against Order',
		content: <AgainstOrder />,
	},
];

const Index = () => {
	const haveAccess = useAccess('slider__die_casting_transfer_entry');

	return (
		<PageContainer title={'Create Transfer'} breadcrumbs={breadcrumbs}>
			<Tabs tabs={tabs} tabSize={'md'} className='mb-8' />
		</PageContainer>
	);
};

export default Index;
