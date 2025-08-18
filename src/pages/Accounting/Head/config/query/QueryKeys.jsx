export const accQK = {
	all: () => ['accQK'],

	//Head
	head: () => [...accQK.all(), 'head'],
	headByUUID: (uuid) => [...accQK.head(), uuid],
};
