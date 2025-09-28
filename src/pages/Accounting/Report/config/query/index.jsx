import createGlobalState from '@/state';

import { accQK } from './QueryKeys';

//* Accounting cost center
export const useAccReport = (from, to, type) =>
	createGlobalState({
		queryKey: accQK.accReport(from, to, type),
		url: `/report/acc-balance-report?from=${from}&to=${to}&type=${type}`,
		enabled: !!from && !!to,
	});
