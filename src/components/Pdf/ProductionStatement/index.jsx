import { DEFAULT_FONT_SIZE, xMargin } from '@/components/Pdf/ui';
import { DEFAULT_A4_PAGE, getTable, TableHeader } from '@/components/Pdf/utils';
import { Pdf } from '@/ui/Others';

import pdfMake from '..';
import { getPageFooter, getPageHeader } from './utils';

const node = [
	getTable('party_name', 'Party'),
	getTable('type', 'Type'),
	getTable('marketing', 'Team'),
	getTable('order_number', 'O/N'),
	getTable('order_qty', 'Ord.Qty'),
	getTable('item_description', 'Item'),
	getTable('size', 'Size'),
	getTable('running_total_close_end_quantity', 'C/E', 'right'),
	getTable('running_total_open_end_quantity', 'O/E', 'right'),
	getTable('running_total_quantity', 'Total Qty', 'right'),
	getTable('company_price_dzn', 'Price', 'right'),
	getTable('value', 'Value', 'right'),
];
export default function Index(data, from, to) {
	const headerHeight = 80;
	let footerHeight = 50;
	const PdfData = data || [];
	let grandTotalCloseEnd = 0;
	let grandTotalOpenEnd = 0;
	let grandTotalQuantity = 0;
	let grandOpeningCloseEnd = 0;
	let grandOpeningOpenEnd = 0;
	let grandOpeningTotalQuantity = 0;
	let grandClosingCloseEnd = 0;
	let grandClosingOpenEnd = 0;
	let grandClosingTotalQuantity = 0;
	let grandClosingValue = 0;
	let grandOpeningValue = 0;
	let grandTotalValue = 0;
	PdfData?.forEach((item) => {
		let partyTotalCloseEnd = 0;
		let partyTotalOpenEnd = 0;
		let partyTotalQuantity = 0;
		let partyOpeningCloseEnd = 0;
		let partyOpeningOpenEnd = 0;
		let partyOpeningTotalQuantity = 0;
		let partyClosingCloseEnd = 0;
		let partyClosingOpenEnd = 0;
		let partyClosingTotalQuantity = 0;
		let partyClosingValue = 0;
		let partyOpeningValue = 0;
		let partyTotalValue = 0;

		item.orders?.forEach((orderItem, orderIndex) => {
			orderItem.items?.forEach((itemItem) => {
				const totalCloseEnd = itemItem.other?.reduce((total, item) => {
					return total + (item.running_total_close_end_quantity || 0);
				}, 0);
				partyTotalCloseEnd += totalCloseEnd;
				grandTotalCloseEnd += totalCloseEnd;

				const totalOpenEnd = itemItem.other?.reduce((total, item) => {
					return total + (item.running_total_open_end_quantity || 0);
				}, 0);
				partyTotalOpenEnd += totalOpenEnd;
				grandTotalOpenEnd += totalOpenEnd;
				const totalQuantity = itemItem.other?.reduce((total, item) => {
					return total + (item.running_total_quantity || 0);
				}, 0);
				partyTotalQuantity += totalQuantity;
				grandTotalQuantity += totalQuantity;
				const totalOpeningCloseEnd = itemItem.other?.reduce(
					(total, item) => {
						return (
							total + (item.opening_total_close_end_quantity || 0)
						);
					},
					0
				);
				partyOpeningCloseEnd += totalOpeningCloseEnd;
				grandOpeningCloseEnd += totalOpeningCloseEnd;
				const totalOpeningOpenEnd = itemItem.other?.reduce(
					(total, item) => {
						return (
							total + (item.opening_total_open_end_quantity || 0)
						);
					},
					0
				);
				partyOpeningOpenEnd += totalOpeningOpenEnd;
				grandOpeningOpenEnd += totalOpeningOpenEnd;
				const OpeningTotalQuantity = itemItem.other?.reduce(
					(total, item) => {
						return total + (item.opening_total_quantity || 0);
					},
					0
				);
				partyOpeningTotalQuantity += OpeningTotalQuantity;
				grandOpeningTotalQuantity += OpeningTotalQuantity;
				const totalClosingCloseEnd = itemItem.other?.reduce(
					(total, item) => {
						return (
							total + (item.closing_total_close_end_quantity || 0)
						);
					},
					0
				);
				partyClosingCloseEnd += totalClosingCloseEnd;
				grandClosingCloseEnd += totalClosingCloseEnd;
				const totalClosingOpenEnd = itemItem.other?.reduce(
					(total, item) => {
						return (
							total + (item.closing_total_open_end_quantity || 0)
						);
					},
					0
				);
				partyClosingOpenEnd += totalClosingOpenEnd;
				grandClosingOpenEnd += totalClosingOpenEnd;
				const CloseTotalQuantity = itemItem.other?.reduce(
					(total, item) => {
						return total + (item.closing_total_quantity || 0);
					},
					0
				);
				partyClosingTotalQuantity += CloseTotalQuantity;
				grandClosingTotalQuantity += CloseTotalQuantity;

				const totalValue = itemItem.other?.reduce((total, item) => {
					return (
						total +
						(itemItem.other?.reduce((total, item) => {
							return total + (item.running_total_value || 0);
						}, 0) || 0)
					);
				}, 0);
				partyTotalValue += totalValue;
				grandTotalValue += totalValue;
				const OpeningTotalValue = itemItem.other?.reduce(
					(total, item) => {
						return (
							total +
							(itemItem.other?.reduce((total, item) => {
								return total + (item.opening_total_value || 0);
							}, 0) || 0)
						);
					},
					0
				);
				partyOpeningValue += OpeningTotalValue;
				grandOpeningValue += OpeningTotalValue;
				const ClosingTotalValue = itemItem.other?.reduce(
					(total, item) => {
						return (
							total +
							(itemItem.other?.reduce((total, item) => {
								return total + (item.closing_total_value || 0);
							}, 0) || 0)
						);
					},
					0
				);
				partyClosingValue += ClosingTotalValue;
				grandClosingValue += ClosingTotalValue;

				itemItem.other.push({
					size: 'Current Total',
					running_total_close_end_quantity: totalCloseEnd,
					running_total_open_end_quantity: totalOpenEnd,
					running_total_quantity: totalQuantity,
					company_price_pcs: 1,
					running_total_value: totalValue,
				});
				itemItem.other.push({
					size: 'Opening Bal.',
					running_total_close_end_quantity: totalOpeningCloseEnd,
					running_total_open_end_quantity: totalOpeningOpenEnd,
					running_total_quantity: OpeningTotalQuantity,
					company_price_pcs: 1,
					running_total_value: OpeningTotalValue,
				});
				itemItem.other.push({
					size: 'Closing Bal.',
					running_total_close_end_quantity: totalClosingCloseEnd,
					running_total_open_end_quantity: totalClosingOpenEnd,
					running_total_quantity: CloseTotalQuantity,
					company_price_pcs: 1,
					running_total_value: ClosingTotalValue,
				});
				if (item.orders.length === orderIndex + 1) {
					itemItem.other.push({
						size: 'P.Current Total',
						running_total_close_end_quantity: partyTotalCloseEnd,
						running_total_open_end_quantity: partyTotalOpenEnd,
						running_total_quantity: partyTotalQuantity,
						company_price_pcs: 1,
						running_total_value: partyTotalValue,
					});

					itemItem.other.push({
						size: 'P.Opening Bal.',
						running_total_close_end_quantity: partyOpeningCloseEnd,
						running_total_open_end_quantity: partyOpeningOpenEnd,
						running_total_quantity: partyOpeningTotalQuantity,
						company_price_pcs: 1,
						running_total_value: partyOpeningValue,
					});
					itemItem.other.push({
						size: 'P.Closing Bal.',
						running_total_close_end_quantity: partyClosingCloseEnd,
						running_total_open_end_quantity: partyClosingOpenEnd,
						running_total_quantity: partyClosingTotalQuantity,
						company_price_pcs: 1,
						running_total_value: partyClosingValue,
					});
				}
			});
		});
	});

	const tableData = PdfData.flatMap((item) => {
		const typeRowSpan =
			item?.orders?.reduce((total, orders) => {
				return (
					total +
						orders.items?.reduce((itemTotal, item) => {
							return itemTotal + (item.other?.length || 1);
						}, 0) || 0
				);
			}, 0) || 0;

		return item?.orders?.flatMap((orderItem, orderIndex) => {
			const orderRowSpan =
				orderItem.items?.reduce((total, item) => {
					return total + (item.other?.length || 1);
				}, 0) || 0;

			return orderItem.items?.flatMap((itemItem, itemIndex) => {
				const itemRowSpan = itemItem.other?.length || 1;

				return itemItem.other?.map((otherItem) => ({
					party_name: {
						text: item.party_name,
						rowSpan: typeRowSpan,
					},
					type: {
						text: item.type,
						rowSpan: typeRowSpan,
					},
					marketing: {
						text: item.marketing_name,
						rowSpan: typeRowSpan,
					},
					order_number: {
						text: orderItem.order_number,
						rowSpan: orderRowSpan,
					},
					order_qty: {
						text: orderItem.total_quantity,
						rowSpan: orderRowSpan,
					},
					item_description: {
						text: itemItem.item_description,
						rowSpan: itemRowSpan,
					},
					size: {
						text:
							otherItem.size === 'Current Total' ||
							otherItem.size === 'Opening Bal.' ||
							otherItem.size === 'Closing Bal.' ||
							otherItem.size === 'P.Current Total' ||
							otherItem.size === 'P.Opening Bal.' ||
							otherItem.size === 'P.Closing Bal.'
								? otherItem.size
									? otherItem.size
									: '---'
								: `${otherItem.size.includes('-') ? `(${otherItem.size})` : otherItem.size} ${otherItem.unit}`,
						rowSpan: 1,
						bold:
							otherItem.size === 'Current Total' ||
							otherItem.size === 'Opening Bal.' ||
							otherItem.size === 'Closing Bal.' ||
							otherItem.size === 'P.Current Total' ||
							otherItem.size === 'P.Opening Bal.' ||
							otherItem.size === 'P.Closing Bal.'
								? true
								: false,
					},
					running_total_close_end_quantity: {
						text: otherItem.running_total_close_end_quantity,
						rowSpan: 1,
						bold:
							otherItem.size === 'Current Total' ||
							otherItem.size === 'Opening Bal.' ||
							otherItem.size === 'Closing Bal.' ||
							otherItem.size === 'P.Current Total' ||
							otherItem.size === 'P.Opening Bal.' ||
							otherItem.size === 'P.Closing Bal.'
								? true
								: false,
					},
					running_total_open_end_quantity: {
						text: otherItem.running_total_open_end_quantity,
						rowSpan: 1,
						bold:
							otherItem.size === 'Current Total' ||
							otherItem.size === 'Opening Bal.' ||
							otherItem.size === 'Closing Bal.' ||
							otherItem.size === 'P.Current Total' ||
							otherItem.size === 'P.Opening Bal.' ||
							otherItem.size === 'P.Closing Bal.'
								? true
								: false,
					},
					running_total_quantity: {
						text: otherItem.running_total_quantity,
						rowSpan: 1,

						bold:
							otherItem.size === 'Current Total' ||
							otherItem.size === 'Opening Bal.' ||
							otherItem.size === 'Closing Bal.' ||
							otherItem.size === 'P.Current Total' ||
							otherItem.size === 'P.Opening Bal.' ||
							otherItem.size === 'P.Closing Bal.'
								? true
								: false,
					},
					company_price_dzn: {
						text: otherItem.company_price_dzn
							? otherItem.company_price_dzn + '/DZN'
							: '---',
						rowSpan: 1,
						bold:
							otherItem.size === 'Current Total' ||
							otherItem.size === 'Opening Bal.' ||
							otherItem.size === 'Closing Bal.' ||
							otherItem.size === 'P.Current Total' ||
							otherItem.size === 'P.Opening Bal.' ||
							otherItem.size === 'P.Closing Bal.'
								? true
								: false,
					},
					value: {
						text: otherItem.running_total_value,

						rowSpan: 1,
						bold:
							otherItem.size === 'Current Total' ||
							otherItem.size === 'Opening Bal.' ||
							otherItem.size === 'Closing Bal.' ||
							otherItem.size === 'P.Current Total' ||
							otherItem.size === 'P.Opening Bal.' ||
							otherItem.size === 'P.Closing Bal.'
								? true
								: false,
					},
				}));
			});
		});
	});

	const pdfDocGenerator = pdfMake.createPdf({
		...DEFAULT_A4_PAGE({
			xMargin,
			headerHeight,
			footerHeight,
		}),
		pageOrientation: 'landscape',
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
					widths: [100, 40, 80, 50, 50, 70, 60, 45, 45, 45, 45, 45],
					body: [
						TableHeader(node),

						// Body
						...tableData?.map((item) =>
							node?.map((nodeItem) => {
								const cellData = nodeItem.field
									? item[nodeItem.field]
									: '---';
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
						[
							{
								text: 'Grand Current Total',
								bold: true,
								colSpan: 7,
							},
							{},
							{},
							{},
							{},
							{},
							{},

							{
								text: Number(grandTotalCloseEnd).toFixed(2),
								bold: true,
							},
							{
								text: Number(grandTotalOpenEnd).toFixed(2),
								bold: true,
							},

							{
								text: Number(grandTotalQuantity).toFixed(2),
								bold: true,
							},
							{},
							{
								text: Number(grandTotalValue).toFixed(2),
								bold: true,
							},
						],
						[
							{
								text: 'Grand Opening Total',
								bold: true,
								colSpan: 7,
							},
							{},
							{},
							{},
							{},
							{},
							{},

							{
								text: Number(grandOpeningCloseEnd).toFixed(2),
								bold: true,
							},
							{
								text: Number(grandOpeningOpenEnd).toFixed(2),
								bold: true,
							},

							{
								text: Number(grandOpeningTotalQuantity).toFixed(
									2
								),
								bold: true,
							},
							{},
							{
								text: Number(grandOpeningValue).toFixed(2),
								bold: true,
							},
						],
						[
							{
								text: 'Grand Closing Total',
								bold: true,
								colSpan: 7,
							},
							{},
							{},
							{},
							{},
							{},
							{},

							{
								text: Number(grandClosingCloseEnd).toFixed(2),
								bold: true,
							},
							{
								text: Number(grandClosingOpenEnd).toFixed(2),
								bold: true,
							},

							{
								text: Number(grandClosingTotalQuantity).toFixed(
									2
								),
								bold: true,
							},
							{},
							{
								text: Number(grandClosingValue).toFixed(2),
								bold: true,
							},
						],
					],
				},
			},
		],
	});

	return pdfDocGenerator;
}
