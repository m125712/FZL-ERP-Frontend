import { Link, useResolvedPath } from 'react-router-dom';
import { flatRoutes } from '../../routes/routes';
import matchUrl from '@/util/matchUrl';

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
			matchUrl(item.path, route)
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
							<li key={index}>
								<Link to={route?.path}>{route?.name}</Link>
							</li>
						))}

				{matchedRoutes?.length > 0 && (
					<li>{matchedRoutes[matchedRoutes.length - 1].name}</li>
				)}
			</ul>
		</div>
	);
};

export default Breadcrumbs;
