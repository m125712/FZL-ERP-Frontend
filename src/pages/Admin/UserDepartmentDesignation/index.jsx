import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc } from '@/hooks';
import { EditDelete } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const info = new PageInfo(
		'Department',
		'user-department-designation',
		'admin__user_department'
	);

	const [department, setDepartment] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess('admin__user_department');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'department',
				header: 'Department',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'designation',
				header: 'Designation',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
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
							handelDelete={handelDelete}
							showDelete={haveAccess.includes('delete')}
						/>
					);
				},
			},
		],
		[department]
	);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
		useFetchFunc(info.getFetchUrl(), setDepartment, setLoading, setError);
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateDepartment, setUpdateDepartment] = useState({
		id: null,
	});

	const handelUpdate = (idx) => {
		setUpdateDepartment((prev) => ({
			...prev,
			id: department[idx].id,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Delete
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});
	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: department[idx].id,
			itemName: department[idx].name,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className=''>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={department}
				columns={columns}
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setDepartment,
						updateDepartment,
						setUpdateDepartment,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setDepartment}
					uri={info.getDeleteUrl()}
				/>
			</Suspense>
		</div>
	);
}
