import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useSampleCombined } from '@/state/Report';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, ReactSelect, SimpleDatePicker } from '@/ui';

import PageInfo from '@/util/PageInfo';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `&own_uuid=${userUUID}`;
	}

	return ``;
};

export default function Index() {
	const haveAccess = useAccess('report__orders');
	const { user } = useAuth();

	const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [option, setOption] = useState(0);
	const { data, isLoading, url } = useSampleCombined(
		date,
		option,
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);
	const info = new PageInfo('Orders', url, 'report__orders');
	const options = [
		{ value: 1, label: 'Sample' },
		{ value: 0, label: 'Bulk' },
	];

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
				accessorFn: (row) => format(row.issue_date, 'dd/MM/yy'),
				id: 'issue_date',
				header: 'Order Date',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.issue_date}
						customizedDateFormate='dd MMM, yy'
						isTime={false}
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
				cell: (info) => info.getValue().join(', '),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue().join(', '),
			},
			{
				accessorKey: 'size',
				header: 'Size',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue().join(', '),
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
				accessorKey: 'total_quantity',
				header: 'QTY',
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
			title={info.getTitle()}
			accessor={false}
			data={data}
			columns={columns}
			extraClass={'py-0.5'}
			extraButton={
				<div className='flex items-center gap-2'>
					<SimpleDatePicker
						className='h-9 w-32'
						value={date}
						placeholder='Select Date'
						onChange={(data) => {
							setDate(format(data, 'yyyy-MM-dd'));
						}}
						selected={date}
					/>
					<ReactSelect
						className='h-4 w-24 text-sm'
						placeholder='Select option'
						options={options}
						value={options?.filter((item) => item.value == option)}
						onChange={(e) => {
							setOption(e.value);
						}}
					/>
				</div>
			}
		/>
	);
}
