import { format } from 'date-fns';
import { useFetch } from '@/hooks';

import { DEFAULT_FONT_SIZE, PRIMARY_COLOR } from '../ui';
import { company, getEmptyColumn } from '../utils';

const PAGE_HEADER_EMPTY_ROW = ['', '', '', ''];

const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy');

export const getPageHeader = (data) => {
	const created_at = getDateFormate(data?.created_at);
	// const updated_at = getDateFormate(data?.updated_at);
	// const delivery_date = getDateFormate(data?.delivery_date);
	// const pi_number = data?.pi_number;
	const buyer = new Set();
	data?.pi_cash_entry?.forEach((item) => {
		buyer.add(item.buyer_name);
	});

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
							text: 'PROFORMA INVOICE\n',
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						`O/N: ${data?.id}\n`,
						`Date: ${created_at}\n`,
					],
					alignment: 'right',
				},
				'',
			],
			PAGE_HEADER_EMPTY_ROW,

			// * Start of table
			[
				{ text: 'Party:', bold: true, color: PRIMARY_COLOR },
				data?.party_name,
				{ text: 'Advising Bank:', bold: true, color: PRIMARY_COLOR },
				data?.bank_name,
			],
			[
				//{ text: '', bold: true, color: PRIMARY_COLOR },
				{ text: data?.party_address, colSpan: 2 },
				'',

				{ text: data?.bank_address, colSpan: 2 },
				'',
				//{ text: 'Merchandiser', bold: true, color: PRIMARY_COLOR },
			],
			[
				{ text: 'Buyer:', bold: true, color: PRIMARY_COLOR },
				{ text: [...buyer].join(', ') },
				{ text: 'SWIFT:', bold: true, color: PRIMARY_COLOR },
				data?.bank_swift_code,
			],

			// [
			// 	{ text: '', bold: true, color: PRIMARY_COLOR },
			// 	updated_at,
			// 	{ text: 'Created By', bold: true, color: PRIMARY_COLOR },
			// 	data?.created_by_name,
			// ],
			[
				'',
				'',
				{ text: 'Attention', bold: true, color: PRIMARY_COLOR },
				data?.merchandiser_name,
			],

			// [
			// 	{
			// 		text: 'Remarks',
			// 		bold: true,
			// 		color: PRIMARY_COLOR,
			// 	},
			// 	{
			// 		colSpan: 3,
			// 		text: [
			// 			{
			// 				text: data?.remarks,
			// 			},
			// 		],
			// 		alignment: 'left',
			// 	},
			// 	'',
			// 	'',
			// ],
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
