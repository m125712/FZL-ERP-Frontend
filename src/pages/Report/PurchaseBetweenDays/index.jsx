import ReactTable from "@/components/Table";
import { useAuth } from "@/context/auth";
import { useFetchFunc } from "@/hooks";
import { useEffect, useMemo, useState } from "react";

const dateConversion = (date) =>
	new Date(date).toLocaleString("en-GB", {
		day: "numeric",
		month: "numeric",
		year: "2-digit",
	});

export default function Index() {
	const { user } = useAuth();
	const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
	const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10));
	const [purchasePerDay, setPurchasePerDay] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const finalValue = useMemo(() => {
		return purchasePerDay.map((row) => {
			return {
				...row,
				average_price: row.total_price / row.purchased_quantity,
			};
		});
	}, [purchasePerDay]);

	const columns = useMemo(
		() => [
			{
				accessorKey: "material_name",
				header: "Material Name",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "purchased_quantity",
				header: "Purchased Quantity",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "received_quantity",
				header: "Received Quantity",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "total_price",
				header: "Total Price",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "average_price",
				header: "Avg Price",
				enableColumnFilter: false,
				cell: (info) => info.getValue()?.toFixed(2),
			},
		],
		[finalValue]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(
			`/report/purchase-range/of/${date}/${toDate}`,
			setPurchasePerDay,
			setLoading,
			setError
		);
	}, [date, toDate]);
	console.table(finalValue);

	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;
	// if (error) return <h1>Error:{error}</h1>;

	const fromToDate = `${dateConversion(date)} to ${dateConversion(toDate)}`;
	const title = `Purchase: ${fromToDate}`;

	return (
		<div className="container mx-auto px-2 md:px-4">
			<ReactTable
				title={title}
				data={finalValue}
				columns={columns}
				extraClass={"py-3"}
				fromDate={date}
				toDate={toDate}
				setFromDate={setDate}
				setToDate={setToDate}
				multiDateRange={true}
				error={error}
			/>
		</div>
	);
}
