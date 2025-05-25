import { useEffect, useMemo } from 'react';
import { useDyeingFinishingBatchOverview } from '@/state/Dyeing';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, DateTime, LinkWithCopy, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function index() {
	const haveAccess = useAccess('planning__overview');

	const { data, isLoading, url } = useDyeingFinishingBatchOverview(
		`dyed_tape_required=false&swatch_approved=true&is_balance=true`
	);

	const info = new PageInfo('Overview', url, 'planning__overview');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				width: 'w-36',
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.getValue()}
						uri={`/order/details`}
					/>
				),
			},
			{
				accessorKey: 'item_description',
				header: 'Item',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => {
					const { order_number, order_description_uuid } =
						info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={`${order_number}/${order_description_uuid}`}
							uri={`/order/details`}
						/>
					);
				},
			},
			{
				accessorKey: 'order_type',
				header: 'Type',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'recipe_id',
			// 	header: 'Recipe',
			// 	enableColumnFilter: false,
			// 	width: 'w-28',
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorFn: (row) =>
					row.order_type == 'slider' ? '--' : row.recipe_id,
				id: 'recipe_id',
				header: 'Recipe',
				enableColumnFilter: true,
				cell: (info) => {
					info.getValue();

					if (info.row.original.order_type == 'slider') return '--';
					return (
						<CustomLink
							label={info.getValue()}
							url={`/lab-dip/recipe/details/${info.row.original.recipe_uuid}`}
						/>
					);
				},
			},
			{
				accessorKey: 'style',
				header: 'Style',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				width: 'w-36',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'size',
				header: 'Size',
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
				accessorKey: 'approved',
				header: 'Bulk App.',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-xs' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'is_pps_req',
				header: 'PP App.',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-xs' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'order_quantity',
				header: (
					<div className='flex flex-col'>
						<span>Order </span>
						<span>Qty</span>
					</div>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'balance_quantity',
				header: 'Balance',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	return (
		<div>
			<ReactTable
				title={'Order Overview'}
				data={data}
				columns={columns}
			/>
		</div>
	);
}
