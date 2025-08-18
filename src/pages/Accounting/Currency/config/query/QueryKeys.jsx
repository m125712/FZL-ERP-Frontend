export const accQK = {
	all: () => ['accQK'],
	//Count-length
	currency: () => [...accQK.all(), 'currency'],
	currencyByUUID: (uuid) => [...accQK.currency(), uuid],
	otherCurrency: () => [...accQK.all(), 'otherCurrency'],
};
