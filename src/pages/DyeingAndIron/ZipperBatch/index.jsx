import { useEffect, useMemo } from 'react';
import { useDyeingBatch } from '@/state/Dyeing';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { DateTime, EditDelete, LinkWithCopy, Transfer } from '@/ui';

import { cn } from '@/lib/utils';
import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, url, isLoading, updateData } = useDyeingBatch();
	const info = new PageInfo('Batch', url, 'dyeing__zipper_batch');
	const haveAccess = useAccess('dyeing__zipper_batch');
	const navigate = useNavigate();

	const columns = useMemo(
		() => [
			{
				accessorKey: 'batch_id',
				header: 'Batch ID',
				enableColumnFilter: false,
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.row.original.uuid}
						uri='/dyeing-and-iron/zipper-batch'
					/>
				),
			},
			{
				accessorKey: 'order_numbers',
				header: 'O/N',
				width: 'w-28',
				enableColumnFilter: false,
				cell: (info) => {
					return info?.getValue()?.map((order_number) => {
						return (
							<LinkWithCopy
								key={order_number}
								title={order_number}
								id={order_number}
								uri='/order/details'
							/>
						);
					});
				},
			},
			{
				accessorKey: 'batch_type',
				header: 'Type',
				enableColumnFilter: false,
				cell: (info) => {
					const res = {
						normal: 'badge badge-primary',
						extra: 'badge badge-warning',
					};
					return (
						<span
							className={cn(
								res[info.getValue()],
								'badge-sm uppercase'
							)}>
							{info.getValue()}
						</span>
					);
				},
			},
			{
				accessorKey: 'production_date',
				header: (
					<div className='flex flex-col'>
						<span>Production</span>
						<span>Date</span>
					</div>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime date={info.getValue()} isTime={false} />
				),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue()?.join(', '),
			},
			{
				accessorKey: 'total_quantity',
				header: (
					<div className='flex flex-col'>
						<span>Total</span>
						<span>Qty(Pcs)</span>
					</div>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'expected_kg',
				header: (
					<span>
						Exp Prod
						<br />
						Qty(kg)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'add_actions',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('create'),
				cell: (info) => {
					const { uuid, received } = info.row.original;
					return (
						<Transfer
							onClick={() =>
								navigate(
									`/dyeing-and-iron/zipper-batch/batch-production/${uuid}`
								)
							}
							disabled={
								received === 1 ||
								!haveAccess.includes('click_production')
							}
						/>
					);
				},
			},
			{
				accessorKey: 'total_actual_production_quantity',
				header: (
					<span>
						Total Prod
						<br />
						Qty(kg)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'batch_status',
				header: 'Status',
				enableColumnFilter: false,
				cell: (info) => {
					const res = {
						cancelled: 'badge-error',
						completed: 'badge-success',
						pending: 'badge-warning',
					};
					return (
						<span
							className={cn(
								'badge badge-sm uppercase',
								res[info.getValue()]
							)}>
							{info.getValue()}
						</span>
					);
				},
			},

			{
				accessorKey: 'received',
				header: (
					<span>
						Stock
						<br />
						Received
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => {
					const { received } = info.row.original;
					const access = haveAccess.includes('click_receive_status');
					const overrideAccess = haveAccess.includes(
						'click_receive_status_override'
					);
					// overrideAccess ? false : access ? received === 1 : true;
					let isDisabled = false;
					if (!overrideAccess) {
						if (access) {
							isDisabled = received === 1;
						} else {
							isDisabled = true;
						}
					}
					return (
						<SwitchToggle
							disabled={isDisabled}
							onChange={() => handelReceived(info.row.index)}
							checked={info.getValue() === 1}
						/>
					);
				},
			},
			{
				accessorKey: 'machine_name',
				header: 'Machine',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slot',
				header: 'Slot',
				enableColumnFilter: false,
				cell: (info) => {
					const value = info.getValue();
					if (value === 0) {
						return '-';
					}
					return 'Slot ' + value;
				},
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			,
			// * created_at
			{
				accessorKey: 'created_at',
				header: 'Created at',
				width: 'w-24',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			// * updated_at
			{
				accessorKey: 'updated_at',
				header: 'Updated at',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			// * remarks
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// * actions
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						showUpdate={
							haveAccess.includes('update') &&
							info.row.original.received == 0
						}
						showDelete={false}
					/>
				),
			},
		],
		[data]
	);

	// Add
	const handelAdd = () => navigate('/dyeing-and-iron/zipper-batch/entry');

	// Update
	const handelUpdate = (idx) => {
		const { uuid } = data[idx];

		navigate(`/dyeing-and-iron/zipper-batch/${uuid}/update`);
	};
	// Received
	const handelReceived = async (idx) => {
		await updateData.mutateAsync({
			url: `${url}/${data[idx]?.uuid}`,
			updatedData: {
				received: data[idx]?.received === 1 ? 0 : 1,
			},
			isOnCloseNeeded: false,
		});
	};

	// get tabname
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				handelAdd={handelAdd}
				title={info.getTitle()}
				data={data}
				columns={columns}
				accessor={haveAccess.includes('create')}
			/>
		</div>
	);
}
