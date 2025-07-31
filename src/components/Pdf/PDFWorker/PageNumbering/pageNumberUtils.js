// pageNumberUtils.js - Utility functions for page numbering
export const toRomanNumeral = (num) => {
	const romanNumerals = [
		{ value: 1000, numeral: 'M' },
		{ value: 900, numeral: 'CM' },
		{ value: 500, numeral: 'D' },
		{ value: 400, numeral: 'CD' },
		{ value: 100, numeral: 'C' },
		{ value: 90, numeral: 'XC' },
		{ value: 50, numeral: 'L' },
		{ value: 40, numeral: 'XL' },
		{ value: 10, numeral: 'X' },
		{ value: 9, numeral: 'IX' },
		{ value: 5, numeral: 'V' },
		{ value: 4, numeral: 'IV' },
		{ value: 1, numeral: 'I' },
	];

	let result = '';
	for (let i = 0; i < romanNumerals.length; i++) {
		while (num >= romanNumerals[i].value) {
			result += romanNumerals[i].numeral;
			num -= romanNumerals[i].value;
		}
	}
	return result.toLowerCase();
};

export const toAlphaNumeral = (num) => {
	let result = '';
	while (num > 0) {
		num--;
		result = String.fromCharCode(65 + (num % 26)) + result;
		num = Math.floor(num / 26);
	}
	return result.toLowerCase();
};

export const safeGet = (obj, path, defaultValue = undefined) => {
	try {
		return path.split('.').reduce((o, p) => o && o[p], obj) ?? defaultValue;
	} catch (error) {
		return defaultValue;
	}
};

export const validateAndSanitizeOptions = (options) => {
	const safeOptions = options || {};

	const defaultPageNumbering = {
		enabled: true,
		position: 'below-footer',
		alignment: 'center',
		template: 'Page {currentPage} of {pageCount}',
		fontSize: 10,
		showOnFirstPage: true,
		startFrom: 1,
		format: 'default',
		prefix: '',
		suffix: '',
		showTotal: true,
		skipPages: [],
		style: {
			fontSize: 8,
			color: '#000000',
			bold: false,
			italics: false,
		},
		headerMargin: [0, 10, 0, 20],
		footerMargin: [0, 15, 0, 10],
		belowFooterMargin: [0, 5, 0, 15],
		spacingAbovePageNumber: 10,
	};

	const pageNumbering = safeOptions.pageNumbering || {};

	const sanitizedPageNumbering = {
		...defaultPageNumbering,
		...pageNumbering,
		style: {
			...defaultPageNumbering.style,
			...(pageNumbering.style || {}),
		},
	};

	return {
		...safeOptions,
		pageNumbering: sanitizedPageNumbering,
	};
};

export const formatPageNumber = (currentPage, pageCount, options) => {
	const {
		format = 'default',
		prefix = '',
		suffix = '',
		startFrom = 1,
		showTotal = true,
		customFormatter = null,
		skipPages = [],
		template = 'Page {currentPage} of {pageCount}',
	} = options || {};

	if (Array.isArray(skipPages) && skipPages.includes(currentPage)) {
		return '';
	}

	const adjustedPage = Math.max(1, currentPage - startFrom + 1);
	let formattedPage = adjustedPage;

	try {
		switch (format) {
			case 'roman':
				formattedPage = toRomanNumeral(adjustedPage);
				break;
			case 'roman-upper':
				formattedPage = toRomanNumeral(adjustedPage).toUpperCase();
				break;
			case 'alpha':
				formattedPage = toAlphaNumeral(adjustedPage);
				break;
			case 'alpha-upper':
				formattedPage = toAlphaNumeral(adjustedPage).toUpperCase();
				break;
			case 'custom':
				if (typeof customFormatter === 'function') {
					formattedPage = customFormatter(adjustedPage);
				} else {
					formattedPage = adjustedPage;
				}
				break;
			default:
				formattedPage = adjustedPage;
		}
	} catch (error) {
		console.warn('Error formatting page number:', error);
		formattedPage = adjustedPage;
	}

	let pageText = `${prefix}${formattedPage}${suffix}`;

	if (
		template &&
		typeof template === 'string' &&
		template.includes('{currentPage}')
	) {
		pageText = template
			.replace('{currentPage}', `${prefix}${formattedPage}${suffix}`)
			.replace('{pageCount}', pageCount);
	} else if (showTotal) {
		pageText += ` of ${pageCount}`;
	}

	return pageText;
};
