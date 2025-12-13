import { format } from 'date-fns';
import { FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

import { GetFlatHeader } from '../../utils';

const HandleXlsx = ({
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
	// helper: convert 0-based index to Excel column letter
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

	// If the computed column exists, build formula for gross_due
	const openingIndex = csvHeadersId.indexOf('opening');
	const salesIndex = csvHeadersId.indexOf('total_produced_value_company_bdt');
	const grossIndex = csvHeadersId.indexOf('gross_due');
	const salesDeletedIndex = csvHeadersId.indexOf(
		'total_produced_value_company_deleted_bdt'
	);
	const cashIndex = csvHeadersId.indexOf('running_total_cash_received');
	const lcIndex = csvHeadersId.indexOf('running_total_lc_value_bdt');

	// Build AOA (array of arrays) for SheetJS
	const aoa = [];
	aoa.push(csvHeaders);

	filteredRows.forEach((row) => {
		const dataRow = csvHeadersId.map((id) => row.getValue(id));
		aoa.push(dataRow);
	});

	// append extraExcelData if provided (expects array of arrays)
	if (
		extraExcelData &&
		Array.isArray(extraExcelData) &&
		extraExcelData.length
	) {
		extraExcelData.forEach((er) => aoa.push(er));
	}

	function downloadXlsx() {
		const ws = XLSX.utils.aoa_to_sheet(aoa);

		const totalRows = filteredRows.length;

		// Insert formulas for gross_due and net_due if columns exist
		if (openingIndex > -1 && salesIndex > -1 && grossIndex > -1) {
			for (let i = 0; i < totalRows; i++) {
				const excelRow = i + 2;
				const openingCell = `${colLetter(openingIndex)}${excelRow}`;
				const salesCell = `${colLetter(salesIndex)}${excelRow}`;
				const salesDeletedCell = `${colLetter(
					salesDeletedIndex
				)}${excelRow}`;
				const grossCell = `${colLetter(grossIndex)}${excelRow}`;
				ws[grossCell] = {
					f: `${openingCell}+${salesCell}-${salesDeletedCell}`,
				};
			}
		}

		const netColIndex = csvHeadersId.indexOf('net_due');
		if (
			openingIndex > -1 &&
			salesIndex > -1 &&
			cashIndex > -1 &&
			lcIndex > -1 &&
			netColIndex > -1
		) {
			for (let i = 0; i < totalRows; i++) {
				const excelRow = i + 2;
				const openingCell = `${colLetter(openingIndex)}${excelRow}`;
				const salesCell = `${colLetter(salesIndex)}${excelRow}`;
				const salesDeletedCell = `${colLetter(
					salesDeletedIndex
				)}${excelRow}`;
				const cashCell = `${colLetter(cashIndex)}${excelRow}`;
				const lcCell = `${colLetter(lcIndex)}${excelRow}`;
				const netCell = `${colLetter(netColIndex)}${excelRow}`;
				ws[netCell] = {
					f: `${openingCell}+${salesCell}-${salesDeletedCell}-${cashCell}-${lcCell}`,
				};
			}
		}

		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, title.substring(0, 31));
		const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
		const blob = new Blob([wbout], { type: 'application/octet-stream' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${title} - ${format(new Date(), 'dd-MM-yyyy')}.xlsx`;
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	}

	return (
		<button type='button' className='btn-filter' onClick={downloadXlsx}>
			<FileSpreadsheet className='size-4' />
			<span className='hidden lg:block'>Xlsx</span>
		</button>
	);
};

export default HandleXlsx;
