import { useAuth } from '@/context/auth';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import User from '@/ui/Others/User';

const SidebarLogout = () => {
	const navigate = useNavigate();
	const { Logout } = useAuth();

	const handleLogout = () => {
		Logout();
		navigate('/login', { replace: true });
	};

	return (
		<motion.button
			className='flex w-full items-center gap-3 rounded-md bg-gradient-to-r from-accent/10 to-accent/30 px-5 py-2 text-left text-sm font-normal text-primary-content'
			whileTap={{ scale: 0.95 }}
			onClick={() => handleLogout()}>
			<LogOut className='size-6 text-primary-content' />
			<User />
		</motion.button>
	);
};

export default SidebarLogout;
