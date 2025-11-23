import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useProductionReportThreadPartyWise } from '@/state/Report';
import { format, startOfMonth, subMonths } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { SimpleDatePicker } from '@/ui';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `&own_uuid=${userUUID}`;
	}

	return ``;
};

export default function Index() {
	const haveAccess = useAccess('report__thread_production_batch_wise');
	const { user } = useAuth();

	const [from, setFrom] = useState(new Date());
	const [to, setTo] = useState(new Date());
	const { data, isLoading } = useProductionReportThreadPartyWise(
		`from=${format(from, 'yyyy-MM-dd')}&to=${format(to, 'yyyy-MM-dd')}${getPath(haveAccess, user?.uuid)}`,
		{
			enabled: !!user?.uuid,
		}
	);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				cell: (info) => info?.getValue(),
			},
			{
				accessorKey: 'total_quantity',
				header: 'Total Quantity',
				enableColumnFilter: false,
				cell: (info) => info?.getValue(),
			},
		],
		[data]
	);
	if (!user?.uuid) return null;
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<ReactTable
				title={'Thread Production Party Wise'}
				accessor={false}
				data={data}
				columns={columns}
				// extraClass={'py-0.5'}
				extraButton={
					<div className='flex items-center gap-2'>
						<SimpleDatePicker
							className='h-[2.34rem] w-32'
							key={'from'}
							value={from}
							selected={from}
							placeholder='From'
							onChange={(data) => {
								setFrom(data);
							}}
						/>
						<SimpleDatePicker
							className='h-[2.34rem] w-32'
							key={'to'}
							value={to}
							placeholder='To'
							selected={to}
							onChange={(data) => {
								setTo(data);
							}}
						/>
					</div>
				}
			/>
		</>
	);
}
