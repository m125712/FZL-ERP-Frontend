// Notification.js
import { useSubscribe } from '@/state/Other';

import { PUBLIC_VAPID_KEY } from '@/lib/secret';
import GetDateTime from '@/util/GetDateTime';

function urlBase64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding)
		.replace(/-/g, '+')
		.replace(/_/g, '/');
	const rawData = atob(base64);
	return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function usePushSubscription() {
	const { postData, url } = useSubscribe();

	async function sendSubscriptionToBackend(subscription) {
		postData.mutate({
			url,
			newData: { endpoint: subscription, created_at: GetDateTime() },
		});
		localStorage.setItem('pushEndpoint', subscription.endpoint);
		// console.log(
		// 	'✅ Subscription sent to backend and endpoint saved locally.'
		// );
	}

	async function registerAndSubscribe() {
		try {
			const registration =
				await navigator.serviceWorker.register('/service-worker.js');
			// console.log('✅ Service Worker registered:', registration);

			const permission = await Notification.requestPermission();
			if (permission !== 'granted') {
				console.warn('❌ Push permission not granted');
				return;
			}

			let subscription = await registration.pushManager.getSubscription();

			if (!subscription) {
				subscription = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey:
						urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
				});
				await sendSubscriptionToBackend(subscription);
			} else {
				const savedEndpoint = localStorage.getItem('pushEndpoint');
				if (savedEndpoint !== subscription.endpoint) {
					await sendSubscriptionToBackend(subscription);
				}
			}
		} catch (error) {
			console.error('Error during subscription:', error);
		}
	}

	// ✅ NEW: Unsubscribe function
	async function unregisterPushSubscription() {
		try {
			const registration = await navigator.serviceWorker.ready;
			const subscription =
				await registration.pushManager.getSubscription();

			if (subscription) {
				let deleteItem = subscription;
				const success = await subscription.unsubscribe();
				if (success) {
					// console.log(
					// 	'✅ Push subscription successfully unsubscribed.'
					// );
					// Optionally, notify your backend here too:
					postData.mutate({
						url: '/public/unsubscribe',
						newData: {
							endpoint: deleteItem,
						},
					});
				} else {
					console.warn('⚠️ Failed to unsubscribe push subscription.');
				}
			} else {
				console.log('ℹ️ No push subscription to unsubscribe.');
			}

			localStorage.removeItem('pushEndpoint');
		} catch (error) {
			console.error('Error during unsubscribe:', error);
		}
	}

	return { registerAndSubscribe, unregisterPushSubscription };
}
