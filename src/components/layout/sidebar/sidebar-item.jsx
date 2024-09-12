import SidebarFile from './sidebar-file';
import SidebarFolder from './sidebar-folder';

const SidebarItem = ({ path, name, children, disableCollapse }) => {
	return children ? (
		<SidebarFolder
			path={path}
			name={name}
			disableCollapse={disableCollapse}>
			{children}
		</SidebarFolder>
	) : (
		<SidebarFile path={path} name={name} />
	);
};

export default SidebarItem;
