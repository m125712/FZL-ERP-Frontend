import { api } from '@/lib/api';
import createGlobalState from '@/state';
import { useEffect } from 'react';
import { adminQK } from './QueryKeys';

export const useAdminUsers = () =>
	createGlobalState({
		queryKey: adminQK.users(),
		url: '/hr/user',
	});

// const useFetchForRhfReset = async (uri, returnId, reset) => {
// 	useEffect(async () => {
// 		if (returnId === null || returnId === undefined) return;

// 		await api.get(uri).then((res) => reset(res?.data[0]));
// 	}, [returnId]);
// };

export const useOrderBuyerByUUID = (uuid) =>
	createGlobalState({
		queryKey: orderQK.buyer(uuid),
		url: `/public/buyer/${uuid}`,
	});
