import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('item_name', 'Item'),
	getTable('total', 'Total'),
	getTable('marketing_name', 'Marketing'),
	getTable('marketing_quantity', 'Qty'),
];

export default function Index(data, from, to) {
	const headerHeight = 100;
	let footerHeight = 50;

	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_A4_PAGE({
			xMargin,
			headerHeight,
			footerHeight,
		}),

		// * Page Header
		header: {
			table: getPageHeader(data, from, to),
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
						...(data ?? []).flatMap((item) =>
							// node.map((nodeItem) => ({
							// 	text: item[nodeItem.field],
							// 	style: nodeItem.cellStyle,
							// 	alignment: nodeItem.alignment,
							// }))

							item.marketing.map((m) => [
								{
									text: item.item_name,
									style: 'tableCell',
									alignment: 'left',
									rowSpan: item.marketing.length,
								},
								{
									text: item.marketing.reduce(
										(acc, item) =>
											acc + item.marketing_quantity,
										0
									),
									style: 'tableCell',
									alignment: 'left',
									rowSpan: item.marketing.length,
								},
								{
									text: m.marketing_name,
									style: 'tableCell',
									alignment: 'left',
								},
								{
									text: m.marketing_quantity,
									style: 'tableCell',
									alignment: 'right',
								},
							])
						),
					],
				},
				// layout: tableLayoutStyle,
			},
		],
	});

	return pdfDocGenerator;
}
