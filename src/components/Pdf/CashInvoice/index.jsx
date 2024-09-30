import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import { DollarToWord } from '@/lib/NumToWord';
import numToWords from '@/util/NumToWord';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('pi_item_description', 'Item'),
	getTable('specification', 'Specification'),
	getTable('size', 'Size'),
	// getTable('h_s_code', 'H S,Code'),
	getTable('quantity', 'Quantity(PCS)', 'right'),
	getTable('quantity_pcs', 'Quantity(DZN)', 'right'),
	getTable('unit_price', 'Unit Price(DZN)', 'right'),
	getTable('unit_rate', 'Unit Rate', 'right'),
	getTable('value', 'Value(BDT)', 'right'),
];

export default function Index(data) {
	const headerHeight = 140;
	let footerHeight = 50;
	let { pi_cash_entry } = data;
	let { pi_cash_entry_thread } = data;

	if (!pi_cash_entry) {
		pi_cash_entry = [];
	}
	if (!pi_cash_entry_thread) {
		pi_cash_entry_thread = [];
	}
	//pi_cash_entry = [...pi_cash_entry, ...pi_cash_entry_thread];
	const uniqueItemDescription = new Set();
	const uniqueItemDescriptionThread = new Set();
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
		pi_cash_entry.forEach((item2) => {
			if (item2.pi_item_description === item) {
				total_unit_price += parseFloat(item2.unit_price);
				total_value += parseFloat(item2.value);
				total_quantity += parseFloat(item2.pi_cash_quantity);
			}
		});
		TotalUnitPrice.push(total_unit_price);
		TotalValue.push(total_value);
		grand_total_value += total_value;
		TotalQuantity.push(total_quantity);
		grand_total_quantity += total_quantity;
		total_unit_price = 0;
		total_value = 0;
		total_quantity = 0;
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

	const order_info_entry = [...uniqueItemDescription].map((item, index) => {
		return {
			pi_item_description: item,
			specification: '',
			size: `(${sizeResults[index].min_size || 0} - ${sizeResults[index].max_size || 0}) cm`,
			//h_s_code: '9607,11.00',
			quantity: TotalQuantity[index] + 'pcs',
			quantity_pcs: TotalQuantity[index],
			unit_price: TotalUnitPrice[index] + '/dzn',
			unit_rate: Number(TotalValue[index]),
			value: Number(TotalValue[index]).toFixed(2),
		};
	});
	[...uniqueItemDescriptionThread].forEach((item) => {
		pi_cash_entry_thread.forEach((item2) => {
			if (item2.count_length_name === item) {
				total_thread_unit_price += parseFloat(item2.unit_price);
				total_thread_value += parseFloat(item2.value);
				total_thread_quantity += parseFloat(item2.pi_cash_quantity);
			}
		});
		TotalThreadUnitPrice.push(total_thread_unit_price);
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
				pi_item_description: item,
				specification: '100% SPUN POLYESTER SEWEING THREAD',
				size: item.match(/\d+$/)[0] + ' mtr',
				//h_s_code: '5402,62.00',
				quantity: TotalThreadQuantity[index] + ' cone',
				quantity_pcs: TotalThreadQuantity[index] + ' cone',
				unit_price: TotalThreadUnitPrice[index] + '/cone',
				unit_rate: Number(TotalThreadUnitPrice[index]).toFixed(2),
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
					widths: ['*'],
					body: [
						[
							{
								text:
									'Order Ref No: ' +
									[
										...new Set(
											pi_cash_entry
												.concat(pi_cash_entry_thread)
												.map(
													(entry) =>
														entry.order_number
												)
										),
									].join(', '),
								border: [true, true, true, true],
							},
						],
					],
				},
			},
			{
				table: {
					widths: ['*'],
					body: [
						[
							{
								text:
									'Style: ' +
									[
										...new Set(
											pi_cash_entry
												.concat(pi_cash_entry_thread)
												.map((entry) => entry.style)
										),
									].join(', '),
								border: [true, true, true, true],
							},
						],
					],
				},
			},
			{
				table: {
					headerRows: 1,
					widths: [90, 90, 60, 39, 39, 45, 41, '*'],
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
								text: `Total Zipper: ${Number(grand_total_quantity || 0)} pcs, Total Thread: ${grand_thread_total_quantity} cone`,
								alignment: 'right',
								bold: true,
								colSpan: 5,
							},
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
		],
	});

	return pdfDocGenerator;
}
