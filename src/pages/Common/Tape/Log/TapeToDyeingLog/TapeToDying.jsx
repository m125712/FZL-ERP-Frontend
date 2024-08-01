import { Suspense } from "@/components/Feedback";
import { DeleteModal } from "@/components/Modal";
import ReactTable from "@/components/Table";
import { useAccess, useFetchFunc } from "@/hooks";
import { EditDelete } from "@/ui";
import PageInfo from "@/util/PageInfo";
import React, { useEffect, useMemo, useState } from "react";
import TapeToDyeingAddOrUpdate from "./TapeToDyeingAddOrUpdate";

export default function TapeToDying() {
	const info = new PageInfo("Tape to Dying Log", "sfg/trx/by/tape_making");
	const [tapeLog, setTapeLog] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess("common__tape_log");

	const columns = useMemo(
		() => [
			{
				accessorKey: "item_description",
				header: "Item Description",
				enableColumnFilter: false,
				cell: (info) => (
					<span className="capitalize">{info.getValue()}</span>
				),
			},
			{
				accessorKey: "order_description",
				header: "Style / Color / Size",
				enableColumnFilter: false,
				cell: (info) => (
					<span className="capitalize">{info.getValue()}</span>
				),
			},

			{
				accessorKey: "trx_quantity",
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
				hidden: !haveAccess.includes("click_update_tape_to_dying"),
				width: "w-24",
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes(
								"click_delete_tape_to_dying"
							)}
						/>
					);
				},
			},
		],
		[tapeLog]
	);

	// if (error) return <h1>Error:{error}</h1>;

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(info.getFetchUrl(), setTapeLog, setLoading, setError);
	}, []);

	// Update
	const [updateTapeLog, setUpdateTapeLog] = useState({
		id: null,
		trx_from: null,
		trx_to: null,
		item_name: null,
		trx_quantity: null,
		order_description: null,
		order_quantity: null,
		tape_stock: null,
		dying_and_iron_stock: null,
		finishing_stock: null,
		order_entry_id: null,
		zipper_number_name: null,
	});

	const handelUpdate = (idx) => {
		const selected = tapeLog[idx];
		setUpdateTapeLog((prev) => ({
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
			itemId: tapeLog[idx].id,
			itemName: tapeLog[idx].order_description.replace(/[#&/]/g, ""),
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;

	return (
		<div className="container mx-auto px-2 md:px-4">
			<ReactTable
				title={info.getTitle()}
				data={tapeLog}
				columns={columns}
				extraClass="py-2"
			/>
			<Suspense>
				<TapeToDyeingAddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setTapeLog,
						updateTapeLog,
						setUpdateTapeLog,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setTapeLog}
					uri={`/sfg/trx`}
				/>
			</Suspense>
		</div>
	);
}
