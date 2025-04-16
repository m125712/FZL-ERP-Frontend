import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import {
	DEFAULT_LETTER_PAGE,
	getTable,
	TableHeader,
} from '@/components/Pdf/utils';

import { NumToWord } from '@/lib/NumToWord';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

export default function Index(data) {
	const createNode = (fields) => fields.map((field) => getTable(...field));

	const threadNode = createNode([
		['item_description', 'Count'],
		['style', 'Style'],
		['color', 'Color'],
		['recipe_name', 'Shade'],
		['size', 'Length', 'right'],
		['qty', 'Qty(cone)', 'right'],
		['carton_quantity', 'Carton Qty', 'right'],
	]);

	const node = threadNode;

	const headerHeight = 220;
	const footerHeight = 50;
	const { challan_entry } = data;
	const challanGroup = [];
	const challanEntry = challan_entry;

	challanEntry.forEach((item) => {
		const { item_description, style, color, size, recipe_name, quantity } =
			item;
		let flag = false;

		challanGroup.forEach((group) => {
			if (
				group.recipe_name === recipe_name &&
				group.style === style &&
				group.color === color &&
				group.item_description === item_description &&
				group.size === size
			) {
				flag = true;
			}
		});

		if (!flag) {
			challanGroup.push(item);
		}
	});
	challanEntry.forEach((item) => {
		const { item_description, style, color, size, recipe_name, quantity } =
			item;

		challanGroup.forEach((group) => {
			if (
				group.recipe_name === recipe_name &&
				group.style === style &&
				group.color === color &&
				group.item_description === item_description &&
				group.size === size
			) {
				group['qty'] =
					parseInt(group['qty'] || 0, 10) +
					parseInt(quantity || 0, 10);
			}
		});
	});
	challanGroup.map((item) => {
		item['carton_quantity'] = Math.ceil(item['qty'] / item.cone_per_carton);
	});

	const uniqueCounts = (challanEntry) =>
		challanEntry?.reduce(
			(acc, item) => {
				acc.itemDescriptions.add(item.item_description);
				acc.styles.add(item.style);
				acc.colors.add(item.color);
				acc.sizes.add(item.size);
				acc.shade.add(item.recipe_name);
				acc.quantity += parseInt(item.qty, 10) || 0;
				acc.carton_quantity += parseInt(item.carton_quantity, 10) || 0;
				return acc;
			},
			{
				itemDescriptions: new Set(),
				styles: new Set(),
				colors: new Set(),
				shade: new Set(),
				sizes: new Set(),
				quantity: 0,
				carton_quantity: 0,
			}
		) || {};

	const grandTotalQuantity = uniqueCounts(challanGroup).quantity;
	const grandTotalCartonQuantity = uniqueCounts(challanGroup).carton_quantity;

	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_LETTER_PAGE({
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
					widths: [70, 130, 60, 60, 60, 50, 50],
					body: [
						[
							{
								text: 'P/L No',
								bold: true,
							},
							{
								text: data.packing_numbers.join(', '),
								bold: true,

								colSpan: 6,
							},
							{},
							{},
							{},
							{},
							{},
						],
						// * Header
						TableHeader(node),

						// * Body
						...challanGroup.map((item) =>
							node.map((nodeItem) => {
								const text =
									nodeItem.field === 'size'
										? `${item[nodeItem.field]} mtr`
										: item[nodeItem.field];
								return {
									text,
									style: nodeItem.cellStyle,
									alignment: nodeItem.alignment,
									colSpan: nodeItem.colSpan,
								};
							})
						),
						[
							{
								text: `Total ${
									uniqueCounts(challanGroup).itemDescriptions
										?.size
								} Count`,
								bold: true,
								fontSize: DEFAULT_FONT_SIZE + 2,
							},

							{
								text: `${uniqueCounts(challanGroup).styles?.size} Style`,
								bold: true,
								fontSize: DEFAULT_FONT_SIZE + 2,
							},
							{
								text: `${uniqueCounts(challanGroup).colors?.size} Color`,
								bold: true,
								fontSize: DEFAULT_FONT_SIZE + 2,
							},
							{
								text: `${uniqueCounts(challanGroup).shade?.size} Shade`,
								bold: true,
								fontSize: DEFAULT_FONT_SIZE + 2,
							},
							{
								text: `${uniqueCounts(challanGroup).sizes?.size} Length `,
								bold: true,
								alignment: 'right',
								fontSize: DEFAULT_FONT_SIZE + 2,
							},
							{
								text: `${grandTotalQuantity} Cones`,
								bold: true,
								alignment: 'right',
								fontSize: DEFAULT_FONT_SIZE + 2,
							},
							{
								text: `${grandTotalCartonQuantity} Pcs`,
								bold: true,
								alignment: 'right',
								fontSize: DEFAULT_FONT_SIZE + 2,
							},
						],
					],
				},
			},
			{ text: '\n\n' },
			{
				text: `Grand Total Quantity (In Words): ${NumToWord(grandTotalQuantity)} Cone Only`,
				bold: true,
				fontSize: DEFAULT_FONT_SIZE + 2,
			},
		],
	});

	return pdfDocGenerator;
}
