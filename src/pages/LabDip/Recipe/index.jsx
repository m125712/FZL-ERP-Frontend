import { useEffect, useMemo } from 'react';
import { useLabDipRecipe } from '@/state/LabDip';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, EditDelete, LinkWithCopy } from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, isLoading, isError, url, updateData } = useLabDipRecipe();
	const navigate = useNavigate();
	const info = new PageInfo('Lab Dip/Recipe', url, 'lab_dip__recipe');
	const haveAccess = useAccess('lab_dip__recipe');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'recipe_id',
				header: 'ID',
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
				width: 'w-36',
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'bleaching',
				header: 'Bleaching',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<span className='capitalize'>{info.getValue()}</span>
					);
				},
			},
			{
				accessorKey: 'sub_streat',
				header: 'Substrate',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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

		navigate(`/lab-dip/recipe/${recipe_id}/${uuid}/update`);
	};
	const handelApprovedStatusChange = async (idx) => {
		await updateData.mutateAsync({
			url: `${url}/${data[idx]?.uuid}`,
			updatedData: {
				approved: data[idx]?.approved === 1 ? 0 : 1,
				approved_date: data[idx]?.approved === 1 ? null : GetDateTime(),
			},
			isOnCloseNeeded: false,
		});
	};
	const handelStatusChange = async (idx) => {
		await updateData.mutateAsync({
			url: `${url}/${data[idx]?.uuid}`,
			updatedData: {
				status: data[idx]?.status === 1 ? 0 : 1,
				updated_at: GetDateTime(),
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
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
				handelAdd={handelAdd}
			/>
		</div>
	);
}
