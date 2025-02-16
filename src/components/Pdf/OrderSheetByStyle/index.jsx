import pdfMake from '@/components/Pdf/pdfMake';
import {
	DEFAULT_FONT_SIZE,
	defaultStyle,
	styles,
	xMargin,
} from '@/components/Pdf/ui';

import {
	getGarmentInfo,
	getPageFooter,
	getPageHeader,
	getSpecialReqInfo,
	TableHeader,
} from './utils';

export default function OrderSheetByStyle(orderByStyle) {
	const headerHeight = 110;
	let footerHeight = 30;
	const { order_info, orders, sr, garments } = orderByStyle;
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
						widths: ['*', 80, 30, 25, 35],
						body: [
							// Header
							...TableHeader(item),

							...item.item_description?.flatMap((entry, idx) => {
								const special_req = getSpecialReqInfo(
									entry,
									sr
								);
								const garments_info = getGarmentInfo(
									entry,
									garments
								);

								return entry.details.flatMap((detail) => {
									let TotalColorQty = detail.sizes.reduce(
										(acc, item) => acc + item.quantity,
										0
									);

									return detail.sizes.map((size) => {
										total += size.quantity;
										grandTotal += size.quantity;

										return [
											{
												text: [
													{
														text: 'Tape: ',
														bold: true,
													},
													entry.tape,
													'\n',
													{
														text: 'Slider: ',
														bold: true,
													},
													entry.slider,

													...(special_req?.length > 0
														? [
																'\n',
																{
																	text: 'Special Req: ',
																	bold: true,
																},
																special_req?.join(
																	', '
																),
															]
														: []),

													...(garments_info?.length >
													0
														? [
																'\n',
																{
																	text: 'Garments: ',
																	bold: true,
																},
																garments_info?.join(
																	', '
																),
															]
														: []),
													...(entry.description
														? [
																'\n',
																{
																	text: 'Description: ',
																	bold: true,
																},
																entry.description,
															]
														: []),
													...(entry.remarks
														? [
																'\n',
																{
																	text: 'Remarks: ',
																	bold: true,
																},
																entry.remarks,
															]
														: []),
												],
												rowSpan: entry.details
													.map(
														(detail) =>
															detail.sizes.length
													)
													.reduce(
														(acc, item) =>
															acc + item,
														0
													),
											},
											{
												// text: detail.color
												// 	? detail.color + '\n' + TotalColorQty
												// 	: '---',
												text: [
													{
														text: detail.color
															? detail.color
															: '---',
													},
													...(detail.sizes.length > 1
														? [
																'\n' +
																	`(Total: ${TotalColorQty})`,
															]
														: ['']),
												],
												rowSpan: detail.sizes.length,
											},
											{
												text: size.size
													? size.size
													: '---',
												alignment: 'right',
											},
											{
												text: size.unit
													? size.unit
													: '---',
											},
											{
												text: size.quantity
													? size.bleaching ===
														'non-bleach'
														? size.quantity
														: 'B - ' + size.quantity
													: '---',
												alignment: 'right',
											},
										];
									});
								});
							}),

							// ...item.item_description?.flatMap((entry, idx) =>
							// 	entry.details.map((detail) => {
							// 		total += detail.quantity;
							// 		grandTotal += detail.quantity;

							// 		const special_req = getSpecialReqInfo(
							// 			entry,
							// 			sr
							// 		);
							// 		const garments_info = getGarmentInfo(
							// 			entry,
							// 			garments
							// 		);

							// 		return [
							// 			{
							// 				text: [
							// 					{ text: 'Tape: ', bold: true },
							// 					entry.tape,
							// 					'\n',
							// 					{
							// 						text: 'Slider: ',
							// 						bold: true,
							// 					},
							// 					entry.slider,

							// 					...(special_req?.length > 0
							// 						? [
							// 								'\n',
							// 								{
							// 									text: 'Special Req: ',
							// 									bold: true,
							// 								},
							// 								special_req?.join(
							// 									', '
							// 								),
							// 							]
							// 						: []),

							// 					...(garments_info?.length > 0
							// 						? [
							// 								'\n',
							// 								{
							// 									text: 'Garments: ',
							// 									bold: true,
							// 								},
							// 								garments_info?.join(
							// 									', '
							// 								),
							// 							]
							// 						: []),
							// 					...(entry.remarks
							// 						? [
							// 								'\n',
							// 								{
							// 									text: 'Remarks: ',
							// 									bold: true,
							// 								},
							// 								entry.remarks,
							// 							]
							// 						: []),
							// 				],
							// 				// rowSpan: entry.details.length,
							// 			},
							// 			{
							// 				text: detail.color
							// 					? detail.color
							// 					: '---',
							// 			},
							// 			{
							// 				text: detail.size
							// 					? detail.size
							// 					: '---',
							// 				alignment: 'right',
							// 			},
							// 			{
							// 				text: detail.unit
							// 					? detail.unit
							// 					: '---',
							// 			},
							// 			{
							// 				text: detail.quantity
							// 					? detail.bleaching ===
							// 						'non-bleach'
							// 						? detail.quantity
							// 						: 'B - ' + detail.quantity
							// 					: '---',
							// 				alignment: 'right',
							// 			},
							// 		];
							// 	})
							// ),

							//* Total
							[
								{
									text: 'Total',
									colSpan: 4,
								},
								{},
								{},
								{},
								{
									text: total,
									alignment: 'right',
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
