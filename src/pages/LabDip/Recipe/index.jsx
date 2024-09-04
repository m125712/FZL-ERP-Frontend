import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import { useLabDipRecipe } from '@/state/LabDip';
import { EditDelete, LinkWithCopy, StatusButton, UserName } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Index() {
	const { data, isLoading, isError, url } = useLabDipRecipe();
	const navigate = useNavigate();
	const info = new PageInfo('Lab Dip/Recipe', url, 'lab_dip__recipe');
	const haveAccess = useAccess('lab_dip__recipe');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'recipe_id',
				header: 'ID',
				width: 'w-12',
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={uuid}
							uri='/lab-dip/recipe/details'
						/>
					);
				},
			},
			{
				accessorKey: 'name',
				header: 'Recipe Name',
				enableColumnFilter: false,
				// width: 'w-12',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'approved',
				header: 'Approved',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-sm' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'status',
				header: 'Status',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-sm' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'action',
				header: 'Action',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							showEdit={haveAccess.includes('update')}
							showDelete={false}
						/>
					);
				},
			},
		],
		[data]
	);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => navigate('/lab-dip/recipe/entry');

	// Update
	const handelUpdate = (idx) => {
		const { recipe_id, uuid } = data[idx];

		navigate(`/lab-dip/recipe/update/${recipe_id}/${uuid}`);
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
				handelAdd={handelAdd}
			/>
		</div>
	);
}
