import { useMemo, useState } from 'react';
import { useOrderSummary } from '@/state/Report';

import { CustomLink, DateTime } from '@/ui';

import Header from './Header';
import Information from './Information';
import TransposedTable from './TransposedTable';

export default function index() {
	const [order, setOrder] = useState('');
	const { data, isLoading } = useOrderSummary(order);

	const uniqueChallanNumbers =
		Array.from(
			new Map(
				data?.order_entry
					?.flatMap((entry) => entry.challan_array ?? []) // Flatten all challans
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
					?.filter(([key]) => key !== '|') // Remove entries with missing data
			).values()
		) ?? [];

	const transformedData = data?.order_entry.map((entry) => {
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
			...uniqueChallanNumbers.map((challan, index) => ({
				accessorFn: (row) => row[challan?.challan_number] || '--',
				id: 'challan-number-' + index,
				header: (
					<div
						key={challan?.challan_number}
						className='flex flex-col items-center justify-center'
					>
						<CustomLink
							label={challan?.challan_number}
							url={`/delivery/challan/${challan?.challan_uuid}`}
							openInNewTab
						/>
						<DateTime
							date={challan?.challan_date}
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
					uniqueChallanNumbers.reduce((acc, curr) => {
						total += row[curr.challan_number] || 0;
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
					uniqueChallanNumbers?.reduce((acc, curr) => {
						total += row[curr.challan_number] || 0;
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
