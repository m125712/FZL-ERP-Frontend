import { DEFAULT_FONT_SIZE } from '@/components/Pdf/ui';
import { CUSTOM_PAGE_CONE_STICKER } from '@/components/Pdf/utils';

import pdfMake from '..';

export default function Index(data) {
	const contentArray = Array(data?.quantity || 1).fill(data);
	const fontSize = DEFAULT_FONT_SIZE - 4;
	const tableLayout = {
		hLineWidth: function (i, node) {
			return 0;
		},
		vLineWidth: function (i) {
			return 0;
		},
		paddingTop: function (i) {
			return i === 0 ? 37 : 0;
		},
	};
	const contents = contentArray.map((index) => {
		return {
			layout: tableLayout,

			table: {
				widths: [71, 71, 71],
				body: [
					// * item description
					[
						{
							text:
								data?.item_description +
								' ' +
								data?.size +
								' M',
							alignment: 'center',
							fontSize: fontSize + 2,
							bold: true,
						},

						{
							text:
								data?.item_description +
								' ' +
								data?.size +
								' M',
							alignment: 'center',
							fontSize: fontSize + 2,
							bold: true,
						},

						{
							text:
								data?.item_description +
								' ' +
								data?.size +
								' M',
							alignment: 'center',
							fontSize: fontSize + 2,
							bold: true,
						},
					],

					// * color
					[
						{
							text: data?.color,
							alignment: 'center',
							fontSize: fontSize,
						},

						{
							text: data?.color,
							alignment: 'center',
							fontSize: fontSize,
						},

						{
							text: data?.color,
							alignment: 'center',
							fontSize: fontSize,
						},
					],

					// * recipe
					[
						{
							text: data?.recipe_name,
							alignment: 'center',
							fontSize: fontSize,
						},

						{
							text: data?.recipe_name,
							alignment: 'center',
							fontSize: fontSize,
						},

						{
							text: data?.recipe_name,
							alignment: 'center',
							fontSize: fontSize,
						},
					],

					// * packing number
					[
						{
							text: data?.packing_number,
							alignment: 'center',
							fontSize: fontSize,
						},

						{
							text: data?.packing_number,
							alignment: 'center',
							fontSize: fontSize,
						},

						{
							text: data?.packing_number,
							alignment: 'center',
							fontSize: fontSize,
						},
					],
				],
			},
		};
	});
	const pdfDocGenerator = pdfMake.createPdf({
		...CUSTOM_PAGE_CONE_STICKER({
			pageOrientation: 'landscape',
			xMargin: 5,
			headerHeight: 0,
			footerHeight: 0,
		}),

		content: contents.map((content) => [content]).flat(),
	});

	return pdfDocGenerator;
}
