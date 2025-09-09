import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE, xMargin } from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('file_number', 'File No.'),
	getTable('lc_number', 'LC No.'),
	getTable('lc_date', 'LC Date'),
	getTable('total_value', 'LC Value'),
	getTable('ldbc_fdbc', 'LDBC/FDBC'),
	getTable('acceptance_date', 'Acceptance Date'),
	getTable('maturity_date', 'Maturity Date'),
	getTable('bank_name', 'Bank Ref.'),
	getTable('m_exec', 'M Exec'),
	getTable('com_exec', 'Com Exec'),
	getTable('party_bank', 'Party Bank'),
	getTable('remarks', 'Remarks'),
];

export default function Index(data, date, type) {
	const headerHeight = 100;
	let footerHeight = 50;

	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_A4_PAGE({
			xMargin,

			headerHeight,
			footerHeight,
		}),
		pageOrientation: 'landscape',

		// * Page Header
		header: {
			table: getPageHeader(data, date, type),
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
					widths: [40, 70, 50, 50, 50, 50, 50, 80, 50, 50, '*', 50],
					body: [
						// * Header
						TableHeader(node),
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
									};
								}
								return {
									text: item[col.field],
									style: 'tableCell',
									alignment: 'left',
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
