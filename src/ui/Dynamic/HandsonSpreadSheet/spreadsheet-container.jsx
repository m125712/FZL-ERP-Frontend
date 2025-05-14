import React from 'react';
import { FileSpreadsheet, Plus } from 'lucide-react';
import { CSVLink } from 'react-csv';

import ReadFile from '@/ui/Others/read-file';

const SpreadSheetContainer = (
	{ children, extraHeader, handleAdd, title, handleUploadFile, csvData } = {
		children,
		title,
		extraHeader,
		handleAdd,
		handleUploadFile: (data) => {},
		csvData: [],
	}
) => {
	return (
		<div className='overflow-hidden rounded-md shadow-sm'>
			<div className='flex items-center justify-between bg-primary py-2 pl-4 pr-2'>
				<h3 className='text-lg font-medium text-primary-foreground'>
					{title || 'Dynamic Fields'}
				</h3>

				<div className='flex items-center gap-4'>
					{extraHeader}
					{csvData && csvData.length > 0 && (
						<CSVLink
							title='Demo Sheet'
							type='button'
							className='btn btn-warning btn-xs gap-1 rounded'
							data={csvData}
						>
							<FileSpreadsheet className='size-4' />
							Demo
						</CSVLink>
					)}

					<ReadFile onChange={handleUploadFile} />
					{handleAdd && (
						<button
							onClick={handleAdd}
							type='button'
							size={'xs'}
							className='btn btn-accent btn-xs gap-1 rounded'
						>
							<Plus className='size-4' />
							New
						</button>
					)}
				</div>
			</div>

			{children}
		</div>
	);
};

export default SpreadSheetContainer;
