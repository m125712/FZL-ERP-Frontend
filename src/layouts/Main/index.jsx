import { Toast } from '@/components/Toast';
import AuthProvider from '@context/auth';
import { NextUIProvider } from '@nextui-org/react';

function MainLayout({ children }) {
	return (
		<AuthProvider>
			<NextUIProvider>
				{children}
				<Toast />
			</NextUIProvider>
		</AuthProvider>
	);
}

export default MainLayout;
