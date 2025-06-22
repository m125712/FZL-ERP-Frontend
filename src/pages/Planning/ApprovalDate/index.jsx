import { useMemo, useState } from 'react';
import { useOtherRecipe } from '@/state/Other';
import { usePlanningApprovalDate } from '@/state/Planning';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { DateTime, LinkWithCopy, StatusSelect } from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

const options = [
	{ value: 'all', label: 'All' },
	{ value: 'pending', label: 'Pending' },
	{ value: 'completed', label: 'Completed' },
];

const options2 = [
	{ value: 'complete_order', label: 'Complete Order' },
	{ value: 'incomplete_order', label: 'Incomplete Order' },
];

export default function Index() {
	const [status, setStatus] = useState('pending');
	const [status2, setStatus2] = useState('incomplete_order');

	const { data, isLoading, updateData } = usePlanningApprovalDate(
		status2 === 'complete_order'
			? `order_type=${status2}`
			: `type=${status}&order_type=${status2}`
	);
	const info = new PageInfo(
		'Planning/Approval Date',
		'',
		'lab_dip__zipper_swatch'
	);
	const haveAccess = useAccess('planning__approval_date');

	const handleBulkApprovalDate = async (idx) => {
		await updateData.mutateAsync({
			url: `/zipper/bulk-approval/${data[idx]?.uuid}`,
			updatedData: {
				bulk_approval: data[idx]?.bulk_approval ? false : true,
				bulk_approval_date: data[idx]?.bulk_approval
					? null
					: GetDateTime(),
				updated_at: GetDateTime(),
			},
			isOnCloseNeeded: false,
		});
	};

	const { data: recipe } = useOtherRecipe(`approved=true`);
	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				cell: (info) => {
					const { order_number } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={order_number}
							uri='/order/details'
						/>
					);
				},
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				// enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => {
					const { order_description_uuid, order_number } =
						info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={order_description_uuid}
							uri={`/order/details/${order_number}`}
						/>
					);
				},
			},
			// {
			// 	accessorKey: 'order_type',
			// 	header: 'Type',
			// 	width: 'w-24',
			// 	// enableColumnFilter: false,
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'style',
				header: 'Style',
				width: 'w-40',
				// enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				width: 'w-40',
				// enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'size',
				header: 'Size',
				width: 'w-24',
				// enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) => {
					if (row.order_type === 'tape') return 'MTR';

					return row.is_inch === 1 ? 'INCH' : 'CM';
				},
				id: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'quantity',
				header: (
					<>
						QTY <br />
						(PCS)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'bleaching',
				header: 'Bleach',
				enableColumnFilter: true,
				enableSorting: true,
				// cell: (info) => {
				// 	const isBleach = info.getValue() === 'bleach';
				// 	return (
				// 		<StatusButton className={'btn-xs'} value={isBleach} />
				// 	);
				// },
			},
			{
				accessorKey: 'receive_by_factory_time',
				header: (
					<>
						Factory <br />
						Received
					</>
				),
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.receive_by_factory_time}
					/>
				),
			},
			{
				accessorKey: 'swatch_approval_date',
				header: <>Swatch App.</>,
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime date={info.row.original.swatch_approval_date} />
				),
			},
			{
				accessorFn: (row) => {
					if (row.bulk_approval === null) return null;

					return format(row.bulk_approval_date, 'dd/MM/yyyy');
				},
				id: 'bulk_approval',
				header: (
					<>
						Bulk Approval <br />
					</>
				),
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => (
					<div className='flex flex-col'>
						<SwitchToggle
							disabled={!haveAccess}
							onChange={() => {
								handleBulkApprovalDate(info.row.index);
							}}
							checked={info.row.original.bulk_approval === true}
						/>
						<DateTime date={info.row.original.bulk_approval_date} />
					</div>
				),
			},
		],
		[data, recipe, haveAccess]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				extraButton={
					<>
						{status2 === 'incomplete_order' && (
							<StatusSelect
								options={options}
								status={status}
								setStatus={setStatus}
							/>
						)}
						<StatusSelect
							options={options2}
							status={status2}
							setStatus={setStatus2}
						/>
					</>
				}
			/>
		</div>
	);
}
