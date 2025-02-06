import pdfMake from '@/components/Pdf/pdfMake';
import {
	DEFAULT_FONT_SIZE,
	defaultStyle,
	styles,
	xMargin,
} from '@/components/Pdf/ui';

import {
	getPageFooter,
	getPageHeader,
	TableFooter,
	TableHeader,
} from './utils';

export default function ChallanPdf(challan) {
	const headerHeight = 120;
	let footerHeight = 30;
	const { challan_info, challan_entry } = challan;

	// console.log(challan_info, challan_entry);

	const pdfDocGenerator = pdfMake.createPdf({
		pageSize: 'A4',
		pageOrientation: 'portrait',
		pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
		defaultStyle,
		styles,

		// Page Header
		header: {
			table: {
				widths: [35, '*', 60, '*'],
				body: getPageHeader(challan_info),
			},
			layout: 'noBorders',
			margin: [xMargin, 10, xMargin, 0],
		},
		// Page Footer
		footer: function (currentPage, pageCount) {
			return {
				table: getPageFooter({
					currentPage,
					pageCount,
				}),
				// layout: "noBorders",
				margin: [xMargin, 2],
				fontSize: DEFAULT_FONT_SIZE - 2,
			};
		},

		// Page Layout
		content: [
			{
				table: {
					headerRows: 1,
					widths: ['*', '*', '*', '*', '*'],
					// dontBreakRows: true,
					body: [
						// Header
						...TableHeader(),

						// Body
						...challan_entry.map((item) => [
							{
								rowSpan: challan_entry.filter(
									(i) =>
										i.item_description ===
										item.item_description
								).length,
								text: item.item_description,
								style: 'tableCell',
							},
							{
								rowSpan: challan_entry.filter(
									(i) =>
										i.item_description ===
											item.item_description &&
										i.style === item.style
								).length,
								text: item.style,
								style: 'tableCell',
							},
							{
								rowSpan: challan_entry.filter(
									(i) =>
										i.item_description ===
											item.item_description &&
										i.style === item.style &&
										i.color === item.color
								).length,
								text: item.color,
								style: 'tableCell',
							},
							{
								text: item.size,
								alignment: 'right',
							},
							{
								text: item.delivery_quantity,
								alignment: 'right',
							},
						]),

						// Footer
						TableFooter({
							...challan_info,
						}),
					],
				},
			},
		],
	});

	// test
	// return new Promise((resolve) => {
	// 	pdfDocGenerator.getDataUrl((dataUrl) => {
	// 		resolve(dataUrl);
	// 	});
	// });
	return pdfDocGenerator;
}
