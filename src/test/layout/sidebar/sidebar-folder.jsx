import cn from '@/lib/cn';
import { useSidebar } from './sidebar-provider';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SidebarFile from './sidebar-file';

const variants = {
	animate: {
		y: 0,
		opacity: 1,
		transition: {
			y: { stiffness: 1000, velocity: -100 },
		},
	},
	initial: {
		y: 50,
		opacity: 0,
		transition: {
			y: { stiffness: 1000 },
		},
	},
};

const SidebarFolder = ({ path, name, children, exclude, disableCollapse }) => {
	const {
		path: { pathname },
		isCloseAll,
		setIsCloseAll,
	} = useSidebar();

	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (pathname.includes(path) && !isCloseAll) {
			setIsOpen(true);
		}

		if (isCloseAll) {
			setIsOpen(false);
		}
	}, [path, pathname, setIsOpen, isCloseAll]);

	if (disableCollapse) {
		return <SidebarFile path={path} name={name} exclude={exclude} />;
	}

	if (exclude) return null;

	return (
		<motion.ul variants={variants} initial='initial' animate='animate'>
			<Link
				onClick={() => {
					setIsOpen((prev) => !prev);
					setIsCloseAll(false);
				}}
				className={cn(
					'group flex w-full items-center justify-between gap-2 rounded-none border-l-[3px] px-4 py-2 text-sm text-primary-content',
					isOpen && !isCloseAll
						? 'rounded-r-md border-secondary bg-gradient-to-r from-accent/10 to-accent/30 text-primary-content'
						: 'border-transparent text-primary-content/70 hover:bg-secondary/20 hover:text-primary-content'
				)}
				to={path}>
				<span className='truncate'>{name}</span>

				<ChevronRight
					className={cn(
						'h-5 w-5 transform duration-300 ease-in-out group-hover:scale-110',
						isOpen && !isCloseAll && 'rotate-90'
					)}
				/>
			</Link>

			{isOpen && (
				<ul className='border-l-[2px] border-secondary/40 pl-3 pt-1'>
					{children?.map((child) => {
						if (child?.children) {
							return (
								<SidebarFolder key={child.path} {...child} />
							);
						} else {
							return <SidebarFile key={child.path} {...child} />;
						}
					})}
				</ul>
			)}
		</motion.ul>
	);
};

export default SidebarFolder;
