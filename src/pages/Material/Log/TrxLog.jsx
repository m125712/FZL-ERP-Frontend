import { Suspense } from "@/components/Feedback";
import ReactTable from "@/components/Table";
import { useAccess, useFetchFunc } from "@/hooks";

import { DateTime, EditDelete, SectionName } from "@/ui";
import PageInfo from "@/util/PageInfo";
import { lazy, useEffect, useMemo, useState } from "react";

const TrxLogAddOrUpdate = lazy(() => import("./TrxLogAddOrUpdate"));
const DeleteModal = lazy(() => import("@/components/Modal/Delete"));

export default function Index() {
	const info = new PageInfo("Log", "material/trx");
	const [materialTrx, setMaterialTrx] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess("store__log");

	const columns = useMemo(
		() => [
			{
				accessorKey: "material_name",
				header: "Name",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "trx_to",
				header: "Section",
				enableColumnFilter: false,
				cell: (info) => <SectionName section={info.getValue()} />,
			},
			{
				accessorKey: "quantity",
				header: "Quantity",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "unit",
				header: "Unit",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "issued_by_name",
				header: "Issued By",
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
				accessorKey: "created_at",
				header: "Created At",
				filterFn: "isWithinRange",
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: "updated_at",
				header: "Updated At",
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
				hidden: !haveAccess.includes("update_log"),
				width: "w-24",
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes("delete_log")}
						/>
					);
				},
			},
		],
		[materialTrx]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(info.getFetchUrl(), setMaterialTrx, setLoading, setError);
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateMaterialTrx, setUpdateMaterialTrx] = useState({
		id: null,
		material_name: null,
		stock: null,
	});

	const handelUpdate = (idx) => {
		setUpdateMaterialTrx((prev) => ({
			...prev,
			id: materialTrx[idx]?.id,
			material_name: materialTrx[idx]?.material_name
				.replace(/#/g, "")
				.replace(/\//g, "-"),
			stock: materialTrx[idx]?.stock,
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
			itemId: materialTrx[idx].id,
			itemName: materialTrx[idx].material_name
				.replace(/#/g, "")
				.replace(/\//g, "-"),
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className="container px-2 md:px-4">
			<ReactTable
				title={info.getTitle()}
				data={materialTrx}
				columns={columns}
				extraClass="py-2"
			/>

			<Suspense>
				<TrxLogAddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setMaterialTrx,
						updateMaterialTrx,
						setUpdateMaterialTrx,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setMaterialTrx}
					uri={info.getDeleteUrl()}
				/>
			</Suspense>
		</div>
	);
}
