import createGlobalState from '@/state';

import { accQK } from './QueryKeys';

//* Accounting cost center
export const useAccCostCenter = () =>
	createGlobalState({
		queryKey: accQK.costCenter(),
		url: '/acc/cost-center',
	});

export const useAccCostCenterByUUID = (uuid) =>
	createGlobalState({
		queryKey: accQK.costCenterByUUID(uuid),
		url: `/acc/cost-center/${uuid}`,
		enabled: !!uuid,
	});

//? Other Value Label ?//
export const useOtherAccLedger = () =>
	createGlobalState({
		queryKey: accQK.otherLedger(),
		url: '/other/accounts/ledger/value/label',
	});
