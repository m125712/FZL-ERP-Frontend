import { get } from 'react-hook-form';



import { DEFAULT_FONT_SIZE, tableLayoutStyle, xMargin } from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';



import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';


const node = [
	getTable('type', 'Type'),
	getTable('party_name', 'Party'),
	getTable('order_number', 'O/N'),
	getTable('item_description', 'Item'),
	getTable('size', 'Size'),
	getTable('running_total_close_end_quantity', 'C/E'),
	getTable('running_total_open_end_quantity', 'O/E'),
	getTable('running_total_quantity', 'Total Qty'),
];
export default function Index(data, from) {
	const headerHeight = 80;
	let footerHeight = 50;
	const tableData = data.flatMap((item) => {
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

		return item.parties?.flatMap((partyItem,) => {
			let totalPartyWiseCloseEnd = 0;
			let totalPartyWiseOpenEnd = 0;
			let totalPartyWiseTotalQuantity = 0;
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

				return orderItem.items?.flatMap((itemItem, itemIndex) => {
					const itemRowSpan = itemItem.other?.length || 1;
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
					totalPartyWiseCloseEnd += totalCloseEnd;
					totalPartyWiseOpenEnd += totalOpenEnd;
					totalPartyWiseTotalQuantity += totalQuantity;
					if (
						!itemItem.other?.find(
							(otherItem) => otherItem.size === 'Order Wise Total'
						)
					) {
						itemItem.other?.push({
							size: 'Order Wise Total',
							running_total_close_end_quantity: totalCloseEnd,
							running_total_open_end_quantity: totalOpenEnd,
							running_total_quantity: totalQuantity,
						});
					}
					if (
						!itemItem.other?.find(
							(otherItem) => otherItem.size === 'Party Wise Total'
						) &&
						itemIndex === orderItem.items.length - 1 &&
						orderIndex === partyItem.orders.length - 1
					) {
						itemItem.other?.push({
							size: 'Party Wise Total',
							running_total_close_end_quantity:
								totalPartyWiseCloseEnd,
							running_total_open_end_quantity:
								totalPartyWiseOpenEnd,
							running_total_quantity: totalPartyWiseTotalQuantity,
						});
					}

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
						size: {
							text: otherItem.size,
							rowSpan: 1,
							bold:
								otherItem.size === 'Order Wise Total' ||
								otherItem.size === 'Party Wise Total'
									? true
									: false,
						},
						running_total_close_end_quantity: {
							text: otherItem.running_total_close_end_quantity,
							rowSpan: 1,
							bold:
								otherItem.size === 'Order Wise Total' ||
								otherItem.size === 'Party Wise Total'
									? true
									: false,
						},
						running_total_open_end_quantity: {
							text: otherItem.running_total_open_end_quantity,
							rowSpan: 1,
							bold:
								orderItem.order_number === 'Order Wise Total' ||
								partyItem.party_name === 'Party Wise Total'
									? true
									: false,
						},
						running_total_quantity: {
							text: otherItem.running_total_quantity,
							rowSpan: 1,

							bold:
								otherItem.size === 'Order Wise Total' ||
								otherItem.size === 'Party Wise Total'
									? true
									: false,
						},
					}));
				});
			});
		});
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
					widths: [40, 100, 50, 60, 70, 45, 45, 45],
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