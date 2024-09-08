import { useSidebar } from './sidebar-provider';
import { CopyMinus } from 'lucide-react';

const SidebarHeader = () => {
	const { setIsCloseAll } = useSidebar();

	return (
		<div>
			<div className='border-b border-secondary/20 p-8'>
				<h1 className='text-xl text-white'>Sidebar</h1>
			</div>

			<div className='flex justify-end px-2 py-2'>
				<button
					onClick={() => setIsCloseAll((prev) => !prev)}
					className='text- btn btn-square btn-ghost btn-sm text-primary-content'>
					<CopyMinus className='size-4' />
				</button>
			</div>
		</div>
	);
};

export default SidebarHeader;
