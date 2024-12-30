import { FZL_LOGO } from '@/assets/img/base64';
import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE, PRIMARY_COLOR } from '../ui';
import { company, getEmptyColumn } from '../utils';

const PAGE_HEADER_EMPTY_ROW = ['', '', '', ''];

const getDateFormate = (date) => format(new Date(date), 'MMM dd, yyyy');

export const getPageHeader = (batch) => {
	const created_at = getDateFormate(batch?.created_at);
	// const updated_at = getDateFormate(batch?.updated_at);

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
							text: `Travel Card #${batch?.batch_type}\n`,
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						`Batch: ${batch?.batch_id}\n`,
						`Date: ${created_at} `,
					],
					alignment: 'right',
				},
				'',
			],
			PAGE_HEADER_EMPTY_ROW,

			// * Start of table
			[
				{ text: 'Batch', bold: true, color: PRIMARY_COLOR },
				batch?.batch_id,
				{ text: 'Production Date', bold: true, color: PRIMARY_COLOR },
				getDateFormate(batch?.production_date),
			],
			[
				{ text: 'Machine', bold: true, color: PRIMARY_COLOR },
				batch?.machine_name,

				{ text: 'Slot', bold: true, color: PRIMARY_COLOR },
				batch?.slot,
			],
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
					text: 'SNO',
					alignment: 'center',
					border: [false, true, false, false],
				},
				{
					text: '',
					alignment: 'center',
					border: [false, false, false, false],
				},
				{
					text: 'Managing Director',
					alignment: 'center',
					border: [false, true, false, false],
				},
			],
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
