import { FZL_LOGO } from '@/assets/img/base64';
import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE, PRIMARY_COLOR } from '../ui';
import { company, getEmptyColumn } from '../utils';

const PAGE_HEADER_EMPTY_ROW = ['', '', '', ''];

const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy');

export const getPageHeader = (date, item) => {
	const batch_date = getDateFormate(date);
	return {
		heights: ['auto', 2, 'auto', 'auto'],
		widths: [70, '*', 70, '*'],
		body: [
			[
				{
					image: FZL_LOGO.src,
					width: 70,
					height: 40,
					alignment: 'left',
				},
				{
					text: [`${company.address}\n`, `${company.phone}\n`],
					alignment: 'left',
				},
				{
					colSpan: 2,
					text: [
						{
							text: 'Daily Production Plan\n',
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						`Item: ${item}\n`,
						`Date: ${batch_date}\n`,
					],
					alignment: 'right',
				},
				'',
			],
			PAGE_HEADER_EMPTY_ROW,
		],
	};
};

const EMPTY_COLUMN = getEmptyColumn(4);

export const getPageFooter = ({ currentPage, pageCount }) => {
	return {
		widths: ['*', '*', '*'],
		body: [
			[
				{
					colSpan: 3,
					text: `Page ${currentPage} of ${pageCount}`,
					alignment: 'center',
					border: [false, false, false, false],
				},
				'',
				'',
			],
		],
	};
};
