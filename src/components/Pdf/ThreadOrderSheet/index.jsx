import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('color', 'Color'),
	getTable('style', 'Style'),
	getTable('count_length_name', 'Count Length'),
	getTable('quantity', 'Quantity', 'right'),
	getTable('remarks', 'Remarks'),
];

export default function Index(orderInfo) {
	const headerHeight = 170;
	let footerHeight = 50;
	const { order_info_entry } = orderInfo;

	// bleaching: 'non-bleach';
	// : 'Balck';
	// company_price: '1.2000';
	// count: '30/3';
	// : '30/3 - 2500';
	// count_length_uuid: 'KBLu6r1TcGxyCaO';
	// created_at: '2024-09-26 16:39:48';
	// created_by: 'RL1xtJnYkxGrTMz';
	// created_by_name: 'Mirsad';
	// lab_reference: null;
	// length: '2500';
	// order_entry_uuid: 'zGf8tmztEhrF1hl';
	// order_info_uuid: 'eXwsNjbAI7bjRI0';
	// party_price: '1.3000';
	// po: null;
	// production_quantity: '0.0000';
	// : '130.0000';
	// recipe_name: null;
	// recipe_uuid: null;
	// : '';
	// : 'S-1-B';
	// swatch_approval_date: '2024-09-26 16:39:49';
	// transfer_quantity: '0.0000';
	// updated_at: null;
	// uuid: 'zGf8tmztEhrF1hl';

	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_A4_PAGE({
			xMargin,
			headerHeight,
			footerHeight,
		}),

		// * Page Header
		header: {
			table: getPageHeader(orderInfo),
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
					widths: [70, 70, 70, 70, '*'],
					body: [
						// * Header
						TableHeader(node),

						// * Body
						...order_info_entry?.map((item) =>
							node.map((nodeItem) => ({
								text: item[nodeItem.field],
								style: nodeItem.cellStyle,
								alignment: nodeItem.alignment,
							}))
						),
					],
				},
				// layout: 'lightHorizontalLines',
				layout: tableLayoutStyle,
			},
		],
	});

	return pdfDocGenerator;
}
