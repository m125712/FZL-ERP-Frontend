import { useAuth } from '@/context/auth';
import { LogOutIcon } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const SidebarLogout = () => {
	const history = useLocation();
	const { Logout, user } = useAuth();

	const handleLogout = () => {
		Logout();
		history.push('/login');
	};

	return (
		<li>
			<NavLink
				to='/login'
				className='btn btn-accent flex w-full justify-start text-left font-normal'
				onClick={handleLogout}>
				<LogOutIcon className='size-6' />
				<div className='flex flex-col justify-around gap-1'>
					<span className='truncate capitalize text-error-content'>
						{user?.name}
					</span>
					<span className='text-[.6rem] capitalize text-primary-content/70'>
						{user?.department}
					</span>
				</div>
			</NavLink>
		</li>
	);
};

export default SidebarLogout;
