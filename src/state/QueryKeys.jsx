// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
// https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories

export const orderQK = {
	all: () => ['order'],

	// details
	details: () => [...orderQK.all(), 'details'],
	detail: (id) => [...orderQK.details(), id],

	// info
	infos: () => [...orderQK.all(), 'info'],
	info: (id) => [...orderQK.infos(), id],

	// buyers
	buyers: () => [...orderQK.all(), 'buyers'],
	buyer: (uuid) => [...orderQK.buyers(), uuid],

	// marketing
	marketings: () => [...orderQK.all(), 'marketing'],
	marketing: (uuid) => [...orderQK.marketings(), uuid],

	// marketing
	factories: () => [...orderQK.all(), 'factory'],
	factory: (uuid) => [...orderQK.factories(), uuid],

	// merchandisers
	merchandisers: () => [...orderQK.all(), 'merchandisers'],
	merchandiser: (uuid) => [...orderQK.merchandisers(), uuid],
	//Party
	party: () => [...orderQK.all(), 'party'],
	partyByUUID: (uuid) => [...orderQK.party(), uuid],
	//properties
	properties: () => [...orderQK.all(), 'party'],
	propertiesByUUID: (uuid) => [...orderQK.party(), uuid],

	// info
	info: () => [...orderQK.all(), 'info'],
	infoByUUID: (uuid) => [...orderQK.info(), uuid],
};
