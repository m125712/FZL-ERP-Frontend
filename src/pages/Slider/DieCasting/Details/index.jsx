import { Suspense } from "@/components/Feedback";
import { DeleteModal } from "@/components/Modal";
import ReactTable from "@/components/Table";
import { useAuth } from "@/context/auth";
import { useAccess, useFetchFunc } from "@/hooks";

import { DateTime, EditDelete } from "@/ui";
import PageInfo from "@/util/PageInfo";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
	const navigate = useNavigate();
	const info = new PageInfo(
		"Production",
		"slider/die-casting",
		"slider__die_casting_details"
	); // details changed to production

	const [slider, setSlider] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const haveAccess = useAccess("slider__die_casting_details");

	const columns = useMemo(
		() => [
			{
				accessorKey: "mc_no",
				header: "M/C",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "item_name_label",
				header: "Item Name",
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "item_type",
				header: "Type",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "cavity_goods",
				header: "Cavity Goods",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "cavity_reject",
				header: "Cavity Reject",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "push_value",
				header: "Push",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "production_quantity",
				header: (
					<>
						Production QTY
						<br />
						(PCS)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "order_number",
				header: "O/N",
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: "weight",
				header: (
					<>
						Weight
						<br />
						(KG)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "production_weight",
				header: (
					<>
						Unit Qty
						<br />
						(PCS/KG)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// {
			// 	accessorKey: "remarks",
			// 	header: "Remarks",
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 	info.getValue()
			// ),
			// },
			// {
			// 	accessorKey: "issued_by_name",
			// 	header: "Issued By",
			// 	enableColumnFilter: false,
			// 	cell: (info) => (
			// 	info.getValue()
			// ),
			// },
			{
				accessorKey: "created_at",
				header: "Created At",
				filterFn: "isWithinRange",
				enableColumnFilter: false,
				width: "w-24",
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			// {
			// 	accessorKey: "updated_at",
			// 	header: "Updated",
			// 	enableColumnFilter: false,
			// 	width: "w-24",
			// 	cell: (info) => {
			// 		return <DateTime date={info.getValue()} />;
			// 	},
			// },
			{
				accessorKey: "action",
				header: "Action",
				enableColumnFilter: false,
				hidden: !haveAccess.includes("update"),
				cell: (info) => {
					const uuid = info.row.original.slider_die_casting_uuid;
					return (
						<EditDelete
							handelUpdate={() => handelUpdate(uuid)}
							handelDelete={() => handelDelete(info.row.id)}
							showDelete={haveAccess.includes("delete")}
						/>
					);
				},
			},
		],
		[slider]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(info.getFetchUrl(), setSlider, setLoading, setError);
	}, []);

	// Add
	const handelAdd = () => navigate("/slider/die-casting/entry");

	// Update
	const handelUpdate = (uuid) => {
		navigate(`/slider/die-casting/update/${uuid}`);
	};

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: slider[idx].id,
			itemName: slider[idx].item_name_label.replace(/ /g, "_"),
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;

	return (
		<div className="container mx-auto px-2 md:px-4">
			<ReactTable
				title={info.getTitle()}
				accessor={haveAccess.includes("create")}
				data={slider}
				columns={columns}
				handelAdd={handelAdd}
				extraClass={"py-0.5"}
			/>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={setSlider}
					uri={info.getDeleteUrl()}
				/>
			</Suspense>
		</div>
	);
}
