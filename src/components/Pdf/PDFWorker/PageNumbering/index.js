// index.js - Main export file for the page numbering module
export {
	PageNumberGenerator,
	enhanceDocumentWithPageNumbers,
	createPageNumberGenerator,
} from './pageNumberGenerator';

export {
	toRomanNumeral,
	toAlphaNumeral,
	safeGet,
	validateAndSanitizeOptions,
	formatPageNumber,
} from './pageNumberUtils.js';

export {
	PAGE_NUMBER_STYLES,
	POSITION_TYPES,
	ALIGNMENT_TYPES,
	FORMAT_TYPES,
	getPageNumberStyle,
	getAvailableStyles,
} from './pageNumberStyles.js';

// Default export for convenience
export { PageNumberGenerator as default } from './pageNumberGenerator.js';
