import { Suspense } from "@/components/Feedback";
import ReactTable from "@/components/Table";
import { useAccess, useFetchFunc } from "@/hooks";
import { EditDelete, LinkWithCopy, Transfer } from "@/ui";
import PageInfo from "@/util/PageInfo";
import { lazy, useEffect, useMemo, useState } from "react";

const AddOrUpdate = lazy(() => import("./AddOrUpdate"));
const DeleteModal = lazy(() => import("@/components/Modal/Delete"));
const AgainstOrderTransfer = lazy(() => import("./AgainstOrderTransfer"));
const MaterialTrx = lazy(() => import("./MaterialTrx"));

export default function Index() {
	const info = new PageInfo("Stock", "material/details", "store__stock");
	const [materialDetails, setMaterialDetails] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess("store__stock");

	const belowThreshold = useMemo(
		() =>
			materialDetails.filter(({ threshold, stock }) => threshold > stock)
				?.length,
		[materialDetails]
	);

	const columns = useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Name",
				enableColumnFilter: false,
				width: "w-48",
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.row.original.id}
						uri="/material"
					/>
				),
			},
			{
				accessorKey: "threshold",
				header: "Threshold",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "stock",
				header: "Stock",
				enableColumnFilter: false,
				cell: (info) => {
					const cls =
						Number(info.row.original.threshold) >
						Number(info.getValue())
							? "text-error bg-error/10 px-2 py-1 rounded-md"
							: "";
					return <span className={cls}>{info.getValue()}</span>;
				},
			},
			{
				accessorKey: "unit",
				header: "Unit",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "action_trx",
				header: "Action",
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes("click_action"),
				width: "w-24",
				cell: (info) =>
					info.row.original.stock > 0 && (
						<Transfer onClick={() => handleTrx(info.row.index)} />
					),
			},
			{
				accessorKey: "action_trx_against_order",
				header: "Trx Against Order",
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes("click_trx_against_order"),
				width: "w-24",
				cell: (info) =>
					info.row.original.stock > 0 && (
						<Transfer
							onClick={() =>
								handleTrxAgainstOrder(info.row.index)
							}
						/>
					),
			},
			{
				accessorKey: "section_name",
				header: "Section",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "material_type",
				header: "Type",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "description",
				header: "Description",
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
		[materialDetails]
	);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
		useFetchFunc(
			info.getFetchUrl(),
			setMaterialDetails,
			setLoading,
			setError
		);
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateMaterialDetails, setUpdateMaterialDetails] = useState({
		id: null,
		section_id: null,
		section_name: null,
		type_id: null,
		type_name: null,
		name: null,
		threshold: null,
		stock: null,
		unit: null,
		description: null,
		remarks: null,
		material_stock_id: null,
	});

	const handelUpdate = (idx) => {
		const selectedItem = materialDetails[idx];
		setUpdateMaterialDetails((prev) => ({
			...prev,
			...selectedItem,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	const handleTrx = (index) => {
		const selectedItem = materialDetails[index];
		setUpdateMaterialDetails((prev) => ({
			...prev,
			...selectedItem,
		}));
		window["MaterialTrx"].showModal();
	};

	const handleTrxAgainstOrder = (index) => {
		const selectedItem = materialDetails[index];
		setUpdateMaterialDetails((prev) => ({
			...prev,
			...selectedItem,
		}));
		window["MaterialTrxAgainstOrder"].showModal();
	};

	// Delete
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});
	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: materialDetails[idx].id,
			itemName: materialDetails[idx].name
				.replace(/#/g, "")
				.replace(/\//g, "-"),
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
				data={materialDetails}
				columns={columns}
				extraClass="py-2"
				indicatorValue={belowThreshold}
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setMaterialDetails,
						updateMaterialDetails,
						setUpdateMaterialDetails,
					}}
				/>
			</Suspense>
			<Suspense>
				<AgainstOrderTransfer
					modalId={"MaterialTrxAgainstOrder"}
					setMaterialDetails={setMaterialDetails}
					updateMaterialDetails={updateMaterialDetails}
					setUpdateMaterialDetails={setUpdateMaterialDetails}
				/>
			</Suspense>
			<Suspense>
				<MaterialTrx
					modalId={"MaterialTrx"}
					setMaterialDetails={setMaterialDetails}
					updateMaterialDetails={updateMaterialDetails}
					setUpdateMaterialDetails={setUpdateMaterialDetails}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setMaterialDetails}
					uri={info.getDeleteUrl()}
				/>
			</Suspense>
		</div>
	);
}
