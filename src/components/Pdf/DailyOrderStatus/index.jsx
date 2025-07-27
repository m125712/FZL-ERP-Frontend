import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('item_name', 'Item'),
	getTable('total', 'Total'),
	getTable('marketing_name', 'Marketing'),
	getTable('marketing_quantity', 'Qty'),
];

export default function Index(data, from, to) {
	const headerHeight = 100;
	let footerHeight = 50;
	let total = 0;

	// * Getting the marketing name and quantity
	const marketingWise = data.flatMap((item) =>
		item.marketing.map((mark) => mark)
	);
	const totalsMap = {};

	marketingWise.forEach((item) => {
		if (totalsMap[item.marketing_name]) {
			totalsMap[item.marketing_name] += item.marketing_quantity;
		} else {
			totalsMap[item.marketing_name] = item.marketing_quantity;
		}
	});

	// * Getting the total marketing wise
	const marketingWiseResult = Object.entries(totalsMap).map(
		([marketing_name, total]) => ({
			marketing_name,
			total,
		})
	);

	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_A4_PAGE({
			xMargin,
			headerHeight,
			footerHeight,
		}),

		// * Page Header
		header: {
			table: getPageHeader(data, from, to),
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
					widths: ['*', '*', '*', '*'],
					body: [
						// * Header
						TableHeader(node),
						// * Body
						...(data ?? []).flatMap((item, index) => {
							// * If the type changes, reset the Total
							if (
								index > 0 &&
								data[index].type !== data[index - 1]?.type
							) {
								total = 0;
							}

							// * storing the current total
							total += item.marketing.reduce(
								(acc, item) => acc + item.marketing_quantity,
								0
							);

							// * Storing the Inner Map data
							let innerMap = item.marketing.map((m) => [
								{
									text: item.item_name,
									style: 'tableCell',
									alignment: 'left',
									rowSpan: item.marketing.length,
								},
								{
									text: item.marketing.reduce(
										(acc, item) =>
											acc + item.marketing_quantity,
										0
									),
									style: 'tableCell',
									alignment: 'left',
									rowSpan: item.marketing.length,
								},
								{
									text: m.marketing_name,
									style: 'tableCell',
									alignment: 'left',
								},
								{
									text: m.marketing_quantity,
									style: 'tableCell',
									alignment: 'right',
								},
							]);

							// * Printing total if type changes
							if (data[index].type !== data[index + 1]?.type) {
								innerMap.push([
									{
										text: `${data[index].type} Total`,
										alignment: 'right',
										colSpan: 2,
										bold: true,
									},
									{},
									{
										text: total,
										alignment: 'left',
										colSpan: 2,
										bold: true,
									},
									{},
								]);
							}

							return innerMap;
						}),
					],
				},
				// layout: tableLayoutStyle,
			},
			{
				table: {
					headerRows: 1,
					widths: ['*', '*'],
					body: [
						// * Header
						[
							{
								text: 'Marketing Name',
								style: 'tableCell',
								alignment: 'left',
								bold: true,
							},
							{
								text: 'Total',
								style: 'tableCell',
								alignment: 'left',
								bold: true,
							},
						],

						// * Body
						...(marketingWiseResult ?? []).map((item) => [
							{
								text: item.marketing_name,
								style: 'tableCell',
								alignment: 'left',
							},
							{
								text: item.total,
								style: 'tableCell',
								alignment: 'left',
							},
						]),
					],
				},
				pageBreak: 'before',
			},
		],
	});

	return pdfDocGenerator;
}
