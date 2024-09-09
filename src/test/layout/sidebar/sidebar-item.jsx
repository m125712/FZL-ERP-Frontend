import SidebarFolder from './sidebar-folder';
import SidebarFile from './sidebar-file';

const SidebarItem = ({ path, name, children, exclude, disableCollapse }) => {
	if (children) {
		return (
			<SidebarFolder
				path={path}
				name={name}
				exclude={exclude}
				disableCollapse={disableCollapse}>
				{children}
			</SidebarFolder>
		);
	}

	return <SidebarFile path={path} name={name} exclude={exclude} />;
};

export default SidebarItem;
