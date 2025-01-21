import { FZL_LOGO } from '@/assets/img/base64';
import { layouts } from 'chart.js';
import { format, sub } from 'date-fns';

import { getRequiredTapeKg } from '@/util/GetRequiredTapeKg';

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
	const shade = new Set();
	const color = new Set();
	const count_length = new Set();
	const substrate = new Set();
	const delivery_date = new Set();
	const orderCreatedDate = new Set();
	const bleach = new Set();
	const party = new Set();
	batch?.dyeing_batch_entry?.forEach((item) => {
		party.add(item.party_name);
		buyer.add(item.buyer_name);
		order_ref_no.add(item.order_number);
		shade.add(item.recipe_name);
		color.add(item.color);
		count_length.add(item.count_length);
		substrate.add(item.sub_streat);
		delivery_date.add(
			item.delivery_date ? getDateFormate(item.delivery_date) : ''
		);
		orderCreatedDate.add(getDateFormate(item.created_at));
		bleach.add(item.bleaching);
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
							text: `Bulk Recipe #${batch?.batch_type}\n`,
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						`B/N: ${batch?.batch_id}\n`,
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
						widths: [60, 200, 60, 160],
						headerRows: 1,
						body: [
							[
								{
									text: 'Party',
									bold: true,
								},
								{
									text: `${Array.from(party).join(', ')}`,
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
									text: 'Order No',
									bold: true,
								},
								{
									text: `${Array.from(order_ref_no).join(', ')}`,
								},
								{
									text: 'Date',
									bold: true,
								},
								{
									text: created_at,
								},
							],
							[
								{
									text: 'Shade',
									bold: true,
								},
								{
									text: `${Array.from(shade).join(', ')}`,
								},
								{
									text: 'Substrate',
									bold: true,
								},
								{
									text: `${Array.from(substrate).join(', ')}`,
								},
							],
							[
								{
									text: 'Color',
									bold: true,
								},
								{
									text: `${Array.from(color).join(', ')}`,
								},
								{
									text: 'Batch Weight',
									bold: true,
								},
								{
									text:
										batch?.dyeing_batch_entry
											.reduce((acc, item) => {
												const quantity =
													parseFloat(item.quantity) ||
													0;

												// * for tape order we calculate with size as quantity
												const itemTotal =
													getRequiredTapeKg({
														row: item,
														type: 'raw',
														input_quantity:
															quantity,
													}) || 0;
												return acc + itemTotal;
											}, 0)
											.toFixed(3) + ' (KG)',
									// text:
									// 	batch?.total_yarn_quantity +
									// 	'/' +
									// 	batch?.total_expected_weight,
								},
							],
							[
								{
									text: 'Machine No',
									bold: true,
								},
								{
									text: batch?.machine_name,
								},
								{
									text: 'Volume',
									bold: true,
								},
								{
									text: Number(
										batch?.water_capacity *
											batch?.total_yarn_quantity
									)?.toFixed(3),
								},
							],
							[
								{
									text: 'Slot',
									bold: true,
								},
								{
									text: 'Slot ' + batch?.slot,
								},
								{
									text: 'Delv Dt',
									bold: true,
								},
								{
									text: `${Array.from(delivery_date).join(', ')}`,
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
									text: 'Fiber Type',
									bold: true,
								},
								{
									text: '',
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
