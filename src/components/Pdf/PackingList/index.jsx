import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('item_description', 'Item Description'),
	getTable('style', 'Style'),
	getTable('color', 'Color'),
	getTable('size', 'Size'),
	getTable('quantity', 'Quantity', 'right'),
	getTable('poli_quantity', 'Poly', 'right'),
	getTable('remarks', 'Remarks'),
];

export default function Index(data) {
	const headerHeight = 170;
	let footerHeight = 50;
	let { packing_list_entry } = data;
	let totalQuantity = packing_list_entry?.reduce((acc, item) => {
		const quantity = parseInt(item.quantity, 10) || 0;
		return acc + quantity;
	}, 0);
	let totalPoly = packing_list_entry?.reduce((acc, item) => {
		const quantity = parseInt(item.poli_quantity, 10) || 0;
		return acc + quantity;
	}, 0);

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
					widths: ['*', '*', '*', '*', '*', '*', '*'],
					body: [
						// * Header
						TableHeader(node),

						// * Body
						...packing_list_entry?.map((item) =>
							node.map((nodeItem) => ({
								text: item[nodeItem.field],
								style: nodeItem.cellStyle,
								alignment: nodeItem.alignment,
							}))
						),
						[
							{
								text: `Total`,
								alignment: 'right',
								colSpan: 4,
								bold: true,
							},
							{},
							{},
							{},

							{
								text: totalQuantity,
								bold: true,
								alignment: 'right',
							},
							{
								text: totalPoly,
								bold: true,
								alignment: 'right',
							},
							{},
						],
					],
				},
				// layout: 'lightHorizontalLines',
				layout: tableLayoutStyle,
			},
		],
	});

	return pdfDocGenerator;
}
