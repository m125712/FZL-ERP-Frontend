import { format } from 'date-fns';
import { FileSpreadsheet } from 'lucide-react';
import { CSVLink } from 'react-csv';

import { GetFlatHeader } from '../../utils';

const HandleExport = ({
	getAllLeafColumns,
	filteredRows,
	title,
	extraExcelData,
}) => {
	// * Exclude unnecessary columns and filter visible ones
	const excludedColumns = new Set(['action', 'actions', 'resetPass']);
	const csvHeaders = [];
	const csvHeadersId = [];

	getAllLeafColumns().forEach(({ id, getIsVisible, columnDef }) => {
		if (getIsVisible() && !excludedColumns.has(id)) {
			csvHeaders.push(GetFlatHeader(columnDef.header));
			csvHeadersId.push(id);
		}
	});

	// * Generate the CSV data
	const csvData = [
		csvHeaders, // * Header row
		...filteredRows.map((row) =>
			csvHeadersId.map((id) => row.getValue(id))
		), // * Data rows

		extraExcelData ? extraExcelData : [], // * Extra data rows
	];

	// * Generate filename with current date
	const dateTime = format(new Date(), 'dd-MM-yyyy');
	const filename = `${title} - ${dateTime}.csv`;

	return (
		<CSVLink
			type='button'
			className='btn-filter'
			data={csvData} // * Pass precomputed data
			filename={filename}
		>
			<FileSpreadsheet className='size-4' />
			<span className='hidden lg:block'>Excel</span>
		</CSVLink>
	);
};

export default HandleExport;
