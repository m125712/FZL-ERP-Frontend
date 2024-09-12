import { createContext, useContext, useState } from 'react';
import { useAuth } from '@/context/auth';
import { Navigate } from 'react-router-dom';

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

	//* Get the authentication state from the context
	const { signed, loading } = useAuth();

	//* Render a loading indicator while authentication is in progress
	if (loading) {
		return <span className='loading loading-dots loading-lg z-50' />;
	}

	//* If the user is not signed in, redirect to the login page
	if (!signed) {
		return <Navigate to='/login' replace={true} />;
	}

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
