import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('mc_no', 'MC No'),
	getTable('die_casting_name', 'Name'),
	getTable('cavity_goods', 'Count Length'),
	getTable('cavity_defect', 'Bleaching'),
	getTable('push', 'Push', 'right'),
	getTable('order_number', 'Order Number'),
	getTable('item_description', 'Item Description'),
	getTable('production_quantity', 'Production Quantity', 'right'),
	getTable('weight', 'Weight', 'right'),
	getTable('remarks', 'Remarks'),
];

export default function Index(information) {
	const headerHeight = 100;
	let footerHeight = 50;
	const { data } = information;

	let date;
	if (information.startDate === information.endDate) {
		date = information.startDate;
	} else {
		date = information.startDate + ' to ' + information.endDate;
	}
	let total_production = data?.reduce(
		(acc, item) => acc + item.production_quantity,
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
			table: getPageHeader(information),
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
				text: `Date: ${date}`,
				style: 'tableHeader',
				bold: true,
				fontSize: DEFAULT_FONT_SIZE + 2,
				border: [true, true, true, true],
			},
			{
				table: {
					headerRows: 1,
					widths: [40, 60, 30, 40, 30, 50, 60, 50, 30, '*'],
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
								text:
									'Total Production Quantity :' +
									total_production,
								colSpan: 10,
								alignment: 'center',
							},
						],
					],
				},

				// layout: 'lightHorizontalLines',
				//layout: tableLayoutStyle,
			},
		],
	});

	return pdfDocGenerator;
}
