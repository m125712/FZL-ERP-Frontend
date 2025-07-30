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

						return {
							margin: [0, 5],
							table: {
								headerRows: 2,
								widths: ['*', 80, 30, 25, 35],
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
													let TotalDescQty =
														entry.details.reduce(
															(acc, item) =>
																acc +
																item.sizes.reduce(
																	(
																		acc,
																		item
																	) =>
																		acc +
																		item.quantity,
																	0
																),
															0
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
															text: TotalDescQty,
															alignment: 'right',
															bold: true,
															color: 'blue',
														},
													];

													const entireRow =
														entry.details.flatMap(
															(detail) => {
																let TotalColorQty =
																	detail.sizes.reduce(
																		(
																			acc,
																			item
																		) =>
																			acc +
																			item.quantity,
																		0
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
																			text: TotalColorQty,
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
																			grandTotal +=
																				size.quantity;

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
																					// table: {
																					// 	widths: ['*'],
																					// 	body: getInnerTable(
																					// 		entry,
																					// 		special_req,
																					// 		garments_info,
																					// 		TotalDescQty
																					// 	),
																					// },
																					// customPadding: {
																					// 	left: 0,
																					// 	top: 3,
																					// 	right: 0,
																					// 	bottom: 3,
																					// },
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
					widths: ['*', 'auto'],
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
						],
					],
				},
			},
		],
	});

	return pdfDocGenerator;
}
