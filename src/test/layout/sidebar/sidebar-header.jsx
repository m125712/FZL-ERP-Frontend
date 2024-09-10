import { useSidebar } from './sidebar-provider';
import { CopyMinus } from 'lucide-react';
import { motion } from 'framer-motion';
import SidebarLogo from './sidebar-logo';

const SidebarHeader = () => {
	const { setIsCloseAll } = useSidebar();

	return (
		<div>
			<div className='border-b border-secondary px-4 py-6'>
				<SidebarLogo className='flex items-center justify-center text-2xl font-bold text-primary-content md:text-4xl' />
			</div>

			<div className='flex justify-end px-2 py-2'>
				<div
					className='tooltip tooltip-bottom tooltip-secondary'
					data-tip='Collapse Folders'>
					<motion.button
						whileTap={{ scale: 0.9 }}
						onClick={() => setIsCloseAll((prev) => !prev)}
						className='text- btn btn-square btn-ghost btn-sm text-primary-content/70'>
						<CopyMinus className='size-4' />
					</motion.button>
				</div>
			</div>
		</div>
	);
};

export default SidebarHeader;
