import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const ReadFile = (
	{ onChange } = {
		onChange: () => {},
	}
) => {
	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();

		reader.onload = (event) => {
			const workbook = XLSX.read(event.target.result, { type: 'array' });
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const sheetData = XLSX.utils.sheet_to_json(sheet);
			onChange(sheetData);
		};

		reader.readAsArrayBuffer(file);
	};

	return (
		<div className='btn btn-success btn-xs relative gap-1 rounded'>
			<FileSpreadsheet className='size-4' />
			<span>Upload</span>
			<input
				className='absolute inset-0 z-50 m-0 h-full w-full cursor-pointer opacity-0'
				type='file'
				onChange={handleFileUpload}
			/>
		</div>
	);
};

export default ReadFile;
