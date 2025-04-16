import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useConsumption } from '@/state/Report';
import { format } from 'date-fns';
import numeral from 'numeral';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { ReactSelect, SimpleDatePicker } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { consumptionTypes } from '../utils';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `&own_uuid=${userUUID}`;
	}

	return ``;
};

export default function Index() {
	const dateFormat = 'yyyy-MM-dd';
	const haveAccess = useAccess('report__consumption');
	const { user } = useAuth();
	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());
	const [type, setType] = useState('all');
	const { data, isLoading, url } = useConsumption(
		format(date, dateFormat),
		format(toDate, dateFormat),
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
			// {
			// 	accessorKey: 'item_description',
			// 	header: 'Item',
			// },
			// {
			// 	accessorKey: 'mtr_per_kg',
			// 	header: 'mtr_per_kg',
			// },
			{
				accessorKey: 'item_name',
				header: 'Item',
			},
			{
				accessorFn: (row) => row.nylon_stopper_name || '--',
				id: 'nylon_stopper_name',
				header: 'Nylon Stopper',
			},
			{
				accessorKey: 'zipper_number_name',
				header: 'Zipper Number',
			},
			{
				accessorKey: 'end_type_name',
				header: 'End Type',
			},
			{
				accessorKey: 'puller_type_name',
				header: 'Puller Type',
			},
			{
				accessorKey: 'total_quantity',
				header: (
					<>
						Order Qty <br />
						(PCS)
					</>
				),
				cell: (info) => numeral(info.getValue()).format('0,0'),
			},
			// {
			// 	accessorFn: (row) => {
			// 		const { total_cm, top, bottom, total_quantity } = row;
			// 		const top_bottom = (top + bottom) * total_quantity;
			// 		const total_size = total_cm + top_bottom;
			// 		const total_mtr = total_size / 100;
			// 		return total_mtr.toFixed(2);
			// 	},
			// 	id: 'total_mtr',
			// 	header: 'Total (MTR)',
			// },
			// {
			// 	accessorKey: 'mtr_per_kg',
			// 	header: 'MTR/KG',
			// },

			{
				accessorFn: (row) => {
					const top_bottom =
						(row.top + row.bottom) * row.total_quantity;
					const total_size = row.total_cm + top_bottom;
					const total_mtr = total_size / 100;
					return (total_mtr / row.mtr_per_kg).toFixed(2);
				},
				id: 'req_tape_qty',
				header: (
					<>
						Req. Tape <br />
						Qty (KG)
					</>
				),
			},
			{
				accessorKey: 'total_dyeing_transaction_quantity',
				header: (
					<>
						Prov. Tape <br />
						Qty (KG)
					</>
				),
			},

			{
				accessorKey: 'total_coloring_production_quantity',
				header: (
					<>
						Total Slider <br />
						Prod Qty.
					</>
				),
				cell: (info) => numeral(info.getValue()).format('0,0'),
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
