import { Voucher } from "@/assets/icons";
import { Suspense } from "@/components/Feedback";
import ReactTable from "@/components/Table";
import { useAccess, useFetchFunc, useFetchFuncForReport } from "@/hooks";
import { EditDelete, Transfer } from "@/ui";
import PageInfo from "@/util/PageInfo";
import { set } from "date-fns";
import { lazy, useEffect, useMemo, useState } from "react";

const AddOrUpdate = lazy(() => import("./AddOrUpdate"));

export default function Index() {
	const info = new PageInfo(
		"Dyeing RM Stock",
		"/material/stock/by/single-field/dying_and_iron",
		"dyeing__dyeing_and_iron_rm"
	);
	const [dyeingAndIron, setDyeingAndIron] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess("dyeing__dyeing_and_iron_rm");

	useEffect(() => {
		document.title = info.getTabName();
		useFetchFunc(info.getUrl(), setDyeingAndIron, setLoading, setError);
	}, []);

	console.log(dyeingAndIron, "dyeingAndIron");

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
		[dyeingAndIron]
	);

	const [updateDyeingAndIron, setUpdateDyeingAndIron] = useState({
		id: null,
		quantity: null,
		unit: null,
	});

	const handelUpdate = (idx) => {
		setUpdateDyeingAndIron((prev) => ({
			...prev,
			id: dyeingAndIron[idx].id,
			quantity: dyeingAndIron[idx].quantity,
			unit: dyeingAndIron[idx].unit,
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
				data={dyeingAndIron}
				columns={columns}
				extraClass="py-2"
			/>
			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						setDyeingAndIron,
						updateDyeingAndIron,
						setUpdateDyeingAndIron,
					}}
				/>
			</Suspense>
		</div>
	);
}
