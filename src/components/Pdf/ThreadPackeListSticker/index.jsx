import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE } from '@/components/Pdf/ui';
import { CUSTOM_PAGE_THREAD_STICKER } from '@/components/Pdf/utils';

import pdfMake from '..';
import { generateBarcodeAsBase64 } from './Barcode';
import { getPageFooter } from './utils';

const getDateFormate = (date) => format(new Date(date), 'dd/MM/yy');
export default function Index(data) {
	const shade = new Set();
	const subStreat = new Set();
	const countLength = new Set();
	const color = new Set();
	const style = new Set();
	let totalQuantity = 0;

	data?.packing_list_entry?.forEach((item) => {
		shade.add(item.recipe_name);
		subStreat.add(item.sub_streat.toUpperCase());
		countLength.add(item.item_description + '-' + item.size);
		subStreat.add(item.sub_streat);
		countLength.add(item.item_description + '-' + item.size);
		color.add(item.color);
		style.add(item.style);
		totalQuantity += parseInt(item.quantity, 10) || 0;
	});

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
					widths: ['*', '*', '*'],
					body: [
						[
							{
								text: '',
								bold: true,
							},
							{
								text: data?.order_number,
								bold: true,
							},
							{
								text: getDateFormate(data?.created_at),
								bold: true,
							},
						],
						[
							{
								text: `${
									Array.from(countLength).join(', ') +
									' #' +
									Array.from(subStreat).join(', ')
								}`,
								bold: true,
								colSpan: 2,
							},
							{},
							{
								text: `${totalQuantity} cone`,
								bold: true,
							},
						],

						[
							{
								text: `${Array.from(color).join(', ')} - (${Array.from(shade).join(', ')})`,
								bold: true,
								colSpan: 3,
							},
							{},
							{},
						],
						[
							{
								text: Array.from(style).join(', '),
								bold: true,
								colSpan: 3,
							},
							{},
							{},
						],
						[
							{
								text: '\n',
								bold: true,
								colSpan: 3,
							},
							{},
							{},
						],
						[
							{
								text: data?.buyer_name,
								bold: true,
								colSpan: 3,
							},
							{},
							{},
						],
						[
							{
								text: data?.party_name,
								bold: true,
								colSpan: 3,
							},
							{},
							{},
						],
						[
							{
								text: data?.factory_name,
								bold: true,
								colSpan: 3,
							},
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
