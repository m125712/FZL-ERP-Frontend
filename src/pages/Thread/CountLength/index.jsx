import { Suspense } from "@/components/Feedback";
import ReactTable from "@/components/Table";
import { useAccess, useFetchFunc } from "@/hooks";
import { DateTime, EditDelete } from "@/ui";
import PageInfo from "@/util/PageInfo";
import { lazy, useEffect, useMemo, useState } from "react";

const AddOrUpdate = lazy(() => import("./AddOrUpdate"));
const DeleteModal = lazy(() => import("@/components/Modal/Delete"));

export default function Index() {
	const info = new PageInfo(
		"Count Length",
		"thread/count-length",
		"thread__count_length"
	);

	const [countLength, setCountLength] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess("thread__count_length");

	const columns = useMemo(
		() => [
			{
				accessorKey: "count_length",
				header: "Count Length",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "weight",
				header: "Weight",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "sst",
				header: "SST",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "created_at",
				header: "Created",
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: "updated_at",
				header: "Updated",
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
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
		[countLength]
	);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
		useFetchFunc(info.getFetchUrl(), setCountLength, setLoading, setError);
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateCountLength, setUpdateCountLength] = useState({
		id: null,
	});

	const handelUpdate = (idx) => {
		setUpdateCountLength((prev) => ({
			...prev,
			id: countLength[idx].id,
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
			itemId: countLength[idx].id,
			itemName: countLength[idx].name,
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
				data={countLength}
				columns={columns}
				extraClass="py-2"
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setCountLength,
						updateCountLength,
						setUpdateCountLength,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setCountLength}
					uri={info.getDeleteUrl()}
				/>
			</Suspense>
		</div>
	);
}
