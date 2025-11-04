import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { DateTime } from '@/ui';

const utilityTypeLabels = {
	fzl_peak_hour: 'FZL Peak Hour',
	fzl_off_hour: 'FZL Off Hour',
	boiler: 'Boiler',
	gas_generator: 'Gas Generator',
	tsl_peak_hour: 'TSL Peak Hour',
	tsl_off_hour: 'TSL Off Hour',
};

export default function Index({ utility_entries }) {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'type',
				header: 'Type',
				enableColumnFilter: false,
				cell: (info) => {
					const type = info.getValue();
					return utilityTypeLabels[type] || type;
				},
			},
			{
				accessorKey: 'reading',
				header: 'Reading',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'voltage_ratio',
				header: 'Voltage Ratio',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'unit_cost',
				header: 'Unit Cost',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue() || '-',
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue() || '-',
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => {
					const value = info.getValue();
					return value ? <DateTime date={value} /> : '-';
				},
			},
		],
		[utility_entries]
	);

	return (
		<ReactTableTitleOnly
			title='Utility Entries'
			data={utility_entries || []}
			columns={columns}
		/>
	);
}
