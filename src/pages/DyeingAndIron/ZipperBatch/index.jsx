import { useEffect, useMemo } from 'react';
import { useDyeingBatch } from '@/state/Dyeing';
import { useNavigate } from 'react-router-dom';
import { useAccess, useFetch } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, EditDelete, LinkWithCopy, ReactSelect } from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, url, isLoading, updateData } = useDyeingBatch();
	const info = new PageInfo('Batch', url, 'dyeing__zipper_batch');
	const { value: machine } = useFetch('/other/machine/value/label');
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
						uri='/dyeing-and-iron/zipper-batch'
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
				accessorKey: 'machine_name',
				header: 'Machine',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: 'machine_name',
			// 	header: 'Machine',
			// 	enableColumnFilter: false,
			// 	width: 'w-60',
			// 	cell: (info) => {
			// 		const { machine_uuid } = info.row.original;

			// 		return (
			// 			<ReactSelect
			// 				className={'input-xs'}
			// 				key={machine_uuid}
			// 				placeholder='Select Machine'
			// 				options={machine ?? []}
			// 				value={machine?.filter(
			// 					(item) => item.value === machine_uuid
			// 				)}
			// 				filterOption={null}
			// 				onChange={(e) => handleMachine(e, info.row.index)}
			// 				menuPortalTarget={document.body}
			// 			/>
			// 		);
			// 	},
			// },
			{
				accessorKey: 'slot',
				header: 'Slot',
				enableColumnFilter: false,
				cell: (info) => {
					const value = info.getValue();
					if (value === 0) {
						return '-';
					} else {
						return 'Slot ' + value;
					}
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
	// const handleMachine = async (e, idx) => {
	// 	await updateData.mutateAsync({
	// 		url: `${url}/${data[idx]?.uuid}`,
	// 		updatedData: {
	// 			machine_uuid: e.value,
	// 			updated_at: GetDateTime(),
	// 		},
	// 		isOnCloseNeeded: false,
	// 	});
	// };

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
