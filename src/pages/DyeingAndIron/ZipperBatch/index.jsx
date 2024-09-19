import { useEffect, useMemo } from 'react';
import { useDyeingBatch } from '@/state/Dyeing';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, EditDelete, LinkWithCopy } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, url, isLoading } = useDyeingBatch();
	const info = new PageInfo('Batch', url, 'dyeing__zipper_batch');
	const haveAccess = useAccess('dyeing__zipper_batch');
	const navigate = useNavigate();

	const columns = useMemo(
		() => [
			// * batch_id
			{
				accessorKey: 'batch_id',
				header: 'Batch ID',
				enableColumnFilter: false,
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.row.original.uuid}
						uri='/dyeing-and-iron/batch'
					/>
				),
			},
			{
				accessorKey: 'add_actions',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('create'),
				width: 'w-24',
				cell: (info) => {
					const { week } = info.row.original;
					return (
						<button
							className='btn btn-primary btn-xs'
							onClick={() =>
								navigate(
									`/dyeing-and-iron/zipper-batch/batch-production/${info.row.original.uuid}`
								)
							}>
							Add Production
						</button>
					);
				},
			},
			{
				accessorKey: 'batch_status',
				header: 'Status',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
						showEdit={haveAccess.includes('update')}
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
