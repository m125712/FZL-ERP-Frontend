import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useZipperProduction } from '@/state/Report';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { ProductionStatus } from '../utils';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_all_orders')) {
		return `all=true`;
	}
	if (
		haveAccess.includes('show_approved_orders') &&
		haveAccess.includes('show_own_orders') &&
		userUUID
	) {
		return `own_uuid=${userUUID}&approved=true`;
	}

	if (haveAccess.includes('show_approved_orders')) {
		return 'all=false&approved=true';
	}

	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return `all=false`;
};

export default function Index() {
	const haveAccess = useAccess('report__zipper_production');
	const { user } = useAuth();

	const [status, setStatus] = useState('pending');
	const { data, isLoading, url, refetch } = useZipperProduction(
		`status=${status}&${getPath(haveAccess, user?.uuid)}`,
		{
			enabled: !!user?.uuid,
		}
	);
	const info = new PageInfo(
		'Zipper Production Status',
		url,
		'report__zipper_production'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'id',
				header: 'Sample/Bill/Cash',
				enableColumnFilter: false,
				width: 'w-28',
				cell: (info) => {
					const { is_sample, is_bill, is_cash } = info.row.original;
					return (
						<div className='flex gap-6'>
							<StatusButton size='btn-xs' value={is_sample} />
							<StatusButton size='btn-xs' value={is_bill} />
							<StatusButton size='btn-xs' value={is_cash} />
						</div>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				width: 'w-40',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => format(row.order_created_at, 'dd/MM/yy'),
				id: 'order_created_at',
				header: 'Created At',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.order_created_at}
						isTime={false}
					/>
				),
			},
			{
				accessorFn: (row) =>
					row.order_description_updated_at
						? format(row.order_description_updated_at, 'dd/MM/yy')
						: '--',
				id: 'order_description_updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.order_description_updated_at}
						isTime={false}
					/>
				),
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
				width: 'w-32',
				cell: (info) => info.getValue(),
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
						{info.getValue().join(', ')}
					</div>
				),
			},
			{
				accessorKey: 'swatch_approval_count',
				header: 'Swatch',
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
						{info.getValue().join(', ')}
					</div>
				),
			},
			{
				accessorFn: (row) => row.sizes + ' (' + row.size_count + ')',
				id: 'sizes',
				header: 'Size (cm)',
				enableColumnFilter: false,
				cell: (info) => {
					const { sizes, size_count } = info.row.original;
					return (
						<div className='flex flex-col'>
							<span>{sizes} </span>
							<span>#{size_count}</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'total_quantity',
				header: 'Order QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'assembly_production_quantity',
				header: (
					<>
						Slider <br />
						Assembly
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'coloring_production_quantity',
				header: (
					<>
						Slider <br />
						Coloring
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_tape_coil_to_dyeing_quantity',
				header: (
					<>
						Tape Prep <br />
						(kg)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_dyeing_transaction_quantity',
				header: (
					<>
						Dyeing <br />
						(kg)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.teeth_molding_quantity + ' ' + row.teeth_molding_unit,
				id: 'teeth_molding',
				header: (
					<>
						Teeth <br />
						Molding
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'teeth_coloring_quantity',
				header: (
					<>
						Teeth <br />
						Coloring
					</>
				),
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
				accessorKey: 'total_packing_list_quantity',
				header: 'Packing List',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.total_delivery_delivered_quantity +
					row.total_delivery_balance_quantity,
				id: 'total_delivery_balance_quantity',
				header: 'Challan',
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
				accessorKey: 'total_delivery_delivered_quantity',
				header: 'Delivered',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
		],
		[data, status]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			title={info.getTitle()}
			accessor={false}
			data={data}
			columns={columns}
			extraClass={'py-0.5'}
			extraButton={
				<ProductionStatus
					className='w-44'
					status={status}
					setStatus={setStatus}
					page='report__zipper_production'
				/>
			}
		/>
	);
}
