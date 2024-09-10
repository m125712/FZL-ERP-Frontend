import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import cn from '@/lib/cn';
import { useLayout } from '../layout-provider';

const SidebarCollapse = () => {
	const { isCollapsed, setIsCollapsed } = useLayout();
	return (
		<div className='absolute right-0 h-full w-[3px] bg-gradient-to-b from-accent/50 to-accent'>
			<div className='absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2'>
				<motion.button
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsCollapsed((prev) => !prev)}
					className={cn('btn btn-circle btn-accent btn-sm')}>
					<ChevronLeft
						className={cn(
							'size-5 transition-transform duration-200',
							isCollapsed ? 'rotate-180' : 'rotate-0'
						)}
					/>
				</motion.button>
			</div>
		</div>
	);
};

export default SidebarCollapse;
