import { useMemo, useState } from 'react';
import { useReportStock } from '@/state/Report';
import { format } from 'date-fns';

import ReactTable from '@/components/Table';
import { SimpleDatePicker } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function index() {
	const [from, setFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
	const { data, isLoading } = useReportStock(from, to, {
		enabled: !!(from && to),
	});

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_section_name',
				header: 'Section',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'material_name',
				header: 'Material',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'material_unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'opening_quantity',
				header: 'Opening',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'purchase_quantity',
				header: 'Purchase',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'consumption_quantity',
				header: 'Consumption',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'closing_quantity',
				header: 'Closing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex flex-col gap-8'>
			<ReactTable
				title={'Store'}
				accessor={false}
				data={data}
				columns={columns}
				extraButton={
					<div className='flex items-center gap-2'>
						<SimpleDatePicker
							className='h-[2.34rem] w-32'
							key={'from'}
							value={from}
							placeholder='From'
							onChange={(data) => {
								setFrom(format(data, 'yyyy-MM-dd'));
							}}
							selected={from}
						/>
						<SimpleDatePicker
							className='h-[2.34rem] w-32'
							key={'to'}
							value={to}
							placeholder='To'
							onChange={(data) => {
								setTo(format(data, 'yyyy-MM-dd'));
							}}
							selected={to}
						/>
					</div>
				}
			/>
		</div>
	);
}
