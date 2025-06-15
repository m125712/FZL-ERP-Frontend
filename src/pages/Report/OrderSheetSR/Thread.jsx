import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useOrderSheetSRThread } from '@/state/Report';
import { format } from 'date-fns';

import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import {
	CustomLink,
	DateTime,
	SimpleDatePicker,
	StatusButton,
	StatusSelect,
} from '@/ui';

import { REPORT_DATE_FORMATE } from '../utils';
import { types } from './utils';

export default function Index() {
	const { user } = useAuth();

	const [date, setDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());
	const [type, setType] = useState('sno');

	const { data, isLoading, updateData } = useOrderSheetSRThread(
		format(date, 'yyyy-MM-dd'),
		format(toDate, 'yyyy-MM-dd'),
		type,
		{ enabled: !!user?.uuid }
	);

	const handelSwatch = async (idx) => {
		await updateData.mutateAsync({
			url: `/thread/order-info/swatch-attachment/update/by/${data[idx]?.uuid}`,
			updatedData: {
				is_swatch_attached: !data[idx]?.is_swatch_attached,
			},
		});
	};

	const columns = useMemo(
		() => [
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
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,

				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,

				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => (row.is_swatch_attached ? 'Y' : 'N'),
				id: 'is_swatch_attached',
				header: 'Swatch',
				enableColumnFilter: false,
				cell: (info) => (
					<SwitchToggle
						// disabled={!permission}
						onChange={() => {
							handelSwatch(info.row.index);
						}}
						checked={info.row.original.is_swatch_attached === true}
					/>
				),
			},
			{
				accessorKey: 'revise',
				header: 'Revise',
				enableColumnFilter: false,

				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => (row.sno_from_head_office ? 'Y' : 'N'),
				id: 'sno_from_head_office',
				header: 'SNO Rcv.',
				enableColumnFilter: false,

				cell: (info) => (
					<StatusButton
						size='btn-xs'
						value={info.row.original.sno_from_head_office}
					/>
				),
			},
			{
				accessorKey: 'sno_from_head_office_by_name',
				header: 'SNO Rcv. By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					REPORT_DATE_FORMATE(row.sno_from_head_office_time),
				id: 'sno_from_head_office_time',
				header: 'SNO Rcv. Time',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => (
					<DateTime
						date={info.row.original.sno_from_head_office_time}
						isTime={false}
						customizedDateFormate='dd MMM,yyyy'
					/>
				),
			},
			{
				accessorFn: (row) => (row.receive_by_factory ? 'Y' : 'N'),
				id: 'receive_by_factory',
				header: 'Factory Rcv.',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton
						size='btn-xs'
						value={info.row.original.receive_by_factory}
					/>
				),
			},
			{
				accessorKey: 'receive_by_factory_by_name',
				header: 'Factory Rcv. By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					REPORT_DATE_FORMATE(row.receive_by_factory_time),
				id: 'receive_by_factory_time',
				header: 'Factory Rcv. Time',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => (
					<DateTime
						date={info.row.original.receive_by_factory_time}
						isTime={false}
						customizedDateFormate='dd MMM,yyyy'
					/>
				),
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			showDateRange={false}
			title={'Order Sheet Send & Receive (Thread)'}
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
