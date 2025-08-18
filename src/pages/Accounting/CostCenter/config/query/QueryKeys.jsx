export const accQK = {
	all: () => ['accQK'],

	//Cost center
	costCenter: () => [...accQK.all(), 'cost-center'],
	costCenterByUUID: (uuid) => [...accQK.costCenter(), uuid],

	//? Other Value Label ?//
	otherLedger: () => [...accQK.all(), 'other', 'ledger'],
};
