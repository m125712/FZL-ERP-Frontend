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
	let grandTotal = 0;

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
				let total = 0;
				return {
					margin: [0, 5],
					table: {
						headerRows: 2,
						widths: ['*', 50, 30, 30, 30, 35],
						body: [
							// Header
							...TableHeader(item),

							...item.item_description?.flatMap((entry, idx) =>
								entry.details.map((detail) => {
									total += detail.quantity;
									grandTotal += detail.quantity;

									return [
										{
											text: [
												{ text: 'Tape: ', bold: true },
												entry.tape,
												'\n\n',
												{ text: 'Slider: ', bold: true },
												entry.slider,
											],
											rowSpan: entry.details.length,
										},
										{
											text: detail.color
												? detail.color
												: '---',
										},
										{
											text: detail.size
												? detail.size
												: '---',
										},
										{
											text: detail.unit
												? detail.unit
												: '---',
										},
										{
											text:
												detail.bleaching ===
												'non-bleach'
													? 'No'
													: 'Yes',
										},
										{
											text: detail.quantity
												? detail.quantity
												: '---',
										},
									];
								})
							),
							[
								{
									text: 'Total',
									colSpan: 5,
								},
								{},
								{},
								{},
								{},
								{
									text: total,
								},
							],
						],
					},
				};
			}),

			{
				text: 'Grand Total: ' + grandTotal,
				fontSize: DEFAULT_FONT_SIZE + 3,
				bold: true,
			},
		],
	});

	return pdfDocGenerator;
}
