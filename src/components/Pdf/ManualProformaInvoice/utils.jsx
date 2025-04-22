import { FZL_LOGO } from '@/assets/img/base64';
import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE, PRIMARY_COLOR } from '../ui';
import { company, getEmptyColumn } from '../utils';

const PAGE_HEADER_EMPTY_ROW = ['', '', '', ''];

const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy');

export const getPageHeader = (data) => {
	const created_at = getDateFormate(data?.date);
	// const updated_at = getDateFormate(data?.updated_at);
	// const delivery_date = getDateFormate(data?.delivery_date);
	// const pi_number = data?.pi_number;

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
					colspan: 2,
					text: [
						`${company.name}\n`,
						`${company.address}\n`,
						`${company.bin}\n`,
						`${company.tax}\n`,
					],
					alignment: 'left',
				},

				{
					colSpan: 2,
					text: [
						{
							text: 'PROFORMA INVOICE\n',
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						`PI No: ${data?.pi_number}\n`,
						`Date: ${created_at}\n`,
					],
					alignment: 'right',
				},
				'',
			],
			PAGE_HEADER_EMPTY_ROW,

			// * Start of table
			[
				{ text: 'Proforma For:', bold: true, color: PRIMARY_COLOR },
				data?.party_name,
				{ text: 'Advising Bank:', bold: true, color: PRIMARY_COLOR },
				data?.bank_name,
			],
			[
				{ text: 'Address', bold: true, color: PRIMARY_COLOR },
				{ text: data?.party_address },

				{ text: 'Address', bold: true, color: PRIMARY_COLOR },
				{ text: data?.bank_address },
				//{ text: 'Merchandiser', bold: true, color: PRIMARY_COLOR },
			],
			[
				{ text: 'Buyer:', bold: true, color: PRIMARY_COLOR },
				{ text: data?.buyer_name },
				{ text: 'SWIFT:', bold: true, color: PRIMARY_COLOR },
				data?.bank_swift_code,
			],

			[
				{ text: 'Attention', bold: true, color: PRIMARY_COLOR },
				data?.merchandiser_name,
				{ text: 'Routing No', bold: true, color: PRIMARY_COLOR },
				data?.routing_no,
			],

			[
				{
					text: Number(data?.weight) > 0 ? 'Weight' : '',
					bold: true,
					color: PRIMARY_COLOR,
				},
				{ text: Number(data?.weight) > 0 ? data?.weight : '' },
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
