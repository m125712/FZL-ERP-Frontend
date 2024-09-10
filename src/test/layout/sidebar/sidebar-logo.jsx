import { filteredRoutes } from '@/test/routes';
import { NavLink } from 'react-router-dom';

const SidebarLogo = ({ ...props }) => {
	const route = filteredRoutes[0];

	return (
		<NavLink to={route?.path} {...props}>
			FZL
		</NavLink>
	);
};

export default SidebarLogo;
