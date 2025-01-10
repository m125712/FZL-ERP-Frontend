import { router } from '@/routes/router';
import AuthProvider from '@context/auth';
import { RouterProvider } from 'react-router-dom';

import { Toast } from '@/components/Toast';

function App() {
	return (
		<AuthProvider>
			<RouterProvider router={router} />
			<Toast />
		</AuthProvider>
	);
}

export default App;
