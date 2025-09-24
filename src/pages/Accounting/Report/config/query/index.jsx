import createGlobalState from '@/state';

import { accQK } from './QueryKeys';

//* Accounting cost center
export const useAccReport = () =>
	createGlobalState({
		queryKey: accQK.costCenter(),
		url: '/report/acc-balance-report',
	});

export const useAccReportByUUID = (uuid) =>
	createGlobalState({
		queryKey: accQK.costCenterByUUID(uuid),
		url: `/report/acc-balance-report/${uuid}`,
		enabled: !!uuid,
	});
