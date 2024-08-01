import pdfMake from "@/components/Pdf/pdfMake";
import {
	DEFAULT_FONT_SIZE,
	defaultStyle,
	styles,
	xMargin,
} from "@/components/Pdf/ui";
import {
	TableFooter,
	TableHeader,
	getPageFooter,
	getPageHeader,
} from "./utils";

export default function PiPdf(pi_info) {
	// const { pi_info } = props;
	const {
		pi_entry,
		order_numbers,
		total_quantity,
		total_value,
		payment,
		bank_name,
		total_value_in_words,
	} = pi_info;

	const headerHeight = 140;
	let footerHeight = 150;

	const pdfDocGenerator = pdfMake.createPdf({
		pageSize: "A4",
		pageOrientation: "portrait",
		pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
		defaultStyle,
		styles,

		// Page Header
		header: {
			table: {
				widths: [38, "*", 35, "*"],
				body: getPageHeader(pi_info),
			},
			layout: "noBorders",
			margin: [xMargin, 15, xMargin, 0],
		},
		// Page Footer
		footer: function (currentPage, pageCount) {
			return {
				table: getPageFooter({
					currentPage,
					pageCount,
					payment,
					bank_name,
				}),
				layout: "noBorders",
				margin: [xMargin, 2],
				fontSize: DEFAULT_FONT_SIZE - 2,
			};
		},

		// Page Layout
		content: [
			{
				table: {
					headerRows: 2,
					widths: ["*", "*", 25, 40, 40, 40],
					// dontBreakRows: true,
					body: [
						// Header
						...TableHeader({
							order_numbers,
							styles: pi_info.styles,
						}),

						// Body
						...pi_entry.map((item) => [
							{
								rowSpan: pi_entry.filter(
									(i) =>
										i.item_description ===
										item.item_description
								).length,
								text: item.item_description,
								style: "tableCell",
							},
							{
								rowSpan: pi_entry.filter(
									(i) =>
										i.item_description ===
										item.item_description
								).length,
								text: item.item_description,
								style: "tableCell",
							},
							{
								rowSpan: pi_entry.filter(
									(i) =>
										i.item_description ===
											item.item_description &&
										i.size === item.size
								).length,
								text: item.size,
								style: "tableCell",
								alignment: "right",
							},
							{
								text: item.pi_quantity,
								style: "tableCell",
								alignment: "right",
							},
							{
								text: item.unit_price,
								style: "tableCell",
								alignment: "right",
							},
							{
								text: item.value,
								style: "tableCell",
								alignment: "right",
							},
						]),

						// Footer
						TableFooter({
							total_quantity,
							total_value,
						}),
					],
				},
			},
			{
				text: `Total Value in Words: ${total_value_in_words}`,
				style: "tableFooter",
				margin: [0, 5],
			},
		],
	});

	// test
	return new Promise((resolve) => {
		pdfDocGenerator.getDataUrl((dataUrl) => {
			resolve(dataUrl);
		});
	});
	// return pdfDocGenerator;
}
