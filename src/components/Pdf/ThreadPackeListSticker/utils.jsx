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
							text: 'Packing List\n',
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						`Packing Number: ${data?.packing_number}\n`,
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
				{ text: 'Challan Number', bold: true, color: PRIMARY_COLOR },
				data?.challan_number,
			],
			[
				{ text: 'Carton Size', bold: true, color: PRIMARY_COLOR },
				data?.carton_size,
				{ text: 'Carton Weight', bold: true, color: PRIMARY_COLOR },
				data?.carton_weight,
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

export const getPageFooter = ({
	data,
	currentPage,
	pageCount,
	rank,
	packing_number,
}) => ({
	body: [
		[
			{
				text: data?.buyer_name,

				fontSize: DEFAULT_FONT_SIZE + 1,
				border: [false, false, false, false],
			},
		],
		[
			{
				text: data?.factory_name,

				fontSize: DEFAULT_FONT_SIZE + 1,
				border: [false, false, false, false],
			},
		],
		[
			{
				text: data?.party_name,
				bold: true,

				fontSize: DEFAULT_FONT_SIZE + 1,
				border: [false, false, false, false],
			},
		],
	],
});
