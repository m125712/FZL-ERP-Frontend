import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useDeliveryReportThread } from '@/state/Report';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import {
	CustomLink,
	DateTime,
	SimpleDatePicker,
	StatusButton,
	StatusSelect,
} from '@/ui';

import { REPORT_DATE_FORMATE } from '../utils';
import { types } from './utils';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return `all=true`;
};

export default function Index() {
	const haveAccess = useAccess('report__delivery_report');
	const { user } = useAuth();

	const [date, setDate] = useState(() => new Date());
	const [toDate, setToDate] = useState(() => new Date());
	const [type, setType] = useState('all');

	const { data, isLoading } = useDeliveryReportThread(
		format(date, 'yyyy-MM-dd HH:mm:ss'),
		format(toDate, 'yyyy-MM-dd HH:mm:ss'),
		type,
		getPath(haveAccess, user?.uuid),
		{ enabled: !!user?.uuid }
	);

	const columns = useMemo(
		() => [
			{
				accessorFn: (row) => (row.receive_status ? 'Y' : 'N'),
				id: 'receive_status',
				header: 'Received',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => (
					<StatusButton
						size='btn-xs'
						value={info.row.original.receive_status}
					/>
				),
			},
			{
				accessorFn: (row) => REPORT_DATE_FORMATE(row.delivery_date),
				id: 'delivery_date',
				header: 'Delivery Date',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => (
					<DateTime date={info.row.original.delivery_date} />
				),
			},
			{
				accessorKey: 'challan_number',
				header: 'Challan No',
				enableColumnFilter: true,
				width: 'w-40',
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/delivery/challan/${uuid}`}
							openInNewTab
						/>
					);
				},
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				width: 'w-32',
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
				accessorFn: (row) => row.lc_numbers?.join(', '),
				id: 'lc_numbers',
				header: 'LC',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => row.pi_numbers?.join(', '),
				id: 'pi_numbers',
				header: 'PI',
				enableColumnFilter: false,
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
				accessorKey: 'item_description',
				header: 'Count Length',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'order_quantity',
				header: 'Order QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'delivered_quantity',
				header: 'Delivered QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'reject_quantity',
				header: 'Return QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'rate_per_piece',
				header: 'Rate/PCS',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'commission',
				header: 'Comm.',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_value',
				header: 'Total Value',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_commission',
				header: 'Total Comm.',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_value_company',
				header: 'Net Sales',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('show_price'),
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);
	if (!user?.uuid) return null;
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			showDateRange={false}
			title={'Thread Delivery Report'}
			subtitle={
				<div className='flex flex-col'>
					<span>
						delivered = when the packing list is entered in a
						CHALLAN, but it is not necessary to be delivered or not.
					</span>
				</div>
			}
			accessor={false}
			data={data}
			columns={columns}
			extraButton={
				<div className='flex items-center gap-2'>
					<SimpleDatePicker
						className='m-w-32 h-[2.34rem]'
						key={'date'}
						value={date}
						placeholder='Date'
						selected={date}
						onChangeForTime={(data) => {
							setDate(data);
						}}
						showTime={true}
					/>
					<SimpleDatePicker
						className='m-w-32 h-[2.34rem]'
						key={'toDate'}
						value={toDate}
						placeholder='To'
						selected={toDate}
						onChangeForTime={(data) => {
							setToDate(data);
						}}
						showTime={true}
					/>{' '}
					<StatusSelect
						status={type}
						setStatus={setType}
						options={types}
					/>
				</div>
			}
		/>
	);
}
