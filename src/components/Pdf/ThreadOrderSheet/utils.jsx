import { FZL_LOGO } from '@/assets/img/base64';
import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE, PRIMARY_COLOR } from '../ui';
import { company, getEmptyColumn } from '../utils';

const PAGE_HEADER_EMPTY_ROW = ['', '', '', ''];

const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy');

export const getPageHeader = (orderInfo) => {
	const created_at = getDateFormate(orderInfo?.created_at);
	const updated_at = getDateFormate(orderInfo?.updated_at);
	const delivery_date = getDateFormate(orderInfo?.delivery_date);
	const pi_number = orderInfo?.pi_numbers;

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
							text: 'Thread Order Sheet\n',
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						`O/N: ${orderInfo?.order_number}\n`,
						`Date: ${created_at}\n`,
						`PI Number: ${pi_number ? pi_number.join(', ') : '---'}\n`,
					],
					alignment: 'right',
				},
				'',
			],
			PAGE_HEADER_EMPTY_ROW,

			// * Start of table
			[
				{ text: 'Party', bold: true, color: PRIMARY_COLOR },
				orderInfo?.party_name,
				{ text: 'Marketing', bold: true, color: PRIMARY_COLOR },
				orderInfo?.marketing_name,
			],
			[
				{ text: 'Factory', bold: true, color: PRIMARY_COLOR },
				orderInfo?.factory_name,

				{ text: 'Merchandiser', bold: true, color: PRIMARY_COLOR },
				orderInfo?.merchandiser_name,
			],
			[
				{ text: 'Address', bold: true, color: PRIMARY_COLOR },
				orderInfo?.factory_address,
				{ text: 'Buyer', bold: true, color: PRIMARY_COLOR },
				orderInfo?.buyer_name,
			],
			[
				{
					text: 'Remarks',
					bold: true,
					color: PRIMARY_COLOR,
				},
				{
					colSpan: 3,
					text: orderInfo?.remarks,
					alignment: 'left',
				},
				'',
				'',
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
