import { Suspense } from "@/components/Feedback";
import ReactTable from "@/components/Table";
import { useAccess, useFetchFunc } from "@/hooks";

import { DateTime, EditDelete, SectionName } from "@/ui";
import PageInfo from "@/util/PageInfo";
import { lazy, useEffect, useMemo, useState } from "react";

const OrderTrxLogAddOrUpdate = lazy(() => import("./OrderTrxLogAddOrUpdate"));
const DeleteModal = lazy(() => import("@/components/Modal/Delete"));

export default function Index() {
	const info = new PageInfo("Log Against Order", "material/trx-to/sfg");
	const [materialTrxToOrder, setMaterialTrxToOrder] = useState([]);
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
				accessorKey: "order_number",
				header: "Order Number",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "item_description",
				header: "Item Description",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "style_size_color",
				header: "Style / Size / Color",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "trx_to",
				header: "Section",
				enableColumnFilter: false,
				cell: (info) => (
					<span className="capitalize">
						{/* replace _ with space */}
						{info.getValue().replace(/_/g, " ")}
					</span>
				),
			},
			{
				accessorKey: "trx_quantity",
				header: "Transferred QTY",
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
				hidden: !haveAccess.includes("update_log_against_order"),
				width: "w-24",
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes(
								"delete_log_against_order"
							)}
						/>
					);
				},
			},
		],
		[materialTrxToOrder]
	);

	// console.log("materialTrxToOrder", materialTrxToOrder);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(
			info.getFetchUrl(),
			setMaterialTrxToOrder,
			setLoading,
			setError
		);
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateMaterialTrxToOrder, setUpdateMaterialTrxToOrder] = useState({
		id: null,
		material_name: null,
		trx_quantity: null,
		stock: null,
	});

	const handelUpdate = (idx) => {
		setUpdateMaterialTrxToOrder((prev) => ({
			...prev,
			id: materialTrxToOrder[idx]?.id,
			material_name: materialTrxToOrder[idx]?.material_name
				.replace(/#/g, "")
				.replace(/\//g, "-"),
			trx_quantity: materialTrxToOrder[idx]?.trx_quantity,
			stock: materialTrxToOrder[idx]?.stock,
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
			itemId: materialTrxToOrder[idx].id,
			itemName: materialTrxToOrder[idx].material_name
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
				data={materialTrxToOrder}
				columns={columns}
				extraClass="py-2"
			/>

			<Suspense>
				<OrderTrxLogAddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setMaterialTrxToOrder,
						updateMaterialTrxToOrder,
						setUpdateMaterialTrxToOrder,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setMaterialTrxToOrder}
					uri={info.getDeleteUrl()}
				/>
			</Suspense>
		</div>
	);
}
