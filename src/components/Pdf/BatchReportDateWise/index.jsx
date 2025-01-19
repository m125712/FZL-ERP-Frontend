import { get } from 'react-hook-form';

import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('batch_number', 'B/N'),
	getTable('order_number', 'O/N'),
	getTable('party_name', 'Party'),
	getTable('item_description', 'Item Description'),
	getTable('style', 'Style'),
	getTable('color', 'Color'),
	getTable('size', 'Size'),
	getTable('unit', 'Unit'),
	getTable('quantity', 'Quantity(pcs)', 'right'),
	getTable('production_qty', 'Production Qty', 'right'),
	getTable('achievement', 'Achievement (%)'),
];

export default function Index(data, date, item) {
	const headerHeight = 80;
	let footerHeight = 50;

	const totalQuantity = data.reduce((acc, item) => acc + item.quantity, 0);
	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_A4_PAGE({
			xMargin,
			headerHeight,
			footerHeight,
		}),
		pageOrientation: 'landscape',
		// * Page Header
		header: {
			table: getPageHeader(date, item),
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
					widths: [45, 40, '*', '*', 50, 50, 35, 20, 55, 60, 70],
					body: [
						// * Header
						TableHeader(node),

						// * Body
						...data?.map((item) =>
							node.map((nodeItem) => ({
								text: item[nodeItem.field],
								style: nodeItem.cellStyle,
								alignment: nodeItem.alignment,
							}))
						),
						[
							{
								text: `Total: ${Number(totalQuantity)}`,
								alignment: 'right',
								bold: true,
								colSpan: 9,
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
							{},
						],
					],
				},
				// layout: 'lightHorizontalLines',
			},
		],
	});

	return pdfDocGenerator;
}
