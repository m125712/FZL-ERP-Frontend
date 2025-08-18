import createGlobalState from '@/state';

import { accQK } from './QueryKeys';

//Count-length
export const useAccountingFiscalYear = () =>
	createGlobalState({
		queryKey: accQK.fiscalYear(),
		url: '/acc/fiscal-year',
	});

export const useAccountingFiscalYearByUUID = (uuid) =>
	createGlobalState({
		queryKey: accQK.fiscalYearByUUID(uuid),
		url: `/acc/fiscal-year/${uuid}`,
	});
