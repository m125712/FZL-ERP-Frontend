import { useMemo, useState } from 'react';
import { useCommonTapeCoilDashboard } from '@/state/Common';
import { useOtherTapeCoil } from '@/state/Other';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { CustomLink, ReactSelect, StatusButton, StatusSelect } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const [status, setStatus] = useState('bulk_pending');
	// options for extra table select
	const options = [
		{ value: 'bulk_pending', label: 'Bulk Pending' },
		{ value: 'bulk_completed', label: 'Bulk Completed' },
		{ value: 'bulk_all', label: 'Bulk All' },
		{ value: 'sample_pending', label: 'Sample Pending' },
		{ value: 'sample_completed', label: 'Sample Completed' },
		{ value: 'sample_all', label: 'Sample All' },
	];

	const { data, updateData, isLoading } = useCommonTapeCoilDashboard(
		`type=${status}`
	);

	const info = new PageInfo(
		'Common/Dashboard',
		'common/dashboard',
		'common__dashboard'
	);

	const haveAccess = useAccess('common__dashboard');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				cell: (info) => {
					const { order_number } = info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/order/details/${order_number}`}
						/>
					);
				},
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				// enableColumnFilter: false,
				cell: (info) => {
					const { order_description_uuid, order_number } =
						info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/order/details/${order_number}/${order_description_uuid}`}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorKey: 'item_name',
				header: 'Item',
				enableColumnFilter: false,
				width: 'w-40',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'zipper_number_name',
				header: 'Zipper No.',
				enableColumnFilter: false,
				width: 'w-40',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'tape_coil_name',
				header: 'Tape Coil Name',
				enableColumnFilter: false,
				width: 'w-40',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_trx_to_dyeing_quantity',
				header: 'Total Trx to Dyeing Qty',
				enableColumnFilter: false,
				width: 'w-40',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'tape_received',
				header: 'Tape Received',
				enableColumnFilter: false,
				width: 'w-40',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'tape_transferred',
				header: 'Tape Transferred',
				enableColumnFilter: false,
				width: 'w-40',
				cell: (info) => info.getValue(),
			},
		],
		[data, status]
	);

	const handleSwatchStatus = async (e, idx) => {
		await updateData.mutateAsync({
			url: `/zipper/order/description/update/by/${e.value}`,
			updatedData: {
				order_description_uuid: data[idx].order_description_uuid,
			},
			isOnCloseNeeded: false,
		});
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				extraButton={
					<StatusSelect
						status={status}
						setStatus={setStatus}
						options={options}
					/>
				}
			/>
		</div>
	);
}
