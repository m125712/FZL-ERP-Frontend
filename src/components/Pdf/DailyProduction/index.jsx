import { DEFAULT_FONT_SIZE, xMargin } from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('type', 'Type'),
	getTable('marketing_name', 'Marketing'), // Added marketing column
	getTable('party_name', 'Party'),
	getTable('order_number', 'O/N'),
	getTable('item_description', 'Item'),
	getTable('color', 'Color'),
	getTable('size', 'Size'),
	getTable('running_total_close_end_quantity', 'C/E'),
	getTable('running_total_open_end_quantity', 'O/E'),
	getTable('running_total_quantity', 'Total Qty'),
];

export default function Index(data, from, to) {
	const headerHeight = 80;
	let footerHeight = 50;

	const pdfData = data || [];
	const title = [
		'Order Wise Total',
		'Party Wise Total',
		'Marketing Wise Total',
		'Type Wise Total',
	];

	pdfData.forEach((item) => {
		let totalTypeWiseCloseEnd = 0;
		let totalTypeWiseOpenEnd = 0;
		let totalTypeWiseTotalQuantity = 0;

		return item.marketing?.forEach((marketingItem, marketingIndex) => {
			let totalMarketingWiseCloseEnd = 0;
			let totalMarketingWiseOpenEnd = 0;
			let totalMarketingWiseTotalQuantity = 0;

			marketingItem.parties?.forEach((partyItem, partyIndex) => {
				let totalPartyWiseCloseEnd = 0;
				let totalPartyWiseOpenEnd = 0;
				let totalPartyWiseTotalQuantity = 0;

				partyItem.orders?.forEach((orderItem, orderIndex) => {
					let totalOrderWiseCloseEnd = 0;
					let totalOrderWiseOpenEnd = 0;
					let totalOrderWiseTotalQuantity = 0;

					orderItem.items?.forEach((itemItem, itemIndex) => {
						const totalCloseEnd = itemItem.other?.reduce(
							(total, item) => {
								return (
									total +
									(item.running_total_close_end_quantity || 0)
								);
							},
							0
						);
						const totalOpenEnd = itemItem.other?.reduce(
							(total, item) => {
								return (
									total +
									(item.running_total_open_end_quantity || 0)
								);
							},
							0
						);
						const totalQuantity = itemItem.other?.reduce(
							(total, item) => {
								return (
									total + (item.running_total_quantity || 0)
								);
							},
							0
						);

						totalOrderWiseCloseEnd += totalCloseEnd;
						totalOrderWiseOpenEnd += totalOpenEnd;
						totalOrderWiseTotalQuantity += totalQuantity;
						totalPartyWiseCloseEnd += totalCloseEnd;
						totalPartyWiseOpenEnd += totalOpenEnd;
						totalPartyWiseTotalQuantity += totalQuantity;
						totalMarketingWiseCloseEnd += totalCloseEnd;
						totalMarketingWiseOpenEnd += totalOpenEnd;
						totalMarketingWiseTotalQuantity += totalQuantity;
						totalTypeWiseCloseEnd += totalCloseEnd;
						totalTypeWiseOpenEnd += totalOpenEnd;
						totalTypeWiseTotalQuantity += totalQuantity;

						// Add Order Wise Total
						if (
							itemIndex === orderItem.items.length - 1 &&
							!itemItem.other?.find(
								(otherItem) =>
									otherItem.color === 'Order Wise Total'
							)
						) {
							itemItem.other?.push({
								color: 'Order Wise Total',
								size: '',
								running_total_close_end_quantity:
									totalOrderWiseCloseEnd,
								running_total_open_end_quantity:
									totalOrderWiseOpenEnd,
								running_total_quantity:
									totalOrderWiseTotalQuantity,
							});
						}

						// Add Party Wise Total
						if (
							!itemItem.other?.find(
								(otherItem) =>
									otherItem.color === 'Party Wise Total'
							) &&
							itemIndex === orderItem.items.length - 1 &&
							orderIndex === partyItem.orders.length - 1
						) {
							itemItem.other?.push({
								color: 'Party Wise Total',
								size: '',
								running_total_close_end_quantity:
									totalPartyWiseCloseEnd,
								running_total_open_end_quantity:
									totalPartyWiseOpenEnd,
								running_total_quantity:
									totalPartyWiseTotalQuantity,
							});
						}

						// Add Marketing Wise Total
						if (
							!itemItem.other?.find(
								(otherItem) =>
									otherItem.color === 'Marketing Wise Total'
							) &&
							itemIndex === orderItem.items.length - 1 &&
							orderIndex === partyItem.orders.length - 1 &&
							partyIndex === marketingItem.parties.length - 1
						) {
							itemItem.other?.push({
								color: 'Marketing Wise Total',
								size: '',
								running_total_close_end_quantity:
									totalMarketingWiseCloseEnd,
								running_total_open_end_quantity:
									totalMarketingWiseOpenEnd,
								running_total_quantity:
									totalMarketingWiseTotalQuantity,
							});
						}

						// Add Type Wise Total
						if (
							!itemItem.other?.find(
								(otherItem) =>
									otherItem.color === 'Type Wise Total'
							) &&
							itemIndex === orderItem.items.length - 1 &&
							orderIndex === partyItem.orders.length - 1 &&
							partyIndex === marketingItem.parties.length - 1 &&
							marketingIndex === item.marketing.length - 1
						) {
							itemItem.other?.push({
								color: 'Type Wise Total',
								size: '',
								running_total_close_end_quantity:
									totalTypeWiseCloseEnd,
								running_total_open_end_quantity:
									totalTypeWiseOpenEnd,
								running_total_quantity:
									totalTypeWiseTotalQuantity,
							});
						}
					});
				});
			});
		});
	});

	const tableData = pdfData.flatMap((item) => {
		const typeRowSpan =
			item.marketing?.reduce((total, marketing) => {
				return (
					total +
						marketing.parties?.reduce((partyTotal, parties) => {
							return (
								partyTotal +
									parties.orders?.reduce(
										(orderTotal, order) => {
											return (
												orderTotal +
													order.items?.reduce(
														(itemTotal, item) => {
															return (
																itemTotal +
																(item.other
																	?.length ||
																	1)
															);
														},
														0
													) || 0
											);
										},
										0
									) || 0
							);
						}, 0) || 0
				);
			}, 0) || 0;

		return item.marketing?.flatMap((marketingItem) => {
			const marketingRowSpan =
				marketingItem.parties?.reduce((total, parties) => {
					return (
						total +
							parties.orders?.reduce((orderTotal, order) => {
								return (
									orderTotal +
										order.items?.reduce(
											(itemTotal, item) => {
												return (
													itemTotal +
													(item.other?.length || 1)
												);
											},
											0
										) || 0
								);
							}, 0) || 0
					);
				}, 0) || 0;

			return marketingItem.parties?.flatMap((partyItem) => {
				const partyRowSpan =
					partyItem.orders?.reduce((total, orders) => {
						return (
							total +
								orders.items?.reduce((itemTotal, item) => {
									return (
										itemTotal + (item.other?.length || 1)
									);
								}, 0) || 0
						);
					}, 0) || 0;

				return partyItem.orders?.flatMap((orderItem) => {
					const orderRowSpan =
						orderItem.items?.reduce((total, item) => {
							return total + (item.other?.length || 1);
						}, 0) || 0;

					return orderItem.items?.flatMap((itemItem) => {
						const itemRowSpan = itemItem.other?.length || 1;
						return itemItem.other?.map((otherItem) => ({
							type: {
								text: item.type,
								rowSpan: typeRowSpan,
							},
							marketing_name: {
								text: marketingItem.marketing_name,
								rowSpan: marketingRowSpan,
							},
							party_name: {
								text: partyItem.party_name,
								rowSpan: partyRowSpan,
							},
							order_number: {
								text: orderItem.order_number,
								rowSpan: orderRowSpan,
							},
							item_description: {
								text: itemItem.item_description,
								rowSpan: itemRowSpan,
							},
							color: {
								text: otherItem.color,
								rowSpan: 1,
								bold: title.includes(otherItem.color)
									? true
									: false,
								colSpan: title.includes(otherItem.color)
									? 2
									: 1,
							},
							size: {
								text: otherItem.size,
								rowSpan: 1,
								bold: title.includes(otherItem.color)
									? true
									: false,
							},
							running_total_close_end_quantity: {
								text: otherItem.running_total_close_end_quantity,
								rowSpan: 1,
								bold: title.includes(otherItem.color)
									? true
									: false,
							},
							running_total_open_end_quantity: {
								text: otherItem.running_total_open_end_quantity,
								rowSpan: 1,
								bold: title.includes(otherItem.color)
									? true
									: false,
							},
							running_total_quantity: {
								text: otherItem.running_total_quantity,
								rowSpan: 1,
								bold: title.includes(otherItem.color)
									? true
									: false,
							},
						}));
					});
				});
			});
		});
	});

	// Rest of your grand total calculations remain the same
	const grandTotalCloseEnd = tableData.reduce((total, item) => {
		if (title.includes(item.size.text) || item.size.text === '')
			return total;
		return total + (item.running_total_close_end_quantity?.text || 0);
	}, 0);

	const grandTotalOpenEnd = tableData.reduce((total, item) => {
		if (title.includes(item.size.text) || item.size.text === '')
			return total;
		return total + (item.running_total_open_end_quantity?.text || 0);
	}, 0);

	const grandTotalQuantity = tableData.reduce((total, item) => {
		if (title.includes(item.size.text) || item.size.text === '')
			return total;
		return total + (item.running_total_quantity?.text || 0);
	}, 0);

	// Continue with your existing grand total calculations and PDF generation...
	const grandZipperTotalCloseEnd = tableData.reduce((total, item) => {
		if (
			title.includes(item.size.text) ||
			item.size.text === '' ||
			item.type.text === 'Thread'
		)
			return total;

		return total + (item.running_total_close_end_quantity?.text || 0);
	}, 0);

	const grandZipperTotalOpenEnd = tableData.reduce((total, item) => {
		if (
			title.includes(item.size.text) ||
			item.size.text === '' ||
			item.type.text === 'Thread'
		)
			return total;

		return total + (item.running_total_open_end_quantity?.text || 0);
	}, 0);

	const grandZipperTotalQuantity = tableData.reduce((total, item) => {
		if (
			title.includes(item.size.text) ||
			item.size.text === '' ||
			item.type.text === 'Thread'
		)
			return total;

		return total + (Number(item.running_total_quantity?.text) || 0);
	}, 0);

	const grandThreadTotalCloseEnd = tableData.reduce((total, item) => {
		if (
			title.includes(item.size.text) ||
			item.size.text === '' ||
			item.type.text !== 'Thread'
		)
			return total;

		return total + (item.running_total_close_end_quantity?.text || 0);
	}, 0);

	const grandThreadTotalOpenEnd = tableData.reduce((total, item) => {
		if (
			title.includes(item.size.text) ||
			item.size.text === '' ||
			item.type.text !== 'Thread'
		)
			return total;

		return total + (item.running_total_open_end_quantity?.text || 0);
	}, 0);

	const grandThreadTotalQuantity = tableData.reduce((total, item) => {
		if (
			title.includes(item.size.text) ||
			item.size.text === '' ||
			item.type.text !== 'Thread'
		)
			return total;

		return total + (Number(item.running_total_quantity?.text) || 0);
	}, 0);

	const threadIndex = tableData.findIndex(
		(item) => item.type.text === 'Thread'
	);

	if (threadIndex > -1) {
		tableData.splice(threadIndex, 0, {
			type: {
				text: 'Grand Total Zipper',
				colSpan: 7, // Updated colSpan for marketing column
				bold: true,
			},
			marketing_name: { text: '', rowSpan: 1 },
			party_name: { text: '', rowSpan: 1 },
			order_number: { text: '', rowSpan: 1 },
			item_description: { text: '', rowSpan: 1 },
			color: { text: '', rowSpan: 1 },
			size: { text: '', rowSpan: 1 },
			running_total_close_end_quantity: {
				text: grandZipperTotalCloseEnd,
				rowSpan: 1,
				bold: true,
			},
			running_total_open_end_quantity: {
				text: grandZipperTotalOpenEnd,
				rowSpan: 1,
				bold: true,
			},
			running_total_quantity: {
				text: grandZipperTotalQuantity,
				rowSpan: 1,
				bold: true,
			},
		});
	}

	tableData.push({
		type: {
			text: 'Grand Thread Total',
			colSpan: 7, // Updated colSpan for marketing column
			bold: true,
		},
		marketing_name: { text: '', rowSpan: 1 },
		party_name: { text: '', rowSpan: 1 },
		order_number: { text: '', rowSpan: 1 },
		item_description: { text: '', rowSpan: 1 },
		color: { text: '', rowSpan: 1 },
		size: { text: '', rowSpan: 1 },
		running_total_close_end_quantity: {
			text: grandThreadTotalCloseEnd,
			rowSpan: 1,
			bold: true,
		},
		running_total_open_end_quantity: {
			text: grandThreadTotalOpenEnd,
			rowSpan: 1,
			bold: true,
		},
		running_total_quantity: {
			text: grandThreadTotalQuantity,
			rowSpan: 1,
			bold: true,
		},
	});

	tableData.push({
		type: {
			text: 'Grand Total',
			colSpan: 7, // Updated colSpan for marketing column
			bold: true,
		},
		marketing_name: { text: '', rowSpan: 1 },
		party_name: { text: '', rowSpan: 1 },
		order_number: { text: '', rowSpan: 1 },
		item_description: { text: '', rowSpan: 1 },
		color: { text: '', rowSpan: 1 },
		size: { text: '', rowSpan: 1 },
		running_total_close_end_quantity: {
			text: grandTotalCloseEnd,
			rowSpan: 1,
			bold: true,
		},
		running_total_open_end_quantity: {
			text: grandTotalOpenEnd,
			rowSpan: 1,
			bold: true,
		},
		running_total_quantity: {
			text: grandTotalQuantity,
			rowSpan: 1,
			bold: true,
		},
	});

	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_A4_PAGE({
			xMargin,
			headerHeight,
			footerHeight,
		}),

		header: {
			table: getPageHeader(from, to),
			layout: 'noBorders',
			margin: [xMargin, 30, xMargin, 0],
		},
		footer: (currentPage, pageCount) => ({
			table: getPageFooter({
				currentPage,
				pageCount,
			}),
			margin: [xMargin, 2],
			fontSize: DEFAULT_FONT_SIZE - 2,
		}),
		content: [
			{
				table: {
					headerRows: 1,
					widths: [25, 50, 60, 40, 60, 60, 40, 40, 40, 40], // Updated widths for marketing column
					body: [
						TableHeader(node),

						// Body
						...tableData.map((item) =>
							node.map((nodeItem) => {
								const cellData = item[nodeItem.field];
								return {
									text: cellData?.text || cellData,
									style: nodeItem.cellStyle,
									alignment: nodeItem.alignment,
									rowSpan: cellData?.rowSpan,
									colSpan: cellData?.colSpan,
									bold: cellData?.bold,
								};
							})
						),
					],
				},
			},
		],
	});

	return pdfDocGenerator;
}
