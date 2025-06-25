import pdfMake from '@/components/Pdf/pdfMake';
import {
	DEFAULT_FONT_SIZE,
	defaultStyle,
	styles,
	xMargin,
} from '@/components/Pdf/ui';

import {
	chunkArray,
	getGarmentInfo,
	getPageFooter,
	getPageHeader,
	getSpecialReqInfo,
	grandTotal,
	TableHeader,
} from './utils';

export default function OrderSheetPdf(order_sheet) {
	const headerHeight = 140;
	let footerHeight = 40;
	const { order_info, order_entry, garments, sr } = order_sheet;

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

		// * Page Layout
		content: [
			...order_entry.map((entry, i) => {
				// * special requirement info
				const special_req_info = getSpecialReqInfo(entry, sr);
				const { order_entry } = entry;
				const uniqueSizes = [
					...new Set(
						order_entry.map((item) => Number(item.size)).sort()
					),
				].sort((a, b) => a - b);
				const res = order_entry.reduce((acc, item) => {
					const key = item.style;
					const color =
						item.color +
						`${item.color_ref ? ` (Ref: ${item.color_ref})` : ''}`;
					const size = Number(item.size);
					const quantity = Number(item.quantity);
					const bleach = item.bleaching;

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
							bleach: uniqueSizes.map((sizeItem) =>
								sizeItem === size ? bleach : ''
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
				console.log(res);
				//todo: order_type condition will start from here
				if (entry.order_type !== 'slider') {
					// * garments info
					const garments_info = getGarmentInfo(entry, garments);

					const uniqueColor = () => {
						const uniqueColors = new Set();
						order_entry.forEach((item) => {
							uniqueColors.add(item.color);
						});

						return uniqueColors.size;
					};

					const chunkSize = 7;
					const chunkedArray = chunkArray(uniqueSizes, chunkSize);
					let TotalChunkQTY = 0;
					return [
						chunkedArray.map((chunk, index) => {
							let chunkTotal = 0;
							return {
								table: {
									widths: [
										50,
										67,
										...chunkedArray[0].map(() => '*'),
										// * ...uniqueSizes.map(() => 20),
										'*',
									],
									body: [
										// * Table Header
										...TableHeader({
											entry,
											special_req_info,
											uniqueSizes: chunk,
											i,
										}),

										// * Table Body
										...Object.keys(res)
											.map((style) =>
												res[style].map((color) => {
													const colorName =
														Object.keys(color)[0];
													const quantities =
														color[colorName];

													// * the bleaching status for each quantity
													const bleaching =
														color.bleach;
													// console.log(color.color_ref);
													// * Slicing the quantities array for each chunk
													const slicedQuantities =
														quantities.slice(
															index * chunkSize,
															index * chunkSize +
																chunk.length
														);

													// * Slicing the bleaching array for each chunk
													const slicedBleaching =
														bleaching.slice(
															index * chunkSize,
															index * chunkSize +
																chunk.length
														);

													// * check if the chunk is not the 1st chunk (this might not be required because the 1st chunk length might be less than the chunk size)
													// * and if the sliced quantities length is less than the chunk size
													if (
														// * index > 0 &&   // * 1st chunk length might be less than the chunk size so this condition is not required
														slicedQuantities.length <
														chunkSize
													) {
														const missingItems =
															chunkSize -
															slicedQuantities.length;
														slicedQuantities.push(
															...Array(
																missingItems
															).fill(0)
														);
													}

													return [
														{
															rowSpan:
																res[style]
																	.length,
															text: style,
														},
														{
															text: colorName,
														},
														...slicedQuantities.map(
															(qty, i) => ({
																text:
																	qty === 0
																		? '-'
																		: slicedBleaching[
																					i
																			  ] ===
																			  'bleach'
																			? 'B -' +
																				qty
																			: qty,
																alignment:
																	'right',
															})
														),
														{
															text: slicedQuantities.reduce(
																(acc, qty) =>
																	Number(
																		acc
																	) +
																	Number(qty),
																0
															),
															alignment: 'right',
														},
													];
												})
											)
											.flat(),

										//* Total Color
										[
											{
												text: 'Total Color',
												alignment: 'Center',
											},
											{
												text: uniqueColor(),
												alignment: 'right',
											},
											...chunk.map((size) => {
												return {
													text: (() => {
														let total =
															order_entry.reduce(
																(acc, item) =>
																	Number(
																		item.size
																	) === size
																		? Number(
																				acc
																			) +
																			Number(
																				item.quantity
																			)
																		: acc,
																0
															);

														chunkTotal += total;
														TotalChunkQTY += total;

														return total;
													})(), // * Immediately invoke the function
													alignment: 'right',
												};
											}),
											{
												text: chunkTotal,
												alignment: 'right',
											},
										],

										// * Garments
										...(garments_info.length > 0 ||
										entry?.garment ||
										entry?.light_preference_name ||
										entry?.end_user_short_name
											? [
													[
														{
															text: 'Garments',
															style: 'tableHeader',
															alignment: 'Center',
														},
														{
															colSpan:
																chunk.length +
																2,
															text: [
																entry?.garment
																	? entry?.garment
																	: '', // * Include garments if it exists
																garments &&
																(garments_info.length >
																	0 ||
																	entry?.light_preference_name ||
																	entry?.end_user_short_name)
																	? ' / '
																	: '', // * Show separator if garments and at least one other value exists
																garments_info.length >
																0
																	? `(${garments_info?.join(', ')})`
																	: '',
																garments_info.length >
																	0 &&
																(entry?.light_preference_name ||
																	entry?.end_user_short_name)
																	? ' / '
																	: '', // * Show separator if either light preference or end user exists after garments_info
																entry?.light_preference_name
																	? entry?.light_preference_name
																	: '',
																entry?.light_preference_name &&
																entry?.end_user_short_name
																	? ' / '
																	: '', // * Show separator if both light preference and end user exist
																entry?.end_user_short_name
																	? entry?.end_user_short_name
																	: '',
															],
															style: 'tableHeader',
															alignment: 'left',
														},
													],
												]
											: []),

										// * remarks
										...(entry?.remarks?.length > 0
											? [
													[
														{
															text: 'Remarks',
															alignment: 'Center',
														},
														{
															colSpan:
																chunk.length +
																2,
															text: entry?.remarks,
															alignment: 'left',
														},
													],
												]
											: []),
									],
								},

								margin: [0, 5],
							};
						}),

						// * Chunk total
						{
							margin: [0, 5],
							table: {
								widths: ['*', 'auto'],
								body: [
									[
										{
											text: `#${i + 1} Total`,
											style: 'tableFooter',
											alignment: 'right',
										},
										{
											text: TotalChunkQTY,
											style: 'tableFooter',
											alignment: 'Center',
										},
									],
								],
							},
						},
					];
				} else {
					let SliderTotal = 0;
					return [
						{
							margin: [0, 5],
							table: {
								widths: [50, '*', '*'],
								body: [
									...TableHeader({
										entry,
										special_req_info,
										uniqueSizes: [],
										i,
									}),

									// * Table Body
									...Object.keys(res)
										.map((style) =>
											res[style].map((color) => {
												const colorName =
													Object.keys(color)[0];
												const quantities =
													color[colorName];

												return [
													{
														rowSpan:
															res[style].length,
														text: style,
													},
													...quantities.map((qty) => {
														SliderTotal += qty;
														return {
															text:
																qty === 0
																	? '-'
																	: qty,
															alignment: 'right',
														};
													}),
													{
														text: quantities.reduce(
															(acc, qty) =>
																Number(acc) +
																Number(qty),
															0
														),
														alignment: 'right',
													},
												];
											})
										)
										.flat(),

									// * Total
									[
										{
											text: 'Total',
											style: 'tableFooter',
											alignment: 'Center',
										},
										{
											text: SliderTotal,
											style: 'tableFooter',
											alignment: 'right',
											colSpan: 2,
										},
									],
									// * remarks
									...(entry?.remarks?.length > 0
										? [
												[
													{
														text: 'Remarks',
														alignment: 'Center',
													},
													{
														colSpan: 2,
														text: entry?.remarks,
														alignment: 'left',
													},
												],
											]
										: []),
								],
							},
						},

						// * slider section total
						{
							margin: [0, 5],
							table: {
								widths: ['*', 'auto'],
								body: [
									[
										{
											text: `#${i + 1} Slider Total`,
											style: 'tableFooter',
											alignment: 'right',
										},
										{
											text: SliderTotal,
											style: 'tableFooter',
											alignment: 'Center',
										},
									],
								],
							},
						},
					];
				}
			}),

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
								text: grandTotal(order_entry),
								style: 'tableFooter',
								alignment: 'Center',
							},
						],
					],
				},
			},
		],
	});

	// * test
	// * return new Promise((resolve) => {
	// * 	pdfDocGenerator.getDataUrl((dataUrl) => {
	// * 		resolve(dataUrl);
	// * 	});
	// * });
	// * return pdfDocGenerator.download();

	return pdfDocGenerator;
}
