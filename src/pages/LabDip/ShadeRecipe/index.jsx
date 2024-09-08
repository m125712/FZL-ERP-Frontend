import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';
import cn from '@/lib/cn';
import { useLabDipShadeRecipeDescription } from '@/state/LabDip';
import { DateTime, EditDelete, LinkOnly } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, url, deleteData, updateData } =
		useLabDipShadeRecipeDescription();

	const navigate = useNavigate();
	const info = new PageInfo('Details', url, 'lab_dip__shade_recipe');
	const haveAccess = useAccess('lab_dip__shade_recipe');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'shade_recipe_id',
				header: 'ID',
				enableColumnFilter: false,
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<LinkOnly
							uri='/lab-dip/shade_recipe/details'
							id={uuid}
							title={info.getValue()}
						/>
					);
				},
			},
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'sub_streat',
				header: 'Sub Streat',
				enableColumnFilter: false,
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
				accessorKey: 'lab_status',
				header: 'Lab Status',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<input
							onChange={() => handelStatusChange(info.row.index)}
							checked={info.getValue() === 1}
							type='checkbox'
							className={cn(
								'toggle toggle-md checked:toggle-accent'
							)}
							defaultChecked
						/>
					);
				},
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden:
					!haveAccess.includes('update') &&
					!haveAccess.includes('delete'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes('delete')}
							showUpdate={haveAccess.includes('update')}
						/>
					);
				},
			},
		],
		[data]
	);

	// Add
	const handelAdd = () => navigate('/lab-dip/shade_recipe/entry');
	// Update
	const handelUpdate = (idx) => {
		const { uuid } = data[idx];
		navigate(`/lab-dip/shade_recipe/update/${uuid}`);
	};
	const handelStatusChange = async (idx) => {
		await updateData.mutateAsync({
			url: `${url}/${data[idx]?.uuid}`,
			updatedData: {
				lab_status: data[idx]?.lab_status === 1 ? 0 : 1,
				updated_at: GetDateTime(),
			},
			isOnCloseNeeded: false,
		});
	};
	// Delete
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});
	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: data[idx].uuid,
			itemName: data[idx].uuid,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
			/>

			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url,
						deleteData,
					}}
				/>
			</Suspense>
		</>
	);
}
