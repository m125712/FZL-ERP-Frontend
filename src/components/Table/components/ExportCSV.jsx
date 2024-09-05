import { Download, Excel } from '@/assets/icons';
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';
import { GetFlatHeader } from '../utils';

export default function ExportCSV({ getAllLeafColumns, filteredRows, title }) {
	const showingColumns = ['action', 'actions', 'resetPass'];
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

	const dateTime = format(new Date(), 'dd-MM-yyyy');
	const filename = `${title} - ${dateTime}.csv`;

	return (
		<CSVLink
			type='button'
			className='btn-filter'
			data={csvData}
			filename={filename}>
			<Download className='size-5' />
			<span className='hidden lg:block'>Export</span>
		</CSVLink>
	);
}
