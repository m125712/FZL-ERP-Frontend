import { useEffect, useMemo } from 'react';
import { useZipperProduction } from '@/state/Report';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, EditDelete, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, isLoading, url } = useZipperProduction();
	const info = new PageInfo(
		'Zipper Production Status',
		url,
		'report__zipper_production'
	);
	const haveAccess = useAccess('report__zipper_production');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'order_created_at',
				header: 'Order Created At',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'order_description_updated_at',
				header: 'Order Dsc Updated At',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'marketing_name',
				header: 'S&M',
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
				accessorKey: 'bill_cash_sample',
				header: 'Bill/LC/Sample',
				enableColumnFilter: false,
				cell: (info) => {
					const { is_bill, is_cash, is_sample } = info.row.original;
					return (
						<div className='flex space-x-1'>
							<StatusButton size='btn-xs' value={is_bill} />
							<StatusButton size='btn-xs' value={!is_cash} />
							<StatusButton size='btn-xs' value={is_sample} />
						</div>
					);
				},
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'colors',
				header: 'Colors',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => (
					<div className='flex-wrap'>
						{' '}
						{info.getValue().join(', ')}
					</div>
				),
			},
			{
				accessorKey: 'swatch_approval_count',
				header: 'Swatch Approval Count',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'styles',
				header: 'Styles',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => (
					<div className='flex-wrap'>
						{' '}
						{info.getValue().join(', ')}
					</div>
				),
			},
			{
				accessorKey: 'sizes',
				header: 'Size (cm)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'size_count',
				header: 'Size Count',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_quantity',
				header: 'Order QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'assembly_production_quantity',
				header: 'Assembly Prod QTY',
				enableColumnFilter: false,
				cell: (info) =>info.getValue(),
			},
			{
				accessorKey: 'coloring_production_quantity',
				header: 'Coloring Prod QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'coloring_production_quantity',
				header: 'Tape Prep',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_dyeing_transaction_quantity',
				header: 'Dyeing (kg)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'teeth_molding',
				header: 'Teeth Molding',
				enableColumnFilter: false,
				cell: (info) => {
					const { teeth_molding_quantity, teeth_molding_unit } =
						info.row.original;
					return (
						Number(teeth_molding_quantity) +
						' ' +
						teeth_molding_unit
					);
				},
			},
			{
				accessorKey: 'teeth_coloring_quantity',
				header: 'Teeth Coloring',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'finishing_quantity',
				header: 'Finishing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_delivery_delivered_quantity',
				header: 'Delivered (Gate Pass 1)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_delivery_balance_quantity',
				header: 'Bal. Delivery (Gate Pass 0)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_short_quantity',
				header: 'Short',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_reject_quantity',
				header: 'Reject',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				width: "w-32",
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<ReactTable
				title={info.getTitle()}
				accessor={false}
				data={data}
				columns={columns}
				extraClass={'py-0.5'}
			/>
		</>
	);
}
