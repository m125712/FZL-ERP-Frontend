import { FZL_LOGO } from '@/assets/img/base64';
import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE, PRIMARY_COLOR } from '../ui';
import { company, getEmptyColumn } from '../utils';

const PAGE_HEADER_EMPTY_ROW = ['', '', '', ''];

const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy');

const TitleValue = (title = '', value = '', extraFontSize = 2, colSpan) => [
	{
		text: title,
		fontSize: DEFAULT_FONT_SIZE + extraFontSize,
		bold: true,
		color: PRIMARY_COLOR,
	},
	{
		text: value,
		fontSize: DEFAULT_FONT_SIZE + extraFontSize,
		colSpan: colSpan,
	},
];

export const getPageHeader = (data) => {
	const created_at = getDateFormate(data?.delivery_date);
	const updated_at = data?.updated_at ? getDateFormate(data?.updated_at) : '';

	return {
		heights: ['auto', 2, 'auto', 'auto'],
		widths: [70, '*', 100, '*'],
		body: [
			[
				{
					image: FZL_LOGO.src,
					width: 70,
					height: 40,
					alignment: 'left',
				},
				{
					text: [
						`${company.address}\n`,
						`${company.email}\n`,
						`${company.challan_phone}\n`,
						`${company.bin}, ${company.tax}\n`,
					],
					alignment: 'left',
				},
				{
					colSpan: 2,
					text: [
						{
							text: 'Thread Challan\n',
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						{
							text: `${created_at}\n`,
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
					],
					alignment: 'right',
				},
				'',
			],
			PAGE_HEADER_EMPTY_ROW,

			// * Start of table
			[
				...TitleValue('O/N', data?.order_number),
				...TitleValue('Marketing', data?.marketing_name),
			],
			[
				...TitleValue('PI No', data?.pi_cash_numbers?.join(', ')),
				...TitleValue('Buyer', data?.buyer_name),
			],
			[
				...TitleValue('Party', data?.party_name),
				...TitleValue('Merchandiser', data?.merchandiser_name),
			],
			[
				...TitleValue('Factory', data?.factory_name, 2, 3),
				// ...TitleValue(
				// 	'Carton Quantity',
				// 	`${data?.total_carton_quantity} pcs`
				// ),
				{},
				{},
			],
			[
				{
					text: 'Address',
					bold: true,
					color: PRIMARY_COLOR,
					fontSize: DEFAULT_FONT_SIZE + 2,
				},
				{
					colSpan: 3,
					text: data?.factory_address,
					alignment: 'left',
					fontSize: DEFAULT_FONT_SIZE + 2,
				},
				'',
				'',
			],
			PAGE_HEADER_EMPTY_ROW,
			PAGE_HEADER_EMPTY_ROW,
			[
				{
					colSpan: 4,
					text: `Challan: ${data?.challan_number}\n`,
					fontSize: DEFAULT_FONT_SIZE + 4,
					bold: true,
					alignment: 'center',
					color: PRIMARY_COLOR,
				},
				'',
				'',
				'',
			],
		],
	};
};

export const getPageFooter = ({ currentPage, pageCount }) => {
	return {
		widths: ['*', '*', '*', '*', '*'],
		body: [
			[
				{
					text: 'Received By',
					fontSize: DEFAULT_FONT_SIZE + 3,
					alignment: 'center',
					border: [false, true, false, false],
				},
				{
					text: '',
					alignment: 'center',
					border: [false, false, false, false],
				},
				{
					text: 'Checked By',
					fontSize: DEFAULT_FONT_SIZE + 3,
					alignment: 'center',
					border: [false, true, false, false],
				},
				{
					text: '',
					alignment: 'center',
					border: [false, false, false, false],
				},
				{
					text: 'Prepared By',
					fontSize: DEFAULT_FONT_SIZE + 3,
					alignment: 'center',
					border: [false, true, false, false],
				},
			],
			[
				{
					colSpan: 5,
					text: `Page ${currentPage} / ${pageCount}`,
					alignment: 'left',
					border: [false, false, false, false],
					// color,
				},
				...getEmptyColumn(5),
			],
		],
	};
};
