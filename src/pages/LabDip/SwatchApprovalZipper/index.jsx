import { useCallback, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useDyeingDummy, useSwatchApprovalZipper } from '@/state/Dyeing';
import { useOtherRecipe } from '@/state/Other';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import {
	DateTime,
	LinkWithCopy,
	ReactSelect,
	StatusButton,
	StatusSelect,
} from '@/ui';

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
	const { user } = useAuth();

	const [status, setStatus] = useState('pending');
	const [status2, setStatus2] = useState('incomplete_order');

	const { data, isLoading, updateData } = useSwatchApprovalZipper(
		status2 === 'complete_order'
			? `order_type=${status2}`
			: `type=${status}&order_type=${status2}`
	);

	const info = new PageInfo(
		'Swatch Approval (Zipper)',
		'/lab-dip/swatch-approval-zipper',
		'lab_dip__swatch_approval_zipper'
	);
	const haveAccess = useAccess('lab_dip__swatch_approval_zipper');

	const handleSwatchApprovalDate = async (idx) => {
		await updateData.mutateAsync({
			url: `/zipper/swatch-approval-received/${data[idx]?.uuid}`,
			updatedData: {
				swatch_approval_received: data[idx]?.swatch_approval_received
					? false
					: true,
				swatch_approval_received_date: data[idx]
					?.swatch_approval_received
					? null
					: GetDateTime(),
				swatch_approval_received_by: user?.uuid,
			},
			isOnCloseNeeded: false,
		});
	};

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
				accessorKey: 'color_ref',
				header: 'Color Ref',
				// enableColumnFilter: true,
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
				accessorFn: (row) => (row.is_batch_created ? 'Yes' : 'No'),
				id: 'is_dyeing_batch_entry',
				header: (
					<>
						Batch <br />
						Created
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton
						className={'btn-xs'}
						value={info.row.original.is_batch_created}
					/>
				),
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
				accessorFn: (row) =>
					row.swatch_approval_received ? 'Yes' : 'No',
				id: 'swatch_approval_received',
				header: (
					<>
						Swatch <br />
						App.
					</>
				),
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => (
					<div className='flex flex-col'>
						<SwitchToggle
							disabled={
								!haveAccess.includes('click_swatch_status')
							}
							onChange={() => {
								handleSwatchApprovalDate(info.row.index);
							}}
							checked={
								info.row.original.swatch_approval_received ===
								true
							}
						/>
						{/* <DateTime date={info.row.original.bulk_approval_date} /> */}
						<span>
							{info.row.original.swatch_approval_received_by_name}
						</span>
					</div>
				),
			},
			{
				accessorFn: (row) => {
					if (row.swatch_approval_received_date === null) return null;

					return format(
						row.swatch_approval_received_date,
						'dd/MM/yyyy'
					);
				},
				id: 'swatch_approval_received_date',
				header: (
					<>
						Swatch App <br />
						Rcv Date
					</>
				),
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.swatch_approval_received_date}
					/>
				),
			},
			{
				accessorKey: 'color_ref_entry_date',
				header: (
					<>
						Color Ref <br /> Entry
					</>
				),
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'color_ref_update_date',
				header: (
					<>
						Color Ref <br /> Update
					</>
				),
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
		],
		[data, haveAccess]
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
