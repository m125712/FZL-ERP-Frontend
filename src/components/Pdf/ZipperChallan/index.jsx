import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('packing_number', 'PL No'),
	getTable('item_description', 'Item Description'),
	getTable('style', 'Style'),
	getTable('color', 'Color'),
	getTable('size', 'Size', 'right'),
	getTable('quantity', 'Qty(pcs)', 'right'),
	getTable('poly_quantity', 'Poly', 'right'),
];

export default function Index(data) {
	const headerHeight = 150;
	let footerHeight = 50;
	let { challan_entry } = data;
	let totalQuantity = challan_entry?.reduce((acc, item) => {
		const quantity = parseInt(item.quantity, 10) || 0;
		return acc + quantity;
	}, 0);
	let totalPolyQty = challan_entry?.reduce((acc, item) => {
		const quantity = parseInt(item.poly_quantity, 10) || 0;
		return acc + quantity;
	}, 0);
	data?.challan_entry?.map((item) => {
		item.size = `${item.is_inch === 1 ? `${item.size} in` : `${item.size} cm`}`;
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
					headerRows: 1,
					widths: [80, '*', '*', '*', 60, 50, 50],
					body: [
						// * Header
						TableHeader(node),

						// * Body
						...challan_entry?.map((item) =>
							node.map((nodeItem) => ({
								text: item[nodeItem.field],
								style: nodeItem.cellStyle,
								alignment: nodeItem.alignment,
							}))
						),

						[
							{
								text: 'Total',
								bold: true,
								colSpan: 5,
								alignment: 'right',
							},
							{},
							{},
							{},
							{},
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
		],
	});

	return pdfDocGenerator;
}
