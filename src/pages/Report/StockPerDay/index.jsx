import ReactTable from "@/components/Table";
import { useFetchFunc } from "@/hooks";
import { useEffect, useMemo, useState } from "react";

export default function Index() {
	const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
	const [stockPerDay, setStockPerDay] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const finalValue = useMemo(() => {
		return stockPerDay.map((row) => {
			return {
				...row,
				avg_opening_purchase_price:
					row.opening_purchase_quantity === 0
						? 0
						: row.opening_purchase_quantity_total_price /
							row.opening_purchase_quantity,
				opening:
					row.opening_purchase_quantity -
					row.opening_consumed_quantity,
				closing:
					row.opening_purchase_quantity -
					row.opening_consumed_quantity +
					row.closing_purchased_quantity -
					row.closing_consumption_quantity,
				avg_closing_purchase_price:
					row.closing_purchased_quantity === 0
						? 0
						: row.closing_purchase_quantity_total_price /
							row.closing_purchased_quantity,
			};
		});
	}, [stockPerDay]);

	const columns = useMemo(
		() => [
			{
				accessorKey: "material_name",
				header: "Name",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "avg_opening_purchase_price",
				header: "Previous Avg Price",
				enableColumnFilter: false,
				cell: (info) => info.getValue().toFixed(2),
			},
			{
				accessorKey: "opening",
				header: "Opening",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "closing_purchased_quantity",
				header: "Purchased",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "closing_consumption_quantity",
				header: "Consumption",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "closing",
				header: "Closing",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "avg_closing_purchase_price",
				header: "Latest Avg Price",
				enableColumnFilter: false,
				cell: (info) => info.getValue().toFixed(2),
			},
		],
		[finalValue]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(
			`/report/stock/of/${date}`,
			setStockPerDay,
			setLoading,
			setError
		);
	}, [date]);

	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className="container mx-auto px-2 md:px-4">
			<ReactTable
				title={`Stock: ${date}`}
				data={finalValue}
				columns={columns}
				extraClass={"py-3"}
				date={date}
				setDate={setDate}
				showSingleDateRange={true}
			/>
		</div>
	);
}
