import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { DateTime } from '@/ui';

import { dateType } from '../utils';

export default function Index({ entries }) {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'ud_no',
				header: 'UD No',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'ud_received',
				header: 'UD Received',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.getValue()}
						customizedDateFormate={dateType}
						isTime={false}
					/>
				),
			},
			{
				accessorKey: 'up_number',
				header: 'Ud Number',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
		],
		[entries]
	);

	return (
		<ReactTableTitleOnly title='UD' data={entries} columns={columns} />
	);
}
