import { format } from 'date-fns';

import GetDateTime from '@/util/GetDateTime';

import { DEFAULT_FONT_SIZE, PRIMARY_COLOR } from '../ui';
import { company, getEmptyColumn } from '../utils';

const PAGE_HEADER_EMPTY_ROW = ['', '', '', ''];

const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy');

export const getPageHeader = (information) => {
	const created_at = getDateFormate(GetDateTime());

	return {
		heights: ['auto', 2, 'auto', 'auto'],
		widths: [70, '*', 70, '*'],
		body: [
			[
				{
					colSpan: 2,
					text: [
						{
							text: `${company.name}\n`,
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						`${company.address}\n`,
						`${company.phone}\n`,
					],
					alignment: 'left',
				},
				'',
				{
					colSpan: 2,
					text: [
						{
							text: 'Coloring Production Report\n',
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						``,
						`Date: ${created_at}\n`,
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

export const getPageFooter = ({ currentPage, pageCount }) => ({
	body: [
		[
			{
				colSpan: 4,
				text: `Page ${currentPage} / ${pageCount}`,
				alignment: 'center',
				border: [false, false, false, false],
				// color,
			},
			...EMPTY_COLUMN,
		],
	],
});
