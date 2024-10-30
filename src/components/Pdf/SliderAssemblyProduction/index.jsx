import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('serial_number', 'S/N'),
	getTable('order_number', 'O/N'),
	getTable('party_name', 'Party Name'),
	getTable('item', 'Item Name'),
	getTable('production_quantity', 'Quantity(pcs)', 'right'),
	getTable('weight', 'Weight(kg)', 'right'),
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
		(acc, item) => acc + Number(item.production_quantity),
		0
	);
	const tableData = data.map((item) => ({
		...item,
		item: item?.item_description ? item?.item_description : item?.item_name,
	}));

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
					widths: [20, 40, 140, 70, 70, 40, '*'],
					body: [
						// * Header
						TableHeader(node),

						// * Body
						...tableData?.map((item) =>
							node.map((nodeItem) => ({
								text:
									nodeItem.field === 'order_number' &&
									item[nodeItem.field] === 'Assembly Stock'
										? '-'
										: item[nodeItem.field],
								style: nodeItem.cellStyle,
								alignment: nodeItem.alignment,
							}))
						),
						[
							{
								text:
									'Total Production Quantity :' +
									total_production +
									' pcs',
								colSpan: 7,
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
