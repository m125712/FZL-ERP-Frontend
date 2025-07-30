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
	const headerHeight = 140;
	let footerHeight = 40;
	const { order_info, orders, sr, garments } = orderByStyle;
	let grandTotal = 0;
	let grandTotalMeter = 0;
	let grandTotalKg = 0;

	const pdfDocGenerator = pdfMake.createPdf({
		pageSize: 'A4',
		pageOrientation: 'portrait',
		pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
		defaultStyle,
		styles,

		// * Page Header
		header: function (currentPage, pageCount) {
			return {
				table: {
					widths: [35, '*', 50, '*'],
					body: getPageHeader(order_info, currentPage, pageCount),
				},
				layout: 'noBorders',
				margin: [xMargin, 10, xMargin, 0],
			};
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
			...(Array.isArray(orders)
				? orders.map((item) => {
						let total = 0;
						let totalMeter = 0;
						let totalKg = 0;

						return {
							margin: [0, 5],
							table: {
								headerRows: 2,
								widths: ['*', 80, 30, 25, 35, 35, 35],
								body: [
									// Header
									...TableHeader(item),

									...(Array.isArray(item.item_description)
										? item.item_description.flatMap(
												(entry) => {
													const special_req =
														getSpecialReqInfo(
															entry,
															sr
														);
													const garments_info =
														getGarmentInfo(
															entry,
															garments
														);

													//* Total for each description
													const TotalDescQty =
														entry.details.reduce(
															(acc, detail) => {
																const sizeTotals =
																	detail.sizes.reduce(
																		(
																			sizeAcc,
																			sizeItem
																		) => {
																			sizeAcc.quantity +=
																				sizeItem.quantity;
																			sizeAcc.quantity_meter +=
																				sizeItem.quantity_meter;
																			sizeAcc.quantity_kg +=
																				sizeItem.quantity_kg;
																			return sizeAcc;
																		},
																		{
																			quantity: 0,
																			quantity_meter: 0,
																			quantity_kg: 0,
																		}
																	);

																acc.quantity +=
																	sizeTotals.quantity;
																acc.quantity_meter +=
																	sizeTotals.quantity_meter;
																acc.quantity_kg +=
																	sizeTotals.quantity_kg;
																return acc;
															},
															{
																quantity: 0,
																quantity_meter: 0,
																quantity_kg: 0,
															}
														);

													const TotalDescQtyRow = [
														{
															text: 'Description Total',
															colSpan: 4,
															bold: true,
															color: 'blue',
														},
														{},
														{},
														{},
														{
															text: TotalDescQty.quantity,
															alignment: 'right',
															bold: true,
															color: 'blue',
														},
														{
															text: TotalDescQty.quantity_meter.toFixed(
																2
															),
															alignment: 'right',
															bold: true,
															color: 'blue',
														},
														{
															text: TotalDescQty.quantity_kg.toFixed(
																2
															),
															alignment: 'right',
															bold: true,
															color: 'blue',
														},
													];

													const entireRow =
														entry.details.flatMap(
															(detail) => {
																//* Total for each color
																let TotalColorQty =
																	detail.sizes.reduce(
																		(
																			acc,
																			item
																		) => {
																			acc.color =
																				acc.color +
																				item.quantity;
																			acc.meter =
																				acc.meter +
																				item.quantity_meter;
																			acc.quantity_kg =
																				acc.quantity_kg +
																				item.quantity_kg;
																			return acc;
																		},
																		{
																			color: 0,
																			meter: 0,
																			quantity_kg: 0,
																		}
																	);

																const TotalColorQtyRow =
																	[
																		{},
																		{
																			text: 'Color Total',
																			colSpan: 3,
																			bold: true,
																		},
																		{},
																		{},
																		{
																			text: TotalColorQty.color,
																			alignment:
																				'right',
																			bold: true,
																		},
																		{
																			text: TotalColorQty.meter.toFixed(
																				2
																			),
																			alignment:
																				'right',
																			bold: true,
																		},
																		{
																			text: TotalColorQty.quantity_kg.toFixed(
																				2
																			),
																			alignment:
																				'right',
																			bold: true,
																		},
																	];

																const detailsRow =
																	detail.sizes.map(
																		(
																			size
																		) => {
																			total +=
																				size.quantity;
																			totalMeter +=
																				size.quantity_meter;
																			totalKg +=
																				size.quantity_kg;
																			grandTotal +=
																				size.quantity;
																			grandTotalMeter +=
																				size.quantity_meter;
																			grandTotalKg +=
																				size.quantity_kg;

																			const DetailsRowSpan =
																				entry.details
																					.map(
																						(
																							detail
																						) =>
																							detail
																								.sizes
																								.length
																					)
																					.reduce(
																						(
																							acc,
																							item
																						) =>
																							acc +
																							item,
																						0
																					);

																			const sizeRowSpan =
																				entry.details.reduce(
																					(
																						acc,
																						item
																					) => {
																						if (
																							item
																								.sizes
																								.length >
																							1
																						) {
																							return (
																								acc +
																								1
																							);
																						}
																						return acc;
																					},
																					0
																				);

																			return [
																				{
																					// * might need it later
																					text: [
																						{
																							text: 'Tape: ',
																							bold: true,
																						},
																						{
																							text:
																								entry.tape +
																								'\n\n',
																							marginLeft: 5,
																							marginTop: 2,
																							marginRight: 10,
																							marginBottom: 2,
																						},
																						{
																							text: 'Slider: ',
																							bold: true,
																							margin: [
																								0,
																								0,
																								0,
																								10,
																							],
																						},
																						{
																							text:
																								entry.slider +
																								'\n\n',
																							margin: [
																								0,
																								0,
																								0,
																								10,
																							],
																						},

																						...(special_req?.length >
																						0
																							? [
																									{
																										text: 'Special Req: ',
																										bold: true,
																										margin: [
																											0,
																											0,
																											0,
																											2,
																										],
																									},
																									{
																										text:
																											special_req.join(
																												', '
																											) +
																											'\n\n',
																										margin: [
																											0,
																											0,
																											0,
																											4,
																										],
																									},
																								]
																							: []),

																						...(garments_info?.length >
																						0
																							? [
																									{
																										text: 'Garments: ',
																										bold: true,
																										margin: [
																											0,
																											0,
																											0,
																											2,
																										],
																									},
																									{
																										text:
																											garments_info.join(
																												', '
																											) +
																											'\n\n',
																										margin: [
																											0,
																											0,
																											0,
																											4,
																										],
																									},
																								]
																							: []),

																						...(entry.description
																							? [
																									{
																										text: 'Description: ',
																										bold: true,
																										margin: [
																											0,
																											0,
																											0,
																											2,
																										],
																									},
																									{
																										text:
																											entry.description +
																											'\n\n',
																										margin: [
																											0,
																											0,
																											0,
																											4,
																										],
																									},
																								]
																							: []),

																						...(entry.remarks
																							? [
																									{
																										text: 'Remarks: ',
																										bold: true,
																										margin: [
																											0,
																											0,
																											0,
																											2,
																										],
																									},
																									{
																										text:
																											entry.remarks +
																											'\n',
																										margin: [
																											0,
																											0,
																											0,
																											4,
																										],
																									},
																								]
																							: []),
																					],

																					rowSpan:
																						sizeRowSpan +
																						DetailsRowSpan,
																				},
																				{
																					text: [
																						{
																							text: detail.color
																								? detail.color
																								: '---',
																						},
																					],
																					rowSpan:
																						detail
																							.sizes
																							.length,
																				},
																				{
																					text: size.size
																						? size.size
																						: '---',
																					alignment:
																						'right',
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
																							: 'B - ' +
																								size.quantity
																						: '---',
																					alignment:
																						'right',
																				},
																				{
																					text: size.quantity_meter
																						? size.quantity_meter
																						: '---',
																					alignment:
																						'right',
																				},
																				{
																					text: size.quantity_kg
																						? size.quantity_kg
																						: '---',
																					alignment:
																						'right',
																				},
																			];
																		}
																	);

																return [
																	...detailsRow,
																	...(detail
																		.sizes
																		.length >
																	1
																		? [
																				TotalColorQtyRow,
																			]
																		: []),
																];
															}
														);

													return [
														...entireRow,
														TotalDescQtyRow,
													];
												}
											)
										: []),

									//* Style Total
									[
										{
											text: 'Style Total',
											colSpan: 4,
											bold: true,
											color: 'red',
										},
										{},
										{},
										{},
										{
											text: total,
											alignment: 'right',
											bold: true,
											color: 'red',
										},
										{
											text: totalMeter.toFixed(2),
											alignment: 'right',
											bold: true,
											color: 'red',
										},
										{
											text: totalKg.toFixed(2),
											alignment: 'right',
											bold: true,
											color: 'red',
										},
									],
								],
							},
						};
					})
				: []),

			// * Grand total
			{
				margin: [0, 5],
				table: {
					widths: ['*', 35, 35, 35],
					body: [
						[
							{
								text: 'Grand Total',
								style: 'tableFooter',
								alignment: 'right',
							},
							{
								text: grandTotal,
								style: 'tableFooter',
								alignment: 'Center',
							},
							{
								text: grandTotalMeter.toFixed(2),
								style: 'tableFooter',
								alignment: 'Center',
							},
							{
								text: grandTotalKg.toFixed(2),
								style: 'tableFooter',
								alignment: 'Center',
							},
						],
					],
				},
			},
		],
	});

	return pdfDocGenerator;
}
