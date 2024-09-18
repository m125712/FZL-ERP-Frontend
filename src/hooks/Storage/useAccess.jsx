export default function useAccess(key) {
	const can_access = localStorage.getItem('can_access');

	if (String(can_access).length < 3) return [];

	const userAccess = JSON.parse(JSON.parse(can_access)) || {};

	return userAccess[key] || [];
}
