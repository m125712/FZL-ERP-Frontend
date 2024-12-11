import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE, xMargin } from '@/components/Pdf/ui';
import {
	CUSTOM_PAGE,
	CUSTOM_PAGE_STICKER,
	getTable,
	TableHeader,
} from '@/components/Pdf/utils';

import pdfMake from '..';
import { generateBarcodeAsBase64 } from './Barcode';
import { getPageFooter } from './utils';

export default function Index(data) {
	const nodeZipper = [
		getTable('item_description', 'Item'),
		getTable('style', 'Style'),
		getTable('color', 'Color'),
		getTable('size', 'Size', 'right'),
		getTable('quantity', 'Qty(pcs)', 'right'),
		getTable('poli_quantity', 'Poly', 'right'),
	];
	const nodeThread = [
		getTable('item_description', 'Count'),
		getTable('style', 'Style'),
		getTable('color', 'Color'),
		getTable('recipe_name', 'Recipe'),
		getTable('size', 'Length', 'right'),
		getTable('quantity', 'Qty(cone)', 'right'),
	];
	const node =
		data?.item_for === 'thread' || data?.item_for === 'sample_thread'
			? nodeThread
			: nodeZipper;
	const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy');
	let { packing_list_entry } = data;
	let totalQuantity = packing_list_entry?.reduce((acc, item) => {
		const quantity = parseInt(item.quantity, 10) || 0;
		return acc + quantity;
	}, 0);
	let totalPoly = packing_list_entry?.reduce((acc, item) => {
		const quantity = parseInt(item.poli_quantity, 10) || 0;
		return acc + quantity;
	}, 0);
	let unit = [];
	packing_list_entry?.forEach((item) => {
		unit.push(
			`${data?.item_for === 'thread' || data?.item_for === 'sample_thread' ? `mtr` : item.is_inch === 1 ? `inch` : `cm`}`
		);
	});
	const pdfDocGenerator = pdfMake.createPdf({
		...CUSTOM_PAGE_STICKER({
			pageOrientation: 'landscape',
			xMargin: 5,
			headerHeight: 5,
			footerHeight: 10,
		}),

		// Page Footer
		footer: (currentPage, pageCount) => ({
			table: getPageFooter({
				currentPage,
				pageCount,
				rank: data?.packing_list_wise_rank,
				packing_number: data?.packing_number,
			}),
			margin: [5, -5, 5, 0],
			fontSize: DEFAULT_FONT_SIZE - 4,
		}),

		// * Main Table
		content: [
			{
				image: generateBarcodeAsBase64(
					data?.packing_number,
					data?.uuid
				),
				width: 150,
				height: 30,
				alignment: 'center',
				colSpan: 6,
			},
			{
				table: {
					// headerRows: 1,
					widths: [40, '*', '*', 40, 40, 40],
					body: [
						[
							{
								text: 'Fortune Zipper LTD',
								style: 'header',
								bold: true,
								alignment: 'center',
								colSpan: 3,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{},
							{},

							{
								text: `C/N: #${data?.packing_list_wise_rank}, ${data?.packing_number}`,
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 2,
								colSpan: 3,
							},
							{},
							{},
						],
						[
							{
								text: 'Challan No',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: '',
								fontSize: DEFAULT_FONT_SIZE - 2,
								colSpan: 2,
							},
							{},
							{
								text: 'Date',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: `${getDateFormate(data?.created_at)}`,

								fontSize: DEFAULT_FONT_SIZE - 2,
								colSpan: 2,
							},
							{},
						],
						[
							{
								text: 'O/N',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: `${data?.order_number}`,

								fontSize: DEFAULT_FONT_SIZE - 2,
								colSpan: 2,
							},

							{},
							{
								text: 'Weight',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: `${data?.carton_weight} Kg`,

								fontSize: DEFAULT_FONT_SIZE - 2,
								colSpan: 2,
							},
							{},
						],
						[
							{
								text: 'Factory',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: `${data?.factory_name}`,

								fontSize: DEFAULT_FONT_SIZE - 2,
								colSpan: 5,
							},
							{},
							{},
							{},
							{},
						],
						[
							{
								text: 'Buyer',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: `${data?.buyer_name}`,

								fontSize: DEFAULT_FONT_SIZE - 2,
								colSpan: 5,
							},
							{},
							{},
							{},
							{},
						],
						[
							{
								text: 'Party',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: `${data?.party_name}`,

								fontSize: DEFAULT_FONT_SIZE - 2,
								colSpan: 5,
							},
							{},
							{},
							{},
							{},
						],
						// * Header

						TableHeader(node, DEFAULT_FONT_SIZE - 2, '#000000'),

						// * Body
						...packing_list_entry?.map((item) =>
							node.map((nodeItem) => {
								if (nodeItem.field === 'size') {
									const unitIndex =
										packing_list_entry.indexOf(item);
									return {
										text:
											item[nodeItem.field] +
											' ' +
											(unit[unitIndex] || ''),
										style: nodeItem.cellStyle,
										alignment: nodeItem.alignment,
										fontSize: DEFAULT_FONT_SIZE - 2,
									};
								}
								return {
									text: item[nodeItem.field],
									style: nodeItem.cellStyle,
									alignment: nodeItem.alignment,
									fontSize: DEFAULT_FONT_SIZE - 2,
								};
							})
						),
						[
							...(data?.item_for === 'zipper' ||
							data?.item_for === 'sample_zipper'
								? [
										{
											text: `Total`,
											alignment: 'right',
											colSpan: 4,
											bold: true,
											fontSize: DEFAULT_FONT_SIZE - 2,
										},
										{},
										{},
										{},
										{
											text: totalQuantity,
											bold: true,
											alignment: 'right',
											fontSize: DEFAULT_FONT_SIZE - 2,
										},
										{
											text: totalPoly,
											bold: true,
											alignment: 'right',
											fontSize: DEFAULT_FONT_SIZE - 2,
										},
									]
								: [
										{
											text: `Total`,
											alignment: 'right',
											colSpan: 5,
											bold: true,
											fontSize: DEFAULT_FONT_SIZE - 2,
										},
										{},
										{},
										{},
										{},
										{
											text: totalQuantity,
											bold: true,
											alignment: 'right',
											fontSize: DEFAULT_FONT_SIZE - 2,
										},
									]),
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
