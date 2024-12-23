import Table from '@/pages/Planning/FinishingBatch/Details/Table';
import { format } from 'date-fns';
import { color } from 'framer-motion';
import { get } from 'react-hook-form';

import { DEFAULT_FONT_SIZE, xMargin } from '@/components/Pdf/ui';
import {
	CUSTOM_PAGE_THREAD_STICKER,
	getTable,
	TableHeader,
} from '@/components/Pdf/utils';

import pdfMake from '..';
import { generateBarcodeAsBase64 } from './Barcode';
import { getPageFooter } from './utils';

const getDateFormate = (date) => format(new Date(date), 'dd/MM/yyyy');
export default function Index(data) {
	const nodeThread = [
		getTable('style', 'Style'),
		getTable('quantity', 'Qty(cone)'),
	];
	const node = nodeThread;
	const shade = new Set();
	const subStreat = new Set();
	const countLength = new Set();
	const color = new Set();

	data?.packing_list_entry?.forEach((item) => {
		shade.add(item.recipe_name);
		subStreat.add(item.sub_streat.toUpperCase());
		countLength.add(item.item_description + '-' + item.size);
		color.add(item.color);
	});

	const { packing_list_entry } = data;
	const totalQuantity = packing_list_entry?.reduce((acc, item) => {
		const quantity = parseInt(item.quantity, 10) || 0;
		return acc + quantity;
	}, 0);

	const pdfDocGenerator = pdfMake.createPdf({
		...CUSTOM_PAGE_THREAD_STICKER({
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
			fontSize: DEFAULT_FONT_SIZE - 3,
		}),

		// * Main Table
		content: [
			{
				margin: [0, 94, 0, 0],
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

					widths: [21, 35, 12, 35, 13, 33],
					body: [
						[
							{
								text: 'Challan',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 3,
							},
							{
								text: '',
								fontSize: DEFAULT_FONT_SIZE - 3,
							},
							{
								text: 'O/N',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 3,
							},
							{
								text: `${data?.order_number}`,

								fontSize: DEFAULT_FONT_SIZE - 3,
							},
							{
								text: 'Date',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 3,
							},
							{
								text: `${getDateFormate(data?.created_at)}`,

								fontSize: DEFAULT_FONT_SIZE - 3,
							},
						],
						[
							{
								text: 'Factory',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 3,
							},
							{
								text: `${data?.factory_name}`,

								fontSize: DEFAULT_FONT_SIZE - 3,
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
								fontSize: DEFAULT_FONT_SIZE - 3,
							},
							{
								text: `${data?.party_name}`,

								fontSize: DEFAULT_FONT_SIZE - 3,
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
								fontSize: DEFAULT_FONT_SIZE - 3,
							},
							{
								text: `${data?.buyer_name}`,

								fontSize: DEFAULT_FONT_SIZE - 3,
								colSpan: 5,
							},
							{},
							{},
							{},
							{},
						],
						[
							{
								text: 'S/S',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 3,
							},
							{
								text: `${Array.from(subStreat).join(', ')}`,
								fontSize: DEFAULT_FONT_SIZE - 3,
							},
							{
								text: 'C/L',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 3,
							},
							{
								text: `${Array.from(countLength).join(',\n ')}`,
								fontSize: DEFAULT_FONT_SIZE - 3,
							},
							{
								text: `C/N: #${data?.packing_list_wise_rank}, ${data?.packing_number}`,
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 3,
								colSpan: 2,
							},
							{},
						],
						[
							{
								text: 'Color',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 3,
							},
							{
								text: `${Array.from(color).join(', ')}`,
								fontSize: DEFAULT_FONT_SIZE - 3,
								colSpan: 2,
							},
							{},
							{
								text: 'Shade',
								bold: true,
								fontSize: DEFAULT_FONT_SIZE - 3,
							},

							{
								text: `${Array.from(shade).join(', ')}`,
								fontSize: DEFAULT_FONT_SIZE - 3,
								colSpan: 2,
							},

							{},
						],
						[
							{
								table: {
									headerRows: 1,
									widths: ['*', 30],
									body: [
										TableHeader(
											node,
											DEFAULT_FONT_SIZE - 3,
											'#000000'
										),
										...packing_list_entry.map((item) => [
											{
												text: item.style,
												fontSize: DEFAULT_FONT_SIZE - 3,
											},
											{
												text: item.quantity,
												alignment: 'right',
												fontSize: DEFAULT_FONT_SIZE - 3,
											},
										]),
										[
											{
												text: `Total`,
												alignment: 'right',

												bold: true,
												fontSize: DEFAULT_FONT_SIZE - 3,
											},
											{
												text: totalQuantity,
												bold: true,
												alignment: 'right',
												fontSize: DEFAULT_FONT_SIZE - 3,
											},
										],
									],
								},
								colSpan: 6,
							},
							{},
							{},
							{},
							{},
							{},
						],
					],
				},
				layout: 'noBorders',
			},
		],
	});

	return pdfDocGenerator;
}
