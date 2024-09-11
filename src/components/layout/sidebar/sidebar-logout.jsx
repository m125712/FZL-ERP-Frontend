import { useAuth } from '@/context/auth';
import { LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNetworkState } from '@uidotdev/usehooks';
import cn from '@/lib/cn';

const SidebarLogout = () => {
	const history = useLocation();
	const { Logout, user } = useAuth();
	const isOnline = useNetworkState().online;

	const handleLogout = () => {
		Logout();
		history.push('/login');
	};

	return (
		<motion.button
			whileTap={{ scale: 0.95 }}
			className='flex w-full items-center gap-3 rounded-md bg-gradient-to-r from-accent/10 to-accent/30 px-5 py-3 text-left text-sm font-normal text-primary-content'
			onClick={handleLogout}>
			<LogOut className='size-6 text-primary-content' />

			<div className='flex flex-1 flex-shrink-0 items-center gap-2'>
				<div className={cn('avatar', isOnline ? 'online' : 'offline')}>
					<div className='size-10 rounded-full'>
						<img
							className='object-cover'
							src='https://avatar.iran.liara.run/public/job/operator/male'
						/>
					</div>
				</div>

				<div className='flex flex-col items-start'>
					<span className='truncate capitalize'>{user?.name}</span>
					<span className='text-[.6rem] capitalize text-primary-content/70'>
						{user?.department}
					</span>
				</div>
			</div>
		</motion.button>
	);
};

export default SidebarLogout;
