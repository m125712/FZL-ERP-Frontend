import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('packing_number', 'Packing Number'),
	getTable('item_description', 'Item Description'),
	getTable('style', 'Style'),
	getTable('color', 'Color'),
	getTable('size', 'Size'),
	getTable('delivered', 'Delivered', 'right'),
	getTable('quantity', 'Quantity', 'right'),
	getTable('short_quantity', 'Short QTY', 'right'),
	getTable('reject_quantity', 'Reject QTY', 'right'),
	getTable('remarks', 'Remarks'),
];

export default function Index(data) {
	const headerHeight = 170;
	let footerHeight = 50;
	let { challan_entry } = data;
	let totalQuantity = challan_entry?.reduce((acc, item) => {
		const quantity = parseInt(item.quantity, 10) || 0;
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
					widths: [45, 48, 45, 70, 30, 38, 35, 30, 30, '*'],
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
								text: `Total Quantity: ${totalQuantity}`,
								colSpan: 10,
								style: 'tableFooter',
								alignment: 'right',
							},
							{},
							{},
							{},
							{},
							{},
							{},
							{},
							{},
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
