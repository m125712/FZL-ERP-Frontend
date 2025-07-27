import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useBulk } from '@/state/Report';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, SimpleDatePicker, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { REPORT_DATE_FORMATE } from '../utils';

const getPath = (haveAccess, userUUID) => {
	if (
		haveAccess.includes('show_own_orders') &&
		haveAccess.includes('show_zero_balance') &&
		userUUID
	) {
		return `own_uuid=${userUUID}&show_zero_balance=1`;
	} else if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}&show_zero_balance=0`;
	} else if (haveAccess.includes('show_zero_balance') && userUUID) {
		return `show_zero_balance=1`;
	}

	return `show_zero_balance=0`;
};

export default function Index() {
	const haveAccess = useAccess('report__bulk');
	const haveDateAccess = haveAccess.includes('show_date_range');
	const { user } = useAuth();
	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());
	const { data, isLoading, url } = useBulk(
		haveDateAccess,
		format(date, 'yyyy-MM-dd'),
		format(toDate, 'yyyy-MM-dd'),
		getPath(haveAccess, user?.uuid),
		!!user?.uuid
	);
	const info = new PageInfo('Bulk', url, 'report__bulk');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
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
				enableColumnFilter: true,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				width: 'w-40',
				cell: (info) => {
					const order_uuid = info.row.original.order_info_uuid;
					const link = info.getValue().includes('ST')
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
				accessorKey: 'item_description',
				header: 'Item',
				enableColumnFilter: true,
				width: 'w-32',
				cell: (info) => {
					const { order_description_uuid, order_number } =
						info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/order/details/${order_number}/${order_description_uuid}`}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorKey: 'item_details',
				header: 'Item',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slider_details',
				header: 'Slider',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'other_details',
				header: 'Other',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => REPORT_DATE_FORMATE(row.issue_date),
				id: 'issue_date',
				header: 'Order Date',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.issue_date}
						isTime={false}
						customizedDateFormate='dd MMM, yy'
					/>
				),
			},
			{
				accessorKey: 'item_name',
				header: 'Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'style',
				header: 'Style',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color_ref',
				header: 'Color Ref',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color_ref_entry_date',
				header: (
					<>
						Color Ref <br /> Entry
					</>
				),
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'color_ref_update_date',
				header: (
					<>
						Color Ref <br /> Update
					</>
				),
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'size',
				header: 'Size',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => {
					if (row.order_type === 'tape') return 'Meter';
					return row.is_inch ? 'Inch' : 'Cm';
				},
				id: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => (row.bulk_approval ? 'Y' : 'N'),
				id: 'bulk_approval',
				header: 'Bulk Approval',
				enableColumnFilter: false,
				width: 'w-28',
				cell: (info) => {
					const { bulk_approval, bulk_approval_date } =
						info.row.original;
					return (
						<div className='flex gap-6'>
							<StatusButton size='btn-xs' value={bulk_approval} />
							<DateTime
								date={bulk_approval_date}
								isTime={false}
								customizedDateFormate='dd MMM, yy'
							/>
						</div>
					);
				},
			},
			{
				accessorKey: 'bulk_approval',
				header: 'Bulk Approval',
				enableColumnFilter: false,
				cell: (info) => {
					const { bulk_approval } = info.row.original;

					return bulk_approval;
				},
			},
			{
				accessorKey: 'quantity',
				header: 'Order QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_price',
				header: 'Party Price',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price_pi'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'pi',
				header: 'PI',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price_pi'),
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'finishing_prod',
				header: 'Finishing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'balance',
				header: 'Balance',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'warehouse',
				header: 'Warehouse',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'delivered_balance',
				header: 'Delivered Balance',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'delivered',
				header: 'Delivered',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			key='bulk'
			title={info.getTitle()}
			subtitle={
				<div className='flex flex-col'>
					<span>
						warehouse = when the packing list is warehouse received
					</span>
					<span>
						delivered = when the packing list is warehouse out
					</span>
					<span>balance = order qty - (warehouse + delivered)</span>
				</div>
			}
			accessor={false}
			data={data}
			columns={columns}
			extraClass={'py-0.5'}
			extraButton={
				haveDateAccess && (
					<div className='flex items-center gap-2'>
						<SimpleDatePicker
							className='h-[2.34rem] w-32'
							key={'Date'}
							value={date}
							placeholder='Date'
							onChange={(data) => {
								setDate(data);
							}}
							selected={date}
						/>
						<SimpleDatePicker
							className='h-[2.34rem] w-32'
							key={'toDate'}
							value={toDate}
							placeholder='To'
							onChange={(data) => {
								setToDate(data);
							}}
							selected={toDate}
						/>
					</div>
				)
			}
		/>
	);
}
