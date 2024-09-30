import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import numToWords from '@/util/NumToWord';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('item_description', 'Item'),
	getTable('specification', 'Specification'),
	getTable('size', 'Size'),
	getTable('h_s_code', 'H S,Code'),
	getTable('quantity', 'Quantity', 'right'),
	getTable('unit_price', 'Unit Price(US$)', 'right'),
	getTable('value', 'Value(US$)', 'right'),
];

export default function Index(data) {
	const headerHeight = 170;
	let footerHeight = 50;
	let { pi_cash_entry } = data;
	let { pi_cash_entry_thread } = data;

	if (!pi_cash_entry) {
		pi_cash_entry = [];
	}
	if (!pi_cash_entry_thread) {
		pi_cash_entry_thread = [];
	}
	pi_cash_entry = [...pi_cash_entry, ...pi_cash_entry_thread];
	const uniqueItemDescription = new Set();
	const uniqueStyle = new Set();
	const uniqueOrder = new Set();
	const TotalUnitPrice = [];
	const TotalValue = [];
	const TotalQuantity = [];
	let total_unit_price = 0;
	let total_value = 0;
	let total_quantity = 0;
	let grand_total_value = 0;
	let grand_total_quantity = 0;

	pi_cash_entry.forEach((item) => {
		uniqueItemDescription.add(item.item_description);
	});

	pi_cash_entry_thread.forEach((item) => {
		uniqueItemDescription.add(item.item_description);
	});

	[...uniqueItemDescription].forEach((item) => {
		pi_cash_entry.forEach((item2) => {
			if (item2.item_description === item) {
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
			.filter((entry) => entry.item_description === item)
			.map((entry) => parseFloat(entry.size));

		return {
			min_size: Math.min(...sizes),
			max_size: Math.max(...sizes),
		};
	});

	const order_info_entry = [...uniqueItemDescription].map((item, index) => {
		return {
			item_description: item,
			specification: '',
			size: `${sizeResults[index].min_size || 0} - ${sizeResults[index].max_size || 0}`,
			h_s_code: item ? '9607,11.00' : '5402.62.00',
			quantity: TotalQuantity[index],
			unit_price: TotalUnitPrice[index],
			value: Number(TotalValue[index]).toFixed(2),
		};
	});

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
											pi_cash_entry.map(
												(entry) => entry.order_number
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
											pi_cash_entry.map(
												(entry) => entry.style
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
					headerRows: 1,
					widths: [40, 100, 70, 50, 50, 50, '*'],
					body: [
						// Header
						TableHeader(node),

						// Body
						...order_info_entry?.map((item) =>
							node.map((nodeItem) => ({
								text: item[nodeItem.field],
								style: nodeItem.cellStyle,
								alignment: nodeItem.alignment,
							}))
						),
						[
							{
								text: `Total: ${Number(grand_total_quantity || 0)}`,
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
						],
					],
				},
			},
			{
				table: {
					widths: [50, '*'],
					body: [
						[
							{
								text: 'Total Value',
								bold: true,
							},

							{
								text:
									': U.S. Dollar ' +
									numToWords(grand_total_value.toFixed(2)) +
									' Only',
								bold: true,
							},
						],
					],
				},
				layout: 'noBorders',
			},
			{
				text: 'Terms & Conditions',
				underline: true,
				decoration: 'underline',
				bold: true,
			},
			{
				text: data?.privciy,
			},
		],
	});

	return pdfDocGenerator;
}
