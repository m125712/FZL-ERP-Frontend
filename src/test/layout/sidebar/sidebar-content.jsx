import SidebarHeader from './sidebar-header';
import SidebarLogout from './sidebar-logout';
import { motion } from 'framer-motion';
import cn from '@/lib/cn';
import SidebarMenu from './sidebar-menu';
import { useLayout } from '../layout-provider';

const SidebarContent = () => {
	const { isCollapsed } = useLayout();

	return (
		<aside className={cn('relative h-full bg-primary')}>
			{/* <SidebarCollapse /> */}
			<motion.div
				variants={{
					open: { opacity: 1, width: '18rem' },
					closed: { opacity: 1, width: 0, overflow: 'hidden' },
				}}
				animate={isCollapsed ? 'closed' : 'open'}
				className={cn('flex h-full flex-col')}>
				<SidebarHeader />
				<SidebarMenu />
				<div className='p-4'>
					<SidebarLogout />
				</div>
			</motion.div>
		</aside>
	);
};

export default SidebarContent;
