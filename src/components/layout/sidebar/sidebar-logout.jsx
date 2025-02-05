import { useAuth } from '@/context/auth';
import { LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

import User from '@/ui/Others/User';

const SidebarLogout = () => {
	const navigate = useNavigate();
	const { Logout } = useAuth();

	const handleLogout = async () => {
		await Logout();
		navigate('/login', { replace: true });
	};

	return (
		<motion.button
			className='flex w-full items-center gap-2 rounded-md bg-gradient-to-r from-error/50 to-error/70 px-4 py-2 text-left font-normal text-primary-content'
			whileTap={{ scale: 0.95 }}
			onClick={() => handleLogout()}
		>
			<LogOut className='size-6 text-primary-content' />
			<User />
		</motion.button>
	);
};

export default SidebarLogout;
