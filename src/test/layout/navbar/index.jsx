import { useLayout } from '../layout-provider';
import { PanelLeftOpen, PanelRightOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
	const { isCollapsed, setIsCollapsed } = useLayout();
	return (
		<div className='bg-background w-full border-b px-4 py-4 lg:px-8'>
			<div
				className='tooltip tooltip-right tooltip-secondary'
				data-tip='Collapse Sidebar'>
				<motion.button
					whileTap={{ scale: 0.9 }}
					className='size-fit text-secondary'
					onClick={() => setIsCollapsed((prev) => !prev)}>
					{isCollapsed ? (
						<PanelLeftOpen className='size-6' />
					) : (
						<PanelRightOpen className='size-6' />
					)}
				</motion.button>
			</div>
		</div>
	);
};

export default Navbar;
