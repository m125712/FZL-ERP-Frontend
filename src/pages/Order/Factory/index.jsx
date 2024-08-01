import { Suspense } from "@/components/Feedback";
import ReactTable from "@/components/Table";
import { useAccess, useFetchFunc } from "@/hooks";

import { DateTime, EditDelete } from "@/ui";
import PageInfo from "@/util/PageInfo";
import { lazy, useEffect, useMemo, useState } from "react";

const AddOrUpdate = lazy(() => import("./AddOrUpdate"));
const DeleteModal = lazy(() => import("@/components/Modal/Delete"));

export default function Index() {
	const info = new PageInfo("Factory", "factory", "order__factory");

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const [factory, setFactory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess("order__factory");

	const columns = useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Name",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "party_name",
				header: "Party Name",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "phone",
				header: "Phone",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "address",
				header: "Address",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "created_at",
				header: "Created At",
				enableColumnFilter: false,
				filterFn: "isWithinRange",
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: "updated_at",
				header: "Updated",
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: "actions",
				header: "Actions",
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes("update"),
				width: "w-24",
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
		[factory]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(info.getFetchUrl(), setFactory, setLoading, setError);
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateFactory, setUpdateFactory] = useState({
		id: null,
	});

	const handelUpdate = (idx) => {
		setUpdateFactory((prev) => ({
			...prev,
			id: factory[idx].id,
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
			itemId: factory[idx].id,
			itemName: factory[idx].name,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className="container mx-auto px-2 md:px-4">
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes("create")}
				data={factory}
				columns={columns}
				extraClass="py-2"
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setFactory,
						updateFactory,
						setUpdateFactory,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setFactory}
					uri={info.getDeleteUrl()}
				/>
			</Suspense>
		</div>
	);
}
