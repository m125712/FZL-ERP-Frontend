import createGlobalState from '.';
import { materialQK } from './QueryKeys';

// STOCK
export const useMaterialStock = () =>
	createGlobalState({
		queryKey: materialQK.stock(),
		url: '/material/stock',
	});

export const useMaterialStockByUUID = (uuid) =>
	createGlobalState({
		queryKey: materialQK.stockByUUID(uuid),
		url: `/material/stock/${uuid}`,
		enabled: !!uuid,
	});
