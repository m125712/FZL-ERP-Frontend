import { Toast } from '@/components/Toast';
import AuthProvider from '@context/auth';
import { NextUIProvider } from '@nextui-org/react';

function MainLayout({ children }) {
	return (
		<AuthProvider>
			{children}
			<Toast />
		</AuthProvider>
	);
}

export default MainLayout;
