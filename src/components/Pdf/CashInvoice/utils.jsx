import { FZL_LOGO } from '@/assets/img/base64';
import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE, PRIMARY_COLOR } from '../ui';
import { company, getEmptyColumn } from '../utils';

const PAGE_HEADER_EMPTY_ROW = ['', '', '', ''];

const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy');

export const getPageHeader = (data) => {
	const created_at = getDateFormate(data?.created_at);
	const buyer = new Set();
	data?.pi_cash_entry?.forEach((item) => {
		buyer.add(item.buyer_name);
	});
	data?.pi_cash_entry_thread?.forEach((item) => {
		buyer.add(item.buyer_name);
	});

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
							text: 'CASH INVOICE\n',
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						`PI No: ${data?.id}\n`,
						`Date: ${created_at}\n`,
					],
					alignment: 'right',
				},
				'',
			],
			PAGE_HEADER_EMPTY_ROW,

			// * Start of table
			[
				{ text: 'Party', bold: true, color: PRIMARY_COLOR },
				data?.party_name,
				{ text: 'Conversion Rate', bold: true, color: PRIMARY_COLOR },
				`${Number(data?.conversion_rate).toFixed(2)} BDT`,
			],
			[
				{ text: 'Buyer', bold: true, color: PRIMARY_COLOR },
				{ text: [...buyer].join(', ') },
				{ text: 'Attention', bold: true, color: PRIMARY_COLOR },
				data?.merchandiser_name,
			],

			[
				{
					text: 'Address',
					bold: true,
					color: PRIMARY_COLOR,
				},
				{
					colSpan: 3,
					text: [
						{
							text: data?.party_address,
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
