import { Suspense } from "@/components/Feedback";
import ReactTable from "@/components/Table";
import { useAccess, useFetchFunc, useFetchFuncForReport } from "@/hooks";
import { Transfer } from "@/ui";
import PageInfo from "@/util/PageInfo";
import { lazy, useEffect, useMemo, useState } from "react";

const AddOrUpdate = lazy(() => import("./AddOrUpdate"));

export default function Index() {
	const info = new PageInfo(
		"Tape Stock",
		"/material/stock/by/single-field/tape_making",
		"common__tape_rm"
	);
	const [tapeStock, setTapeStock] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess("common__tape_rm");

	console.log("tapeStock", tapeStock);

	useEffect(() => {
		document.title = info.getTabName();
		useFetchFunc(info.getUrl(), setTapeStock, setLoading, setError);
	}, []);

	// section	tape_or_coil_stock_id	quantity	wastage	issued_by

	const columns = useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Material Name",
				enableColumnFilter: false,
				cell: (info) => (
					<span className="capitalize">{info.getValue()}</span>
				),
			},
			{
				accessorKey: "quantity",
				header: "Stock",
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
				accessorKey: "remarks",
				header: "Remarks",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "action",
				header: "Used",
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes("click_used"),
				width: "w-24",
				cell: (info) => (
					<Transfer onClick={() => handelUpdate(info.row.index)} />
				),
			},
		],
		[tapeStock]
	);

	// console.log("tapeStock", tapeStock);

	const [updateTapeStock, setUpdateTapeStock] = useState({
		id: null,
		quantity: null,
		unit: null,
	});

	const handelUpdate = (idx) => {
		setUpdateTapeStock((prev) => ({
			...prev,
			id: tapeStock[idx].id,
			quantity: tapeStock[idx].quantity,
			unit: tapeStock[idx].unit,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className="container mx-auto px-2 md:px-4">
			<ReactTable
				title={info.getTitle()}
				data={tapeStock}
				columns={columns}
				extraClass="py-2"
			/>
			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setTapeStock,
						updateTapeStock,
						setUpdateTapeStock,
					}}
				/>
			</Suspense>
		</div>
	);
}
