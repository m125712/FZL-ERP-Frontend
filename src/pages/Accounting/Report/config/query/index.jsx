import createGlobalState from '@/state';

import { accQK } from './QueryKeys';

//* Accounting cost center
export const useAccReport = (from, to) =>
	createGlobalState({
		queryKey: accQK.costCenter(),
		url: `/report/acc-balance-report?from=${from}&to=${to}`,
		enabled: !!from && !!to,
	});

export const useAccReportByUUID = (uuid) =>
	createGlobalState({
		queryKey: accQK.costCenterByUUID(uuid),
		url: `/report/acc-balance-report/${uuid}`,
		enabled: !!uuid,
	});
