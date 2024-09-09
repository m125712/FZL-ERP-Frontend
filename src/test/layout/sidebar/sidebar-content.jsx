import SidebarHeader from './sidebar-header';
import SidebarLogout from './sidebar-logout';
import { useSidebar } from './sidebar-provider';
import { motion } from 'framer-motion';
import cn from '@/lib/cn';
import SidebarCollapse from './sidebar-collapse';
import SidebarMenu from './sidebar-menu';

const SidebarContent = () => {
	const { isCollapsed } = useSidebar();

	return (
		<aside className={cn('relative h-full bg-primary')}>
			<SidebarCollapse />
			<motion.div
				variants={{
					open: { opacity: 1, width: '18rem' },
					closed: { opacity: 0, width: '1.5rem' },
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
