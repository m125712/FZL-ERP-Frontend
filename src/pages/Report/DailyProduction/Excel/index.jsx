import { ExcelConverter } from 'pdfmake-to-excel';

export default function Index(data, from, to) {
	const pdfData = data || [];

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
					if (itemIndex === orderItem.items.length - 1) {
						itemItem.other?.push({
							size: 'Order Wise Total',
							running_total_close_end_quantity:
								totalOrderWiseCloseEnd,
							running_total_open_end_quantity:
								totalOrderWiseOpenEnd,
							running_total_quantity: totalOrderWiseTotalQuantity,
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
					if (
						!itemItem.other?.find(
							(otherItem) => otherItem.size === 'Type Wise Total'
						) &&
						itemIndex === orderItem.items.length - 1 &&
						orderIndex === partyItem.orders.length - 1 &&
						partyIndex === item.parties.length - 1
					) {
						itemItem.other?.push({
							size: 'Type Wise Total',
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

		return item.parties?.flatMap((partyItem, partyIndex) => {
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
					return itemItem.other?.map((otherItem, otherIndex) => {
						return [
							{
								text: item.type,
							},

							{
								text: partyItem.party_name,
							},
							{
								text: orderItem.order_number,
							},
							{
								text: itemItem.item_description,
							},

							{
								text: otherItem.size,
							},
							{
								text: otherItem.running_total_close_end_quantity,
							},
							{
								text: otherItem.running_total_open_end_quantity,
							},
							{
								text: otherItem.running_total_quantity,
							},
						];
					});
				});
			});
		});
	});
	const grandTotalCloseEnd = tableData.reduce((total, item) => {
		return total + (item[5]?.text || 0);
	}, 0);

	const grandTotalOpenEnd = tableData.reduce((total, item) => {
		return total + (item[6]?.text || 0);
	}, 0);

	const grandTotalQuantity = tableData.reduce((total, item) => {
		return total + (item[7]?.text || 0);
	}, 0);

	tableData.push([
		{
			text: 'Grand Total',
			colSpan: 5,
		},
		{ text: '' },
		{ text: '' },
		{ text: '' },
		{ text: '' },
		{
			text: grandTotalCloseEnd,
			rowSpan: 1,
		},
		{
			text: grandTotalOpenEnd,
			rowSpan: 1,
		},
		{
			text: grandTotalQuantity,
			rowSpan: 1,
		},
	]);
	tableData.unshift([
		{
			text: 'Type',
		},
		{
			text: 'Party',
		},
		{
			text: 'O/N',
		},
		{
			text: 'Item',
		},
		{
			text: 'Size',
		},
		{
			text: 'C/E',
		},
		{
			text: 'O/E',
		},
		{
			text: 'Total Qty',
		},
	]);
	const content = {
		title: 'Daily Production Report',
		data: tableData,
	};

	function downloadFile() {
		const exporter = new ExcelConverter(
			`Daily Production Report-${from}-${to}`,
			content,
			{
				defaultOptions: { defaultColWidth: 20 },
			}
		);
		exporter.downloadExcel();
	}
	return downloadFile();
}
