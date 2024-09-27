import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE, PRIMARY_COLOR } from '../ui';
import { company, getEmptyColumn } from '../utils';

const PAGE_HEADER_EMPTY_ROW = ['', '', '', ''];

const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy');

export const getPageHeader = (orderInfo) => {
	const created_at = getDateFormate(orderInfo?.created_at);
	const updated_at = getDateFormate(orderInfo?.updated_at);
	const delivery_date = getDateFormate(orderInfo?.delivery_date);
	const pi_number = orderInfo?.pi_number;

	// const data = {
	// 	: 'Test Buyer',
	// 	buyer_uuid: 'JioEjrQqCL6WtpP',
	// 	created_at: '2024-09-26 17:09:15',
	// 	created_by: 'RL1xtJnYkxGrTMz',
	// 	created_by_name: 'Mirsad',
	// 	: '2024-09-26 12:00:00',
	// 	: 'Test Factory',
	// 	factory_uuid: 'xDVVb0IvkKGRyCx',
	// 	id: 8,
	// 	is_bill: 0,
	// 	is_cash: 1,
	// 	is_sample: 0,
	// 	: 'Test Marketing',
	// 	marketing_uuid: 'YR8BG0L2E7WUe2Y',
	// 	: 'Test Merchandiser',
	// 	merchandiser_uuid: 'UYpEDgT4cC6FfHf',
	// 	: 'TO24-0008',
	// 	: 'Test Party',
	// 	party_uuid: 'pT4j7Y23Qz8Qq4J',
	// 	remarks: '',
	// 	updated_at: '2024-09-26 17:09:28',
	// 	uuid: 'f014KcGxesFrUZJ',
	// };

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
							text: 'Thread Order Sheet\n',
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						`O/N: ${orderInfo?.order_number}\n`,
						`Date: ${created_at}\n`,
						`PI Number: ${pi_number ? pi_number : '---'}\n`,
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
				{ text: 'Updated', bold: true, color: PRIMARY_COLOR },
				updated_at,
				{ text: 'Created By', bold: true, color: PRIMARY_COLOR },
				orderInfo?.created_by_name,
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
							text: orderInfo?.remarks,
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
