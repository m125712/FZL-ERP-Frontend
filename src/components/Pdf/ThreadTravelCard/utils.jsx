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
							text: 'Travel Card\n',
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
					text: 'Yarn Qty (KG)',
					bold: true,
					color: PRIMARY_COLOR,
				},
				{
					text: `${batch?.total_yarn_quantity} / ${batch?.total_expected_weight} #Sub-Streat (${[...sub_streat].join(', ')})`,
				},
				{ text: 'Supervisor', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.dyeing_supervisor_name },
			],
			[
				{ text: 'Liquor Ratio', bold: true, color: PRIMARY_COLOR },
				{ text: `1:10` },
				{ text: 'Machine', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.machine_name },
			],
			[
				{ text: 'Volume', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.water_capacity * batch?.total_yarn_quantity },
				{ text: 'Slot', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.slot === 0 ? '-' : 'Slot ' + batch?.slot },
			],
			[
				{ text: 'Color', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.batch_entry[0]?.color },
				{ text: 'Shift', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.shift },
			],
			[
				{ text: 'Bleach', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.batch_entry[0]?.bleaching },
				{ text: 'Operator', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.dyeing_operator_name },
			],
			[
				{ text: 'Status', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.status },
				{ text: 'Pass By', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.pass_by_name },
			],

			[
				{ text: 'Reason', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.reason },
				{ text: 'Category', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.category },
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
