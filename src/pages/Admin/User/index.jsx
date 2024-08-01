import { Suspense } from "@/components/Feedback";
import ReactTable from "@/components/Table";
import { useAccess, useFetchFunc, useUpdateFunc } from "@/hooks";
import { DateTime, EditDelete, ResetPassword, StatusButton } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import PageInfo from "@/util/PageInfo";
import { lazy, useEffect, useMemo, useState } from "react";

const AddOrUpdate = lazy(() => import("./AddOrUpdate"));
const DeleteModal = lazy(() => import("@/components/Modal/Delete"));
const ResetPass = lazy(() => import("./ResetPass"));
const PageAssign = lazy(() => import("./PageAssign"));

export default function Order() {
	const info = new PageInfo("User", "user", "admin__user");
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess("admin__user");

	const columns = useMemo(
		() => [
			{
				accessorKey: "status",
				header: "Status",
				enableColumnFilter: false,
				width: "w-24",
				hidden: !haveAccess.includes("click_status"),
				cell: (info) => {
					return (
						<StatusButton
							size="btn-sm"
							value={info.getValue()}
							onClick={() => handelStatus(info.row.index)}
						/>
					);
				},
			},
			{
				accessorKey: "name",
				header: "Name",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "email",
				header: "Email",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "user_department",
				header: "Department",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "remarks",
				header: "Remarks",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: "reset_pass_actions",
				header: (
					<span>
						Reset
						<br />
						Password
					</span>
				),
				enableColumnFilter: false,
				enableSorting: false,
				width: "w-24",
				hidden: !haveAccess.includes("click_reset_password"),
				cell: (info) => (
					<ResetPassword
						onClick={() => handelResetPass(info.row.index)}
					/>
				),
			},
			{
				accessorKey: "page_assign_actions",
				header: (
					<span>
						Page
						<br />
						Assign
					</span>
				),
				enableColumnFilter: false,
				enableSorting: false,
				width: "w-24",
				hidden: !haveAccess.includes("click_page_assign"),
				cell: (info) => {
					return (
						<ResetPassword
							onClick={() => handelPageAssign(info.row.index)}
						/>
					);
				},
			},
			{
				accessorKey: "created_at",
				header: "Created",
				filterFn: "isWithinRange",
				enableColumnFilter: false,
				width: "w-24",
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: "updated_at",
				header: "Updated",
				enableColumnFilter: false,
				width: "w-24",
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: "actions",
				header: "Actions",
				enableColumnFilter: false,
				enableSorting: false,
				width: "w-24",
				hidden: !haveAccess.includes("update"),
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes("delete")}
						/>
					);
				},
			},
		],
		[users]
	);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
		useFetchFunc(info.getFetchUrl(), setUsers, setLoading, setError);
	}, []);

	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateUser, setUpdateUser] = useState({
		id: null,
		department_designation: null,
	});

	const handelUpdate = (idx) => {
		setUpdateUser({
			id: users[idx].id,
			department_designation: users[idx].department_designation,
		});
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
			itemId: users[idx].id,
			itemName: users[idx].name,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	// Status
	const handelStatus = async (idx) => {
		const user = users[idx];
		const status = user?.status == 1 ? 0 : 1;
		const updated_at = GetDateTime();

		await useUpdateFunc({
			uri: `/user/status/${user?.id}/${status}/${updated_at}/${user?.name}`,
			data: user,
			itemId: user?.id,
			updatedData: { status, updated_at },
			setItems: setUsers,
		});
	};

	// Reset Password
	const [resPass, setResPass] = useState({
		id: null,
		name: null,
	});
	const handelResetPass = async (idx) => {
		setResPass((prev) => ({
			...prev,
			id: users[idx]?.id,
			name: users[idx]?.name,
		}));

		window["reset_pass_modal"].showModal();
	};

	// Page Assign
	const [pageAssign, setPageAssign] = useState({
		id: null,
		name: null,
		can_access: null,
	});
	const handelPageAssign = async (idx) => {
		setPageAssign((prev) => ({
			...prev,
			id: users[idx]?.id,
			name: users[idx]?.name,
			can_access: JSON?.parse(users[idx]?.can_access),
		}));

		window["page_assign_modal"].showModal();
	};

	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className="container mx-auto px-2 sm:px-4">
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes("create")}
				data={users}
				columns={columns}
				extraClass={!haveAccess.includes("create") && "py-2"}
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
					modalId="reset_pass_modal"
					{...{
						resPass,
						setResPass,
						setUsers,
					}}
				/>
			</Suspense>
			<Suspense>
				<PageAssign
					modalId="page_assign_modal"
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
