// pageNumberStyles.js - Predefined styles and formatting options
export const PAGE_NUMBER_STYLES = {
	simple: {
		template: '{currentPage}',
		alignment: 'center',
		fontSize: 10,
		position: 'below-footer',
	},
	detailed: {
		template: 'Page {currentPage} of {pageCount}',
		alignment: 'center',
		fontSize: 10,
		position: 'below-footer',
	},
	minimal: {
		template: '{currentPage} / {pageCount}',
		alignment: 'right',
		fontSize: 9,
		position: 'below-footer',
		belowFooterMargin: [0, 0, 20, 10],
	},
	formal: {
		template: '— {currentPage} —',
		alignment: 'center',
		fontSize: 12,
		position: 'below-footer',
		style: {
			bold: true,
			color: '#666666',
		},
	},
	roman: {
		template: '{currentPage}',
		format: 'roman',
		alignment: 'center',
		fontSize: 10,
		position: 'below-footer',
	},
	'roman-upper': {
		template: '{currentPage}',
		format: 'roman-upper',
		alignment: 'center',
		fontSize: 10,
		position: 'below-footer',
	},
	corporate: {
		template: 'Page {currentPage} of {pageCount}',
		alignment: 'right',
		fontSize: 9,
		position: 'below-footer',
		style: {
			color: '#333333',
			italics: true,
		},
		belowFooterMargin: [0, 0, 30, 15],
	},
	'below-footer-left': {
		template: 'Page {currentPage} of {pageCount}',
		alignment: 'left',
		fontSize: 9,
		position: 'below-footer',
		belowFooterMargin: [20, 5, 0, 10],
	},
	'below-footer-right': {
		template: 'Page {currentPage} of {pageCount}',
		alignment: 'right',
		fontSize: 9,
		position: 'below-footer',
		belowFooterMargin: [0, 5, 20, 10],
	},
	elegant: {
		template: '• {currentPage} •',
		alignment: 'center',
		fontSize: 11,
		position: 'below-footer',
		style: {
			color: '#666666',
		},
	},
	bracket: {
		template: '[ {currentPage} ]',
		alignment: 'center',
		fontSize: 10,
		position: 'below-footer',
	},
	dots: {
		template: '... {currentPage} ...',
		alignment: 'center',
		fontSize: 10,
		position: 'below-footer',
		style: {
			italics: true,
		},
	},
};

export const POSITION_TYPES = {
	HEADER: 'header',
	FOOTER: 'footer',
	BELOW_FOOTER: 'below-footer',
	BOTH: 'both',
};

export const ALIGNMENT_TYPES = {
	LEFT: 'left',
	CENTER: 'center',
	RIGHT: 'right',
};

export const FORMAT_TYPES = {
	DEFAULT: 'default',
	ROMAN: 'roman',
	ROMAN_UPPER: 'roman-upper',
	ALPHA: 'alpha',
	ALPHA_UPPER: 'alpha-upper',
	CUSTOM: 'custom',
};

// Helper function to get style by name
export const getPageNumberStyle = (styleName) => {
	return PAGE_NUMBER_STYLES[styleName] || PAGE_NUMBER_STYLES.detailed;
};

// Helper function to list all available styles
export const getAvailableStyles = () => {
	return Object.keys(PAGE_NUMBER_STYLES);
};
