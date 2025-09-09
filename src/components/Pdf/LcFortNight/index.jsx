import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE, xMargin } from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('file_number', 'File No.'),
	getTable('lc_number', 'LC No.'),
	getTable('lc_date', 'LC Date'),
	getTable('party_name', 'Party'),
	getTable('total_value', 'LC Value'),
	getTable('amount', 'Amount'),
	getTable('acceptance_date', 'Acceptance Date'),
	getTable('maturity_date', 'Maturity Date'),
	getTable('ldbc_fdbc', 'LDBC/FDBC'),
	getTable('marketing_name', 'Marketing'),
	getTable('commercial_executive', 'Commercial Exc.'),
	getTable('order_number', 'Order No.'),
	getTable('handover_date', 'Handover Date'),
	getTable('remarks', 'Remarks'),
	getTable('party_bank', 'Party Bank'),
	// getTable('document_receive_date', 'Document Rcv. Date'),
	// getTable('payment_date', 'Payment Date'),
	// getTable('shipment_date', 'Shipment Date'),
	// getTable('expiry_date', 'Expiry Date'),
	// getTable('payment_value', 'Payment Value'),
];

export default function Index(data, type) {
	const headerHeight = 100;
	let footerHeight = 45;

	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_A4_PAGE({
			xMargin: 10,
			headerHeight,
			footerHeight,
		}),

		pageOrientation: 'landscape',

		// * Page Header
		header: {
			table: getPageHeader(data, type),
			layout: 'noBorders',
			margin: [10, 45, 10, 0],
		},
		// * Page Footer
		footer: (currentPage, pageCount) => ({
			table: getPageFooter({
				currentPage,
				pageCount,
			}),
			margin: [10, 2],
			fontSize: DEFAULT_FONT_SIZE,
		}),

		// * Main Table
		content: [
			{
				table: {
					headerRows: 1,
					widths: [150, 'auto'],
					body: [
						[
							{
								text: 'Total due amount of Company',
								bold: true,
								style: 'tableHeader',
							},
							{
								text: `${data.reduce((acc, cur) => acc + cur.total_value, 0)}`,
								style: 'tableHeader',
								alignment: 'right',
							},
						],
						[
							{
								text: 'Number of Pending documents',
								bold: true,
								style: 'tableHeader',
							},
							{
								text: `${data.length}`,
								style: 'tableHeader',
								alignment: 'right',
							},
						],
					],
				},
			},
			{ text: '\n' },
			{
				table: {
					headerRows: 1,
					widths: [
						45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
						45,
					],
					body: [
						// * Header
						TableHeader(node, DEFAULT_FONT_SIZE - 2),
						// * Body
						...(data ?? []).map((item) => {
							return node.map((col) => {
								if (col.field.split('_').at(-1) === 'date') {
									return {
										text: format(
											item[col.field],
											'dd-MM-yyyy'
										),
										style: 'tableCell',
										fontSize: DEFAULT_FONT_SIZE - 2,
									};
								}
								return {
									text: item[col.field],
									style: 'tableCell',
									fontSize: DEFAULT_FONT_SIZE - 2,
								};
							});
						}),
					],
				},
				// layout: tableLayoutStyle,
			},
		],
	});

	return pdfDocGenerator;
}
