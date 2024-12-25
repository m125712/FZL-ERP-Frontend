import { FZL_LOGO } from '@/assets/img/base64';
import { black } from 'daisyui/src/theming/themes';
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
	const sub_streat = new Set();
	batch?.batch_entry?.forEach((item) => {
		sub_streat.add(item.sub_streat);
	});
	const recipe = new Set();
	batch?.batch_entry?.forEach((item) => {
		recipe.add(item.recipe_name);
	});
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
	const swatch_date = new Set();
	batch?.batch_entry?.forEach((item) => {
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
		swatch_date.add(
			item.swatch_approval_date
				? getDateFormate(item.swatch_approval_date)
				: ''
		);
		orderCreatedDate.add(getDateFormate(item.order_created_at));
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
							text: `Travel Card #${batch?.batch_type}\n`,
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
						widths: [50, 50, 50, 50, 50, 70, 70, 70],
						headerRows: 1,
						body: [
							[
								{
									text: 'Party',
									bold: true,
								},
								{
									text: Array.from(party).join(', '),
									colSpan: 5,
								},
								{},
								{},
								{},
								{},
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
									text: 'Machine',
									bold: true,
								},
								{
									text: batch?.machine_name,
								},
								{
									text: 'Type',
									bold: true,
								},
								{
									text: ``,
								},
								{
									text: 'Swatch Dt.',
									bold: true,
								},
								{
									text: Array.from(swatch_date).join(', '),
								},
								{ text: 'Substrate', bold: true },
								{ text: Array.from(substrate).join(', ') },
							],
							[
								{
									text: 'Remarks',
									bold: true,
								},
								{
									text: batch?.remarks,
									colSpan: 5,
								},
								{},
								{},
								{},
								{},
								{ text: 'Shade', bold: true },
								{ text: Array.from(shade).join(', ') },
							],
							[
								{
									text: 'Order No',
									bold: true,
								},
								{
									text: 'Order Date',
									bold: true,
								},
								{
									text: 'Deliv. Date',
									bold: true,
								},
								{
									text: 'Buyer',
									bold: true,
									colSpan: 3,
								},
								{},
								{},
								{ text: 'Lab Ref', bold: true },
								{},
							],
							[
								{
									text: `${Array.from(order_ref_no).join(', ')}`,
								},
								{
									text: `${Array.from(orderCreatedDate).join(', ')}`,
								},
								{
									text: `${Array.from(delivery_date).join(', ')}`,
								},

								{
									text: `${Array.from(buyer).join(', ')}`,
									colSpan: 3,
								},
								{},
								{},
								{
									text: 'Ttl. Yarn',
									bold: true,
								},
								{
									// text: batch?.total_yarn_quantity + ' (KG)',
									text:
										batch?.total_yarn_quantity +
										'/' +
										batch?.total_expected_weight +
										' (KG)',
								},
							],
							[
								{
									text: 'Bleach',
									bold: true,
								},
								{
									text: `${Array.from(bleach).join(', ')}`,
									colSpan: 2,
								},
								{},
								{
									text: 'Slot',
									bold: true,
								},
								{
									text:
										batch?.slot === 0
											? '-'
											: 'Slot ' + batch?.slot,
									colSpan: 2,
								},
								{},
								{ text: 'Color', bold: true },

								{ text: Array.from(color).join(', ') },
							],
						],
					},
				},
			],

			// [
			// 	{
			// 		text: 'Yarn Qty (KG)',
			// 		bold: true,
			// 		color: PRIMARY_COLOR,
			// 	},
			// 	{
			// 		text: `${batch?.total_yarn_quantity} / ${batch?.total_expected_weight} #Sub-Streat (${[...sub_streat].join(', ')})`,
			// 	},
			// 	{ text: 'Supervisor', bold: true, color: PRIMARY_COLOR },
			// 	{ text: batch?.dyeing_supervisor_name },
			// ],
			// [
			// 	{ text: 'Liquor Ratio', bold: true, color: PRIMARY_COLOR },
			// 	{ text: `1:10` },
			// 	{ text: 'Machine', bold: true, color: PRIMARY_COLOR },
			// 	{ text: batch?.machine_name },
			// ],
			// [
			// 	{ text: 'Volume', bold: true, color: PRIMARY_COLOR },
			// 	{ text: batch?.water_capacity * batch?.total_yarn_quantity },
			// 	{ text: 'Slot', bold: true, color: PRIMARY_COLOR },
			// 	{ text: batch?.slot === 0 ? '-' : 'Slot ' + batch?.slot },
			// ],
			// [
			// 	{ text: 'Color', bold: true, color: PRIMARY_COLOR },
			// 	{ text: batch?.batch_entry[0]?.color },
			// 	{ text: 'Shift', bold: true, color: PRIMARY_COLOR },
			// 	{ text: batch?.shift },
			// ],
			// [
			// 	{ text: 'Bleach', bold: true, color: PRIMARY_COLOR },
			// 	{ text: batch?.batch_entry[0]?.bleaching },
			// 	{ text: 'Operator', bold: true, color: PRIMARY_COLOR },
			// 	{ text: batch?.dyeing_operator_name },
			// ],
			// [
			// 	{ text: 'Status', bold: true, color: PRIMARY_COLOR },
			// 	{ text: batch?.status },
			// 	{ text: 'Pass By', bold: true, color: PRIMARY_COLOR },
			// 	{ text: batch?.pass_by_name },
			// ],

			// [
			// 	{ text: 'Reason', bold: true, color: PRIMARY_COLOR },
			// 	{ text: batch?.reason },
			// 	{ text: 'Category', bold: true, color: PRIMARY_COLOR },
			// 	{ text: batch?.category },
			// ],
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
