import { DEFAULT_FONT_SIZE, xMargin } from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('order_number', 'O/N'),
	getTable('item_description', 'Description'),
	getTable('quantity', 'Quantity (pcs)', 'right'),
	getTable('production_quantity_in_kg', 'Production (KG)', 'right'),
];

export default function Index(batch) {
	const headerHeight = 120;
	let footerHeight = 50;
	const { dyeing_batch_entry } = batch;
	const total_quantity = dyeing_batch_entry?.reduce(
		(acc, item) => acc + item.quantity,
		0
	);
	const total_production_quantity_in_kg = dyeing_batch_entry?.reduce(
		(acc, item) => acc + item.production_quantity_in_kg,
		0
	);

	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_A4_PAGE({
			xMargin,
			headerHeight,
			footerHeight,
		}),

		// * Page Header
		header: {
			table: getPageHeader(batch),
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
					widths: ['*', '*', '*', '*'],
					body: [
						// * Header
						TableHeader(node),

						// * Body
						...dyeing_batch_entry?.map((item) =>
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
								alignment: 'right',
								colSpan: 2,
							},
							{},
							{
								text: total_quantity,
								bold: true,
								alignment: 'right',
							},
							{
								text: Number(
									total_production_quantity_in_kg
								).toFixed(3),
								bold: true,
								alignment: 'right',
							},
						],
					],
				},
				// layout: 'lightHorizontalLines',
				// layout: tableLayoutStyle,
			},
		],
	});

	return pdfDocGenerator;
}
