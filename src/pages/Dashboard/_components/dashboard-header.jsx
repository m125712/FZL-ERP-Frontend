import { useAuth } from '@/context/auth';
import { format } from 'date-fns';

const DashboardHeader = () => {
	const { user } = useAuth();
	return (
		<div className='flex flex-col'>
			<h2 className='text-2xl font-medium text-primary'>
				Welcome Back, {user?.name}!
			</h2>
			<p className='text-sm text-secondary'>
				{format(new Date(), 'EEEE, dd MMMM yyyy')}
			</p>
		</div>
	);
};

export default DashboardHeader;
