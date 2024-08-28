import { useAccess } from '@/hooks';

import Tabs from '@/ui/Others/Tabs';

import AgainstOrder from './AgainstOrder';
import AgainstStock from './AgainstStock';
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

	return <Tabs tabs={tabs} tabSize={'md'} className='mb-8' />;
};

export default Index;
