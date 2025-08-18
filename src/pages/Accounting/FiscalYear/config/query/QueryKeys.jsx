export const accQK = {
	all: () => ['accQK'],
	//Count-length
	fiscalYear: () => [...accQK.all(), 'fiscal-year'],
	fiscalYearByUUID: (uuid) => [...accQK.fiscalYear(), uuid],
};
