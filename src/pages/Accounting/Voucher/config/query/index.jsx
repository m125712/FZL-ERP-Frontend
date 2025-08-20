import createGlobalState from '@/state';

import { accQK } from './QueryKeys';

//* Voucher

export const useVoucher = (query) =>
	createGlobalState({
		queryKey: accQK.voucher(query),
		url: query ? `/acc/voucher?${query}` : '/acc/voucher',
	});

export const useVoucherByUUID = (uuid) =>
	createGlobalState({
		queryKey: accQK.voucherByUUID(uuid),
		url: `/acc/voucher-details/${uuid}`,
		enabled: !!uuid,
	});

export const useOtherCostCenter = (query) =>
	createGlobalState({
		queryKey: accQK.otherCostCenter(),
		url: query
			? `/other/accounts/cost-center/value/label?${query}`
			: '/other/accounts/cost-center/value/label',
	});
