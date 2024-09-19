import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

import { useLayout } from '../layout-provider';

const SidebarMobileToggle = () => {
	const { setSidebarOpen } = useLayout();
	return (
		<motion.button
			whileTap={{ scale: 0.9 }}
			className='size-fit text-secondary'
			onClick={() => {
				setSidebarOpen((prev) => !prev);
			}}>
			<Menu />
		</motion.button>
	);
};

export default SidebarMobileToggle;
