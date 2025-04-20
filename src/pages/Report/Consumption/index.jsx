import { lazy } from 'react';

import { Suspense } from '@/components/Feedback';

const ItemWise = lazy(() => import('./item-wise'));
const DescriptionWise = lazy(() => import('./description-wise'));

const index = () => {
	return (
		<Suspense>
			<DescriptionWise />
			<ItemWise />
		</Suspense>
	);
};

export default index;
