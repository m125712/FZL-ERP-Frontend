import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useConsumption } from '@/state/Report';
import { format, startOfMonth, subMonths } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, ReactSelect, SimpleDatePicker } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { consumptionTypes } from '../utils';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `&own_uuid=${userUUID}`;
	}

	return ``;
};

export default function Index() {
	const haveAccess = useAccess('report__consumption');
	const { user } = useAuth();
	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());
	const [type, setType] = useState('all');
	const { data, isLoading, url } = useConsumption(
		format(date, 'yyyy-MM-dd'),
		format(toDate, 'yyyy-MM-dd'),
		type,
		getPath(haveAccess, user?.uuid),
		!!user?.uuid
	);
	const info = new PageInfo('Consumption', url, 'report__consumption');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
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
				accessorKey: 'total_cm',
				header: 'Total (Cm)',
				enableColumnFilter: true,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_quantity',
				header: 'Total Qty.',
				enableColumnFilter: true,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_dyeing_transaction_quantity',
				header: (
					<>
						Total Dyeing <br /> Trx Qty.
					</>
				),
				enableColumnFilter: true,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'mtr_per_kg',
				header: 'Meter per Kg',
				enableColumnFilter: true,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_coloring_production_quantity',
				header: (
					<>
						Total Color <br /> Prod Qty.
					</>
				),
				enableColumnFilter: true,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			key='consumption'
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
					<ReactSelect
						className='h-4 min-w-36 text-sm'
						placeholder='Select Status'
						options={consumptionTypes}
						value={consumptionTypes?.filter(
							(item) => item.value == type
						)}
						onChange={(e) => {
							setType(e.value);
						}}
					/>
				</div>
			}
		/>
	);
}
