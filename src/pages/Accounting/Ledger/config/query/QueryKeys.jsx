export const accQK = {
	all: () => ['accQK'],

	//Ledger
	ledger: () => [...accQK.all(), 'ledger'],
	ledgerByUUID: (uuid) => [...accQK.ledger(), uuid],

	//? Other Value Label ?//
	otherGroup: () => [...accQK.all(), 'other', 'group'],
};
