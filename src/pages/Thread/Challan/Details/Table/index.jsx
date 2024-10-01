import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { LinkWithCopy } from '@/ui';

export default function Index({ challan }) {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'style_color',
				header: 'Style/Color',
				cell: (info) => {
					const { style, color } = info.row.original;
					return `${style}/${color}`;
				},
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
				header: 'Length',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity',
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
