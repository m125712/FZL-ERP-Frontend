import { motion } from 'framer-motion';
import { House } from 'lucide-react';
import { Link } from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

import cn from '@/lib/cn';

const variants = {
	animate: {
		x: 0,
		opacity: 1,
		transition: {
			duration: 0.3,
			ease: 'easeOut',
		},
	},

	initial: {
		x: -50,
		opacity: 0,
	},
};

const GlobalBreadcrumbs = () => {
	const breadcrumbs = useBreadcrumbs();

	const items = breadcrumbs.map((e) => {
		if (e.match?.pathname === '/') {
			return {
				label: <House className='size-5' />,
				href: '/',
			};
		}

		return {
			label: e.breadcrumb,
			href: e.match?.pathname,
		};
	});

	return (
		<div className='breadcrumbs text-sm'>
			<ul>
				{items?.length > 0 &&
					items.slice(0, -1).map((item, index) => (
						<motion.li
							key={index}
							variants={variants}
							initial='initial'
							animate='animate'>
							{item.href ? (
								<Link
									to={item.href}
									className={cn('text-secondary')}>
									{item.label}
								</Link>
							) : (
								<span className={cn('text-secondary')}>
									{item.label}
								</span>
							)}
						</motion.li>
					))}

				{items?.length > 0 && (
					<motion.li
						key={items.length - 1}
						variants={variants}
						initial='initial'
						animate='animate'
						className='font-medium text-primary'>
						{items[items.length - 1].label}
					</motion.li>
				)}
			</ul>
		</div>
	);
};

export default GlobalBreadcrumbs;
