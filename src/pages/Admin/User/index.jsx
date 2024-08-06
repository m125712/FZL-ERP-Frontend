import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { useAccess, useFetchFunc, useUpdateFunc } from '@/hooks';
import { useAdminUsers } from '@/state/Admin/user';
import { DateTime, EditDelete, ResetPassword, StatusButton } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';
import { lazy, useEffect, useMemo, useState } from 'react';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));
const ResetPass = lazy(() => import('./ResetPass'));
const PageAssign = lazy(() => import('./PageAssign'));

export default function Order() {
	const info = new PageInfo('User', 'hr/user', 'admin__user');
	const { data, isLoading, isError, updateData } = useAdminUsers();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess('admin__user');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'status',
				header: 'Status',
				enableColumnFilter: false,
				width: 'w-24',
				hidden: !haveAccess.includes('click_status'),
				cell: (info) => {
					return (
						<StatusButton
							size='btn-sm'
							value={info.getValue()}
							onClick={() => handelStatus(info.row.index)}
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
				accessorKey: 'email',
				header: 'Email',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'user_department',
				header: 'Department',
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
				accessorKey: 'reset_pass_actions',
				header: (
					<span>
						Reset
						<br />
						Password
					</span>
				),
				enableColumnFilter: false,
				enableSorting: false,
				width: 'w-24',
				hidden: !haveAccess.includes('click_reset_password'),
				cell: (info) => (
					<ResetPassword
						onClick={() => handelResetPass(info.row.index)}
					/>
				),
			},
			{
				accessorKey: 'page_assign_actions',
				header: (
					<span>
						Page
						<br />
						Assign
					</span>
				),
				enableColumnFilter: false,
				enableSorting: false,
				width: 'w-24',
				hidden: !haveAccess.includes('click_page_assign'),
				cell: (info) => {
					return (
						<ResetPassword
							onClick={() => handelPageAssign(info.row.index)}
						/>
					);
				},
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
				width: 'w-24',
				hidden: !haveAccess.includes('update'),
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
		[data]
	);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const handelAdd = () => {
		console.log(window[info?.getAddOrUpdateModalId()]);

		window[info?.getAddOrUpdateModalId()]?.showModal();
	};

	// Update
	const [updateUser, setUpdateUser] = useState({
		uuid: null,
		department_designation: null,
	});

	const handelUpdate = (idx) => {
		setUpdateUser({
			uuid: data[idx].uuid,
			department_designation: data[idx].department_designation,
		});

		window[info.getAddOrUpdateModalId()]?.showModal();
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
			itemName: data[idx].name,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	// Status
	const handelStatus = async (idx) => {
		const user = data[idx];
		const status = user?.status == 1 ? 0 : 1;
		const updated_at = GetDateTime();

		await useUpdateFunc({
			uri: `/hr/user/status/${user?.uuid}/${status}/${updated_at}/${user?.name}`,
			data: user,
			itemId: user?.uuid,
			updatedData: { status, updated_at },
			setItems: setUsers,
		});
	};

	// Reset Password
	const [resPass, setResPass] = useState({
		uuid: null,
		name: null,
	});
	const handelResetPass = async (idx) => {
		setResPass((prev) => ({
			...prev,
			uuid: data[idx]?.uuid,
			name: data[idx]?.name,
		}));

		window['reset_pass_modal'].showModal();
	};

	// Page Assign
	const [pageAssign, setPageAssign] = useState({
		uuid: null,
		name: null,
		can_access: null,
	});
	const handelPageAssign = async (idx) => {
		setPageAssign((prev) => ({
			...prev,
			uuid: data[idx]?.uuid,
			name: data[idx]?.name,
			can_access: JSON?.parse(data[idx]?.can_access),
		}));

		window['page_assign_modal'].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className='container mx-auto px-2 sm:px-4'>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
				extraClass={!haveAccess.includes('create') && 'py-2'}
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setUsers,
						updateUser,
						setUpdateUser,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setUsers}
					uri={info.getDeleteUrl()}
				/>
			</Suspense>
			<Suspense>
				<ResetPass
					modalId='reset_pass_modal'
					{...{
						resPass,
						setResPass,
						setUsers,
					}}
				/>
			</Suspense>
			<Suspense>
				<PageAssign
					modalId='page_assign_modal'
					{...{
						pageAssign,
						setPageAssign,
						setUsers,
					}}
				/>
			</Suspense>
		</div>
	);
}
