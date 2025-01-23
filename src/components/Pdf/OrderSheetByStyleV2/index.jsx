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
	const headerHeight = 130;
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
						widths: [50, '*', '*', '*', '*', '*'],
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

								let row = [
									// * Tape
									[
										{
											text: 'Tape #' + (idx + 1),
											style: 'tableFooter',
										},
										{
											text: entry.tape,
											colSpan: 5,
											style: 'tableFooter',
										},
									],

									// * Slider
									[
										{
											text: 'Slider #' + (idx + 1),
											style: 'tableFooter',
										},
										{
											text: entry.slider,
											colSpan: 5,
											style: 'tableFooter',
										},
									],

									// * Others

									...(special_req?.length > 0 ||
									entry.description
										? [
												[
													{
														text:
															'Others #' +
															(idx + 1),
														style: 'tableFooter',
													},
													{
														text: special_req?.join(
															', '
														),
														colSpan: 2,
														style: 'tableFooter',
													},
													{},
													{
														text: entry.description,
														colSpan: 3,
														style: 'tableFooter',
													},
													{},
												],
											]
										: []),

									// * Garments
									...(garments_info?.length > 0
										? [
												[
													{
														text:
															'Garments #' +
															(idx + 1),
														style: 'tableFooter',
													},
													{
														text: garments_info?.join(
															', '
														),
														colSpan: 5,
														style: 'tableFooter',
													},
												],
											]
										: []),

									// * Remarks
									...(entry.remarks
										? [
												[
													{
														text:
															'Remarks #' +
															(idx + 1),
														style: 'tableFooter',
													},
													{
														text: entry.remarks,
														colSpan: 5,
														style: 'tableFooter',
													},
												],
											]
										: []),

									// * 2nd Header
									[
										{
											text: 'Color',
											style: 'tableFooter',
											colSpan: 2,
										},
										{},
										{ text: 'Size', style: 'tableFooter' },
										{ text: 'Unit', style: 'tableFooter' },
										{
											text: 'Bleach',
											style: 'tableFooter',
										},
										{
											text: 'Quantity',
											style: 'tableFooter',
										},
									],

									// * data
									...entry.details.map((detail) => {
										total += detail.quantity;
										grandTotal += detail.quantity;

										return [
											{
												text: detail.color
													? detail.color
													: '---',
												alignment: 'center',
												colSpan: 2,
											},
											{},
											{
												text: detail.size
													? detail.size
													: '---',
												alignment: 'center',
											},
											{
												text: detail.unit
													? detail.unit
													: '---',
												alignment: 'center',
											},
											{
												text:
													detail.bleaching ===
													'non-bleach'
														? 'No'
														: 'Yes',
												alignment: 'center',
											},
											{
												text: detail.quantity
													? detail.quantity
													: '---',
												alignment: 'center',
											},
										];
									}),
								];

								return row;
							}),

							// ...item.item_description?.flatMap((entry, idx) =>
							// 	entry.details.map((detail) => {
							// 		total += detail.quantity;
							// 		grandTotal += detail.quantity;

							// 		return [
							// 			{
							// 				text: entry.tape,
							// 				rowSpan: entry.details.length,
							// 			},
							// 			{
							// 				text: entry.slider,
							// 				rowSpan: entry.details.length,
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
							// 			},
							// 			{
							// 				text: detail.unit
							// 					? detail.unit
							// 					: '---',
							// 			},
							// 			{
							// 				text:
							// 					detail.bleaching ===
							// 					'non-bleach'
							// 						? 'No'
							// 						: 'Yes',
							// 			},
							// 			{
							// 				text: detail.quantity
							// 					? detail.quantity
							// 					: '---',
							// 			},
							// 		];
							// 	})
							// ),

							// * Total
							[
								{
									text: 'Total',
									colSpan: 5,
									alignment: 'right',
									bold: true,
								},
								{},
								{},
								{},
								{},
								{
									text: total,
									alignment: 'center',
								},
							],
						],
					},
				};
			}),

			// * Grand Total
			{
				text: 'Grand Total: ' + grandTotal,
				fontSize: DEFAULT_FONT_SIZE + 3,
				bold: true,
			},
		],
	});

	return pdfDocGenerator;
}
