import { Suspense } from "@/components/Feedback";
import { DeleteModal } from "@/components/Modal";
import ReactTable from "@/components/Table";
import { useAccess, useFetchFunc } from "@/hooks";

import { DateTime, EditDelete } from "@/ui";
import PageInfo from "@/util/PageInfo";
import { useEffect, useMemo, useState } from "react";
import RMAddOrUpdate from "./RMAddOrUpdate";

export default function Index() {
	const info = new PageInfo(
		"RM Used Log",
		"material/used/by/m_teeth_molding"
	);
	const [teethMolding, setTeethMolding] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const haveAccess = useAccess("metal__teeth_molding_log");

	const columns = useMemo(
		() => [
			{
				accessorKey: "material_name",
				header: "Material Name",
				enableColumnFilter: false,
				cell: (info) => (
					<span className="capitalize">{info.getValue()}</span>
				),
			},
			{
				accessorKey: "section",
				header: "Section",
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<span className="capitalize">
							{info.getValue()?.replace(/_|n_/g, " ")}
						</span>
					);
				},
			},
			{
				accessorKey: "used_quantity",
				header: "Used QTY",
				enableColumnFilter: false,
				cell: (info) => (
					<span className="capitalize">{info.getValue()}</span>
				),
			},
			{
				accessorKey: "wastage",
				header: "Wastage",
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
				hidden: !haveAccess.includes("click_update_rm"),
				width: "w-24",
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes("click_delete_rm")}
						/>
					);
				},
			},
		],
		[teethMolding]
	);

	// Update
	const [updateTeethMoldingLog, setUpdateTeethMoldingLog] = useState({
		id: null,
		section: null,
		material_name: null,
		m_teeth_molding: null,
		used_quantity: null,
	});

	const handelUpdate = (idx) => {
		const selected = teethMolding[idx];
		setUpdateTeethMoldingLog((prev) => ({
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
			itemId: teethMolding[idx].id,
			itemName: teethMolding[idx].material_name
				.replace(/#/g, "")
				.replace(/\//g, "-"),
		}));

		window[info.getDeleteModalId()].showModal();
	};

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(info.getFetchUrl(), setTeethMolding, setLoading, setError);
	}, []);

	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className="container mx-auto px-2 md:px-4">
			<ReactTable
				title={info.getTitle()}
				data={teethMolding}
				columns={columns}
				extraClass="py-2"
			/>
			<Suspense>
				<RMAddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setTeethMolding,
						updateTeethMoldingLog,
						setUpdateTeethMoldingLog,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setTeethMolding}
					uri={`/material/used`}
				/>
			</Suspense>
		</div>
	);
}
