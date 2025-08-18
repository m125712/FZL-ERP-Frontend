export const accQK = {
	all: () => ['accQK'],
	//Count-length
	countLength: () => [...accQK.all(), 'count-length'],
	countLengthByUUID: (uuid) => [...accQK.countLength(), uuid],
};
