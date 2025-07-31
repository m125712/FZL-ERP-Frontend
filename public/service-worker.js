self.addEventListener('push', function (event) {
	const data = event.data.json();
	// console.log('[Service Worker] Push Received:', data);

	const options = {
		body: data.body,
		icon: '✅',
		data: {
			url: data.url, // ✅ Relative URL
		},
	};

	event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
	// console.log('Notification click received');
	event.notification.close();

	const targetUrl = event.notification.data.url;

	event.waitUntil(
		clients
			.matchAll({ type: 'window', includeUncontrolled: true })
			.then((clientList) => {
				// If any open window matches the same origin, focus it
				for (const client of clientList) {
					if (client.url === targetUrl && 'focus' in client) {
						return client.focus();
					}
				}
				// Or just open a new tab
				if (clients.openWindow) {
					return clients.openWindow(targetUrl);
				}
			})
	);
});
