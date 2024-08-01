import { Suspense } from "@/components/Feedback";
import ReactTable from "@/components/Table";
import { useAccess, useFetchFuncForReport } from "@/hooks";

import { EditDelete, Transfer } from "@/ui";
import PageInfo from "@/util/PageInfo";
import { lazy, useEffect, useMemo, useState } from "react";

const AddOrUpdate = lazy(() => import("./AddOrUpdate"));

export default function Index() {
	const info = new PageInfo(
		"Finishing RM Stock",
		"/material/stock/by/field-names/n_t_cutting,n_stopper",
		"nylon__metallic_finishing_rm"
	);
	const [finishing, setFinishing] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const haveAccess = useAccess("nylon__plastic_finishing_rm");

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	useEffect(() => {
		useFetchFuncForReport(
			info.getUrl(),
			setFinishing,
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
						{info.getValue()?.replace(/_|n_/g, " ")}
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
		[finishing]
	);

	const [updateFinishing, setUpdateFinishing] = useState({
		id: null,
		section: "",
		quantity: null,
		unit: null,
	});

	const handelUpdate = (idx) => {
		setUpdateFinishing((prev) => ({
			...prev,
			id: finishing[idx].id,
			section: finishing[idx].section,
			quantity: finishing[idx].quantity,
			unit: finishing[idx].unit,
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
				// handelAdd={handelAdd}
				accessor={haveAccess.includes("click_name")}
				data={finishing}
				columns={columns}
				extraClass="py-2"
			/>
			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setFinishing,
						updateFinishing,
						setUpdateFinishing,
					}}
				/>
			</Suspense>
		</div>
	);
}
