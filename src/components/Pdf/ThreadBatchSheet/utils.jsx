import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE, PRIMARY_COLOR } from '../ui';
import { company, getEmptyColumn } from '../utils';

const PAGE_HEADER_EMPTY_ROW = ['', '', '', ''];

const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy');

export const getPageHeader = (batch) => {
	
	const created_at = getDateFormate(batch?.created_at);
	const updated_at = getDateFormate(batch?.updated_at);

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
							text: 'Bulk Recipe\n',
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						`Batch No: ${batch?.batch_id}\n`,
						`Date: ${created_at}\n`,
					],
					alignment: 'right',
				},
				'',
			],
			PAGE_HEADER_EMPTY_ROW,

			// * Start of table
			// [
			// 	{ text: 'Party', bold: true, color: PRIMARY_COLOR },
			// 	batch?.party_name,
			// 	{ text: 'Marketing', bold: true, color: PRIMARY_COLOR },
			// 	batch?.marketing_name,
			// ],
			// [
			// 	{ text: 'Factory', bold: true, color: PRIMARY_COLOR },
			// 	batch?.factory_name,

			// 	{ text: 'Merchandiser', bold: true, color: PRIMARY_COLOR },
			// 	batch?.merchandiser_name,
			// ],
			// [
			// 	{ text: 'Address', bold: true, color: PRIMARY_COLOR },
			// 	batch?.factory_address,
			// 	{ text: 'Buyer', bold: true, color: PRIMARY_COLOR },
			// 	batch?.buyer_name,
			// ],
			[
				{ text: 'Updated', bold: true, color: PRIMARY_COLOR },
				updated_at,
				{ text: 'Created By', bold: true, color: PRIMARY_COLOR },
				batch?.created_by_name,
			],

			[
				{
					text: 'Remarks',
					bold: true,
					color: PRIMARY_COLOR,
				},
				{
					colSpan: 3,
					text: [
						{
							text: batch?.remarks,
						},
					],
					alignment: 'left',
				},
				'',
				'',
			],
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
