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
				{ text: 'Party', bold: true, color: PRIMARY_COLOR },
				data?.party_name,
				{ text: 'Buyer', bold: true, color: PRIMARY_COLOR },
				data?.buyer_name,
			],
			[
				{ text: 'Merchandiser', bold: true, color: PRIMARY_COLOR },
				data?.merchandiser_name,
				{ text: 'Factory', bold: true, color: PRIMARY_COLOR },
				data?.factory_name,
			],
			[
				{ text: 'Assign To', bold: true, color: PRIMARY_COLOR },
				data?.assign_to_name,
				{ text: 'Address', bold: true, color: PRIMARY_COLOR },
				data?.factory_address,
			],
			[
				{ text: 'Carton Quantity', bold: true, color: PRIMARY_COLOR },
				data?.carton_quantity,
				{ text: 'Order Number', bold: true, color: PRIMARY_COLOR },
				data?.order_number,
			],
			[
				{ text: 'Gate Pass', bold: true, color: PRIMARY_COLOR },
				data?.gate_pass === 1 ? 'Yes' : 'No',

				{ text: 'Receive Status', bold: true, color: PRIMARY_COLOR },
				data?.receive_status === 1 ? 'Yes' : 'No',
			],
			[
				{ text: 'Created By', bold: true, color: PRIMARY_COLOR },
				data?.created_by_name,
				{ text: 'Updated', bold: true, color: PRIMARY_COLOR },
				updated_at,
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
							text: data?.remarks,
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
