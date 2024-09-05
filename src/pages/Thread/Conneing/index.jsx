import { Edit, Plus } from '@/assets/icons';
import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAuth } from '@/context/auth';
import { useAccess, useFetch } from '@/hooks';
import cn from '@/lib/cn';
import { useDyeingThreadBatch } from '@/state/Dyeing';
import { DateTime, EditDelete, LinkWithCopy, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//const Yarn = lazy(() => import('../ThreadBatch/Yarn'));
//const Dyeing = lazy(() => import('../ThreadBatch/Dyeing'));

export default function Index() {
	const { data, url, updateData, isLoading } = useDyeingThreadBatch();
	const info = new PageInfo('Coning', url, 'thread__coning_details');
	const { value: machine } = useFetch('/other/machine/value/label');
	const haveAccess = useAccess('thread__coning_details');
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
						uri='/thread/coning/details'
					/>
				),
			},
			{
				accessorKey: 'coning_operator_name',
				header: 'Coning Operator',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'coning_supervisor_name',
				header: 'Coning Supervisor',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'coning_machines',
				header: 'Machine Speed',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

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
		[data, machine]
	);

	// Update
	const handelUpdate = (idx) => {
		const { uuid } = data[idx];

		navigate(`/thread/coning/update/${uuid}`);
	};

	// get tabname
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable
				// handelAdd={handelAdd}
				title={info.getTitle()}
				data={data}
				columns={columns}
				// accessor={haveAccess.includes('create')}
				extraClass='py-2'
			/>
		</div>
	);
}
