import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useSample } from '@/state/Report';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, SimpleDatePicker, Status } from '@/ui';

import { cn } from '@/lib/utils';
import PageInfo from '@/util/PageInfo';

import { REPORT_DATE_FORMATE } from '../utils';

const getPath = (haveAccess, userUUID) => {
	if (
		haveAccess.includes('show_own_orders') &&
		userUUID &&
		haveAccess.includes('show_zero_balance')
	) {
		return `&own_uuid=${userUUID}&show_zero_balance=1`;
	} else if (haveAccess.includes('show_own_orders') && userUUID) {
		return `&own_uuid=${userUUID}&show_zero_balance=0`;
	} else if (haveAccess.includes('show_zero_balance') && userUUID) {
		return `&show_zero_balance=1`;
	}

	return ``;
};

export default function Index() {
	const haveAccess = useAccess('report__sample');
	const { user } = useAuth();

	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());
	const { data, isLoading, url } = useSample(
		format(date, 'yyyy-MM-dd'),
		format(toDate, 'yyyy-MM-dd'),
		1,
		getPath(haveAccess, user?.uuid),
		{ enabled: !!user?.uuid }
	);

	const info = new PageInfo('Sample', url, 'report__sample');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
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
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.issue_date && REPORT_DATE_FORMATE(row.issue_date),
				id: 'issue_date',
				header: 'Order Date',
				enableColumnFilter: false,
				cell: (info) =>
					info.getValue() && (
						<DateTime
							date={info.row.original.issue_date}
							isTime={false}
							customizedDateFormate='dd MMM,yyyy'
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
				width: 'w-32',
				enableColumnFilter: false,
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
				accessorKey: 'quantity',
				header: 'QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => {
					return row.challan_info
						?.map((item) => item.challan_number)
						.join(' -- ');
				},
				id: 'challan_info',
				header: 'Challan Info',
				enableColumnFilter: false,

				cell: (info) => {
					const { challan_info } = info.row.original;
					return (
						<table
							className={cn(
								'table table-xs rounded-md border-2 border-primary/20 align-top'
							)}
						>
							<thead>
								<tr>
									{/* <th>Item</th> */}
									<th>C/N</th>
									<th>C/D</th>
									<th>DEL</th>
									<th>QTY</th>
								</tr>
							</thead>
							<tbody>
								{challan_info?.map((item, index) => (
									<tr key={index}>
										{/* <td>{item_description_quantity}</td> */}
										<td>
											<CustomLink
												label={item.challan_number}
												url={`/delivery/challan/${item.challan_uuid}`}
												showCopyButton={false}
												openInNewTab
											/>
										</td>

										<td>
											{
												<DateTime
													date={item.challan_date}
													isTime={false}
													customizedDateFormate='dd MMM,yyyy'
												/>
											}
										</td>
										<td>
											<Status
												status={item.is_delivered}
											/>
										</td>
										<td>{item.challan_quantity}</td>
									</tr>
								))}
							</tbody>
						</table>
					);
				},
			},
			{
				accessorFn: (row) => {
					return row.challan_info?.map((item) =>
						format(item.challan_date, 'dd-MMM-yyyy')
					)[0];
				},
				id: 'challan_info_date',
				header: 'Challan Info Date',
				enableColumnFilter: false,
				hidden: true,
			},
			{
				accessorFn: (row) =>
					row.challan_info?.reduce(
						(acc, curr) => acc + curr.challan_quantity,
						0
					),
				id: 'total_challan',
				header: 'Total Challan',
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
			}
		/>
	);
}
