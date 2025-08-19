import createGlobalState from '@/state';

import { accQK } from './QueryKeys';

//* Accounting Ledger
export const useAccLedger = () =>
	createGlobalState({
		queryKey: accQK.ledger(),
		url: '/acc/ledger',
	});

export const useAccLedgerByUUID = (uuid) =>
	createGlobalState({
		queryKey: accQK.ledgerByUUID(uuid),
		url: `/acc/ledger/${uuid}`,
		enabled: !!uuid,
	});

//? Other Value Label ?//
export const useOtherAccGroup = () =>
	createGlobalState({
		queryKey: accQK.otherGroup(),
		url: '/other/accounts/group/value/label',
	});

export const useOtherTableName = () =>
	createGlobalState({
		queryKey: accQK.otherTableName(),
		url: '/other/accounts/table-name',
	});

export const useOtherTableNameBy = (name) =>
	createGlobalState({
		queryKey: accQK.otherTableNameBy(name),
		url: `/other/accounts/table-data/by/${name}`,
		enabled: !!name,
	});
