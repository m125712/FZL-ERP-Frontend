// Effective React Query Keys
// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
// https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories

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
};
