import pdfMake from "@/components/Pdf/pdfMake";
import {
	DEFAULT_FONT_SIZE,
	defaultStyle,
	styles,
	xMargin,
} from "@/components/Pdf/ui";
import { TableHeader, getPageFooter, getPageHeader } from "./utils";

export default function OrderSheetPdf(order_sheet) {
	const headerHeight = 100;
	let footerHeight = 30;
	const { order_info, order_entry } = order_sheet;

	const pdfDocGenerator = pdfMake.createPdf({
		pageSize: "A4",
		pageOrientation: "portrait",
		pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
		defaultStyle,
		styles,

		// Page Header
		header: {
			table: {
				widths: [35, "*", 42, "*"],
				body: getPageHeader(order_info),
			},
			layout: "noBorders",
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
			...order_entry.map((entry) => {
				const { order_entry } = entry;
				const uniqueSizes = [
					...new Set(
						order_entry.map((item) => Number(item.size)).sort()
					),
				];

				const res = order_entry.reduce((acc, item) => {
					const key = item.style;
					const color = item.color;
					const size = Number(item.size);
					const quantity = Number(item.quantity);

					if (!acc[key]) {
						acc[key] = [];
					}

					const colorIndex = acc[key].findIndex(
						(i) => i[color] !== undefined
					);

					if (colorIndex === -1) {
						acc[key].push({
							[color]: uniqueSizes.map((sizeItem) =>
								sizeItem === size ? quantity : 0
							),
						});
					} else {
						const colorKey = Object.keys(acc[key][colorIndex])[0];
						acc[key][colorIndex][colorKey] = acc[key][colorIndex][
							colorKey
						].map((qty, index) => {
							return uniqueSizes[index] === size
								? Number(qty) + Number(quantity)
								: qty;
						});
					}

					return acc;
				}, {});

				return [
					{
						table: {
							widths: [
								30,
								67,
								...uniqueSizes.map(() => "*"),
								// ...uniqueSizes.map(() => 20),
								"*",
							],
							body: [
								// Table Header
								...TableHeader({
									entry,
									uniqueSizes,
								}),

								// Table Body
								...Object.keys(res)
									.map((style) =>
										res[style].map((color) => {
											const colorName =
												Object.keys(color)[0];
											const quantities = color[colorName];

											return [
												{
													rowSpan: res[style].length,
													text: style,
													style: "tableCell",
												},
												{
													text: colorName,
													style: "tableCell",
												},
												...quantities.map((qty) => ({
													text: qty,
													style: "tableCell",
													alignment: "right",
												})),
												{
													text: quantities.reduce(
														(acc, qty) =>
															Number(acc) +
															Number(qty),
														0
													),
													style: "tableCell",
													alignment: "right",
												},
											];
										})
									)
									.flat(),

								// Table Footer

								[
									{
										colSpan: 2,
										text: "Total",
										style: "tableFooter",
										alignment: "right",
									},
									"",
									...uniqueSizes.map((size) => {
										return {
											text: order_entry.reduce(
												(acc, item) =>
													Number(item.size) === size
														? Number(acc) +
															Number(
																item.quantity
															)
														: acc,
												0
											),
											style: "tableFooter",
											alignment: "right",
										};
									}),
									{
										text: order_entry.reduce(
											(acc, item) =>
												Number(acc) +
												Number(item.quantity),
											0
										),
										style: "tableFooter",
										alignment: "right",
									},
								],
							],
						},
						margin: [0, 5],
					},
				];
			}),
		],
	});

	// test
	// return new Promise((resolve) => {
	// 	pdfDocGenerator.getDataUrl((dataUrl) => {
	// 		resolve(dataUrl);
	// 	});
	// });
	// return pdfDocGenerator.download();

	return pdfDocGenerator;
}
