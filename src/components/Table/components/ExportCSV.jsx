import { Excel } from "@/assets/icons";
import { format } from "date-fns";
import { CSVLink } from "react-csv";
import { GetFlatHeader } from "../utils";

export default function ExportCSV({ getAllLeafColumns, filteredRows, title }) {
	const showingColumns = ["action", "actions", "resetPass"];
	const filteredCsvColumn = getAllLeafColumns().filter(
		({ id, getIsVisible }) => !showingColumns.includes(id) && getIsVisible()
	);

	const { csvHeaders, csvHeadersId } = filteredCsvColumn.reduce(
		(acc, column) => {
			acc.csvHeaders.push(GetFlatHeader(column.columnDef.header));
			acc.csvHeadersId.push(column.id);
			return acc;
		},
		{ csvHeaders: [], csvHeadersId: [] }
	);

	const csvData = [
		csvHeaders,
		...filteredRows.map((row) =>
			csvHeadersId.map((column) => row.original[column])
		),
	];

	const dateTime = format(new Date(), "dd-MM-yyyy");
	const filename = `${title} - ${dateTime}.csv`;

	return (
		<CSVLink
			type="button"
			className="btn btn-xs rounded-full bg-secondary text-secondary-content"
			data={csvData}
			filename={filename}
		>
			Excel <Excel className="w-4 text-secondary-content" />
		</CSVLink>
	);
}
