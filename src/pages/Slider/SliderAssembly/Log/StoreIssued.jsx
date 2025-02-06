import { useMemo, useState } from 'react';
import { useSliderAssemblyStoreIssued } from '@/state/Slider';
import { format } from 'date-fns';

import ReactTable from '@/components/Table';
import { SimpleDatePicker } from '@/ui';

export default function index() {
	const { data, isLoading } = useSliderAssemblyStoreIssued();

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'item_description',
				header: 'Item Desc',
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
				accessorKey: 'trx_to',
				header: 'Trx to',
				enableColumnFilter: false,
				cell: (info) => info.getValue().replace(/_/g, ' '),
			},
			{
				accessorKey: 'trx_quantity',
				header: 'Trx Qty',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'weight',
				header: 'Weight',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'stock',
				header: 'Stock',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'purpose',
				header: 'Purpose',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
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
				title={'Store Issued'}
				accessor={false}
				data={data}
				columns={columns}
			/>
		</div>
	);
}
