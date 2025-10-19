import { useEffect, useMemo, useState } from 'react';
import { useOrderWise } from '@/state/Report';
import { formatDistanceStrict } from 'date-fns';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, ReactSelect } from '@/ui';

import { cn } from '@/lib/utils';
import PageInfo from '@/util/PageInfo';

import {
	itemTypes,
	orderStatuses,
	orderTypes,
	REPORT_DATE_FORMATE,
} from '../utils';

export default function Index() {
	const [orderType, setOrderType] = useState('all');
	const [itemType, setItemType] = useState('zipper');
	const [status, setStatus] = useState('processing');
	const { data, isLoading, url } = useOrderWise(itemType, orderType, status);
	const info = new PageInfo('Order Time Length', url, 'report__time_length');

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
				accessorFn: (row) => REPORT_DATE_FORMATE(row.issue_date),
				header: 'Created At',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => (
					<DateTime
						date={info.getValue()}
						isTime={false}
						customizedDateFormate='dd MMM, yyyy'
					/>
				),
			},
			{
				accessorFn: (row) => {
					let date = formatDistanceStrict(
						row.issue_date,
						Date.now(),
						{ unit: 'day' }
					);

					return date;
				},
				id: 'day_passed',
				header: 'Day Passed',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'color_count',
				header: () => {
					return (
						<>
							Color <br />
							Count
						</>
					);
				},
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => row.delivery_order_quantity.split('/')[1],
				id: 'order_quantity',
				header: 'Order QTY',
				enableColumnFilter: false,

				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'delivery_order_quantity',
				header: 'Del. QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue().split('/')[0],
			},
			{
				accessorFn: (row) =>
					row.delivery_order_quantity.split('/')[1] -
					row.delivery_order_quantity.split('/')[0],
				id: 'balance_quantity',
				header: 'Bal. QTY',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					REPORT_DATE_FORMATE(row.delivery_last_date),
				header: 'Delivery last Date',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) =>
					info.getValue() ? (
						<DateTime
							date={info.getValue()}
							isTime={false}
							customizedDateFormate='dd MMM, yyyy'
						/>
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
					<ReactSelect
						className={cn('h-4 min-w-36 text-sm')}
						placeholder='Select Order Type'
						options={orderStatuses}
						value={orderStatuses?.filter(
							(item) => item.value == status
						)}
						onChange={(e) => {
							setStatus(e.value);
						}}
					/>
				</div>
			}
		/>
	);
}
