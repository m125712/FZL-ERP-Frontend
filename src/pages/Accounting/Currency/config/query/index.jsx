import createGlobalState from '@/state';

import { accQK } from './QueryKeys';

//Count-length
export const useAccountingCurrency = () =>
	createGlobalState({
		queryKey: accQK.currency(),
		url: '/acc/currency',
	});

export const useAccountingCurrencyByUUID = (uuid) =>
	createGlobalState({
		queryKey: accQK.currencyByUUID(uuid),
		url: `/acc/currency/${uuid}`,
	});
export const useOtherCurrency = () =>
	createGlobalState({
		queryKey: accQK.otherCurrency(),
		url: '/other/accounts/currency/value/label',
	});
