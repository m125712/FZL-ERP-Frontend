import { Suspense } from "@/components/Feedback";
import { DeleteModal } from "@/components/Modal";
import ReactTable from "@/components/Table";
import { useAccess, useFetchFunc } from "@/hooks";
import { EditDelete } from "@/ui";
import PageInfo from "@/util/PageInfo";
import React, { useEffect, useMemo, useState } from "react";
import AddOrUpdate from "./AddOrUpdate";

export default function ProductionLog() {
	const info = new PageInfo(
		"Coil Production Log",
		"tape-or-coil-prod-section/coil"
	);
	const [coilLog, setCoilLog] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess("common__coil_log");

	const columns = useMemo(
		() => [
			{
				accessorKey: "type_of_zipper",
				header: "Type of Zipper",
				enableColumnFilter: false,
				cell: (info) => (
					<span className="capitalize">{info.getValue()}</span>
				),
			},
			{
				accessorKey: "prod_quantity",
				header: (
					<span>
						Quantity
						<br />
						(KG)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "wastage",
				header: (
					<span>
						Wastage
						<br />
						(KG)
					</span>
				),
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
				accessorKey: "actions",
				header: "Actions",
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes("click_update_coil_production"),
				width: "w-24",
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes(
								"click_delete_coil_production"
							)}
						/>
					);
				},
			},
		],
		[coilLog]
	);

	// Update
	const [updateCoilLog, setUpdateCoilLog] = useState({
		id: null,
		type_of_zipper: null,
		tape_or_coil_stock_id: null,
		prod_quantity: null,
		coil_stock: null,
		coil_prod: null,
		wastage: null,
		issued_by_name: null,
	});

	const handelUpdate = (idx) => {
		const selected = coilLog[idx];
		setUpdateCoilLog((prev) => ({
			...prev,
			...selected,
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
			itemId: coilLog[idx].id,
			itemName: coilLog[idx].type_of_zipper,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	// if (error) return <h1>Error:{error}</h1>;

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(info.getFetchUrl(), setCoilLog, setLoading, setError);
	}, []);

	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;

	return (
		<div className="container mx-auto px-2 md:px-4">
			<ReactTable
				title={info.getTitle()}
				data={coilLog}
				columns={columns}
				extraClass="py-2"
			/>
			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setCoilLog,
						updateCoilLog,
						setUpdateCoilLog,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setCoilLog}
					uri={`/tape-to-coil-trx`}
				/>
			</Suspense>
		</div>
	);
}
