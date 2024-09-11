import { useAuth } from '@/context/auth';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const SidebarLogout = () => {
	const history = useLocation();
	const { Logout, user } = useAuth();

	const handleLogout = () => {
		Logout();
		history.push('/login');
	};

	return (
		<motion.button
			whileTap={{ scale: 0.95 }}
			className='flex w-full items-center gap-4 rounded-md bg-gradient-to-r from-accent/20 to-accent/40 px-5 py-2 text-left text-sm font-normal text-primary-content'
			onClick={handleLogout}>
			<LogOut className='size-6 text-primary-content' />

			<div className='flex flex-col'>
				<span className='truncate capitalize'>{user?.name}</span>
				<span className='text-[.6rem] capitalize text-primary-content/70'>
					{user?.department}
				</span>
			</div>
		</motion.button>
	);
};

export default SidebarLogout;
