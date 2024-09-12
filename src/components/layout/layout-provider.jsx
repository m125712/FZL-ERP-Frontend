import { createContext, useContext, useState } from 'react';

export const LayoutContext = createContext({
	isCollapsed: false,
	setIsCollapsed: () => {},
	sidebarOpen: true,
	setSidebarOpen: () => {},
});

export const useLayout = () => {
	return useContext(LayoutContext);
};

const LayoutProvider = ({ children }) => {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<LayoutContext.Provider
			value={{
				isCollapsed,
				setIsCollapsed,
				sidebarOpen,
				setSidebarOpen,
			}}>
			{children}
		</LayoutContext.Provider>
	);
};

export default LayoutProvider;
