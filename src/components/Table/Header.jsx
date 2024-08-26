import { useState } from 'react';
import { DebouncedInput, ExportCSV } from './components';
import DateRange from './components/DateRange';
import { FilterColumn, FullFilter } from './components/Filter';
import { PdfButton, Title } from './ui';

export default function Index(props) {
	const [open, setOpen] = useState((prev) => ({
		...prev,
	}));

	const showDateRange = props
		.getAllLeafColumns()
		.some((column) => column.id === 'created_at');

	return (
		<div
			key={props.title}
			className='my-2 flex flex-col items-start justify-between'>
			<Title
				{...{
					title: props.title,
					subtitle: props.subtitle,
					handelAdd: props.handelAdd,
					accessor: props.accessor,
					indicatorValue: props.indicatorValue,
				}}
			/>
			<div className='flex flex-col items-start justify-between gap-2 md:w-full md:flex-row md:items-center'>
				<div className='flex basis-2/3 flex-col items-baseline space-x-2 space-y-2 md:space-y-0'>
					<span className='flex flex-wrap items-center justify-start space-x-2 space-y-2'>
						<FullFilter
							{...{
								getHeaderGroups: props.getHeaderGroups,
								getPreFilteredRowModel:
									props.getPreFilteredRowModel,
								title: props.title,
							}}
						/>
						{props.showColumns && (
							<FilterColumn
								columns={props.getAllLeafColumns()}
								open={open.columns}
								setOpen={setOpen}
							/>
						)}
						{showDateRange && (
							<DateRange
								getHeaderGroups={props.getHeaderGroups}
							/>
						)}
						{props.select}
						{props.extraButton}
						<ExportCSV
							{...{
								getAllLeafColumns: props.getAllLeafColumns,
								filteredRows: props.filteredRows,
								title: props.title,
							}}
						/>
						{props.onClickPdfDownload && (
							<PdfButton onClick={props.onClickPdfDownload} />
						)}
					</span>
				</div>
				{props.showSearchBox && (
					<div className='flex w-60 basis-1/3'>
						<DebouncedInput
							placeholder='Search...'
							value={props.globalFilter ?? ''}
							onChange={(value) =>
								props.setGlobalFilter(String(value))
							}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
