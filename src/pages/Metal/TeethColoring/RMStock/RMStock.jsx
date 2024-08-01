import { Suspense } from "@/components/Feedback";
import ReactTable from "@/components/Table";
import { useAccess, useFetchFunc, useFetchFuncForReport } from "@/hooks";
import { EditDelete, Transfer } from "@/ui";
import PageInfo from "@/util/PageInfo";
import { lazy, useEffect, useMemo, useState } from "react";

const AddOrUpdate = lazy(() => import("./AddOrUpdate"));

export default function Index() {
	const info = new PageInfo(
		"Teeth Coloring RM Stock",
		"/material/stock/by/field-names/teeth_assembling_and_polishing,plating_and_iron",
		"metal__teeth_coloring_rm"
	);
	const [teethColoring, setTeethColoring] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess("metal__teeth_coloring_rm");

	useEffect(() => {
		document.title = info.getTabName();
		useFetchFuncForReport(
			info.getUrl(),
			setTeethColoring,
			setLoading,
			setError
		);
	}, []);

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
				accessorKey: "section",
				header: "Section",
				enableColumnFilter: false,
				cell: (info) => (
					<span className="capitalize">
						{info.getValue()?.replace(/_|m_/g, " ")}
					</span>
				),
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
		[teethColoring]
	);

	const [updateTeethColoring, setUpdateTeethColoring] = useState({
		id: null,
		section: "",
		quantity: null,
		unit: null,
	});

	const handelUpdate = (idx) => {
		setUpdateTeethColoring((prev) => ({
			...prev,
			id: teethColoring[idx].id,
			section: teethColoring[idx].section,
			quantity: teethColoring[idx].quantity,
			unit: teethColoring[idx].unit,
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
				data={teethColoring}
				columns={columns}
				extraClass="py-2"
			/>
			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setTeethColoring,
						updateTeethColoring,
						setUpdateTeethColoring,
					}}
				/>
			</Suspense>
		</div>
	);
}
