import { FZL_LOGO } from '@/assets/img/base64';
import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE } from '../ui';

export const company = {
	name: 'Fortune Zipper LTD.',
	address: 'Aukpara, Ashulia, Savar, DHK-1340',
	contact: 'Email: info@fortunezip.com,\n Phone: 01521533595',
	bin_tax_hscode: 'BIN: 000537296-0403, VAT: 17141000815',
};

const renderCashOrLC = (is_cash, is_sample, is_bill, is_only_value) => {
	let value = is_cash == 1 ? 'Cash' : 'LC';
	let sample_bill = [];

	if (is_sample === 1) sample_bill.push('Sample');
	if (is_bill === 1) sample_bill.push('Bill');

	if (sample_bill.length > 0) value += ` (${sample_bill.join(', ')})`;

	if (is_only_value) return value;

	return value;
};

export const getPageHeader = (order_info) => {
	const order_number =
		order_info.is_sample === 1
			? order_info.order_number + ' (S)'
			: order_info.order_number;

	// const lc_or_cash =
	// 	order_info.is_cash === 1
	// 		? `Cash${order_info?.is_bill === 1 && ' (Bill)'}`
	// 		: 'LC';

	const lc_or_cash = renderCashOrLC(
		order_info.is_cash,
		order_info.is_sample,
		order_info.is_bill,
		true
	);
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
				text: [`${company.address}\n`, `${company.contact}\n`],
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
					`O/N: ${order_number}\n`,
					`Date: ${order_info?.created_at ? format(new Date(order_info?.created_at), 'dd-MM-yyyy') : ''}\n`,
					`PI No.: ${order_info?.pi_numbers ? order_info?.pi_numbers.join(', ') : '---'}\n`,
				],
				alignment: 'right',
			},
			'',
		],
		[
			{ text: 'LC/Cash', bold: true },
			lc_or_cash,

			{ text: 'Buyer', bold: true },
			order_info.buyer_name,
		],
		[
			{ text: 'Factory', bold: true },
			order_info.factory_name,
			{ text: 'Marketing', bold: true },
			order_info.marketing_name,
		],

		[
			{ text: 'Client', bold: true },
			order_info.party_name,
			{ text: 'Priority', bold: true },
			(order_info.marketing_priority || '-') +
				' / ' +
				(order_info.factory_priority || '-'),
		],
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

export const TableHeader = ({ entry, uniqueSizes, column, srinfo, i }) => {
	const {
		item_name,
		nylon_stopper_name,
		end_type_name,
		hand_name,
		zipper_number_name,
		lock_type_name,
		teeth_color_name,
		teeth_type_name,
		puller_type_name,
		puller_color_name: slider_color_name,
		logo_type_name,
		top_stopper_name,
		bottom_stopper_name,

		// short_name,
		item_short_name,
		zipper_number_short_name,
		end_type_short_name,
		lock_type_short_name,
		teeth_color_short_name,
		puller_type_short_name,
		puller_color_short_name: slider_color_short_name,
		logo_type_short_name,
		top_stopper_short_name,
		bottom_stopper_short_name,

		stopper_type_short_name,
		hand_short_name,
		coloring_type_short_name,

		// is logo
		is_logo_body,
		is_logo_puller,

		// unite size
		is_cm,
		is_meter,
		is_inch,

		description,
	} = entry;

	let info = [
		item_name
			? item_name === 'Nylon'
				? item_name + ' - ' + nylon_stopper_name
				: item_name
			: '',
		end_type_name
			? end_type_name === 'Open End'
				? end_type_name + ' - ' + hand_name
				: end_type_name
			: '',
		zipper_number_name,
		lock_type_name,
		teeth_color_name,
		teeth_type_name,
		puller_type_name,
		slider_color_name,
		logo_type_name,
		top_stopper_name,
		bottom_stopper_name,
	];

	return [
		[
			{
				text: 'Description\n' + `\t#${i + 1}`,
				style: 'tableHeader',
				alignment: 'Center',
			},
			{
				colSpan: uniqueSizes.length + 2,
				text: [
					info.filter(Boolean).join(' / '),
					srinfo?.length > 0 ? `(${srinfo?.join(', ')})` : '',
					srinfo?.length > 0 && description ? ' / ' : '',

					description ? `(${description})` : '',
				],
				style: 'tableHeader',
			},
			...Array.from({ length: uniqueSizes.length + 1 }, () => ''),
		],
		[
			{
				text: 'Style',
				style: 'tableHeader',
			},
			{
				text: 'Color / Size(CM)',
				style: 'tableHeader',
			},
			...uniqueSizes.map((size) => ({
				text: size
					? is_inch
						? Number(size * 2.54).toFixed(2)
						: is_meter
							? Number(size * 100).toFixed(2)
							: is_cm
								? size.toFixed(2)
								: size.toFixed(2)
					: '-',
				style: 'tableHeader',
				alignment: 'right',
			})),
			{
				text: 'Total',
				style: 'tableHeader',
				alignment: 'right',
			},
		],
	];
};

export const TableFooter = ({ total_quantity, total_value }) => [
	{
		colSpan: 3,
		text: `Total QTY: ${total_quantity}`,
		style: 'tableFooter',
		alignment: 'right',
	},
	'',
	'',
	{
		colSpan: 2,
		text: `US $${total_value}`,
		style: 'tableFooter',
		alignment: 'right',
	},
	'',
];
