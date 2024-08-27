import { useAccess } from '@/hooks';

import Tabs from '@/ui/Others/Tabs';

import AgainstOrder from './AgainstOrder';
import AgainstStock from './AgainstStock';

const Index = () => {
	useAccess('slider__die_casting_transfer_entry');

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

	return <Tabs tabs={tabs} tabSize={'md'} className='mb-8' />;
};

export default Index;
