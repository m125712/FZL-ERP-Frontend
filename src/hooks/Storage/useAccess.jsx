import { useAuth } from "@/context/auth";

export default function useAccess(key) {
	const { can_access } = useAuth();

	if (!can_access) return [];

	return can_access[key] || [];
}
