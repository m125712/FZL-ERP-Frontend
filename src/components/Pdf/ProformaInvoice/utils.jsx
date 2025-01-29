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
		widths: [60, '*', 60, '*'],
		body: [
			[
				{
					table: {
						widths: ['auto', '*', 'auto'],
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
										`${company.phone}\n`,
										`${company.bin}\n`,
										`${company.tax}\n`,
									],
									alignment: 'left',
								},
								{
									text: [
										{
											text: 'PROFORMA INVOICE\n',
											fontSize: DEFAULT_FONT_SIZE + 4,
											bold: true,
										},
										`PI No: ${data?.id}\n`,
										`Date: ${created_at}\n`,
									],
									alignment: 'right',
								},
							],
						],
					},
					colSpan: 4,
					layout: 'noBorders',
				},
				{},
				{},
				{},
			],

			// * Start of table
			[
				{
					table: {
						widths: [55, '*', 60, '*'],
						body: [
							[
								{
									text: 'Proforma For',
									bold: true,
									color: PRIMARY_COLOR,
								},
								data?.factory_name,
								{
									text: 'Advising Bank',
									bold: true,
									color: PRIMARY_COLOR,
								},
								data?.bank_name,
							],
							[
								{
									text: 'Address',
									bold: true,
									color: PRIMARY_COLOR,
								},
								{ text: data?.factory_address },

								{
									text: 'Address',
									bold: true,
									color: PRIMARY_COLOR,
								},
								{ text: data?.bank_address },
							],
							[
								{
									text: 'Buyer',
									bold: true,
									color: PRIMARY_COLOR,
								},
								{ text: [...buyer].join(', ') },
								{
									text: 'Account No',
									bold: true,
									color: PRIMARY_COLOR,
								},
								data?.bank_account_no,
							],

							[
								{
									text: 'Attention',
									bold: true,
									color: PRIMARY_COLOR,
								},
								data?.merchandiser_name,
								{
									text: 'SWIFT',
									bold: true,
									color: PRIMARY_COLOR,
								},
								data?.bank_swift_code,
							],

							[
								{
									text:
										Number(data?.weight) > 0
											? 'Weight'
											: '',
									bold: true,
									color: PRIMARY_COLOR,
								},
								{
									text:
										Number(data?.weight) > 0
											? data?.weight + ' Kg'
											: '',
								},
								{
									text: 'Routing No',
									bold: true,
									color: PRIMARY_COLOR,
								},
								data?.bank_routing_no,
							],
						],
					},
					layout: 'noBorders',
					colSpan: 4,
				},
				{},
				{},
				{},
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
