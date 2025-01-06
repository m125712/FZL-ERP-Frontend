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
	const count = new Set();
	const length = new Set();
	const color = new Set();
	const style = new Set();
	let totalQuantity = 0;
	const conePerCarton = data?.packing_list_entry[0].cone_per_carton;

	data?.packing_list_entry?.forEach((item) => {
		shade.add(item.recipe_name);
		subStreat.add(item.sub_streat.toUpperCase());
		count.add(item.item_description);
		length.add(item.size);
		color.add(item.color);
		style.add(item.style);
		totalQuantity += parseInt(item.quantity, 10) || 0;
	});

	const cartonNumber = Math.ceil(
		totalQuantity / data?.packing_list_entry[0].cone_per_carton
	);

	const content = [];

	for (let index = 0; index < cartonNumber; index++) {
		let numberOfCone =
			totalQuantity > conePerCarton ? conePerCarton : totalQuantity;
		totalQuantity -= conePerCarton;
		content.push(
			{
				margin: [0, 92, 0, 0],
				image: generateBarcodeAsBase64(
					data?.packing_number,
					data?.uuid
				),
				width: 200,
				alignment: 'center',
				colSpan: 6,
			},
			{
				table: {
					widths: ['*', '*', '*'],
					body: [
						[
							{
								text: Array.from(subStreat).join(', '),
								bold: true,
							},
							{
								text: Array.from(count).join(', '),
								bold: true,
							},
							{
								text: getDateFormate(data?.created_at),
								bold: true,
							},
						],
						[
							{
								text: data?.order_number,
								bold: true,
							},
							{
								text: `${Array.from(color).join(', ')}`,
								bold: true,
								colSpan: 2,
							},
							{},
						],
						[
							{
								text:
									data?.packing_number +
									`(${index + 1}/${cartonNumber})`,
								bold: true,
							},
							{
								text: `${Array.from(shade).join(', ')}`,
								bold: true,
								colSpan: 2,
							},
							{},
						],
						[
							{
								text: Array.from(length).join(', ') + ' M',
								bold: true,
								colSpan: 2,
							},
							{},
							{
								text: `${numberOfCone} Cone`,
								bold: true,
								fontSize: DEFAULT_FONT_SIZE + 1,
							},
						],
						[
							{
								text: `${Array.from(style).join(', ')}`,
								bold: true,
								colSpan: 3,
								fontSize: DEFAULT_FONT_SIZE - 1,
							},
							{},
							{},
						],
					],
				},
				layout: 'noBorders',
			}
		);

		if (index < cartonNumber - 1) {
			content.push({ text: '', pageBreak: 'after' });
		}
	}

	const pdfDocGenerator = pdfMake.createPdf({
		...CUSTOM_PAGE_THREAD_STICKER({
			xMargin: 5,
			headerHeight: 5,
			footerHeight: 60,
		}),

		// Page Footer
		footer: (currentPage, pageCount) => ({
			table: getPageFooter({
				currentPage,
				pageCount,
				rank: data?.packing_list_wise_rank,
				packing_number: data?.packing_number,
				data: data,
			}),
		}),

		content: content,
	});

	return pdfDocGenerator;
}
