import { FZL_LOGO } from '@/assets/img/base64';
import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE, PRIMARY_COLOR } from '../ui';
import { company, getEmptyColumn } from '../utils';

const PAGE_HEADER_EMPTY_ROW = ['', '', '', ''];

const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy');

export const getPageHeader = (data) => {
	const created_at = getDateFormate(data?.created_at);
	const updated_at = data?.updated_at ? getDateFormate(data?.updated_at) : '';

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
							text: 'Zipper Challan\n',
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						`Challan Number: ${data?.order_number}\n`,
						`Date: ${created_at}\n`,
					],
					alignment: 'right',
				},
				'',
			],
			PAGE_HEADER_EMPTY_ROW,

			// * Start of table
			[
				{ text: 'Order Number', bold: true, color: PRIMARY_COLOR },
				data?.order_number,
				{ text: 'Party', bold: true, color: PRIMARY_COLOR },
				data?.party_name,
			],
			[
				{ text: 'Carton QTY', bold: true, color: PRIMARY_COLOR },
				data?.carton_quantity,

				{ text: 'Buyer', bold: true, color: PRIMARY_COLOR },
				data?.buyer_name,
			],
			[
				{ text: 'Factory', bold: true, color: PRIMARY_COLOR },
				data?.factory_name,
				{ text: 'Merchandiser', bold: true, color: PRIMARY_COLOR },
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
							text: data?.factory_address,
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
