import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { usePIRegister } from '@/state/Report';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, SimpleDatePicker } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { REPORT_DATE_FORMATE } from '../utils';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `&own_uuid=${userUUID}`;
	}

	return ``;
};

export default function Index() {
	const [from, setFrom] = useState(new Date());
	const [to, setTo] = useState(new Date());

	const haveAccess = useAccess('report__pi_register');
	const { user } = useAuth();
	const { data, isLoading, url } = usePIRegister(
		format(from, 'yyyy-MM-dd'),
		format(to, 'yyyy-MM-dd'),
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);
	const info = new PageInfo('PI Register', url, 'report__pi_register');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'pi_cash_number',
				header: 'PI No.',
				enableColumnFilter: false,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						url={`/commercial/pi/${info.getValue()}`}
						openInNewTab={true}
					/>
				),
			},
			{
				accessorFn: (row) =>
					REPORT_DATE_FORMATE(row.pi_cash_created_date),
				id: 'pi_cash_created_date',
				header: 'PI Date',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.pi_cash_created_date}
						customizedDateFormate='dd MMM, yyyy'
						isTime={false}
					/>
				),
			},
			{
				accessorFn: (row) => {
					const { order_object } = row;
					const { thread_order_object } = row;
					order_object.push(...thread_order_object);
					return order_object
						.filter((order) => order.value !== null)
						.map((order) => {
							return order.label;
						});
				},
				id: 'order_object',
				header: 'O/N',
				width: 'w-40',
				enableColumnFilter: false,
				cell: (info) => {
					const orderNumbers = info.row.original.order_object;
					return orderNumbers
						.filter((orderNumber) => orderNumber.value !== null)
						?.map((orderNumber) => {
							if (orderNumber === null) return;
							const isThreadOrder =
								orderNumber.label?.includes('ST');
							const number = orderNumber.label;
							const uuid = orderNumber.value;
							return (
								<CustomLink
									label={number}
									url={
										isThreadOrder
											? `/thread/order-info/${uuid}`
											: `/order/details/${number}`
									}
									openInNewTab={true}
								/>
							);
						});
				},
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'bank_name',
				header: 'Bank',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_pi_quantity',
				header: 'PI QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_pi_value',
				header: 'PI Value',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'lc_number',
				header: 'LC No.',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => REPORT_DATE_FORMATE(row.lc_date),
				id: 'lc_date',
				header: 'LC Date',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.lc_date}
						customizedDateFormate='dd MMM, yyyy'
						isTime={false}
					/>
				),
			},
			{
				accessorKey: 'file_number',
				header: 'File No.',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.lc_created_at && REPORT_DATE_FORMATE(row.lc_created_at),
				id: 'lc_created_at',
				header: 'File Date',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.lc_created_at}
						customizedDateFormate='dd MMM, yyyy'
						isTime={false}
					/>
				),
			},
		],
		[data]
	);
	if (!user?.uuid) return null;
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			title={info.getTitle()}
			accessor={false}
			data={data}
			columns={columns}
			extraClass={'py-2'}
			extraButton={
				<div className='flex items-center gap-2'>
					<SimpleDatePicker
						className='h-[2.34rem] w-32'
						key={'from'}
						value={from}
						placeholder='From'
						onChange={(data) => {
							setFrom(data);
						}}
						selected={from}
					/>
					<SimpleDatePicker
						className='h-[2.34rem] w-32'
						key={'to'}
						value={to}
						placeholder='To'
						onChange={(data) => {
							setTo(data);
						}}
						selected={to}
					/>
				</div>
			}
		/>
	);
}
