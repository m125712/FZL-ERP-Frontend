import { useMemo, useState } from 'react';
import { useOrderSummary } from '@/state/Report';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime } from '@/ui';

import Header from './Header';
import Information from './Information';

export default function index() {
	const [order, setOrder] = useState('');
	const { data, isLoading } = useOrderSummary(order);

	const uniqueChallanNumbers = Array.from(
		new Set(
			data?.order_entry.flatMap((entry) =>
				entry.challan_array.map((challan) => challan?.challan_number)
			)
		)
	).filter(Boolean);

	const transformedData = data?.order_entry?.map((entry) => {
		const challanData = entry.challan_array.reduce((acc, challan) => {
			if (challan?.challan_number) {
				acc[challan?.challan_number] = challan?.quantity || 0;
			}

			return acc;
		}, {});

		return {
			...entry,
			...challanData,
		};
	});

	const columns = useMemo(
		() => [
			{
				accessorKey: 'item_description',
				header: 'Desc',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => {
					const { order_description_uuid } = info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/order/details/${data?.order_number}/${order_description_uuid}`}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorKey: 'style',
				header: 'style',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color',
				header: 'color',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'size',
				header: 'size',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit',
				header: 'unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'order_quantity',
				header: 'QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			...uniqueChallanNumbers.map((challanNumber) => ({
				accessorKey: challanNumber,
				header: challanNumber,
				enableColumnFilter: false,
				cell: (info) => info.getValue() || '--',
			})),
			{
				accessorFn: (row) => {
					let total = 0;
					uniqueChallanNumbers.reduce((acc, curr) => {
						return (total += row[curr] || 0);
					}, 0);

					return total;
				},
				id: 'total',
				header: 'Total',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => {
					let total = 0;
					uniqueChallanNumbers.reduce((acc, curr) => {
						return (total += row[curr] || 0);
					}, 0);

					return row.order_quantity - total;
				},
				id: 'balance',
				header: 'Balance',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[transformedData, uniqueChallanNumbers]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex flex-col gap-2'>
			<Header
				{...{
					order,
					setOrder,
				}}
			/>
			<Information data={data} />
			<ReactTable
				title={'Summary'}
				data={transformedData}
				columns={columns}
				extraClass={'py-2'}
			>
				<tr>
					<td colSpan={5} className='text-right font-bold'>
						Total
					</td>
					<td className='ps-2.5'>
						{transformedData?.reduce(
							(acc, curr) => acc + curr?.order_quantity || 0,
							0
						)}
					</td>
					{transformedData?.reduce(
						(acc, curr) =>
							acc +
								curr?.challan_array?.reduce(
									(acc, curr) => acc + curr?.quantity || 0,
									0
								) || 0,
						0
					)}
					{uniqueChallanNumbers.length > 1 &&
						Array.from({
							length: uniqueChallanNumbers.length - 1,
						}).map((_, index) => (
							<td key={index} className='ps-2.5'></td>
						))}
					<td className='ps-2.5'>
						{transformedData?.reduce(
							(acc, curr) =>
								acc +
									curr?.challan_array?.reduce(
										(acc, curr) =>
											acc + curr?.quantity || 0,
										0
									) || 0,
							0
						)}
					</td>
					<td className='ps-2.5'>
						{transformedData?.reduce(
							(acc, curr) =>
								acc +
									curr?.order_quantity -
									curr?.challan_array?.reduce(
										(acc, curr) =>
											acc + curr?.quantity || 0,
										0
									) || 0,
							0
						)}
					</td>
				</tr>
			</ReactTable>
		</div>
	);
}
