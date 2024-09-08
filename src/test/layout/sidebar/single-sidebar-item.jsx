import { NavLink, useResolvedPath } from 'react-router-dom';
import cn from '@/lib/cn';
import matchUrl from '@/util/matchUrl';

const SingleSidebarItem = ({ path, name }) => {
	const { pathname } = useResolvedPath();

	return (
		<li>
			<NavLink
				to={path}
				className={({ isActive }) =>
					cn(
						'block border-l-[3px] px-4 py-2 text-sm font-normal transition-colors duration-200',
						isActive || matchUrl(path, pathname)
							? 'border-accent bg-accent/20 font-medium text-white'
							: 'border-transparent text-primary-content/70 hover:text-primary-content'
					)
				}>
				{name}
			</NavLink>
		</li>
	);
};

export default SingleSidebarItem;
