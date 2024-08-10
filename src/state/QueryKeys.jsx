/**
 *? Effective React Query Keys
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

	// departments
	departments: () => [...adminQK.all(), 'departments'],
	department: (uuid) => [...adminQK.departments(), uuid],

	// designation
	designations: () => [...adminQK.all(), 'designations'],
	designation: (uuid) => [...adminQK.designations(), uuid],

	// users
	users: () => [...adminQK.all(), 'users'],
	user: (uuid) => [...adminQK.users(), uuid],
};
