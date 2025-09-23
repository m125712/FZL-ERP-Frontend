import { FZL_LOGO } from '@/assets/img/base64';
import { types } from '@/pages/Report/LcFortNight/Header';

import { DEFAULT_FONT_SIZE } from '../ui';
import { company, getEmptyColumn } from '../utils';

// const PAGE_HEADER_EMPTY_ROW = ['', '', '', ''];

// const getDateFormate = (date) => {
// 	if (date) {
// 		return format(new Date(date), 'dd/MM/yyyy');
// 	} else {
// 		return '--/--/--';
// 	}
// };

export const getPageHeader = (data, type) => {
	// const created_at = getDateFormate(data?.delivery_date);

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
					text: [
						`${company.address}\n`,
						`${company.challan_phone}\n`,
					],
					alignment: 'left',
				},
				{
					colSpan: 2,
					text: [
						{
							text: `LC Fortnight\n`,
							fontSize: DEFAULT_FONT_SIZE + 4,
							bold: true,
						},
						`Type: ${types?.find((item) => item.value == type)?.label}\n`,
						``,
						``,
					],
					alignment: 'right',
				},
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
