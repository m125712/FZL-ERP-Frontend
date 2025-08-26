import { useEffect, useMemo, useState } from 'react';
import { useOrderWise } from '@/state/Report';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, ReactSelect } from '@/ui';

import { cn } from '@/lib/utils';
import PageInfo from '@/util/PageInfo';

import { itemTypes, orderTypes } from '../utils';

export default function Index() {
	const [orderType, setOrderType] = useState('all');
	const [itemType, setItemType] = useState('all');
	const { data, isLoading, url } = useOrderWise(itemType, orderType);
	const info = new PageInfo('Order Wise', url, 'report__order_wise');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_no',
				header: 'O/N',
				enableColumnFilter: true,
				width: 'w-40',
				cell: (info) => {
					const order_uuid = info.row.original.order_uuid;
					const link = info.getValue()?.includes('ST')
						? `/thread/order-info/${order_uuid}`
						: `/order/details/${info.getValue()}`;
					return (
						<CustomLink
							label={info.getValue()}
							url={link}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'status',
				header: 'Status',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'issue_date',
				header: 'Issue Date',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => (
					<DateTime date={info.getValue()} isTime={false} />
				),
			},
			{
				accessorKey: 'color_count',
				header: 'Color Count',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'delivery_order_quantity',
				header: 'Delivery QTY',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'delivery_last_date',
				header: 'Delivery last Date',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) =>
					info.getValue() ? (
						<DateTime date={info.getValue()} isTime={false} />
					) : null,
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	let rowStyle = 'border border-gray-300 px-2 py-1';
	return (
		<ReactTable
			title={info.getTitle()}
			accessor={false}
			data={data}
			columns={columns}
			extraClass={'py-0.5'}
			extraButton={
				<div className='flex items-center gap-2'>
					<ReactSelect
						className={cn('h-4 min-w-36 text-sm')}
						placeholder='Select Item Type'
						options={itemTypes}
						value={itemTypes?.filter(
							(item) => item.value == itemType
						)}
						onChange={(e) => {
							setItemType(e.value);
						}}
					/>
					<ReactSelect
						className={cn('h-4 min-w-36 text-sm')}
						placeholder='Select Order Type'
						options={orderTypes}
						value={orderTypes?.filter(
							(item) => item.value == orderType
						)}
						onChange={(e) => {
							setOrderType(e.value);
						}}
					/>
				</div>
			}
		/>
	);
}
