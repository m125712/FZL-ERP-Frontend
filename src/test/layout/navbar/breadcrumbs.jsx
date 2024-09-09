import { Link, useResolvedPath } from 'react-router-dom';
import { flatRoutes } from '../../routes/routes';
import matchUrl from '@/util/matchUrl';
import { motion } from 'framer-motion';

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

const Breadcrumbs = () => {
	const pathName = useResolvedPath().pathname;
	const paths = pathName
		.split('/')
		.slice(1)
		.filter((path) => path !== '');

	const generateRoutes = (paths) => {
		if (paths.length === 0) {
			return [];
		}

		const routes = [];

		for (let i = 0; i < paths.length; i++) {
			if (i === 0) {
				routes.push('/' + paths[i]);
			} else {
				routes.push(`${routes[i - 1]}/${paths[i]}`);
			}
		}

		return routes;
	};

	const matchedRoutes = generateRoutes(paths)?.map((route) => {
		const matchedRoute = flatRoutes.find((item) =>
			matchUrl(item?.path, route)
		);

		return {
			name: matchedRoute?.name,
			path: matchedRoute?.path,
		};
	});

	return (
		<div className='breadcrumbs text-sm'>
			<ul>
				<li>
					<Link to='/'>Home</Link>
				</li>

				{matchedRoutes?.length > 0 &&
					matchedRoutes
						.slice(0, matchedRoutes.length - 1)
						.map((route, index) => (
							<motion.li
								key={index}
								variants={variants}
								initial='initial'
								animate='animate'>
								<Link to={route?.path}>{route?.name}</Link>
							</motion.li>
						))}

				{matchedRoutes?.length > 0 && (
					<motion.li
						key={matchedRoutes.length - 1}
						variants={variants}
						initial='initial'
						animate='animate'
						className='font-medium'>
						{matchedRoutes[matchedRoutes.length - 1].name}
					</motion.li>
				)}
			</ul>
		</div>
	);
};

export default Breadcrumbs;
