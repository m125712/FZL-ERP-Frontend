import { DEFAULT_FONT_SIZE, xMargin } from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import { getRequiredTapeKg } from '@/util/GetRequiredTapeKg';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('order_number', 'O/N'),
	getTable('item_description', 'Description'),
	getTable('style', 'Style'),
	getTable('color', 'Color'),
	getTable('quantity', 'Quantity (pcs)', 'right'),
	getTable('production_quantity_in_kg', 'Expected (KG)', 'right'),
	getTable('production_quantity_in_kg', 'Actual (KG)', 'right'),
];

export default function Index(batch) {
	const headerHeight = 140;
	let footerHeight = 50;
	const { dyeing_batch_entry } = batch;
	const totals = dyeing_batch_entry?.reduce(
		(acc, item) => {
			acc.total_quantity += item.quantity;
			acc.total_expected_production += getRequiredTapeKg({
				row: item,
				type: 'dyed',
				input_quantity: item.quantity,
			});
			acc.total_actual_production += item.production_quantity_in_kg;
			return acc;
		},
		{
			total_quantity: 0,
			total_expected_production: 0,
			total_actual_production: 0,
		}
	);
	const {
		total_quantity,
		total_expected_production,
		total_actual_production,
	} = totals;

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
				table: {
					headerRows: 1,
					widths: ['*', '*', '*', '*', 50, 50, 50],
					body: [
						// * Header
						TableHeader(node),

						// * Body
						...(dyeing_batch_entry?.map((item) => [
							{
								text: item.order_number,
								alignment: 'left',
							},
							{
								text: item.item_description,
								alignment: 'left',
							},
							{
								text: item.style,
								alignment: 'left',
							},
							{
								text: item.color,
								alignment: 'left',
							},
							{
								text: item.quantity,
								alignment: 'right',
							},

							{
								text: getRequiredTapeKg({
									row: item,
									type: 'dyed',
									input_quantity: item.quantity,
								}).toFixed(3),
								alignment: 'right',
							},
							{
								text: item.production_quantity_in_kg,
								alignment: 'right',
							},
						]) || []),
						[
							{
								text: 'Total',
								bold: true,
								alignment: 'right',
								colSpan: 4,
							},
							{},
							{},
							{},
							{
								text: total_quantity,
								bold: true,
								alignment: 'right',
							},
							{
								text: Number(total_expected_production).toFixed(
									3
								),
								bold: true,
								alignment: 'right',
							},
							{
								text: Number(total_actual_production).toFixed(
									3
								),
								bold: true,
								alignment: 'right',
							},
						],
					],
				},
				// layout: 'lightHorizontalLines',
				// layout: tableLayoutStyle,
			},
		],
	});

	return pdfDocGenerator;
}
