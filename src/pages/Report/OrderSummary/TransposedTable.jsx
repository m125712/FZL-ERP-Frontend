import React, { useMemo } from 'react';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime } from '@/ui';

export default function TransposedTable({ data, transformedData }) {
	function transposeChallanData(data) {
		if (!Array.isArray(data) || data.length === 0) return [];

		const fields = [
			'style',
			'color',
			'size',
			'unit',
			'order_quantity',
			'challan_no',
		];
		const challanNumbers = new Set();

		// collect all unique challan numbers
		data.forEach((item) => {
			item.challan_array?.forEach((challan) => {
				challanNumbers.add(challan.challan_number);
			});
		});

		const allFields = [...fields, ...challanNumbers];

		const transposed = allFields.map((field) => {
			const row = { field };
			let challanTotal = 0;

			data.forEach((item, index) => {
				const key = item.item_description + index;

				if (field in item) {
					if (field === 'challan_no') {
						row[key] = '';
					} else {
						row[key] = item[field];
					}

					if (challanNumbers.has(field)) {
						const value = item[field] ?? 0;
						challanTotal += typeof value === 'number' ? value : 0;
					}
				} else if (challanNumbers.has(field)) {
					const value = item[field] ?? 0;
					row[key] = value;
					challanTotal += typeof value === 'number' ? value : 0;
				}
			});

			// Only add "total" when it's a challan row
			if (challanNumbers.has(field)) {
				row.total = challanTotal;
			}

			return row;
		});

		// Add "balance" row after "order_quantity"
		const orderQtyIndex = transposed.findIndex(
			(row) => row.field === 'order_quantity'
		);
		if (orderQtyIndex !== -1) {
			const balanceRow = { field: 'balance' };

			let balanceTotal = 0;
			data.forEach((item, index) => {
				const key = item.item_description + index;
				const orderQty = transposed[orderQtyIndex][key] ?? 0;

				// Sum all challan values for this item

				let challanSum = 0;
				item.challan_array?.forEach((challan) => {
					challanSum += challan?.quantity ?? 0;
				});

				balanceRow[key] = orderQty - challanSum;
				balanceTotal += balanceRow[key];
			});

			balanceRow.total = balanceTotal;
			transposed.splice(orderQtyIndex + 1, 0, balanceRow);
		}

		return transposed;
	}

	const transposed = transposeChallanData(transformedData);

	const transposedTotal = transposed.slice(7).reduce((acc, row) => {
		Object.entries(row).forEach(([key, value]) => {
			if (key !== 'field') {
				acc[key] = (acc[key] || 0) + value;
			}
		});
		return acc;
	}, {});

	const challanNumbers = useMemo(() => {
		return (
			Array.from(
				new Map(
					data?.order_entry
						?.flatMap((entry) => entry.challan_array ?? [])
						?.filter((challan) => challan !== null)
						?.map((challan) => {
							const key = `${challan?.challan_number}|${challan?.challan_date}`;
							return [
								key,
								{
									challan_number: challan?.challan_number,
									challan_date: challan?.challan_date,
									challan_uuid: challan?.challan_uuid,
								},
							];
						})
						?.filter(([key]) => key !== '|')
				).values()
			) ?? []
		);
	}, [data?.order_entry]);

	const transposedCol = useMemo(
		() => [
			{
				accessorFn: (row) =>
					row.field
						.replace(/_/g, ' ')
						.replace(/\b\w/g, (c) => c.toUpperCase()),
				id: 'field',
				header: 'Field',
				width: 'w-32',
				cell: (info) => {
					const challan = challanNumbers.find(
						(challan) => challan.challan_number === info.getValue()
					);
					if (challan)
						return (
							<div
								key={challan?.challan_number}
								className='flex w-fit flex-col'
							>
								<CustomLink
									label={challan?.challan_number}
									url={`/delivery/challan/${challan?.challan_uuid}`}
									openInNewTab
									showCopyButton={false}
								/>
								<DateTime
									date={challan?.challan_date}
									customizedDateFormate='dd MMM, yy'
									isTime={false}
								/>
							</div>
						);

					return info.getValue();
				},
			},
			...(Array.isArray(transformedData) ? transformedData : []).map(
				(item, index) => ({
					accessorKey: item.item_description + index,
					header: () => (
						<CustomLink
							label={item?.item_description}
							url={`/order/details/${item?.order_number}/${item?.order_description_uuid}`}
							openInNewTab={true}
						/>
					),
					enableColumnFilter: false,
				})
			),
			{
				accessorKey: 'total',
				header: 'Total',
				enableColumnFilter: false,
			},
		],
		[transposed, transformedData]
	);

	return (
		<ReactTable
			title={'Transposed'}
			data={transposed}
			columns={transposedCol}
			extraClass={'py-2'}
		>
			<tr className='bg-slate-200'>
				<td className='py-2 text-center font-bold'>Total</td>
				{Object.entries(transposedTotal).map(([key, value]) => (
					<td key={key} className='py-1.5 ps-2.5'>
						{value}
					</td>
				))}
			</tr>
		</ReactTable>
	);
}
