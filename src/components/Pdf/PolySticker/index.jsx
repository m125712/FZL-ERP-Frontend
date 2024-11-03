import { format } from 'date-fns';
import { color } from 'framer-motion';

import {
	DEFAULT_FONT_SIZE,
	tableLayoutStyle,
	xMargin,
} from '@/components/Pdf/ui';
import {
	CUSTOM_PAGE,
	DEFAULT_A4_PAGE,
	getTable,
	TableHeader,
} from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('item_description', 'Item'),
	getTable('style', 'Style'),
	getTable('color', 'Color'),
	getTable('size', 'Size', 'right'),
	getTable('quantity', 'Qty(pcs)', 'right'),
];

export default function Index(data) {
	const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy');
	const pdfDocGenerator = pdfMake.createPdf({
		...CUSTOM_PAGE({
			pageOrientation: 'landscape',
			xMargin: 5,
			headerHeight: 5,
			footerHeight: 10,
		}),

		// * Main Table
		content: [
			{
				table: {
					headerRows: 1,
					widths: [40, '*', '*', 25, 30],
					body: [
						[
							{
								text: 'Fortune Zipper LTD',
								style: 'header',
								bold: true,

								colSpan: 3,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{},
							{},
							{
								text: `C/N: #${data?.packing_list_wise_rank}, ${data?.packing_number}`,
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 2,
								colSpan: 2,
							},
							{},
						],
						[
							{
								text: 'Challan No',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 2,
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
								colSpan: 1,
							},
							{
								text: 'Buyer',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: `${data?.buyer_name}`,

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
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: `${data.style}`,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: `${data.color}`,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: `${data.size}`,
								fontSize: DEFAULT_FONT_SIZE - 2,
							},
							{
								text: `${data.quantity}`,
								fontSize: DEFAULT_FONT_SIZE - 2,
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
