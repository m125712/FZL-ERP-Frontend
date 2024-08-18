import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useDyeingPlanningSNO } from '@/state/Dyeing';
import { useAccess, useFetch } from '@/hooks';
import { EditDelete, LinkWithCopy, DateTime } from '@/ui';
import PageInfo from '@/util/PageInfo';
import {  useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



export default function Index() {
	const { data, url, updateData, postData, deleteData, isLoading } =
		useDyeingPlanningSNO();
	const info = new PageInfo('Planning SNO', url, 'dyeing__planning_sno');
	const haveAccess = useAccess('dyeing__planning_sno');

	const navigate = useNavigate();
	
	
	const columns = useMemo(
		() => [
			// * week
			{
				accessorKey: 'week',
				header: 'Week',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// * created_by_name
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
				// cell: (info) => {
				// 	const { user_name, user_department } = info.row.original;
				// 	return (
				// 		<UserName
				// 			name={user_name}
				// 			department={user_department}
				// 		/>
				// 	);
				// },
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
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
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
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							showDelete={false}
						/>
					);
				},
			},
		],
		[data]
	);


	// Add
	const handelAdd = () => navigate('/dyeing-and-iron/planning-sno/entry');

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
				title={info.getTitle()}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
				handelAdd={handelAdd}
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
