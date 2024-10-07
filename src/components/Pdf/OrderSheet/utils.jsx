import { FZL_LOGO } from '@/assets/img/base64';
import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE } from '../ui';

export const company = {
	name: 'Fortune Zipper LTD.',
	address: 'Aukpara, Ashulia, Savar, DHK-1340',
	contact: 'Email: info@fortunezip.com,\n Phone: 01521533595',
	bin_tax_hscode: 'BIN: 000537296-0403, VAT: 17141000815',
};

export const getPageHeader = (order_info) => {
	const order_number =
		order_info.is_sample === 1
			? order_info.order_number + ' (S)'
			: order_info.order_number;
	const lc_or_cash =
		order_info.is_cash === 1
			? `Cash${order_info?.is_bill === 1 && ' (Bill)'}`
			: 'LC';
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
				],
				alignment: 'right',
			},
			'',
		],
		[
			{ text: 'Client', bold: true },
			order_info.party_name,
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
			{ text: 'Address', bold: true },
			order_info.factory_address,
			{ text: 'LC/Cash', bold: true },
			lc_or_cash,
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

export const TableHeader = ({ entry, uniqueSizes, srinfo }) => {
	const {
		item_name,
		zipper_number_name,
		end_type_name,
		lock_type_name,
		teeth_color_name,
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

		description,
	} = entry;

	return [
		[
			{
				text: 'Description',
				style: 'tableHeader',
				alignment: 'Center',
			},
			{
				colSpan: uniqueSizes.length + 2,
				text: [
					item_name ? item_name : '',
					item_name &&
					(zipper_number_name ||
						end_type_name ||
						lock_type_name ||
						teeth_color_name ||
						puller_type_name ||
						slider_color_name ||
						logo_type_name ||
						top_stopper_name ||
						bottom_stopper_name ||
						srinfo?.length > 0 ||
						description)
						? ' / '
						: '',

					zipper_number_name ? zipper_number_name : '',
					zipper_number_name &&
					(end_type_name ||
						lock_type_name ||
						teeth_color_name ||
						puller_type_name ||
						slider_color_name ||
						logo_type_name ||
						top_stopper_name ||
						bottom_stopper_name ||
						srinfo?.length > 0 ||
						description)
						? ' / '
						: '',

					end_type_name ? end_type_name : '',
					end_type_name &&
					(lock_type_name ||
						teeth_color_name ||
						puller_type_name ||
						slider_color_name ||
						logo_type_name ||
						top_stopper_name ||
						bottom_stopper_name ||
						srinfo?.length > 0 ||
						description)
						? ' / '
						: '',

					lock_type_name ? lock_type_name : '',
					lock_type_name &&
					(teeth_color_name ||
						puller_type_name ||
						slider_color_name ||
						logo_type_name ||
						top_stopper_name ||
						bottom_stopper_name ||
						srinfo?.length > 0 ||
						description)
						? ' / '
						: '',

					teeth_color_name ? teeth_color_name : '',
					teeth_color_name &&
					(puller_type_name ||
						slider_color_name ||
						logo_type_name ||
						top_stopper_name ||
						bottom_stopper_name ||
						srinfo?.length > 0 ||
						description)
						? ' / '
						: '',

					puller_type_name ? puller_type_name : '',
					puller_type_name &&
					(slider_color_name ||
						logo_type_name ||
						top_stopper_name ||
						bottom_stopper_name ||
						srinfo?.length > 0 ||
						description)
						? ' / '
						: '',

					slider_color_name ? slider_color_name : '',
					slider_color_name &&
					(logo_type_name ||
						top_stopper_name ||
						bottom_stopper_name ||
						srinfo?.length > 0 ||
						description)
						? ' / '
						: '',

					logo_type_name
						? logo_type_name +
							`(${is_logo_body ? 'Body' : ''})` +
							`${is_logo_body && is_logo_puller ? ' ' : ''}` + // Space between Body and Puller if both exist
							`(${is_logo_puller ? 'Puller' : ''})`
						: '',
					logo_type_name &&
					(top_stopper_name ||
						bottom_stopper_name ||
						srinfo?.length > 0 ||
						description)
						? ' / '
						: '',

					top_stopper_name ? top_stopper_name : '',
					top_stopper_name &&
					(bottom_stopper_name || srinfo?.length > 0 || description)
						? ' / '
						: '',

					bottom_stopper_name ? bottom_stopper_name : '',
					bottom_stopper_name && (srinfo?.length > 0 || description)
						? ' / '
						: '',

					srinfo?.length > 0 ? `(${srinfo?.join(', ')})` : '',
					srinfo?.length > 0 && description ? ' / ' : '',

					description ? `(${description})` : '',
				],
				style: 'tableHeader',
			},
			...Array.from({ length: uniqueSizes.length + 1 }, () => ''),
		],
		// [
		// 	{
		// 		text: 'Description',
		// 		style: 'tableHeader',
		// 		alignment: 'Center',
		// 	},
		// 	{
		// 		colSpan: uniqueSizes.length + 2,
		// 		text: [
		// 			item_short_name ? item_short_name : '',
		// 			' / ',
		// 			zipper_number_short_name ? zipper_number_short_name : '',
		// 			' / ',
		// 			end_type_short_name ? end_type_short_name : '',
		// 			' / ',
		// 			lock_type_short_name ? lock_type_short_name : '',
		// 			' / ',
		// 			teeth_color_short_name ? teeth_color_short_name : '',
		// 			' / ',
		// 			puller_type_short_name ? puller_type_short_name : '',
		// 			' / ',
		// 			slider_color_short_name ? slider_color_short_name : '',
		// 			' / ',
		// 			logo_type_name
		// 				? logo_type_name +
		// 					`(${is_logo_body ? 'B' : ''})` +
		// 					`(${is_logo_puller ? 'P' : ''})`
		// 				: '',
		// 			' / ',
		// 			top_stopper_short_name ? top_stopper_short_name : '',
		// 			' / ',
		// 			bottom_stopper_short_name
		// 				? bottom_stopper_short_name
		// 				: '',
		// 			' / ',
		// 			srinfo && srinfo.length > 0
		// 				? `(${srinfo?.join(', ')})`
		// 				: '',
		// 			' / ',
		// 			description ? `(${description})` : '',
		// 		],
		// 		style: 'tableHeader',
		// 	},
		// 	...Array.from({ length: uniqueSizes.length + 1 }, () => ''),
		// ],
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
				text: size,
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
