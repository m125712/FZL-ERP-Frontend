import { motion } from 'framer-motion';
import { PanelLeftOpenIcon, PanelRightOpenIcon } from 'lucide-react';

import { useLayout } from '../layout-provider';

const SidebarCollapse = () => {
	const { isCollapsed, setIsCollapsed } = useLayout();
	return (
		<div className='hidden md:block'>
			<div
				className='tooltip tooltip-right tooltip-secondary'
				data-tip='Collapse Sidebar'>
				<motion.button
					whileTap={{ scale: 0.9 }}
					className='size-fit text-secondary'
					onClick={() => {
						setIsCollapsed((prev) => !prev);
					}}>
					{isCollapsed ? (
						<PanelLeftOpenIcon className='size-6' />
					) : (
						<PanelRightOpenIcon className='size-6' />
					)}
				</motion.button>
			</div>
		</div>
	);
};

export default SidebarCollapse;
