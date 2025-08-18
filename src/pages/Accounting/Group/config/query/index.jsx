import createGlobalState from '@/state';

import { accQK } from './QueryKeys';

//* Accounting Group
export const useAccGroup = () =>
	createGlobalState({
		queryKey: accQK.group(),
		url: '/acc/group',
	});

export const useAccGroupByUUID = (uuid) =>
	createGlobalState({
		queryKey: accQK.groupByUUID(uuid),
		url: `/acc/group/${uuid}`,
		enabled: !!uuid,
	});

//? Other Value Label ?//
export const useOtherAccHead = () =>
	createGlobalState({
		queryKey: accQK.otherHead(),
		url: '/other/accounts/head/value/label',
	});
