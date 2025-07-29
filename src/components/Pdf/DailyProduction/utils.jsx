// import { FZL_LOGO } from '@/assets/img/base64';
import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE } from '../ui';
import { company, getEmptyColumn } from '../utils';

const PAGE_HEADER_EMPTY_ROW = ['', '', '', ''];

const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy HH:mm:ss');

export const getPageHeader = (from, to) => {
	return {
		heights: ['auto', 2, 'auto', 'auto'],
		widths: [80, '*', 60, '*'],
		body: [
			[
				// {
				// 	image: FZL_LOGO.src,
				// 	width: 70,
				// 	height: 40,
				// 	alignment: 'left',
				// },
				{
					colSpan: 2,
					text: [
						{
							text: `Fortune Zipper Ltd.\n`,
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						`${company.address}\n`,
						`${company.phone}\n`,
					],
					alignment: 'left',
				},
				'',
				// {
				// 	text: [`${company.address}\n`, `${company.phone}\n`],
				// 	alignment: 'center',
				// },
				{
					colSpan: 2,
					text: [
						{
							text: `Daily Production Report\n`,
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						`Date: ${getDateFormate(from)} - ${getDateFormate(to)} \n`,
					],
					alignment: 'right',
				},
				'',
			],
			PAGE_HEADER_EMPTY_ROW,

			// * Start of table
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
