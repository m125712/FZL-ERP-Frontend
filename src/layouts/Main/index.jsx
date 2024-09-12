import { Toast } from '@/components/Toast';
import AuthProvider from '@context/auth';

function MainLayout({ children }) {
	return (
		<AuthProvider>
			{children}
			<Toast />
		</AuthProvider>
	);
}

export default MainLayout;
