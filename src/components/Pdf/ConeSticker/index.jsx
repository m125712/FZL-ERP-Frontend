import { DEFAULT_FONT_SIZE } from '@/components/Pdf/ui';
import { CUSTOM_PAGE_CONE_STICKER } from '@/components/Pdf/utils';

import pdfMake from '..';

export default function Index(data) {
	const contentArray = Array(data?.quantity || 1).fill(data);
	const fontSize = DEFAULT_FONT_SIZE - 3;
	const item_description = {
		text: data?.item_description + ' ' + data?.size + ' M',
		alignment: 'center',
		width: 68,
		fontSize: fontSize,
		margin: [0, 0, 0, 0],
	};
	const tableLayout = {
		hLineWidth: function (i, node) {
			return 0;
		},
		vLineWidth: function (i) {
			return 0;
		},
		paddingLeft: function (i) {
			return i === 0 ? 14 : 0;
		},
		paddingRight: function (i, node) {
			return i === node.table.widths.length - 1 ? 14 : 22;
		},
		paddingTop: function (i) {
			return i === 0 ? 38 : 0;
		},
		paddingBottom: function (i) {
			return 0;
		},
	};
	const contents = contentArray.map((index) => {
		return {
			layout: tableLayout,

			table: {
				body: [
					[
						{
							text:
								data?.item_description +
								' ' +
								data?.size +
								' M',
							alignment: 'center',
							width: 68,
							fontSize: fontSize,
							margin: [0, 0, 0, 0],
						},

						{
							text:
								data?.item_description +
								' ' +
								data?.size +
								' M',
							alignment: 'center',
							width: 68,
							fontSize: fontSize,
							margin: [0, 0, 0, 0],
						},

						{
							text:
								data?.item_description +
								' ' +
								data?.size +
								' M',
							alignment: 'center',
							width: 68,
							fontSize: fontSize,
							margin: [0, 0, 0, 0],
						},
					],
					[
						{
							text: data?.color,
							alignment: 'center',
							width: 68,
							fontSize: fontSize,
							margin: [0, 0, 0, 0],
						},

						{
							text: data?.color,
							alignment: 'center',
							width: 68,
							fontSize: fontSize,
							margin: [0, 0, 0, 0],
						},

						{
							text: data?.color,
							alignment: 'center',
							width: 68,
							fontSize: fontSize,
							margin: [0, 0, 0, 0],
						},
					],
					[
						{
							text: data?.recipe_name,
							alignment: 'center',
							width: 68,
							fontSize: fontSize,
							margin: [0, 0, 0, 0],
						},

						{
							text: data?.recipe_name,
							alignment: 'center',
							width: 68,
							fontSize: fontSize,
							margin: [0, 0, 0, 0],
						},

						{
							text: data?.recipe_name,
							alignment: 'center',
							width: 68,
							fontSize: fontSize,
							margin: [0, 0, 0, 0],
						},
					],
					[
						{
							text: data?.packing_number,
							alignment: 'center',
							width: 68,
							fontSize: fontSize,
							margin: [0, 0, 0, 0],
						},

						{
							text: data?.packing_number,
							alignment: 'center',
							width: 68,
							fontSize: fontSize,
							margin: [0, 0, 0, 0],
						},

						{
							text: data?.packing_number,
							alignment: 'center',
							width: 68,
							fontSize: fontSize,
							margin: [0, 0, 0, 0],
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
