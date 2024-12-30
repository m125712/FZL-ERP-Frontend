import { Table } from 'lucide-react';
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
	getTable('order_number', 'O/N'),
	getTable('quantity', 'Cone', 'right'),
	getTable('count', 'Count'),
	getTable('length', 'Length'),
	getTable('style', 'Style'),
	getTable('yarn_quantity', 'Yarn'),
	getTable('quantity', 'Tube'),
	getTable('quantity', 'Stiker'),
	getTable('quantity', 'Poly'),
	getTable('total_carton', 'Carton'),
	getTable('act_wit', 'Act.Wit'),
	getTable('consum', 'Consum'),
];

export default function Index(batch, shade_recipes_entries, programs) {
	const headerHeight = 200;
	let footerHeight = 50;
	const { batch_entry } = batch;

	const entry = {
		...batch_entry,
		tube: batch_entry?.total_quantity,
		sticker: batch_entry?.total_quantity,
		poly: batch_entry?.total_quantity,
		carton: batch_entry?.carton || 0,
	};

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
			margin: [xMargin, 40, xMargin, 0],
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
					widths: [50, 25, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35],
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
				text: '\n\n\n',
			},
			{
				table: {
					headerRows: 1,
					widths: ['*', '*', '*'],
					body: [
						[
							{ text: 'Prepared by', alignment: 'center' },
							{ text: 'Checked by', alignment: 'center' },
							{ text: 'GT issued by', alignment: 'center' },
						],
					],
				},
				layout: 'noBorders',
			},

			{
				text: '\n',
			},
			{
				text: 'Dyeing Information',
			},
			{
				table: {
					headerRows: 1,
					widths: ['*', '*', '*', '*', '*', '*', '*'],
					heights: 20,
					body: [
						[
							'Dyeing MC',
							'Pkg Loading Checked By',
							'D & C Conformation By',
							'R/C conformation',
							{ text: 'Passed by', colSpan: 3 },
							'',
							'',
						],
						[
							{ text: '', rowSpan: 2 },
							{ text: '', rowSpan: 2 },
							{ text: '', rowSpan: 2 },
							{ text: '', rowSpan: 2 },
							'DH',
							'QC',
							'PM',
						],
						['', '', '', '', '', '', ''],
					],
				},
				// layout: 'lightHorizontalLines',
				//layout: tableLayoutStyle,
			},
			{
				text: '\n',
			},
			{
				text: 'Drying information & Conning information',
			},
			{
				table: {
					headerRows: 1,
					heights: 10,
					widths: [35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 37],
					body: [
						[
							{ text: 'Count', rowSpan: 3 },
							{ text: 'Pkg', rowSpan: 3 },
							{ text: 'Defected PKG', rowSpan: 3 },
							{ text: 'Drying Receiver', rowSpan: 3 },
							{ text: 'Conning Receiver', rowSpan: 3 },
							{ text: 'Conning Machine', rowSpan: 3 },
							{ text: 'Line Supervisor', rowSpan: 3 },
							{ text: 'Count', rowSpan: 3 },
							{ text: 'Production', colSpan: 3, rowSpan: 2 },
							'',
							'',
							{ text: 'Shift InCharge', rowSpan: 3 },
						],
						['', '', '', '', '', '', '', '', '', '', '', ''],
						['', '', '', '', '', '', '', '', '', '', '', ''],
						[
							'',
							'',
							'',
							{ text: '', rowSpan: 5 },
							{ text: '', rowSpan: 5 },
							'',
							'',
							'',
							'',
							'',
							'',
							'',
						],
						['', '', '', '', '', '', '', '', '', '', '', ''],
						['', '', '', '', '', '', '', '', '', '', '', ''],
						['', '', '', '', '', '', '', '', '', '', '', ''],
						['', '', '', '', '', '', '', '', '', '', '', ''],
					],
				},
			},
			{
				text: '\n',
			},
			{
				table: {
					headerRows: 1,
					widths: ['*', '*'],
					borders: false,
					body: [
						["Incharge's Comments For Short/Excess", 'QC Comments'],
					],
				},
				layout: 'noBorders',
			},
			{
				table: {
					headerRows: 1,
					widths: ['*', '*'],
					heights: 40,
					body: [['', '']],
				},
			},
			{
				text: '\n',
			},
			{
				table: {
					headerRows: 1,
					widths: ['*', '*'],
					heights: 40,
					body: [['', '']],
				},
			},
			{
				table: {
					headerRows: 1,
					widths: ['*', '*'],
					body: [
						['Finished Good Received by', 'Production Entry by'],
					],
				},
				layout: 'noBorders',
			},
		],
	});

	return pdfDocGenerator;
}
