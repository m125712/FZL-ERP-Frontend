import { useMemo } from 'react';
import { useAuth } from '@/context/auth';
import { format } from 'date-fns';

const DashboardHeader = () => {
	const auth = useAuth();
	const userInfo = useMemo(() => auth?.user, [auth?.user]);

	return (
		<div className='sticky top-0 z-50 border-b bg-base/50 px-4 py-1 shadow-sm backdrop-blur-xl lg:px-8'>
			<div className='flex items-center justify-between'>
				<div className='flex flex-col'>
					<h2 className='text-2xl font-medium capitalize text-primary'>
						Welcome Back, {userInfo?.name}
					</h2>
					<p className='text-sm text-secondary'>
						{format(new Date(), 'EEEE, dd MMM yyyy')}
					</p>
				</div>
			</div>
		</div>
	);
};

export default DashboardHeader;
