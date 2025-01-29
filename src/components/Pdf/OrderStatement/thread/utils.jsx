import { FZL_LOGO } from '@/assets/img/base64';
import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE, PRIMARY_COLOR, styles } from '../../ui';
import { company, getEmptyColumn } from '../../utils';

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
			// * Start of table
			[
				{
					text: 'THREAD ORDER SHEET',
					bold: true,
					color: PRIMARY_COLOR,
					colSpan: 4,
					alignment: 'center',
					style: 'tableHeader',
					...(orderInfo.pageBreak ? { pageBreak: 'before' } : {}),
				},
				{},
				{},
				{},
			],
			[
				{ text: 'O/N', bold: true, color: PRIMARY_COLOR },
				`${orderInfo?.order_number}  ${orderInfo?.revision_no > 0 ? `Rev: ${orderInfo?.revision_no}` : ''}\n`,
				{ text: 'Date', bold: true, color: PRIMARY_COLOR },
				created_at,
			],

			[
				{ text: 'Buyer', bold: true, color: PRIMARY_COLOR },
				orderInfo?.buyer_name,
				{ text: 'Marketing', bold: true, color: PRIMARY_COLOR },
				orderInfo?.marketing_name,
			],
			[
				{ text: 'Party', bold: true, color: PRIMARY_COLOR },
				orderInfo?.party_name,
				{ text: 'Merchandiser', bold: true, color: PRIMARY_COLOR },
				orderInfo?.merchandiser_name,
			],
			[
				{ text: 'Factory', bold: true, color: PRIMARY_COLOR },
				{ text: orderInfo?.factory_name, colSpan: 3 },
				{ text: 'PI', bold: true, color: PRIMARY_COLOR },
				`${pi_number ? pi_number.join(', ') : '---'}\n`,
			],
			[
				{ text: 'Address', bold: true, color: PRIMARY_COLOR },
				{ text: orderInfo?.factory_address, colSpan: 3 },
				{},
				{},
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
