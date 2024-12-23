import { FZL_LOGO } from '@/assets/img/base64';
import { layouts } from 'chart.js';
import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE, PRIMARY_COLOR } from '../ui';
import { company, getEmptyColumn } from '../utils';

const PAGE_HEADER_EMPTY_ROW = ['', '', '', ''];

const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy');

export const getPageHeader = (batch) => {
	const created_at = batch?.created_at
		? getDateFormate(batch?.created_at)
		: '';
	const updated_at = batch?.updated_at
		? getDateFormate(batch?.updated_at)
		: '';
	const conning_created_at = batch?.conning_created_at
		? getDateFormate(batch?.conning_created_at)
		: '';
	const conning_updated_at = batch?.conning_updated_at
		? getDateFormate(batch?.conning_updated_at)
		: '';
	const yarn_issue_created_at = batch?.yarn_issue_created_at
		? getDateFormate(batch?.yarn_issue_created_at)
		: '';
	const yarn_issue_updated_at = batch?.yarn_issue_updated_at
		? getDateFormate(batch?.yarn_issue_updated_at)
		: '';
	const dyeing_created_at = batch?.dyeing_created_at
		? getDateFormate(batch?.dyeing_created_at)
		: '';
	const dyeing_updated_at = batch?.dyeing_updated_at
		? getDateFormate(batch?.dyeing_updated_at)
		: '';
	const buyer = new Set();
	const order_ref_no = new Set();
	batch?.order_entry?.forEach((item) => {
		buyer.add(item.buyer);
		order_ref_no.add(item.order_ref_no);
	});

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
							text: 'Bulk Recipe\n',
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						`Batch No: ${batch?.batch_id}\n`,
						`Date: ${created_at}\n`,
					],
					alignment: 'right',
				},
				'',
			],
			PAGE_HEADER_EMPTY_ROW,

			// * Start of table
			[
				{
					colSpan: 4,
					table: {
						widths: [75, 75, 75, 80, 80, 80],
						headerRows: 1,
						body: [
							[
								{
									text: 'Buyer',
									bold: true,
								},
								{
									text: '',
								},
								{
									text: 'Ref No',
									bold: true,
								},
								{
									text: '',
								},
								{
									text: 'Batch No',
									bold: true,
								},
								{
									text: batch?.batch_id,
								},
							],
							[
								{
									text: 'Order Ref No',
									bold: true,
								},
								{
									text: '',
								},
								{
									text: 'Delv Dt',
									bold: true,
								},
								{
									text: '',
								},
								{
									text: 'Date',
									bold: true,
								},
								{
									text: batch?.batch_id,
								},
							],
							[
								{
									text: 'Shade',
									bold: true,
								},
								{
									text: '',
								},
								{
									text: 'Yarn Type',
									bold: true,
								},
								{
									text: '',
								},
								{
									text: 'Substrate',
									bold: true,
								},
								{
									text: batch?.batch_id,
								},
							],
							[
								{
									text: 'Color',
									bold: true,
								},
								{
									text: '',
								},
								{
									text: 'Yarn Type',
									bold: true,
								},
								{
									text: '',
								},
								{
									text: 'Batch Weight',
									bold: true,
								},
								{
									text: batch?.batch_id,
								},
							],
							[
								{
									text: 'Product',
									bold: true,
								},
								{
									text: '',
								},
								{
									text: 'Lab Status',
									bold: true,
								},
								{
									text: '',
								},
								{
									text: 'Slot',
									bold: true,
								},
								{
									text: batch?.batch_id,
								},
							],
							[
								{
									text: 'Machine No',
									bold: true,
								},
								{
									text: '',
								},
								{
									text: '',
									bold: true,
								},
								{
									text: '',
								},
								{
									text: 'Volume',
									bold: true,
								},
								{
									text: batch?.batch_id,
								},
							],
							[
								{
									text: 'Light Source',
									bold: true,
								},
								{
									text: '',
								},
								{
									text: '',
									bold: true,
								},
								{
									text: '',
								},
								{
									text: 'Fiber Type',
									bold: true,
								},
								{
									text: batch?.batch_id,
								},
							],
						],
					},
					layout: 'noBorders',
				},
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
