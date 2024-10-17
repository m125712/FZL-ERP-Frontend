import pdfMake from '@/components/Pdf/pdfMake';
import {
	DEFAULT_FONT_SIZE,
	defaultStyle,
	styles,
	xMargin,
} from '@/components/Pdf/ui';

import { getPageFooter, getPageHeader, TableHeader } from './utils';

export default function OrderSheetPdf(order_sheet) {
	// * function to get similar garment_wash
	const getGarmentInfo = (order_description, garments) => {
		if (order_description?.garments_wash) {
			const parsedObject =
				typeof order_description?.garments_wash === 'string'
					? JSON.parse(order_description?.garments_wash)
					: order_description?.garments_wash;

			const matchingLabels = garments
				?.filter((item) => parsedObject.values.includes(item.value)) // Filter by matching value
				.map((item) => item.label);
			return matchingLabels;
		} else {
			return [];
		}
	};

	// * function to get similar Special Requirement
	const getSpecialReqInfo = (order_description, sr) => {
		if (order_description?.special_requirement) {
			const parsedObject =
				typeof order_description?.special_requirement === 'string'
					? JSON.parse(order_description?.special_requirement)
					: order_description?.special_requirement;

			const matchingLabels = sr
				?.filter((item) => parsedObject.values.includes(item.value)) // Filter by matching value
				.map((item) => item.label);
			return matchingLabels;
		} else {
			return [];
		}
	};

	// * function to calculate grand total
	const grandTotal = (total_entries) => {
		let total = 0;
		total_entries?.map((item) => {
			total += item.order_entry.reduce((acc, item) => {
				acc += item?.quantity;

				return acc;
			}, 0);
		});

		return total;
	};

	// * function to chunk array
	const chunkArray = (array, chunkSize) => {
		let chunks = [];
		for (let i = 0; i < array.length; i += chunkSize) {
			let chunk = array.slice(i, i + chunkSize);

			if (i > 0 && chunk.length < chunkSize)
				chunk = [...chunk, ...Array(chunkSize - chunk.length).fill(0)];

			chunks.push(chunk);
		}
		return chunks;
	};

	const headerHeight = 140;
	let footerHeight = 30;
	const { order_info, order_entry, garments, sr } = order_sheet;

	const pdfDocGenerator = pdfMake.createPdf({
		pageSize: 'A4',
		pageOrientation: 'portrait',
		pageMargins: [xMargin, headerHeight, xMargin, footerHeight],
		defaultStyle,
		styles,

		// Page Header
		header: {
			table: {
				widths: [35, '*', 50, '*'],
				body: getPageHeader(order_info),
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
			...order_entry.map((entry) => {
				const { order_entry } = entry;
				const uniqueSizes = [
					...new Set(
						order_entry.map((item) => Number(item.size)).sort()
					),
				].sort((a, b) => a - b);

				// * garments info
				const ginfo = getGarmentInfo(entry, garments);

				// * special requirement info
				const srinfo = getSpecialReqInfo(entry, sr);

				const uniqueColor = () => {
					const uniqueColors = new Set();
					order_entry.forEach((item) => {
						uniqueColors.add(item.color);
					});

					return uniqueColors.size;
				};

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

				const chunkSize = 7;
				const chunkedArray = chunkArray(uniqueSizes, chunkSize);

				return [
					chunkedArray.map((chunk, index) => {
						let chunkTotal = 0;
						return {
							table: {
								widths: [
									50,
									67,
									...chunkedArray[0].map(() => '*'),
									// ...uniqueSizes.map(() => 20),
									'*',
								],
								body: [
									// Table Header
									...TableHeader({
										entry,
										srinfo,
										uniqueSizes: chunk,
									}),

									// Table Body
									...Object.keys(res)
										.map((style) =>
											res[style].map((color) => {
												const colorName =
													Object.keys(color)[0];
												const quantities =
													color[colorName];

												// * Slicing the quantities array for each chunk
												const slicedQuantities =
													quantities.slice(
														index * chunkSize,
														index * chunkSize +
															chunk.length
													);

												// * check if the chunk is not the 1st chunk and if the sliced quantities length is less than the chunk size
												if (
													index > 0 &&
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
															res[style].length,
														text: style,
														style: 'tableCell',
													},
													{
														text: colorName,
														style: 'tableCell',
													},
													...slicedQuantities.map(
														(qty) => ({
															text:
																qty === 0
																	? '-'
																	: qty,
															style: 'tableCell',
															alignment: 'right',
														})
													),
													{
														text: slicedQuantities.reduce(
															(acc, qty) =>
																Number(acc) +
																Number(qty),
															0
														),
														style: 'tableCell',
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
											style: 'tableFooter',
											alignment: 'Center',
										},
										{
											text: uniqueColor(),
											style: 'tableFooter',
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
													return total;
												})(), // Immediately invoke the function,
												style: 'tableFooter',
												alignment: 'right',
											};
										}),
										{
											text: chunkTotal.toFixed(2),
											style: 'tableFooter',
											alignment: 'right',
										},
									],

									// * Garments
									...(ginfo.length > 0 ||
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
															chunk.length + 2,
														text: [
															entry?.garment
																? entry?.garment
																: '', // Include garments if it exists
															garments &&
															(ginfo.length > 0 ||
																entry?.light_preference_name ||
																entry?.end_user_short_name)
																? ' / '
																: '', // Show separator if garments and at least one other value exists
															ginfo.length > 0
																? `(${ginfo?.join(', ')})`
																: '',
															ginfo.length > 0 &&
															(entry?.light_preference_name ||
																entry?.end_user_short_name)
																? ' / '
																: '', // Show separator if either light preference or end user exists after ginfo
															entry?.light_preference_name
																? entry?.light_preference_name
																: '',
															entry?.light_preference_name &&
															entry?.end_user_short_name
																? ' / '
																: '', // Show separator if both light preference and end user exist
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
														style: 'tableFooter',
														alignment: 'Center',
													},
													{
														colSpan:
															chunk.length + 2,
														text: entry?.remarks,
														style: 'tableFooter',
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
				];
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
								text: grandTotal(order_entry).toFixed(2),
								style: 'tableFooter',
								alignment: 'Center',
							},
						],
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
	// return pdfDocGenerator.download();

	return pdfDocGenerator;
}
