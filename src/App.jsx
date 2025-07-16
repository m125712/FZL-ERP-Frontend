import { router } from '@/routes/router';
import AuthProvider from '@context/auth';
import { RouterProvider } from 'react-router/dom';
import { toast } from 'react-toastify';

import { Toast } from '@/components/Toast';

import { Loader } from './components/Feedback';
import NotificationSocket from './util/Notification';

function App() {
	const handleNewIssue = (issue) => {
		toast.info(`🚨 New issue reported: ${issue}`);
	};
	return (
		<AuthProvider>
			<RouterProvider router={router} fallbackElement={<Loader />} />
			<Toast />
			<NotificationSocket onNewIssue={handleNewIssue} />
		</AuthProvider>
	);
}

export default App;
