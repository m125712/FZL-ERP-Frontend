import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { LinkWithCopy } from '@/ui';

export default function Index({ challan }) {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'style',
				header: 'Style',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'color',
				header: 'Color',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'count',
				header: 'Count',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'length',
				header: 'Length(mtr)',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity(cone)',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'short_quantity',
				header: 'Short QTY',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'reject_quantity',
				header: 'Reject QTY',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[challan]
	);

	return (
		<ReactTableTitleOnly title='Details' data={challan} columns={columns} />
	);
}
