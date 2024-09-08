import cn from '@/lib/cn';
import { useSidebar } from './sidebar-provider';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

const NestedSidebarItem = ({ path, name, children }) => {
	const {
		path: { pathname },
		isCloseAll,
		setIsCloseAll,
	} = useSidebar();

	console.log({
		isCloseAll,
	});

	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (pathname.includes(path) && !isCloseAll) {
			setIsOpen(true);
		} else {
			setIsOpen(false);
		}
	}, [path, pathname, setIsOpen, isCloseAll]);

	return (
		<ul>
			<Link
				onClick={() => {
					setIsOpen((prev) => !prev);
					setIsCloseAll(false);
				}}
				className={cn(
					'group flex w-full justify-between rounded-none border-l-[3px] px-4 py-2 text-sm text-primary-content',
					isOpen && !isCloseAll
						? 'border-secondary bg-secondary/20 text-white'
						: 'border-transparent hover:bg-secondary/10'
				)}
				to={path}>
				{name}

				<ChevronRight
					className={cn(
						'h-5 w-5 transform duration-300 ease-in-out group-hover:scale-110',
						isOpen && !isCloseAll && 'rotate-90'
					)}
				/>
			</Link>

			{isOpen && <div className='pl-3'>{children}</div>}
		</ul>
	);
};

export default NestedSidebarItem;
