import { FZL_LOGO } from '@/assets/img/base64';

import { defaultStyle, PRIMARY_COLOR, styles } from './ui';

// * PDF DEFAULTS
export const DEFAULT_A4_PAGE = ({ xMargin, headerHeight, footerHeight }) => ({
	pageSize: 'A4',
	pageOrientation: 'portrait',
	pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
	defaultStyle,
	styles,
});

export const CUSTOM_PAGE = ({
	width,
	height,
	xMargin,
	headerHeight,
	footerHeight,
}) => ({
	pageSize: { width, height },
	pageOrientation: 'portrait',
	pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
	defaultStyle,
	styles,
});

export const company = {
	logo: FZL_LOGO.src,
	name: 'Fortune Zipper LTD.',
	address: 'Aukpara, Ashulia, Savar, DHK-1340',
	email: 'Email: info@fortunezip.com',
	phone: 'Phone: 01521533595',
	bin: 'BIN: 000537296-0403',
	tax: 'VAT: 17141000815',
};

export const getTable = (
	field,
	name,
	alignment = 'left',
	headerStyle = 'tableHeader',
	cellStyle = 'tableCell'
) => ({
	field,
	name,
	alignment,
	headerStyle,
	cellStyle,
});

export const TableHeader = (node) => {
	return [
		...node.map((nodeItem) => ({
			text: nodeItem.name,
			// style: nodeItem.headerStyle,
			alignment: nodeItem.alignment,
			color: PRIMARY_COLOR,
			bold: true,
		})),
	];
};

// * HELPER: GET EMPTY COLUMN
export const getEmptyColumn = (colSpan) => {
	const EMPTY_COLUMN = [];
	for (let i = 0; i < colSpan - 1; i++) {
		EMPTY_COLUMN.push('');
	}
	return EMPTY_COLUMN;
};
