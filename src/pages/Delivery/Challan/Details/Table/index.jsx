import { useMemo } from 'react';

import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { LinkWithCopy } from '@/ui';

export default function Index({ challan }) {
	const columns = useMemo(
		() => [
			{
				accessorKey: 'packing_number',
				header: 'Packing Number',
				cell: (info) => {
					const { packing_list_uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={packing_list_uuid}
							uri='/delivery/packing-list'
						/>
					);
				},
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
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
				accessorKey: 'size',
				header: 'Size',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'is_inch',
				header: 'Unit',
				cell: (info) => (info.getValue() ? 'Inch' : 'Cm'),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'delivered',
				header: 'Delivered',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity(pcs)',
				cell: (info) => info.getValue(),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'poly_quantity',
				header: 'Poly QTY',
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
