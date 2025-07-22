import { useEffect } from 'react';
import { router } from '@/routes/router';
import AuthProvider from '@context/auth';
import { RouterProvider } from 'react-router/dom';
import { toast } from 'react-toastify';

import { Toast } from '@/components/Toast';

import { Loader } from './components/Feedback';
import NotificationSocket from './util/Notification';

function App() {
	// const handleNewIssue = (issue) => {
	// 	console.log(issue);
	// 	if ('Notification' in window && Notification.permission === 'granted') {
	// 		new Notification('🚨 New Issue Reported', {
	// 			body: issue || 'HEHE',
	// 		});
	// 	}
	// };

	// useEffect(() => {
	// 	if ('Notification' in window && Notification.permission !== 'granted') {
	// 		Notification.requestPermission().then((permission) => {
	// 			console.log('Notification permission:', permission);
	// 		});
	// 	}
	// }, []);

	useEffect(() => {
		if ('serviceWorker' in navigator) {
			registerAndSubscribe();
		}
	}, []);

	function urlBase64ToUint8Array(base64String) {
		const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding)
			.replace(/-/g, '+')
			.replace(/_/g, '/');
		const rawData = atob(base64);
		return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
	}

	async function registerAndSubscribe() {
		try {
			const registration =
				await navigator.serviceWorker.register('/service-worker.js');
			console.log('✅ Service Worker registered:', registration);

			const permission = await Notification.requestPermission();
			if (permission !== 'granted') {
				console.warn('❌ Push permission not granted');
				return;
			}
			console.log(import.meta.env.VITE_PUBLIC_VAPID_KEY);
			// ✅ Check if there’s already a subscription!
			let subscription = await registration.pushManager.getSubscription();
			if (!subscription) {
				console.log('ℹ️ No existing subscription, creating new one...');
				subscription = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: urlBase64ToUint8Array(
						import.meta.env.VITE_PUBLIC_VAPID_KEY
					),
				});
				console.log('✅ New subscription created:', subscription);
			} else {
				console.log('✅ Using existing subscription:', subscription);
			}

			// ✅ Send it to your backend anyway to keep it up to date
			// await fetch('http://localhost:4000/api/subscribe', {
			// 	method: 'POST',
			// 	body: JSON.stringify(subscription),
			// 	headers: { 'Content-Type': 'application/json' },
			// });

			console.log('✅ Subscription sent to backend.');
		} catch (error) {
			console.error('Error during subscription:', error);
		}
	}

	return (
		<AuthProvider>
			<RouterProvider router={router} fallbackElement={<Loader />} />
			<Toast />
			{/* <NotificationSocket onNewIssue={handleNewIssue} /> */}
		</AuthProvider>
	);
}

export default App;
