export const accQK = {
	all: () => ['accQK'],

	//Ledger
	ledger: () => [...accQK.all(), 'ledger'],
	ledgerByUUID: (uuid) => [...accQK.ledger(), uuid],

	//? Other Value Label ?//
	otherGroup: () => [...accQK.all(), 'other', 'group'],
	otherTableName: () => [...accQK.all(), 'other', 'table-name'],
	otherTableNameBy: (name) => [...accQK.otherTableName(), name],

	//Ledger Details
	ledgerDetailsByUUID: (uuid) => [...accQK.all(), 'ledger', 'details', uuid],
};
