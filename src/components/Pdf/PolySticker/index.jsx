import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE } from '@/components/Pdf/ui';
import { CUSTOM_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';

export default function Index(data) {
	const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy');
	const normalNode = [
		getTable('item_description', 'Item'),
		getTable('style', 'Style'),
		getTable('color', 'Color'),
		getTable('size', 'Size', 'right'),
		getTable('quantity', 'Qty(pcs)', 'right'),
	];
	const tapeNode = [
		getTable('item_description', 'Item'),
		getTable('style', 'Style'),
		getTable('color', 'Color'),
		getTable('size', 'Size', 'right'),
		getTable('quantity', 'Qty(cm)', 'right'),
	];
	const sliderNode = [
		getTable('item_description', 'Item'),
		getTable('style', 'Style'),
		getTable('color', 'Color'),
		getTable('size', 'Size', 'right'),
		getTable('quantity', 'Qty(cm)', 'right'),
	];
	const node = data?.item_for == 'tape' ? tapeNode : normalNode;

	let val;
	if (data?.item_for === 'slider') {
		val = '-';
	} else if (data?.item_for === 'tape') {
		val = `${data?.size} mtr`;
	} else {
		val = `${data?.size} ${data?.is_inch === 1 ? 'inch' : 'cm'}`;
	}
	const pdfDocGenerator = pdfMake.createPdf({
		...CUSTOM_PAGE({
			pageOrientation: 'landscape',
			leftMargin: 10,
			rightMargin: 20,
			headerHeight: 1,
			footerHeight: 1,
		}),

		// * Main Table
		content: [
			{
				table: {
					headerRows: 1,
					widths: [40, 40, '*', 40, 30],
					body: [
						[
							{
								text: 'Fortune Zipper LTD',
								style: 'header',
								bold: true,

								colSpan: 3,
								fontSize: DEFAULT_FONT_SIZE - 1,
							},
							{},
							{},
							{
								text: `C/N: #${data?.packing_list_wise_rank}, ${data?.packing_number}`,
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 1,
								colSpan: 2,
							},
							{},
						],
						[
							{
								text: 'Challan No',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 1,
							},
							{},

							{
								text: 'Date',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 1,
							},
							{
								text: `${getDateFormate(data?.created_at)}`,

								fontSize: DEFAULT_FONT_SIZE - 1,
								colSpan: 2,
							},
							{},
						],
						[
							{
								text: 'O/N',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 1,
							},
							{
								text: `${data?.order_number}`,

								fontSize: DEFAULT_FONT_SIZE - 1,
								colSpan: 1,
							},
							{
								text: 'Buyer',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 1,
							},
							{
								text: `${data?.buyer_name}`,

								fontSize: DEFAULT_FONT_SIZE - 1,
								colSpan: 2,
							},
							{},
						],
						[
							{
								text: 'Factory',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 1,
							},
							{
								text: `${data?.factory_name}`,

								fontSize: DEFAULT_FONT_SIZE - 1,
								colSpan: 4,
							},
							{},
							{},
							{},
						],
						[
							{
								text: 'Party',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 1,
							},
							{
								text: `${data?.party_name}`,

								fontSize: DEFAULT_FONT_SIZE - 1,
								colSpan: 4,
							},
							{},
							{},
							{},
						],

						// * Header
						TableHeader(node, DEFAULT_FONT_SIZE - 2, '#000000'),
						[
							{
								text: `${data.item_description}`,
								fontSize: DEFAULT_FONT_SIZE - 1,
							},
							{
								text: `${data.style}`,
								fontSize: DEFAULT_FONT_SIZE - 1,
							},
							{
								text: `${
									data?.item_for === 'slider'
										? '-'
										: data?.color
								}`,
								fontSize: DEFAULT_FONT_SIZE - 1,
							},
							{
								text: val,
								fontSize: DEFAULT_FONT_SIZE - 1,
								alignment: 'right',
							},
							{
								text: `${data.quantity}`,
								fontSize: DEFAULT_FONT_SIZE - 1,
								alignment: 'right',
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
