import { useAuth } from "@/context/auth";
import { useAccess } from "@/hooks";
import createGlobalState from "@/state";
import { orderQK } from "./QueryKeys";

const useOrderPath = () => {
	const { user } = useAuth();
	const haveAccess = useAccess("order__details");

	if (haveAccess.includes("show_own_orders"))
		return `order/details/marketing/${user?.id}`;

	if (haveAccess.includes("show_approved_orders"))
		return "order/details/approved";

	return "order/details";
};

export const useOrderDetails = () =>
	createGlobalState({
		queryKey: orderQK.details(),
		url: useOrderPath(),
	});
