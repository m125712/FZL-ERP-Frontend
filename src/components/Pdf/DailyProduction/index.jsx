import { DEFAULT_FONT_SIZE, xMargin } from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('type', 'Type'),
	getTable('party_name', 'Party'),
	getTable('order_number', 'O/N'),
	getTable('item_description', 'Item'),
	getTable('color', 'Color'),
	getTable('size', 'Size'),
	getTable('running_total_close_end_quantity', 'C/E'),
	getTable('running_total_open_end_quantity', 'O/E'),
	getTable('running_total_quantity', 'Total Qty'),
];
export default function Index(data, from) {
	const headerHeight = 80;
	let footerHeight = 50;

	const pdfData = data || [];
	const title = ['Order Wise Total', 'Party Wise Total', 'Type Wise Total'];

	pdfData.forEach((item, index) => {
		let totalTypeWiseCloseEnd = 0;
		let totalTypeWiseOpenEnd = 0;
		let totalTypeWiseTotalQuantity = 0;
		return item.parties?.forEach((partyItem, partyIndex) => {
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
							return total + (item.running_total_quantity || 0);
						},
						0
					);
					totalOrderWiseCloseEnd += totalCloseEnd;
					totalOrderWiseOpenEnd += totalOpenEnd;
					totalOrderWiseTotalQuantity += totalQuantity;
					totalPartyWiseCloseEnd += totalCloseEnd;
					totalPartyWiseOpenEnd += totalOpenEnd;
					totalPartyWiseTotalQuantity += totalQuantity;
					totalTypeWiseCloseEnd += totalCloseEnd;
					totalTypeWiseOpenEnd += totalOpenEnd;
					totalTypeWiseTotalQuantity += totalQuantity;
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
							running_total_quantity: totalOrderWiseTotalQuantity,
						});
					}
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
							running_total_quantity: totalPartyWiseTotalQuantity,
						});
					}
					if (
						!itemItem.other?.find(
							(otherItem) => otherItem.color === 'Type Wise Total'
						) &&
						itemIndex === orderItem.items.length - 1 &&
						orderIndex === partyItem.orders.length - 1 &&
						partyIndex === item.parties.length - 1
					) {
						itemItem.other?.push({
							color: 'Type Wise Total',
							size: '',
							running_total_close_end_quantity:
								totalTypeWiseCloseEnd,
							running_total_open_end_quantity:
								totalTypeWiseOpenEnd,
							running_total_quantity: totalTypeWiseTotalQuantity,
						});
					}
				});
			});
		});
	});

	const tableData = pdfData.flatMap((item) => {
		const typeRowSpan =
			item.parties?.reduce((total, parties) => {
				return (
					total +
						parties.orders?.reduce((orderTotal, order) => {
							return (
								orderTotal +
									order.items?.reduce((itemTotal, item) => {
										return (
											itemTotal +
											(item.other?.length || 1)
										);
									}, 0) || 0
							);
						}, 0) || 0
				);
			}, 0) || 0;

		return item.parties?.flatMap((partyItem) => {
			const partyRowSpan =
				partyItem.orders?.reduce((total, orders) => {
					return (
						total +
							orders.items?.reduce((itemTotal, item) => {
								return itemTotal + (item.other?.length || 1);
							}, 0) || 0
					);
				}, 0) || 0;

			return partyItem.orders?.flatMap((orderItem, orderIndex) => {
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
							colSpan: title.includes(otherItem.color) ? 2 : 1,
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

	tableData.push({
		type: {
			text: 'Grand Total',
			colSpan: 6,
			bold: true,
		},
		party_name: { text: '', rowSpan: 1 },
		order_number: { text: '', rowSpan: 1 },
		item_description: { text: '', rowSpan: 1 },
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
			table: getPageHeader(from),
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
					widths: [40, 100, 50, 60, 40, 70, 30, 20, 40],
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
