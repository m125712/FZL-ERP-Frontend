import createGlobalState from "@/state";
import { orderQK } from "./QueryKeys";

export const useOrderBuyer = () =>
	createGlobalState({
		queryKey: orderQK.buyers(),
		url: "/buyer",
	});
