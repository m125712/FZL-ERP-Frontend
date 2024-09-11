import { useAuth } from '@/context/auth';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import User from '@/ui/Others/User';

const SidebarLogout = () => {
	const history = useLocation();
	const { Logout } = useAuth();

	const handleLogout = () => {
		Logout();
		history.push('/login');
	};

	return (
		<motion.button
			whileTap={{ scale: 0.95 }}
			className='flex w-full items-center gap-3 rounded-md bg-gradient-to-r from-accent/10 to-accent/30 px-5 py-2 text-left text-sm font-normal text-primary-content'
			onClick={handleLogout}>
			<LogOut className='size-6 text-primary-content' />
			<User />
		</motion.button>
	);
};

export default SidebarLogout;
