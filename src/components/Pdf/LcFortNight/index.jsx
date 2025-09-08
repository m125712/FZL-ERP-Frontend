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
	getTable('commercial_executive', 'Commercial Exc.'),
	getTable('handover_date', 'Handover Date'),
	getTable('document_receive_date', 'Document Rcv. Date'),
	getTable('acceptance_date', 'Acceptance Date'),
	getTable('maturity_date', 'Maturity Date'),
	getTable('payment_date', 'Payment Date'),
	getTable('ldbc_fdbc', 'LDBC/FDBC'),
	getTable('shipment_date', 'Shipment Date'),
	getTable('expiry_date', 'Expiry Date'),
	getTable('amount', 'Amount'),
	getTable('payment_value', 'Payment Value'),
	getTable('total_value', 'Total Value'),
	getTable('marketing_name', 'Marketing'),
	getTable('bank_name', 'Bank Ref.'),
	getTable('party_bank', 'Party Bank'),
];

export default function Index(data, type) {
	const headerHeight = 100;
	let footerHeight = 50;
	const FONT_SIZE = 5;

	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_A4_PAGE({
			xMargin: 0,
			headerHeight,
			footerHeight,
		}),

		// * Page Header
		header: {
			table: getPageHeader(data, type),
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
			fontSize: DEFAULT_FONT_SIZE,
		}),

		// * Main Table
		content: [
			{
				table: {
					headerRows: 1,
					widths: [
						25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,
						25, 25, 25, 25, 25,
					],
					body: [
						// * Header
						TableHeader(node, FONT_SIZE),
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
										alignment: 'left',
										fontSize: FONT_SIZE,
									};
								}
								return {
									text: item[col.field],
									style: 'tableCell',
									alignment: 'left',
									fontSize: FONT_SIZE,
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
