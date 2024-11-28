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
	getTable('machine', 'Machine'),
	getTable('slot_1', 'Slot 1'),
	getTable('slot_2', 'Slot 2'),
	getTable('slot_3', 'Slot 3'),
	getTable('slot_4', 'Slot 4'),
	getTable('slot_5', 'Slot 5'),
	getTable('slot_6', 'Slot 6'),
];
export default function Index(data) {
	const headerHeight = 100;
	let footerHeight = 50;
	console.log(data);
	console.log(
		...data?.map((item) =>
			node.map((nodeItem) => ({
				text: item[nodeItem.field],
				style: nodeItem.cellStyle,
				alignment: nodeItem.alignment,
			}))
		)
	);
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
						...data?.map((item) =>
							node.map((nodeItem) => ({
								text: item[nodeItem.field],
								style: nodeItem.cellStyle,
								alignment: nodeItem.alignment,
							}))
						),
					],
				},
				layout: tableLayoutStyle,
			},
		],
	});

	return pdfDocGenerator;
}
