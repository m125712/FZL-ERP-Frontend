import pdfMake from '@/components/Pdf/pdfMake';
import {
	DEFAULT_FONT_SIZE,
	defaultStyle,
	styles,
	xMargin,
} from '@/components/Pdf/ui';

import { getPageFooter, getPageHeader, TableHeader } from './utils';

export default function OrderSheetByStyle(orderByStyle) {
	const headerHeight = 130;
	let footerHeight = 30;
	const { order_info, orders } = orderByStyle;

	const pdfDocGenerator = pdfMake.createPdf({
		pageSize: 'A4',
		pageOrientation: 'portrait',
		pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
		defaultStyle,
		styles,

		// * Page Header
		header: {
			table: {
				widths: [35, '*', 50, '*'],
				body: getPageHeader(order_info),
			},
			layout: 'noBorders',
			margin: [xMargin, 10, xMargin, 0],
		},

		// * Page Footer
		footer: function (currentPage, pageCount) {
			return {
				table: getPageFooter({
					currentPage,
					pageCount,
				}),
				// * layout: "noBorders",
				margin: [xMargin, 2],
				fontSize: DEFAULT_FONT_SIZE - 2,
			};
		},

		content: [
			...orders?.map((item, idx) => {
				return {
					margin: [0, 5],
					table: {
						headerRows: 2,
						widths: ['*', '*', '*', '*', '*', '*', '*', '*'],
						body: [
							// Header
							...TableHeader(item),

							...item.item_description?.flatMap((entry, idx) =>
								entry.details.map((detail) => [
									{
										text: idx,
										rowSpan: detail.length,
									},
									{
										text: entry.tape,
										rowSpan: detail.length,
									},
									{
										text: entry.slider,
										rowSpan: detail.length,
									},
									{
										text: detail.color
											? detail.color
											: '---',
									},
									{ text: detail.size ? detail.size : '---' },
									{ text: detail.unit ? detail.unit : '---' },
									{
										text: detail.bleaching
											? detail.bleaching
											: '---',
									},
									{
										text: detail.quantity
											? detail.quantity
											: '---',
									},
								])
							),
						],
					},
				};
			}),
		],
	});

	return pdfDocGenerator;
}
