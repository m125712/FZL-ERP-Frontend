import { Table } from 'lucide-react';
import { get } from 'react-hook-form';
import { useFetch } from '@/hooks';

import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('recipe_name', 'Recipe Name'),
	getTable('style', 'Style'),
	getTable('color', 'Color'),
	getTable('count_length', 'Count Length'),
	getTable('bleaching', 'Bleaching'),
	getTable('order_quantity', 'Order Quantity', 'right'),
	getTable('balance_quantity', 'Balance Quantity', 'right'),
	getTable('quantity', 'Quantity', 'right'),
	getTable('remarks', 'Remarks'),
];
const node2 = [
	getTable('material_name', 'Dyes Name'),
	getTable('quantity', 'Lab'),
	getTable('bulk', 'Bulk'),
	getTable('first', '1st'),
	getTable('second', '2nd'),
	getTable('third', '3rd'),
	getTable('lot', 'Lot'),
];

export default function Index(batch, shade_recipes_entries, programs) {
	const headerHeight = 170;
	let footerHeight = 50;
	const { batch_entry } = batch;

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
				text: 'Details',
				Style: 'tableTitle',
				alignment: 'left',
				bold: true,
				fontSize: DEFAULT_FONT_SIZE + 4,
			},
			{
				table: {
					headerRows: 1,
					widths: [40, 40, 40, 50, 40, 40, 40, 40, '*'],
					body: [
						// * Header
						TableHeader(node),

						// * Body
						...batch_entry?.map((item) =>
							node.map((nodeItem) => ({
								text: item[nodeItem.field],
								style: nodeItem.cellStyle,
								alignment: nodeItem.alignment,
							}))
						),
					],
				},
				// layout: 'lightHorizontalLines',
				//layout: tableLayoutStyle,
			},
			{
				text: '\n',
			},
			{
				text: 'Dyes',
				Style: 'tableTitle',
				alignment: 'left',
				bold: true,
				fontSize: DEFAULT_FONT_SIZE + 4,
			},
			{
				table: {
					headerRows: 1,
					widths: ['*', '*', '*', 30, 30, 30, '*'],
					body: [
						TableHeader(node2),
						...(Array.isArray(shade_recipes_entries)
							? shade_recipes_entries.map((item) =>
									node2.map((nodeItem) => ({
										text: item[nodeItem.field] || '',
										style: nodeItem.cellStyle,
										alignment: nodeItem.alignment,
									}))
								)
							: []),
					],
				},
				// layout: 'lightHorizontalLines',
				//layout: tableLayoutStyle,
			},
			{
				text: '\n',
			},
			{
				text: 'Others',
				Style: 'tableTitle',
				alignment: 'left',
				bold: true,
				fontSize: DEFAULT_FONT_SIZE + 4,
			},
			{
				table: {
					headerRows: 1,
					widths: ['*', '*', '*', 30, 30, 30, '*'],
					body: [
						TableHeader(node2),
						...(Array.isArray(programs)
							? programs.map((item) =>
									node2.map((nodeItem) => ({
										text: item[nodeItem.field] || '',
										style: nodeItem.cellStyle,
										alignment: nodeItem.alignment,
									}))
								)
							: []),
					],
				},
				// layout: 'lightHorizontalLines',
				//layout: tableLayoutStyle,
			},
		],
	});

	return pdfDocGenerator;
}
