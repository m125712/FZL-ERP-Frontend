import React, { useMemo } from 'react';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime } from '@/ui';

export default function TransposedTable({ data, transformedData }) {
	function transposePlData(data) {
		if (!Array.isArray(data) || data.length === 0) return [];

		const fields = [
			'style',
			'color',
			'size',
			'unit',
			'order_quantity',
			'packing_list_number',
		];
		const packingNumbers = new Set();

		// collect all unique packing list numbers
		data.forEach((item) => {
			item.pl_array?.forEach((pl) => {
				packingNumbers.add(pl.packing_list_number);
			});
		});

		const allFields = [...fields, ...packingNumbers];

		const transposed = allFields.map((field) => {
			const row = { field };
			let plTotal = 0;

			data.forEach((item, index) => {
				const key =
					item.item_description.replace(/[\s_.]+/g, '-') + index;

				if (field in item) {
					if (field === 'packing_list_number') {
						row[key] = '';
					} else {
						row[key] = item[field];
					}

					if (packingNumbers.has(field)) {
						const value = item[field] ?? 0;
						plTotal += typeof value === 'number' ? value : 0;
					}
				} else if (packingNumbers.has(field)) {
					const value = item[field] ?? 0;
					row[key] = value;
					plTotal += typeof value === 'number' ? value : 0;
				}
			});

			// Only add "total" when it's a pl row
			if (packingNumbers.has(field)) {
				row.total = plTotal;
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
				const key =
					item.item_description.replace(/[\s_.]+/g, '-') + index;

				const orderQty = transposed[orderQtyIndex][key] ?? 0;

				// Sum all pl values for this item
				let plSum = 0;

				item.pl_array?.forEach((pl) => {
					plSum += pl?.quantity ?? 0;
				});

				balanceRow[key] = orderQty - plSum;
				balanceTotal += balanceRow[key];
			});

			balanceRow.total = balanceTotal;
			transposed.splice(orderQtyIndex + 1, 0, balanceRow);
		}

		return transposed;
	}

	const transposed = transposePlData(transformedData);

	const transposedTotal = transposed.slice(7).reduce((acc, row) => {
		Object.entries(row).forEach(([key, value]) => {
			if (key !== 'field') {
				acc[key] = (acc[key] || 0) + value;
			}
		});
		return acc;
	}, {});

	const packingNumbers = useMemo(() => {
		return (
			Array.from(
				new Map(
					data?.order_entry
						?.flatMap((entry) => entry.pl_array ?? [])
						?.filter((pl) => pl !== null)
						?.map((pl) => {
							const key = `${pl?.packing_list_number}|${pl?.packing_list_date}`;
							return [
								key,
								{
									packing_list_number:
										pl?.packing_list_number,
									packing_list_date: pl?.packing_list_date,
									packing_list_uuid: pl?.packing_list_uuid,
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
						.replace(/[\s_.]+/g, '-')
						.replace(/\b\w/g, (c) => c.toUpperCase()),
				id: 'field',
				header: 'Field',
				width: 'w-32',
				enableColumnFilter: false,
				enableSorting: false,
				cell: (info) => {
					const pl = packingNumbers.find(
						(pl) => pl.packing_list_number === info.getValue()
					);
					if (pl)
						return (
							<div
								key={pl?.packing_list_number}
								className='flex w-fit flex-col'
							>
								<CustomLink
									label={pl?.packing_list_number}
									url={`/delivery/packing-list/${pl?.packing_list_uuid}`}
									openInNewTab
									showCopyButton={false}
								/>
								<DateTime
									date={pl?.packing_list_date}
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
					accessorKey:
						item.item_description.replace(/[\s_.]+/g, '-') + index,
					header: item.item_description,
					// header: () =>
					// 	item?.order_description_uuid ? (
					// 		<CustomLink
					// 			label={item?.item_description}
					// 			url={`/order/details/${data?.order_number}/${item?.order_description_uuid}`}
					// 			openInNewTab={true}
					// 		/>
					// 	) : (
					// 		item?.item_description
					// 	),
					enableColumnFilter: false,
					enableSorting: false,
				})
			),
			{
				accessorKey: 'total',
				header: 'Total',
				enableColumnFilter: false,
				enableSorting: false,
			},
		],
		[transposed, transformedData]
	);

	const getTotalBalance = () => {
		if (!transposed?.[4]) return 0;

		const total_order_quantity = Object.entries(transposed[4])
			.map(([key, value]) => (key !== 'field' ? value : 0))
			.reduce((acc, val) => acc + val, 0);

		const total_pl_quantity = transposedTotal.total;
		const total_balance = transposed?.[5]?.total;
		const difference = total_order_quantity - total_pl_quantity;

		return {
			total_order_quantity,
			total_pl_quantity,
			difference,
			total_balance,
		};
	};

	const { total_order_quantity, total_pl_quantity, total_balance } =
		getTotalBalance();

	const extraExcelData = [
		'Total Balance Quantity',
		`${total_order_quantity} - ${total_pl_quantity} = ${total_balance}`,
	];

	return (
		<>
			<ReactTable
				title={'Summary'}
				data={transposed}
				columns={transposedCol}
				extraClass={'py-2'}
				extraExcelData={extraExcelData}
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

			{transposed?.[4] && (
				<div className='flex items-center justify-center gap-4 rounded-md bg-primary p-2 text-primary-foreground'>
					Total Balance = {total_order_quantity} - {total_pl_quantity}{' '}
					= {total_balance}
				</div>
			)}
		</>
	);
}
