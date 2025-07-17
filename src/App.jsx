import { useEffect } from 'react';
import { router } from '@/routes/router';
import AuthProvider from '@context/auth';
import { RouterProvider } from 'react-router/dom';
import { toast } from 'react-toastify';

import { Toast } from '@/components/Toast';

import { Loader } from './components/Feedback';
import NotificationSocket from './util/Notification';

function App() {
	const handleNewIssue = (issue) => {
		console.log(issue);
		if ('Notification' in window && Notification.permission === 'granted') {
			new Notification('🚨 New Issue Reported', {
				body: issue || 'HEHE',
			});
		}
	};

	useEffect(() => {
		if ('Notification' in window && Notification.permission !== 'granted') {
			Notification.requestPermission().then((permission) => {
				console.log('Notification permission:', permission);
			});
		}
	}, []);

	return (
		<AuthProvider>
			<RouterProvider router={router} fallbackElement={<Loader />} />
			<Toast />
			<NotificationSocket onNewIssue={handleNewIssue} />
		</AuthProvider>
	);
}

export default App;
