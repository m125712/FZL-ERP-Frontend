import { FZL_LOGO } from '@/assets/img/base64';
import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE } from '../ui';
import { company } from '../utils';

export const getPageHeader = (order_info) => {
	const order_number =
		order_info.is_sample === 1
			? order_info.order_number + ' (S)'
			: order_info.order_number;

	return [
		// CompanyAndORDER
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
					`${company.email}\n`,
					`${company.phone}\n`,
					`${company.bin}, ${company.tax}\n`,
				],
				alignment: 'left',
				margin: [40, 0, 0, 0],
			},
			{
				colSpan: 2,
				text: [
					{
						text: 'Order Sheet\n',
						fontSize: DEFAULT_FONT_SIZE + 4,
						bold: true,
					},
					`O/N: ${order_number} ${order_info.revisions > 0 ? `Rev ${order_info.revisions}` : ''} \n`,
					`Date: ${order_info?.created_at ? format(new Date(order_info?.created_at), 'dd-MM-yyyy') : ''}\n`,
					`PI No.: ${order_info?.pi_numbers ? order_info?.pi_numbers.join(', ') : '---'}\n`,
				],
				alignment: 'right',
			},
			'',
		],
		[
			// { text: 'LC/Cash', bold: true },
			// ...(haveAccess.includes('show_cash_bill_lc')
			// 	? [lc_or_cash]
			// 	: ['- / -']),
			{ text: 'Buyer', bold: true },
			order_info.buyer_name,
			{ text: 'Marketing', bold: true },
			order_info.marketing_name,
		],
		[
			{ text: 'Party', bold: true },
			order_info.party_name,
			{ text: 'Priority', bold: true },
			(order_info.marketing_priority || '-') +
				' / ' +
				(order_info.factory_priority || '-'),
		],

		[{ text: 'Factory', bold: true }, order_info.factory_name, '', ''],
		[
			{ text: 'Address', bold: true },
			{ colSpan: 3, text: order_info.factory_address },
			'',
			'',
		],
	];
};

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

export const TableHeader = (item, idx) => {
	return [
		[
			{
				text: item.style,
				style: 'tableHeader',
				colSpan: 5,
			},
			{},
			{},
			{},
			{},
		],
		[
			{ text: 'Details', style: 'tableHeader' },
			{ text: 'Color', style: 'tableHeader' },
			{ text: 'Size', style: 'tableHeader' },
			{ text: 'Unit', style: 'tableHeader' },
			{ text: 'Quantity', style: 'tableHeader' },
		],
	];
};
