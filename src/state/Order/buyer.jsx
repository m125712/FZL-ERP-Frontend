import { api } from '@/lib/api';
import createGlobalState from '@/state';
import { useEffect } from 'react';
import { orderQK } from './QueryKeys';

export const useOrderBuyer = () =>
	createGlobalState({
		queryKey: orderQK.buyers(),
		url: '/public/buyer',
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
