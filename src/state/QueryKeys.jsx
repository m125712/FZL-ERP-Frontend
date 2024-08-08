/**
 ** Effective React Query Keys
 ** https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
 ** https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories
 **/

export const orderQK = {
	all: () => ['order'],

	// details
	details: () => [...orderQK.all(), 'details'],
	detail: (id) => [...orderQK.details(), id],

	// info
	infos: () => [...orderQK.all(), 'info'],
	info: (id) => [...orderQK.infos(), id],

	// buyers
	buyers: () => [...orderQK.all(), 'buyer'], // [order, buyer]
	buyer: (uuid) => [...orderQK.buyers(), uuid], // [order, buyer, uuid]
};

export const adminQK = {
	all: () => ['admin'],

	// details
	details: () => [...adminQK.all(), 'details'],
	detail: (id) => [...adminQK.details(), id],

	// info
	users: () => [...adminQK.all(), 'users'],
	user: (uuid) => [...adminQK.infos(), uuid],

	// buyers
	buyers: () => [...adminQK.all(), 'buyers'],
	buyer: (uuid) => [...adminQK.buyers(), uuid],

	// departments
	departments: () => [...adminQK.all(), 'departments'],
	department: (uuid) => [...adminQK.departments(), uuid],
};
