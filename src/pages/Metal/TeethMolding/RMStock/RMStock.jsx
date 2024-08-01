import { Suspense } from "@/components/Feedback";
import ReactTable from "@/components/Table";
import { useAccess, useFetchFunc, useFetchFuncForReport } from "@/hooks";

import { EditDelete, Transfer } from "@/ui";
import PageInfo from "@/util/PageInfo";
import { lazy, useEffect, useMemo, useState } from "react";

const AddOrUpdate = lazy(() => import("./AddOrUpdate"));

export default function Index() {
	const info = new PageInfo(
		"Teeth Molding RM Stock",
		"",
		"metal__teeth_molding_rm"
	);
	const [teethMolding, setTeethMolding] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const haveAccess = useAccess("metal__teeth_molding_rm");

	useEffect(() => {
		document.title = info.getTabName();
		useFetchFuncForReport(
			"/material/stock/by/single-field/m_teeth_molding",
			setTeethMolding,
			setLoading,
			setError
		);
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
				accessorKey: "unit",
				header: "Unit",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "quantity",
				header: "Stock",
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
		[teethMolding]
	);

	const [updateTeethMolding, setUpdateTeethMolding] = useState({
		id: null,
		quantity: null,
		unit: null,
	});

	const handelUpdate = (idx) => {
		setUpdateTeethMolding((prev) => ({
			...prev,
			id: teethMolding[idx].id,
			quantity: teethMolding[idx].quantity,
			unit: teethMolding[idx].unit,
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
				data={teethMolding}
				columns={columns}
				extraClass="py-2"
			/>
			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setTeethMolding,
						updateTeethMolding,
						setUpdateTeethMolding,
					}}
				/>
			</Suspense>
		</div>
	);
}
