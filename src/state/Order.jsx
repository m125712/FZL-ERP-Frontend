import { useAuth } from '@/context/auth';
import { useAccess } from '@/hooks';
import createGlobalState from '.';
import { orderQK } from './QueryKeys';

const useOrderPath = () => {
	const { user } = useAuth();
	const haveAccess = useAccess('order__details');

	if (haveAccess.includes('show_own_orders'))
		return `order/details/marketing/${user?.id}`;

	if (haveAccess.includes('show_approved_orders'))
		return 'order/details/approved';

	return 'order/details';
};

export const useOrderDetails = () =>
	createGlobalState({
		queryKey: orderQK.details(),
		url: useOrderPath(),
	});

// * Buyer * //
export const useOrderBuyer = () =>
	createGlobalState({
		queryKey: orderQK.buyers(),
		url: '/public/buyer',
	});

export const useOrderBuyerByUUID = (uuid) =>
	createGlobalState({
		queryKey: orderQK.buyer(uuid),
		url: `/public/buyer/${uuid}`,
	});

// * Marketing * //
export const useOrderMarketing = () =>
	createGlobalState({
		queryKey: orderQK.marketings(),
		url: '/public/marketing',
	});

export const useOrderMarketingByUUID = (uuid) =>
	createGlobalState({
		queryKey: orderQK.marketing(uuid),
		url: `/public/marketing/${uuid}`,
	});
