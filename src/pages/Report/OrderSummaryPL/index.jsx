import { useMemo, useState } from 'react';
import { useOrderSummaryPl } from '@/state/Report';

import { CustomLink, DateTime } from '@/ui';

import Header from './Header';
import Information from './Information';
import TransposedTable from './TransposedTable';

export default function index() {
	const [order, setOrder] = useState('');
	const { data, isLoading } = useOrderSummaryPl(order);

	const uniquePLNumbers =
		Array.from(
			new Map(
				data?.order_entry
					?.flatMap((entry) => entry.pl_array ?? []) // Flatten all pl
					?.filter((pl) => pl !== null)
					?.map((pl) => {
						const key = `${pl?.packing_list_number}|${pl?.packing_list_date}`;
						return [
							key,
							{
								packing_list_number: pl?.packing_list_number,
								packing_list_date: pl?.packing_list_date,
								packing_list_uuid: pl?.packing_list_uuid,
							},
						];
					})
					?.filter(([key]) => key !== '|') // Remove entries with missing data
			).values()
		) ?? [];

	const transformedData = data?.order_entry.map((entry) => {
		const packingData = entry.pl_array.reduce((acc, pl) => {
			if (pl?.packing_list_number) {
				acc[pl?.packing_list_number] = pl?.quantity || 0;
			}

			return acc;
		}, {});

		return {
			...entry,
			...packingData,
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

					if (order_description_uuid)
						return (
							<CustomLink
								label={info.getValue()}
								url={`/order/details/${data?.order_number}/${order_description_uuid}`}
								openInNewTab={true}
							/>
						);
					else return info.getValue();
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
				cell: (info) => info.getValue() || '--',
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
			...uniquePLNumbers.map((pl, index) => ({
				accessorFn: (row) => row[pl?.packing_list_number] || '--',
				id: 'pl-number-' + index,
				header: (
					<div
						key={pl?.packing_list_number}
						className='flex flex-col items-center justify-center'
					>
						<CustomLink
							label={pl?.packing_list_number}
							url={`/delivery/pl/${pl?.packing_list_uuid}`}
							openInNewTab
						/>
						<DateTime
							date={pl?.packing_list_date}
							customizedDateFormate='dd MMM, yy'
							isTime={false}
						/>
					</div>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			})),
			{
				accessorFn: (row) => {
					let total = 0;
					uniquePLNumbers.reduce((acc, curr) => {
						total += row[curr.packing_list_number] || 0;
					}, 0);

					return total;
				},
				id: 'total',
				header: 'Total',
				enableColumnFilter: false,
			},
			{
				accessorFn: (row) => {
					let total = 0;
					uniquePLNumbers?.reduce((acc, curr) => {
						total += row[curr.packing_list_number] || 0;
					}, 0);

					return row.order_quantity - total;
				},
				id: 'balance',
				header: 'Balance',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[transformedData, uniquePLNumbers]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex flex-col gap-5'>
			<Header
				{...{
					order,
					setOrder,
				}}
			/>
			<Information data={data} />

			<TransposedTable data={data} transformedData={transformedData} />
		</div>
	);
}
