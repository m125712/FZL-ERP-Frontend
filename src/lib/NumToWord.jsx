import { ToWords } from 'to-words';

const toWords = new ToWords({
	localeCode: 'en-US',
});

export const NumToWord = (number) => toWords.convert(number);

const dollarToWords = new ToWords({
	localeCode: 'en-US',
	currencyOptions: {
		name: 'Dollar',
		plural: 'Dollars',
		symbol: '$',
		fraction: {
			name: 'Cent',
			plural: 'Cents',
		},
	},
});
const takaToWords = new ToWords({
	localeCode: 'en-BD',
	currencyOptions: {
		name: 'Taka',
		plural: 'Taka',
		symbol: '',
		fraction: {
			name: 'Poisha',
			plural: 'Poisha',
		},
	},
});

export const DollarToWord = (number) =>
	dollarToWords.convert(number, { currency: true, ignoreZeroCurrency: true });
export const TakaToWord = (number) =>
	takaToWords.convert(number, { currency: true, ignoreZeroCurrency: true });
