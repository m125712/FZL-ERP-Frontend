import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import {
	DEFAULT_A4_PAGE,
	DEFAULT_LETTER_PAGE,
	getTable,
	TableHeader,
} from '@/components/Pdf/utils';

import { DollarToWord, NumToWord } from '@/lib/NumToWord';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

export default function Index(data) {
	const isThreadChallan =
		data?.item_for === 'thread' || data?.item_for === 'sample_thread';
	const isTapeChallan = data?.item_for === 'tape';
	const isSliderChallan = data?.item_for === 'slider';

	const threadNode = [
		getTable('packing_number', 'PL No'),
		getTable('item_description', 'Count'),
		getTable('style', 'Style'),
		getTable('color', 'Color'),
		getTable('size', 'Length', 'right'),
		getTable('quantity', 'Qty(cone)', 'right'),
		getTable('poli_quantity', 'Poly', 'right'),
	];

	const zipperNode = [
		getTable('packing_number', 'PL No'),
		getTable('item_description', 'Item Description'),
		getTable('style', 'Style'),
		getTable('color', 'Color'),
		getTable('size', 'Size', 'right'),
		getTable('quantity', 'Qty(pcs)', 'right'),
		getTable('poli_quantity', 'Poly', 'right'),
	];
	const tapeNode = [
		getTable('packing_number', 'PL No'),
		getTable('item_description', 'Item Description'),
		getTable('style', 'Style'),
		getTable('color', 'Color'),
		getTable('size', 'Size', 'right'),
		getTable('quantity', 'Qty(cm)', 'right'),
		getTable('poli_quantity', 'Poly', 'right'),
	];
	const sliderNode = [
		getTable('packing_number', 'PL No'),
		getTable('item_description', 'Item Description'),
		getTable('style', 'Style'),
		getTable('quantity', 'Qty(cm)', 'right'),
		getTable('poli_quantity', 'Poly', 'right'),
	];
	const node = isThreadChallan
		? threadNode
		: isTapeChallan
			? tapeNode
			: isSliderChallan
				? sliderNode
				: zipperNode;

	const headerHeight = 200;
	let footerHeight = 50;
	let { challan_entry } = data;
	const uniqueCounts = challan_entry?.reduce(
		(acc, item) => {
			acc.itemDescriptions.add(item.item_description);
			acc.styles.add(item.style);
			acc.colors.add(item.color);
			acc.sizes.add(item.size);
			acc.quantity = acc.quantity + parseInt(item.quantity, 10);
			acc.poly_quantity =
				acc.poly_quantity + parseInt(item.poli_quantity, 10);
			return acc;
		},
		{
			itemDescriptions: new Set(),
			styles: new Set(),
			colors: new Set(),
			sizes: new Set(),
			quantity: 0,
			poly_quantity: 0,
		}
	);

	const uniqueItemDescription = uniqueCounts.itemDescriptions.size;
	const uniqueStyle = uniqueCounts.styles.size;
	const uniqueColor = uniqueCounts.colors.size;
	const uniqueSize = uniqueCounts.sizes.size;
	let totalQuantity = uniqueCounts.quantity;
	let totalPolyQty = uniqueCounts.poly_quantity;

	let unit = [];
	challan_entry?.forEach((item) => {
		unit.push(
			`${isThreadChallan ? `mtr` : isTapeChallan ? `mtr` : item.is_inch === 1 ? `inch` : `cm`}`
		);
	});

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
					widths: isSliderChallan
						? [110, 110, 110, 80, 80]
						: [70, 80, 110, 70, 40, 70, 50],
					body: [
						// * Header
						TableHeader(node),

						// * Body
						...challan_entry?.map((item) =>
							node.map((nodeItem) => {
								if (nodeItem.field === 'size') {
									const unitIndex =
										challan_entry.indexOf(item);
									return {
										text:
											item[nodeItem.field] +
											' ' +
											(unit[unitIndex] || ''),
										style: nodeItem.cellStyle,
										alignment: nodeItem.alignment,
									};
								}
								return {
									text: item[nodeItem.field],
									style: nodeItem.cellStyle,
									alignment: nodeItem.alignment,
								};
							})
						),

						isSliderChallan
							? [
									{
										text: 'Total',
										bold: true,
									},
									{
										text: `${uniqueItemDescription} Desc`,
										bold: true,
									},
									{
										text: `${uniqueStyle} Style`,
										bold: true,
									},
									{
										text: totalQuantity,
										bold: true,
										alignment: 'right',
									},
									{
										text: totalPolyQty,
										bold: true,
										alignment: 'right',
									},
								]
							: [
									{
										text: 'Total',
										bold: true,
									},
									{
										text: `${uniqueItemDescription} Desc`,
										bold: true,
									},
									{
										text: `${uniqueStyle} Style`,
										bold: true,
									},
									{
										text: `${uniqueColor} Color`,
										bold: true,
									},
									{
										text: `${uniqueSize} Size`,
										bold: true,
										alignment: 'right',
									},
									{
										text: totalQuantity,
										bold: true,
										alignment: 'right',
									},
									{
										text: totalPolyQty,
										bold: true,
										alignment: 'right',
									},
								],
					],
				},
				layout: tableLayoutStyle,
			},
			{
				text: '\n',
			},
			{
				text: `Total Quantity (In Words): ${NumToWord(totalQuantity)} ${
					isThreadChallan
						? 'cone'
						: isTapeChallan
							? 'cm only'
							: 'pcs only'
				}`,
				bold: true,
			},
		],
	});

	return pdfDocGenerator;
}
