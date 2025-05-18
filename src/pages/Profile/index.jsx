import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useAdminUsersByUUID } from '@/state/Admin';

import Information from './Information';

export default function Index() {
	const { user } = useAuth();

	const { data, isLoading, invalidateQuery } = useAdminUsersByUUID(
		user?.uuid
	);

	useEffect(() => {
		invalidateQuery();
		document.title = `Profile: ${data?.name}`;
	}, [data]);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return <Information data={data} />;
}
