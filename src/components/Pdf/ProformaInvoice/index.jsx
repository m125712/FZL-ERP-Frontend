import { PI_MD_SIGN } from '@/assets/img/base64';

import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import { DollarToWord } from '@/lib/NumToWord';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('order_number', 'Order ID'),
	getTable('style', 'Style'),
	getTable('pi_item_description', 'Item'),
	getTable('specification', 'Specification'),
	getTable('size', 'Size'),
	getTable('h_s_code', 'H S.Code'),
	getTable('quantity', 'Quantity', 'right'),
	getTable('unit_price', 'Unit Price\n(US$)', 'right'),
	getTable('value', 'Value\n(US$)', 'right'),
];

export default function Index(data) {
	const headerHeight = 200;
	let footerHeight = 50;
	let { pi_cash_entry } = data;
	let { pi_cash_entry_thread } = data;

	if (!pi_cash_entry) {
		pi_cash_entry = [];
	}
	if (!pi_cash_entry_thread) {
		pi_cash_entry_thread = [];
	}

	const uniqueItemDescription = new Set();
	const uniqueItemDescriptionThread = new Set();
	let style = {};
	let orderID = {};
	let threadStyle = {};
	let threadOrderID = {};
	const TotalUnitPrice = [];
	const TotalValue = [];
	const TotalQuantity = [];
	let total_unit_price = 0;
	let total_value = 0;
	let total_quantity = 0;
	let grand_total_value = 0;
	let grand_total_quantity = 0;
	const TotalThreadUnitPrice = [];
	const TotalThreadValue = [];
	const TotalThreadQuantity = [];
	let total_thread_unit_price = 0;
	let total_thread_value = 0;
	let total_thread_quantity = 0;
	let grand_thread_total_value = 0;
	let grand_thread_total_quantity = 0;
	let count = 0;
	let is_size_inch = 0;

	const bankPolicy = data?.bank_policy
		.replace(/var_routing_no/g, `${data?.routing_no}`)
		.replace(/var_pi_validity/g, `${data?.validity}`)
		.replace(/var_bank_name/g, `${data?.bank_name}`)
		.replace(/var_payment/g, `${data?.payment}`);
	const lines = bankPolicy
		.split(';')
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	const headers = [];
	const values = [];

	lines.forEach((line) => {
		const [header, value] = line.split(':', 2);
		headers.push(header.trim());
		values.push(value ? value.trim() : '');
	});

	pi_cash_entry.forEach((item) => {
		uniqueItemDescription.add(item.pi_item_description);
	});

	pi_cash_entry_thread.forEach((item) => {
		uniqueItemDescriptionThread.add(item.count_length_name);
	});

	[...uniqueItemDescription].forEach((item) => {
		style[item] = new Set();
		orderID[item] = new Set();
		pi_cash_entry.forEach((item2) => {
			if (item2.pi_item_description === item) {
				style[item].add(item2.style);

				orderID[item].add(item2.order_number);
				total_unit_price += parseFloat(item2.unit_price);
				total_value += parseFloat(item2.value);
				total_quantity += parseFloat(item2.pi_cash_quantity);
				is_size_inch = item2.is_size_inch;
				// count++;
			}
		});

		//let avg_unit_price = count > 0 ? total_unit_price / count : 0;

		TotalUnitPrice.push((total_value / total_quantity) * 12);
		TotalValue.push(total_value);
		grand_total_value += total_value;
		TotalQuantity.push(total_quantity);
		grand_total_quantity += total_quantity;
		total_unit_price = 0;
		total_value = 0;
		total_quantity = 0;
		count = 0;
	});

	const sizeResults = [...uniqueItemDescription].map((item) => {
		const sizes = pi_cash_entry
			.filter((entry) => entry.pi_item_description === item)
			.map((entry) => parseFloat(entry.size));

		return {
			min_size: Math.min(...sizes),
			max_size: Math.max(...sizes),
		};
	});

	const specifications = [...uniqueItemDescription].map((item) => {
		return pi_cash_entry
			.filter((entry) => entry.pi_item_description === item)
			.flatMap((entry) => [
				...new Set(
					entry.short_names.filter(
						(name) => name !== null && name !== ''
					)
				),
			])
			.join(', ');
	});
	specifications.forEach((spec, index) => {
		specifications[index] = [...new Set(spec.split(', '))].join(', ');
	});

	const order_info_entry = [...uniqueItemDescription].map((item, index) => {
		return {
			order_number: [...orderID[item]].join(', '),
			style: [...style[item]].join(', '),
			pi_item_description: item,
			specification: specifications[index],
			size: `(${sizeResults[index].min_size || 0} - ${sizeResults[index].max_size || 0}) ${is_size_inch ? 'in' : 'cm'}`,
			h_s_code: '9607.11.00',
			quantity: TotalQuantity[index] + ' pcs',
			unit_price: Number(TotalUnitPrice[index]).toFixed(2) + '/dzn',
			value: Number(TotalValue[index]).toFixed(2),
		};
	});
	[...uniqueItemDescriptionThread].forEach((item) => {
		threadStyle[item] = new Set();
		threadOrderID[item] = new Set();
		pi_cash_entry_thread.forEach((item2) => {
			if (item2.count_length_name === item) {
				threadStyle[item].add(item2.style);
				threadOrderID[item].add(item2.order_number);
				total_thread_unit_price += parseFloat(item2.unit_price);
				total_thread_value += parseFloat(item2.value);
				total_thread_quantity += parseFloat(item2.pi_cash_quantity);
			}
		});
		TotalThreadUnitPrice.push(total_thread_value / total_thread_quantity);
		TotalThreadValue.push(total_thread_value);
		grand_total_value += total_thread_value;
		TotalThreadQuantity.push(total_thread_quantity);
		grand_thread_total_quantity += total_thread_quantity;
		total_thread_unit_price = 0;
		total_thread_value = 0;
		total_thread_quantity = 0;
	});
	const thread_order_info_entry = [...uniqueItemDescriptionThread].map(
		(item, index) => {
			return {
				order_number: [...threadOrderID[item]].join(', '),
				style: [...threadStyle[item]].join(', '),
				pi_item_description: '100% SPUN POLYESTER SEWEING THREAD',
				specification: '',
				size: item.split( ' ' )[0]+'\n ('+item.match(/\d+$/)[0] + ' mtr'+')',
				h_s_code: '5402.62.00',
				quantity: TotalThreadQuantity[index] + ' cone',
				unit_price: TotalThreadUnitPrice[index] + '/cone',
				value: Number(TotalThreadValue[index]).toFixed(2),
			};
		}
	);

	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_A4_PAGE({
			xMargin,
			headerHeight,
			footerHeight,
		}),

		// * Page Header
		header: {
			table: getPageHeader(data),
			layout: 'noBorders',
			margin: [xMargin, 30, xMargin, 0],
		},
		// * Page Footer
		footer: (currentPage, pageCount) => ({
			table: getPageFooter({
				currentPage,
				pageCount,
			}),
			margin: [xMargin, 2],
			fontSize: DEFAULT_FONT_SIZE - 2,
		}),

		// * Main Table
		content: [
			// {
			// 	table: {
			// 		widths: ['*'],
			// 		body: [
			// 			[
			// 				{
			// 					text:
			// 						'Order Ref No: ' +
			// 						[
			// 							...new Set(
			// 								pi_cash_entry
			// 									.concat(pi_cash_entry_thread)
			// 									.map(
			// 										(entry) =>
			// 											entry.order_number
			// 									)
			// 							),
			// 						].join(', '),
			// 					border: [true, true, true, true],
			// 				},
			// 			],
			// 		],
			// 	},
			// },
			// {
			// 	table: {
			// 		widths: ['*'],
			// 		body: [
			// 			[
			// 				{
			// 					text:
			// 						'Style: ' +
			// 						[
			// 							...new Set(
			// 								pi_cash_entry
			// 									.concat(pi_cash_entry_thread)
			// 									.map((entry) => entry.style)
			// 							),
			// 						].join(', '),
			// 					border: [true, true, true, true],
			// 				},
			// 			],
			// 		],
			// 	},
			// },
			{
				table: {
					headerRows: 1,
					widths: [45, 65, 50, 65,65, 50, 40, 45, 40],
					body: [
						// Header
						TableHeader(node),

						// Body
						...order_info_entry.map((item) =>
							node.map((nodeItem) => ({
								text: item[nodeItem.field],
								style: nodeItem.cellStyle,
								alignment: nodeItem.alignment,
							}))
						),
						...thread_order_info_entry.map((item) =>
							node.map((nodeItem) => ({
								text: item[nodeItem.field],
								style: nodeItem.cellStyle,
								alignment: nodeItem.alignment,
							}))
						),
						[
							{
								text: [
									Number(grand_total_quantity) > 0
										? `Total Zipper: ${Number(grand_total_quantity)} pcs`
										: '',
									Number(grand_total_quantity) > 0 &&
									Number(grand_thread_total_quantity) > 0
										? ', '
										: '',
									Number(grand_thread_total_quantity) > 0
										? `Total Thread: ${grand_thread_total_quantity} cone`
										: '',
								],
								alignment: 'right',
								bold: true,
								colSpan: 7,
							},
							{},
							{},
							{},
							{},
							{},
							{},
							{
								text: `U.S.$: ${Number(grand_total_value || 0).toFixed(2)}`,
								alignment: 'right',
								bold: true,
								colSpan: 2,
							},
							{},
						],
					],
				},
			},
			{
				text: '\n',
			},
			{
				text:
					'Total Value(In Words) : ' +
					DollarToWord(grand_total_value),
				bold: true,
			},
			{
				text: '\n',
			},
			{
				text: 'Terms & Conditions',
				underline: true,
				decoration: 'underline',
				bold: true,
			},
			{
				text: '\n',
			},
			{
				table: {
					headerRows: 0,
					heights: 10,
					widths: [60, '*'],
					body: headers.map((header, index) => [
						{ text: header, bold: true },
						{ text: values[index] },
					]),
				},
				layout: 'noBorders',
			},
			{
				image: PI_MD_SIGN.src,
				width: 100,
				height: 100,
				alignment: 'right',
			},
		],
	});

	return pdfDocGenerator;
}
