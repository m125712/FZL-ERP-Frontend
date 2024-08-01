import ReactTable from "@/components/Table";
import { useAuth } from "@/context/auth";
import { useFetchFuncForReport } from "@/hooks";
import { createColumnHelper } from "@tanstack/react-table";
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
	const [stockPerDay, setStockPerDay] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const columnHelper = createColumnHelper();

	const columns = useMemo(
		() => [
			columnHelper.accessor("material_name", {
				header: "Name",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			}),
			columnHelper.group({
				id: "Opening",
				header: "Opening",
				columns: [
					columnHelper.accessor("opening_quantity", {
						header: "Qty",
						enableColumnFilter: false,
						cell: (info) => <span>{info.getValue()}</span>,
					}),
					columnHelper.accessor("opening_quantity_total_price", {
						header: "Price",
						enableColumnFilter: false,
						cell: (info) => <span>{info.getValue()}</span>,
					}),
					columnHelper.accessor("opening_quantity_rate", {
						header: "Rate",
						enableColumnFilter: false,
						cell: (info) => <span>{info.getValue()}</span>,
					}),
				],
			}),
			columnHelper.group({
				id: "Purchased",
				header: "Purchased",
				columns: [
					columnHelper.accessor("purchased_quantity", {
						header: "Qty",
						enableColumnFilter: false,
						cell: (info) => <span>{info.getValue()}</span>,
					}),
					columnHelper.accessor("purchased_quantity_total_price", {
						header: "Price",
						enableColumnFilter: false,
						cell: (info) => <span>{info.getValue()}</span>,
					}),
					columnHelper.accessor("purchased_quantity_rate", {
						header: "Rate",
						enableColumnFilter: false,
						cell: (info) => <span>{info.getValue()}</span>,
					}),
				],
			}),
			columnHelper.group({
				id: "Sub Total",
				header: "Sub Total",
				columns: [
					columnHelper.accessor("sub_total_quantity", {
						header: "Qty",
						enableColumnFilter: false,
						cell: (info) => <span>{info.getValue()}</span>,
					}),
					columnHelper.accessor("sub_total_quantity_total_price", {
						header: "Price",
						enableColumnFilter: false,
						cell: (info) => <span>{info.getValue()}</span>,
					}),
					columnHelper.accessor("sub_total_quantity_rate", {
						header: "Rate",
						enableColumnFilter: false,
						cell: (info) => <span>{info.getValue()}</span>,
					}),
				],
			}),
			columnHelper.group({
				id: "Consumption",
				header: "Consumption",
				columns: [
					columnHelper.accessor("consumption_quantity", {
						header: "Qty",
						enableColumnFilter: false,
						cell: (info) => <span>{info.getValue()}</span>,
					}),
					columnHelper.accessor("consumption_quantity_total_price", {
						header: "Price",
						enableColumnFilter: false,
						cell: (info) => <span>{info.getValue()}</span>,
					}),
					columnHelper.accessor("consumption_quantity_rate", {
						header: "Rate",
						enableColumnFilter: false,
						cell: (info) => <span>{info.getValue()}</span>,
					}),
				],
			}),
			columnHelper.group({
				id: "Closing",
				header: "Closing",
				columns: [
					columnHelper.accessor("closing_quantity", {
						header: "Qty",
						enableColumnFilter: false,
						cell: (info) => <span>{info.getValue()}</span>,
					}),
					columnHelper.accessor("closing_quantity_total_price", {
						header: "Price",
						enableColumnFilter: false,
						cell: (info) => <span>{info.getValue()}</span>,
					}),
					columnHelper.accessor("closing_quantity_rate", {
						header: "Rate",
						enableColumnFilter: false,
						cell: (info) => <span>{info.getValue()}</span>,
					}),
				],
			}),
		],
		[stockPerDay]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFuncForReport(
			`/report/stock-range/of/${date}/${toDate}/new`,
			setStockPerDay,
			setLoading,
			setError
		);
	}, [date, toDate]);

	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;
	// if (error) return <h1>Error:{error}</h1>;

	const fromToDate = `${dateConversion(date)} to ${dateConversion(toDate)}`;
	const title = `Stock: ${fromToDate}`;

	return (
		<div className="container mx-auto px-2 md:px-4">
			<ReactTable
				title={title}
				data={stockPerDay}
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
