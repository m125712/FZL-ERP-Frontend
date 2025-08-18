export const accQK = {
	all: () => ['accQK'],

	//Group
	group: () => [...accQK.all(), 'group'],
	groupByUUID: (uuid) => [...accQK.group(), uuid],

	//? Other Value Label ?//
	otherHead: () => [...accQK.all(), 'other', 'head'],
};
