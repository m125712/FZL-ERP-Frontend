import { ExcelConverter } from 'pdfmake-to-excel';

export default function Index(data, from, to) {
	const pdfData = data || [];

	const tableData = pdfData.flatMap((item) => {
		return item.marketing?.flatMap((marketingItem) => {
			return marketingItem.parties?.flatMap((partyItem) => {
				return partyItem.orders?.flatMap((orderItem) => {
					return orderItem.items?.flatMap((itemItem) => {
						return itemItem.other?.map((otherItem) => {
							return [
								{
									text: item.type,
								},
								{
									text: marketingItem.marketing_name,
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
									text: otherItem.color,
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
	});

	// Calculate grand totals from original data
	const grandTotalCloseEnd = tableData.reduce((total, item) => {
		return total + (Number(item[7]?.text) || 0);
	}, 0);

	const grandTotalOpenEnd = tableData.reduce((total, item) => {
		return total + (Number(item[8]?.text) || 0);
	}, 0);

	const grandTotalQuantity = tableData.reduce((total, item) => {
		return total + (Number(item[9]?.text) || 0);
	}, 0);

	// Calculate zipper and thread totals separately
	const grandZipperTotalCloseEnd = tableData.reduce((total, item) => {
		return (
			total +
			(item[0]?.text !== 'Thread' ? Number(item[7]?.text) || 0 : 0)
		);
	}, 0);

	const grandZipperTotalOpenEnd = tableData.reduce((total, item) => {
		return (
			total +
			(item[0]?.text !== 'Thread' ? Number(item[8]?.text) || 0 : 0)
		);
	}, 0);

	const grandZipperTotalQuantity = tableData.reduce((total, item) => {
		return (
			total +
			(item[0]?.text !== 'Thread' ? Number(item[9]?.text) || 0 : 0)
		);
	}, 0);

	const grandThreadTotalCloseEnd = tableData.reduce((total, item) => {
		return (
			total +
			(item[0]?.text === 'Thread' ? Number(item[7]?.text) || 0 : 0)
		);
	}, 0);

	const grandThreadTotalOpenEnd = tableData.reduce((total, item) => {
		return (
			total +
			(item[0]?.text === 'Thread' ? Number(item[8]?.text) || 0 : 0)
		);
	}, 0);

	const grandThreadTotalQuantity = tableData.reduce((total, item) => {
		return (
			total +
			(item[0]?.text === 'Thread' ? Number(item[9]?.text) || 0 : 0)
		);
	}, 0);

	// Add grand totals
	const threadIndex = tableData.findIndex(
		(item) => item[0]?.text === 'Thread'
	);

	if (threadIndex > -1) {
		tableData.splice(threadIndex, 0, [
			{
				text: 'Grand Total Zipper',
			},
			{ text: '' },
			{ text: '' },
			{ text: '' },
			{ text: '' },
			{ text: '' },
			{ text: '' },
			{
				text: grandZipperTotalCloseEnd.toFixed(2),
			},
			{
				text: grandZipperTotalOpenEnd.toFixed(2),
			},
			{
				text: grandZipperTotalQuantity.toFixed(2),
			},
		]);
	}

	tableData.push([
		{
			text: 'Grand Thread Total',
		},
		{ text: '' },
		{ text: '' },
		{ text: '' },
		{ text: '' },
		{ text: '' },
		{ text: '' },
		{
			text: grandThreadTotalCloseEnd.toFixed(2),
		},
		{
			text: grandThreadTotalOpenEnd.toFixed(2),
		},
		{
			text: grandThreadTotalQuantity.toFixed(2),
		},
	]);

	tableData.push([
		{
			text: 'Grand Total',
		},
		{ text: '' },
		{ text: '' },
		{ text: '' },
		{ text: '' },
		{ text: '' },
		{ text: '' },
		{
			text: grandTotalCloseEnd.toFixed(2),
		},
		{
			text: grandTotalOpenEnd.toFixed(2),
		},
		{
			text: grandTotalQuantity.toFixed(2),
		},
	]);

	// Add header row
	tableData.unshift([
		{
			text: 'Type',
		},
		{
			text: 'Marketing',
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
			text: 'Color',
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
