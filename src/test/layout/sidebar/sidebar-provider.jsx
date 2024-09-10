import { createContext, useContext, useState } from 'react';
import { useResolvedPath } from 'react-router-dom';

const SidebarContext = createContext({
	path: {
		pathname: '',
		hash: '',
		search: '',
	},
	isCloseAll: false,
	setIsCloseAll: () => {},
});

export const useSidebar = () => {
	return useContext(SidebarContext);
};

const SidebarProvider = ({ children }) => {
	const [isCloseAll, setIsCloseAll] = useState(false);
	const path = useResolvedPath();
	return (
		<SidebarContext.Provider
			value={{
				path,
				isCloseAll,
				setIsCloseAll,
			}}>
			{children}
		</SidebarContext.Provider>
	);
};

export default SidebarProvider;
