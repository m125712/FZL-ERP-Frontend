import { ExcelConverter } from 'pdfmake-to-excel';

export default function Index(data, from, to) {
	const PdfData = data || [];
	const title = [
		'Current Total',
		'Opening Bal.',
		'Closing Bal.',
		'P.Current Total',
		'P.Opening Bal.',
		'P.Closing Bal.',
	];
	let orderRowSpan = 0;
	let typeRowSpan = 0;
	let itemRowSpan = 0;

	const nextIndex = {
		type: 0,
		order: 0,
		item: 0,
	};
	const grandTotal = {
		current: {
			close_end_quantity: 0,
			open_end_quantity: 0,
			quantity: 0,
			value: 0,
		},
		closing: {
			close_end_quantity: 0,
			open_end_quantity: 0,
			quantity: 0,
			value: 0,
		},
		opening: {
			close_end_quantity: 0,
			open_end_quantity: 0,
			quantity: 0,
			value: 0,
		},
	};

	PdfData?.forEach((item) => {
		const partyTotal = {
			current: {
				close_end_quantity: 0,
				open_end_quantity: 0,
				quantity: 0,
				value: 0,
			},
			closing: {
				close_end_quantity: 0,
				open_end_quantity: 0,
				quantity: 0,
				value: 0,
			},
			opening: {
				close_end_quantity: 0,
				open_end_quantity: 0,
				quantity: 0,
				value: 0,
			},
		};

		item.orders?.forEach((orderItem, orderIndex) => {
			orderItem.items?.forEach((itemItem, itemIndex) => {
				const totalCloseEnd = itemItem.other?.reduce((total, item) => {
					return total + (item.running_total_close_end_quantity || 0);
				}, 0);

				partyTotal.current.close_end_quantity += totalCloseEnd;
				grandTotal.current.close_end_quantity += totalCloseEnd;
				const totalOpenEnd = itemItem.other?.reduce((total, item) => {
					return total + (item.running_total_open_end_quantity || 0);
				}, 0);
				partyTotal.current.open_end_quantity += totalOpenEnd;
				grandTotal.current.open_end_quantity += totalOpenEnd;
				const totalQuantity = itemItem.other?.reduce((total, item) => {
					return total + (item.running_total_quantity || 0);
				}, 0);

				partyTotal.current.quantity += totalQuantity;
				grandTotal.current.quantity += totalQuantity;
				const totalOpeningCloseEnd = itemItem.other?.reduce(
					(total, item) => {
						return (
							total + (item.opening_total_close_end_quantity || 0)
						);
					},
					0
				);

				partyTotal.opening.close_end_quantity += totalOpeningCloseEnd;
				grandTotal.opening.close_end_quantity += totalOpeningCloseEnd;
				const totalOpeningOpenEnd = itemItem.other?.reduce(
					(total, item) => {
						return (
							total + (item.opening_total_open_end_quantity || 0)
						);
					},
					0
				);

				partyTotal.opening.open_end_quantity += totalOpeningOpenEnd;
				grandTotal.opening.open_end_quantity += totalOpeningOpenEnd;
				const OpeningTotalQuantity = itemItem.other?.reduce(
					(total, item) => {
						return total + (item.opening_total_quantity || 0);
					},
					0
				);

				partyTotal.opening.quantity += OpeningTotalQuantity;
				grandTotal.opening.quantity += OpeningTotalQuantity;
				const totalClosingCloseEnd = itemItem.other?.reduce(
					(total, item) => {
						return (
							total + (item.closing_total_close_end_quantity || 0)
						);
					},
					0
				);
				partyTotal.closing.close_end_quantity += totalClosingCloseEnd;
				grandTotal.closing.close_end_quantity += totalClosingCloseEnd;
				const totalClosingOpenEnd = itemItem.other?.reduce(
					(total, item) => {
						return (
							total + (item.closing_total_open_end_quantity || 0)
						);
					},
					0
				);

				partyTotal.closing.open_end_quantity += totalClosingOpenEnd;
				grandTotal.closing.open_end_quantity += totalClosingOpenEnd;
				const CloseTotalQuantity = itemItem.other?.reduce(
					(total, item) => {
						return total + (item.closing_total_quantity || 0);
					},
					0
				);
				partyTotal.closing.quantity += CloseTotalQuantity;
				grandTotal.closing.quantity += CloseTotalQuantity;
				const totalValue = itemItem.other?.reduce((total, item) => {
					return (
						total +
						(itemItem.other?.reduce((total, item) => {
							return total + (item.running_total_value || 0);
						}, 0) || 0)
					);
				}, 0);
				partyTotal.current.value += totalValue;
				grandTotal.current.value += totalValue;
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

				partyTotal.opening.value += OpeningTotalValue;
				grandTotal.opening.value += OpeningTotalValue;
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
				partyTotal.closing.value += ClosingTotalValue;
				grandTotal.closing.value += ClosingTotalValue;
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
				if (
					item.orders.length === orderIndex + 1 &&
					itemIndex + 1 === orderItem.items.length
				) {
					itemItem.other.push({
						size: 'P.Current Total',
						running_total_close_end_quantity:
							partyTotal.current.close_end_quantity,
						running_total_open_end_quantity:
							partyTotal.current.open_end_quantity,
						running_total_quantity: partyTotal.current.quantity,
						company_price_pcs: 1,
						running_total_value: partyTotal.current.value,
					});

					itemItem.other.push({
						size: 'P.Opening Bal.',
						running_total_close_end_quantity:
							partyTotal.opening.close_end_quantity,
						running_total_open_end_quantity:
							partyTotal.opening.open_end_quantity,
						running_total_quantity: partyTotal.opening.quantity,
						company_price_pcs: 1,
						running_total_value: partyTotal.opening.value,
					});
					itemItem.other.push({
						size: 'P.Closing Bal.',
						running_total_close_end_quantity:
							partyTotal.closing.close_end_quantity,
						running_total_open_end_quantity:
							partyTotal.closing.open_end_quantity,
						running_total_quantity: partyTotal.closing.quantity,
						company_price_pcs: 1,
						running_total_value: partyTotal.closing.value,
					});
				}
			});
		});
	});

	const tableData = PdfData.flatMap((item, idx) => {
		if (idx !== 0) {
			nextIndex.type += typeRowSpan;
		}
		typeRowSpan =
			item?.orders?.reduce((total, orders) => {
				return (
					total +
						orders.items?.reduce((itemTotal, item) => {
							return itemTotal + (item.other?.length || 1);
						}, 0) || 0
				);
			}, 0) || 0;

		return item?.orders?.flatMap((orderItem, orderIndex) => {
			nextIndex.order += orderRowSpan;

			orderRowSpan =
				orderItem.items?.reduce((total, item) => {
					return total + (item.other?.length || 1);
				}, 0) || 0;

			return orderItem.items?.flatMap((itemItem, itemIndex) => {
				nextIndex.item += itemRowSpan;

				itemRowSpan = itemItem.other?.length || 1;

				return itemItem.other?.map((otherItem, index) => {
					const flatIndex =
						index +
						itemItem.other.length * itemIndex +
						itemItem.other.length *
							orderItem.items.length *
							orderIndex +
						idx * item.orders.length;
					itemItem.other.length * orderItem.items.length;
					return [
						index === 0 && orderIndex === 0 && itemIndex === 0
							? {
									text: item.party_name,
									rowSpan: typeRowSpan,
								}
							: {
									text: '',
								},
						index === 0 && orderIndex === 0 && itemIndex === 0
							? {
									text: item.type,
									rowSpan: typeRowSpan,
								}
							: {
									text: '',
								},
						index === 0 && orderIndex === 0 && itemIndex === 0
							? {
									text: item.marketing_name,
									rowSpan: typeRowSpan,
								}
							: {
									text: '',
								},
						index === 0 && itemIndex === 0
							? {
									text: orderItem.order_number,
									rowSpan: orderRowSpan,
								}
							: {
									text: '',
								},
						index === 0 && itemIndex === 0
							? {
									text: orderItem.total_quantity,
									rowSpan: orderRowSpan,
								}
							: {
									text: '',
								},
						index === 0
							? {
									text: itemItem.item_description,
									rowSpan: itemRowSpan,
								}
							: {
									text: '',
								},
						{
							text: title.includes(otherItem.size)
								? otherItem.size
									? otherItem.size
									: '---'
								: `${otherItem.size.includes('-') ? `(${otherItem.size})` : otherItem.size} ${otherItem.unit}`,
						},
						{
							text: String(
								otherItem.running_total_close_end_quantity
							),
						},
						{
							text: String(
								otherItem.running_total_open_end_quantity
							),
						},
						{
							text: String(otherItem.running_total_quantity),
						},
						{
							text: otherItem.company_price_dzn
								? String(otherItem.company_price_dzn + '/DZN')
								: '---',
						},
						{
							text: String(
								Number(otherItem.running_total_value).toFixed(3)
							),
						},
					];
				});
			});
		});
	});
	const content = {
		title: 'Export Report',
		data: tableData,
	};

	function downloadFile() {
		const exporter = new ExcelConverter('Export test', content, {
			defaultOptions: { defaultColWidth: 20 },
		});
		exporter.downloadExcel();
	}
	return downloadFile();
}
