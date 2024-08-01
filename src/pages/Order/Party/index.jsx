import { Suspense } from "@/components/Feedback";
import ReactTable from "@/components/Table";
import { useAccess, useFetchFunc } from "@/hooks";

import { EditDelete } from "@/ui";
import PageInfo from "@/util/PageInfo";
import { lazy, useEffect, useMemo, useState } from "react";

const AddOrUpdate = lazy(() => import("./AddOrUpdate"));
const DeleteModal = lazy(() => import("@/components/Modal/Delete"));

export default function Index() {
	const info = new PageInfo("Party", "party", "order__party");

	const [party, setParty] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess("order__party");

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Name",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "short_name",
				header: "Short Name",
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
		[party]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(info.getFetchUrl(), setParty, setLoading, setError);
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateParty, setUpdateParty] = useState({
		id: null,
	});

	const handelUpdate = (idx) => {
		setUpdateParty((prev) => ({
			...prev,
			id: party[idx].id,
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
			itemId: party[idx].id,
			itemName: party[idx].name,
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
				data={party}
				columns={columns}
				extraClass="py-2"
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setParty,
						updateParty,
						setUpdateParty,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setParty}
					uri={info.getDeleteUrl()}
				/>
			</Suspense>
		</div>
	);
}
