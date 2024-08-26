import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useDyeingBatch } from '@/state/Dyeing';
import { useAccess, useFetch } from '@/hooks';
import { EditDelete, LinkWithCopy, DateTime } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Index() {
	const { data, url, updateData, postData, deleteData, isLoading } =
		useDyeingBatch();
	const info = new PageInfo('Batch', url, 'dyeing__batch');
	const haveAccess = useAccess('dyeing__batch');
	const navigate = useNavigate();

	console.log(data);
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
						uri='/dyeing-and-iron/batch/details'
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
									`/dyeing-and-iron/batch/batch-production/${info.row.original.uuid}`
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
				width: 'w-40',
				enableColumnFilter: false,
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
	const handelAdd = () => navigate('/dyeing-and-iron/batch/entry');

	// Update
	const handelUpdate = (idx) => {
		const { uuid } = data[idx];

		navigate(`/dyeing-and-iron/batch/update/${uuid}`);
	};

	// get tabname
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className='container mx-auto px-2 md:px-4'>
			<ReactTable
				handelAdd={handelAdd}
				title={info.getTitle()}
				data={data}
				columns={columns}
				accessor={haveAccess.includes('create')}
				extraClass='py-2'
			/>
			{/* <Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setSwatch,
						updateSwatch,
						setUpdateSwatch,
					}}
				/>
			</Suspense> */}
		</div>
	);
}
