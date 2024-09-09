import { BrandLink } from '@/components/Sidebar/utils';
import { useSidebar } from './sidebar-provider';
import { CopyMinus } from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarHeader = () => {
	const { setIsCloseAll } = useSidebar();

	return (
		<div>
			<div className='border-b border-secondary px-4 py-6'>
				<BrandLink className='flex items-center justify-center text-2xl font-bold text-primary-content md:text-4xl' />
			</div>

			<div className='flex justify-end px-2 py-2'>
				<motion.button
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsCloseAll((prev) => !prev)}
					className='text- btn btn-square btn-ghost btn-sm text-primary-content/70'>
					<CopyMinus className='size-4' />
				</motion.button>
			</div>
		</div>
	);
};

export default SidebarHeader;
