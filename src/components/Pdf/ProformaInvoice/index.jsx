import { PI_MD_SIGN } from '@/assets/img/base64';

import { DEFAULT_FONT_SIZE, xMargin } from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import { DollarToWord } from '@/lib/NumToWord';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('order_number', 'Order No'),
	getTable('style', 'Style'),
	getTable('pi_item_description', 'Item'),
	getTable('specification', 'Specification'),
	getTable('h_s_code', 'H S.Code'),
	getTable('size', 'Size'),
	getTable('quantity', 'Quantity', 'right'),
	getTable('unit_price', 'Unit Price\n(US$)', 'right'),
	getTable('value', 'Value\n(US$)', 'right'),
];

export default function Index(data) {
	const headerHeight = 180;
	let footerHeight = 20;
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
	const TotalUnitPrice = {};
	const TotalValue = [];
	const TotalQuantity = [];
	let total_value = [];
	let total_quantity = [];
	let grand_total_value = 0;
	let grand_total_quantity = 0;
	const TotalThreadUnitPrice = [];
	const TotalThreadValue = [];
	const TotalThreadQuantity = [];
	let total_thread_unit_price = 0;
	let total_thread_value = 0;
	let total_thread_quantity = 0;
	let grand_thread_total_quantity = 0;
	let is_inch = 0;
	let is_inchs = [];
	let order_type = 0;
	let order_types = [];
	// * Bank Policy
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
	//*
	pi_cash_entry.forEach((item) => {
		uniqueItemDescription.add(item.pi_item_description);
	});

	pi_cash_entry_thread.forEach((item) => {
		uniqueItemDescriptionThread.add(item.count_length_name);
	});
	//* style , orderID , TotalUnitPrice,is_inch,order_type
	[...uniqueItemDescription].forEach((item) => {
		style[item] = new Set();
		orderID[item] = new Set();
		TotalUnitPrice[item] = new Set();
		pi_cash_entry.forEach((item2) => {
			if (item2.pi_item_description === item) {
				style[item].add(item2.style);
				orderID[item].add(item2.order_number);
				TotalUnitPrice[item].add(item2.unit_price);
				is_inch = item2.is_inch;
				order_type = item2.order_type;
			}
		});
		is_inchs.push(is_inch);
		order_types.push(order_type);
	});

	[...uniqueItemDescription].forEach((item) => {
		[...TotalUnitPrice[item]].forEach((item3) => {
			let value = 0;
			let quantity = 0;
			pi_cash_entry.forEach((item2) => {
				if (
					item2.pi_item_description === item &&
					item2.unit_price === item3
				) {
					value += parseFloat(item2.value);
					quantity += parseFloat(item2.pi_cash_quantity);
				}
			});
			total_quantity.push(quantity);
			grand_total_quantity += quantity;
			total_value.push(Number(value).toFixed(2));
			grand_total_value += value;
		});

		TotalValue.push(total_value);
		TotalQuantity.push(total_quantity);
		total_quantity = [];
		total_value = [];
	});

	// * Size
	const sizeResults = {};
	[...uniqueItemDescription].map((item) => {
		sizeResults[item] = [];
		sizeResults[item] = [...TotalUnitPrice[item]].map((item3) => {
			const sizes = pi_cash_entry
				.filter(
					(entry) =>
						entry.pi_item_description === item &&
						entry.unit_price === item3
				)
				.map((entry) => parseFloat(entry.size));

			return {
				min_size: Math.min(...sizes),
				max_size: Math.max(...sizes),
			};
		});
	});
	// * Specifications
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

	// * order_info_entry
	const order_info_entry = [...uniqueItemDescription].flatMap(
		(item, index) => {
			const unitPrices = [...TotalUnitPrice[item]];
			const rowCount = unitPrices.length;

			return unitPrices.map((unitPrice, priceIndex) => {
				// * Row Span
				const rowSpan = priceIndex === 0 ? rowCount : 0;

				// * Size
				const getItem = sizeResults[item][priceIndex];
				let res = '';
				if (getItem.min_size === getItem.max_size) {
					res = `${getItem.min_size}`;
				} else {
					res = `(${getItem.min_size} - ${getItem.max_size})`;
				}

				if (order_types[index] === 'tape') {
					res = `${res} mtr`;
				} else {
					res += ` ${is_inchs[index] ? 'in' : 'cm'}`;
				}

				return {
					order_number: {
						text:
							priceIndex === 0
								? [...orderID[item]].join(', ')
								: '',
						rowSpan,
					},
					style: {
						text:
							priceIndex === 0 ? [...style[item]].join(', ') : '',
						rowSpan,
					},
					pi_item_description: {
						text: priceIndex === 0 ? item : '',
						rowSpan,
					},
					specification: {
						text: priceIndex === 0 ? specifications[index] : '',
						rowSpan,
					},
					h_s_code: {
						text: priceIndex === 0 ? '9607.11.00' : '',
						rowSpan,
					},
					size: order_types[index] === 'full' ? res : '-',
					quantity:
						order_types[index] === 'tape'
							? res
							: TotalQuantity[index][priceIndex] + ' pcs',
					// unit_price: unitPrice + '/dzn',
					unit_price: `${unitPrice} /${order_types[index] === 'tape' ? 'mtr' : 'dzn'}`,
					value: TotalValue[index][priceIndex],
				};
			});
		}
	);

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
				pi_item_description: '100% SPUN POLYESTER SEWING THREAD',
				specification: '',
				size:
					item.split(' ')[0] +
					'\n (' +
					item.match(/\d+$/)[0] +
					' mtr' +
					')',
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
			{
				table: {
					headerRows: 1,
					widths: [45, 40, 50, '*', 50, 46, 40, 45, 40],
					body: [
						// Header
						TableHeader(node),

						// Body
						...order_info_entry.map((item) =>
							node.map((nodeItem) => {
								const cellData = item[nodeItem.field];
								return {
									text: cellData.text || cellData,
									style: nodeItem.cellStyle,
									alignment: nodeItem.alignment,
									rowSpan: cellData.rowSpan,
								};
							})
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
					'Total Value (In Words): ' +
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
				table: {
					widths: [60, '*'],
					body: headers.map((header, index) => [
						{ text: header, bold: true },
						{
							text:
								index === 0 && data?.is_rtgs
									? 'FDD/RTGS'
									: values[index],
						},
					]),
				},
				layout: 'noBorders',
			},
			{
				image: PI_MD_SIGN.src,
				width: 80,
				height: 90,
				alignment: 'right',
				margin: [0, -28, 0, 0],
			},
		],
	});

	return pdfDocGenerator;
}
