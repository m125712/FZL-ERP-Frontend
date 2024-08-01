import { Suspense } from "@/components/Feedback";
import ReactTable from "@/components/Table";
import { useAccess, useFetchFunc } from "@/hooks";
import { EditDelete } from "@/ui";
import PageInfo from "@/util/PageInfo";
import { lazy, useEffect, useMemo, useState } from "react";

const AddOrUpdate = lazy(() => import("./AddOrUpdate"));
const DeleteModal = lazy(() => import("@/components/Modal/Delete"));

const NameCell = ({ value }) => (
	<span className="capitalize">{value().replace(/_/g, " ")}</span>
);
export default function Index() {
	const info = new PageInfo(
		"Properties",
		"order/properties",
		"order__properties"
	);

	const [orderProperties, setOrderProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess("order__properties");

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Name",
				enableColumnFilter: false,
				cell: (info) => <NameCell value={info.getValue} />,
			},
			{
				accessorKey: "type",
				header: "Type",
				enableColumnFilter: false,
				cell: (info) => <NameCell value={info.getValue} />,
			},
			{
				accessorKey: "short_name",
				header: "Short Name",
				enableColumnFilter: false,
				cell: (info) => <NameCell value={info.getValue} />,
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
		[orderProperties]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(
			info.getFetchUrl(),
			setOrderProperties,
			setLoading,
			setError
		);
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateOrderProperties, setUpdateOrderProperties] = useState({
		id: null,
	});

	const handelUpdate = (idx) => {
		setUpdateOrderProperties((prev) => ({
			...prev,
			id: orderProperties[idx].id,
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
			itemId: orderProperties[idx].id,
			itemName: orderProperties[idx].name,
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
				data={orderProperties}
				columns={columns}
				extraClass="py-2"
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setOrderProperties,
						updateOrderProperties,
						setUpdateOrderProperties,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setOrderProperties}
					uri={info.getDeleteUrl()}
				/>
			</Suspense>
		</div>
	);
}
