import { router } from '@/routes/router';
import AuthProvider from '@context/auth';
import { RouterProvider } from 'react-router/dom';

import { Toast } from '@/components/Toast';

import { Loader } from './components/Feedback';

function App() {
	return (
		<AuthProvider>
			<RouterProvider router={router} fallbackElement={<Loader />} />
			<Toast />
		</AuthProvider>
	);
}

export default App;
