import { useMemo, useState } from 'react';
import { useCommonTapeCoilDashboard } from '@/state/Common';

import ReactTable from '@/components/Table';
import { CustomLink, StatusSelect } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const [status, setStatus] = useState('bulk_pending');

	const options = [
		{ value: 'bulk_pending', label: 'Bulk Pending' },
		{ value: 'bulk_completed', label: 'Bulk Completed' },
		{ value: 'bulk_all', label: 'Bulk All' },
		{ value: 'sample_pending', label: 'Sample Pending' },
		{ value: 'sample_completed', label: 'Sample Completed' },
		{ value: 'sample_all', label: 'Sample All' },
	];

	const { data, isLoading } = useCommonTapeCoilDashboard(`type=${status}`);

	const info = new PageInfo(
		'Common/Dashboard',
		'common/dashboard',
		'common__dashboard'
	);

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
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'zipper_number_name',
				header: 'Zipper No.',
				enableColumnFilter: false,
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
				accessorKey: 'tape_received',
				header: (
					<div>
						Tape <br />
						to Dyeing
					</div>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_tape_production',
				header: (
					<div>
						Tape <br />
						Production
					</div>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'tape_transferred',
				header: (
					<div>
						Tape <br />
						Transferred
					</div>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data, status]
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
