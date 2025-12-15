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

	// * Generate the CSV data with visible formula text for gross/net
	const sanitizeCell = (v) => {
		if (v === null || v === undefined) return '';
		if (
			typeof v === 'string' ||
			typeof v === 'number' ||
			typeof v === 'boolean'
		)
			return v;
		try {
			return typeof v.toString === 'function' &&
				v.toString() !== '[object Object]'
				? v.toString()
				: JSON.stringify(v);
		} catch (e) {
			return '';
		}
	};

	const colLetter = (index) => {
		let letters = '';
		let i = index + 1;
		while (i > 0) {
			let modulo = (i - 1) % 26;
			letters = String.fromCharCode(65 + modulo) + letters;
			i = Math.floor((i - modulo) / 26);
		}
		return letters;
	};

	const openingIndex = csvHeadersId.indexOf('opening');
	const salesIndex = csvHeadersId.indexOf('total_produced_value_company_bdt');
	const salesDeletedIndex = csvHeadersId.indexOf(
		'total_produced_value_company_deleted_bdt'
	);
	const grossIndex = csvHeadersId.indexOf('gross_due');
	const cashIndex = csvHeadersId.indexOf('running_total_cash_received');
	const lcIndex = csvHeadersId.indexOf('running_total_lc_value_bdt');
	const netIndex = csvHeadersId.indexOf('net_due');
	const remarksIndex = csvHeadersId.indexOf('remarks_amount');

	const csvData = [
		csvHeaders.map(sanitizeCell),
		...filteredRows.map((row, rowIdx) =>
			csvHeadersId.map((id, colIdx) => {
				if (
					id === 'gross_due' &&
					openingIndex > -1 &&
					salesIndex > -1
				) {
					const excelRow = rowIdx + 2;
					const openingCell = `${colLetter(openingIndex)}${excelRow}`;
					const salesCell = `${colLetter(salesIndex)}${excelRow}`;
					const salesDeletedCell =
						salesDeletedIndex > -1
							? `${colLetter(salesDeletedIndex)}${excelRow}`
							: null;
					if (salesDeletedCell)
						return `'=${openingCell}+${salesCell}-${salesDeletedCell}`;
					return `'=${openingCell}+${salesCell}`;
				}

				if (
					id === 'net_due' &&
					openingIndex > -1 &&
					salesIndex > -1 &&
					cashIndex > -1 &&
					lcIndex > -1
				) {
					const excelRow = rowIdx + 2;
					const openingCell = `${colLetter(openingIndex)}${excelRow}`;
					const salesCell = `${colLetter(salesIndex)}${excelRow}`;
					const cashCell = `${colLetter(cashIndex)}${excelRow}`;
					const lcCell = `${colLetter(lcIndex)}${excelRow}`;
					const salesDeletedCell =
						salesDeletedIndex > -1
							? `${colLetter(salesDeletedIndex)}${excelRow}`
							: null;
					const remarksCell =
						remarksIndex > -1
							? `${colLetter(remarksIndex)}${excelRow}`
							: null;
					if (salesDeletedCell && remarksCell)
						return `'=${openingCell}+${salesCell}-${salesDeletedCell}-${cashCell}-${lcCell}-${remarksCell}`;
					if (salesDeletedCell)
						return `'=${openingCell}+${salesCell}-${salesDeletedCell}-${cashCell}-${lcCell}`;
					if (remarksCell)
						return `'=${openingCell}+${salesCell}-${cashCell}-${lcCell}-${remarksCell}`;
					return `'=${openingCell}+${salesCell}-${cashCell}-${lcCell}`;
				}

				return sanitizeCell(row.getValue(id));
			})
		),

		extraExcelData ? extraExcelData : [],
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
