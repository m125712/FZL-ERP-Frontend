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
					text: 'Act.Yarn Qty',
					bold: true,
					color: PRIMARY_COLOR,
				},
				{ text: batch?.total_yarn_quantity },
				{ text: 'Volume', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.water_capacity * batch?.total_yarn_quantity },
			],
			[
				{
					text: 'Exp.Yarn Qty',
					bold: true,
					color: PRIMARY_COLOR,
				},
				{ text: batch?.total_expected_weight, colSpan: 3 },
				{},
				{},
			],
			[
				{ text: 'Color', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.batch_entry[0]?.color },
				{ text: 'Bleach', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.batch_entry[0]?.bleaching },
			],
			[
				{ text: 'Status', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.status },
				{ text: 'Category', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.category },
			],
			[
				{ text: 'Machine', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.machine_name },
				{ text: 'Water Capacity', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.water_capacity },
			],
			[
				{ text: 'Slot', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.slot === 0 ? '-' : 'Slot ' + batch?.slot },
				{ text: 'Operator', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.dyeing_operator_name },
			],
			[
				{ text: 'SuperVisor', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.dyeing_supervisor_name },
				{ text: 'Pass By', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.pass_by_name },
			],
			[
				{ text: 'Shift', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.shift },
				{ text: 'Reason', bold: true, color: PRIMARY_COLOR },
				{ text: batch?.reason },
			],
			[
				{ text: 'Created At', bold: true, color: PRIMARY_COLOR },
				{ text: dyeing_created_at },
				{ text: 'Updated At', bold: true, color: PRIMARY_COLOR },
				{ text: dyeing_updated_at },
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
