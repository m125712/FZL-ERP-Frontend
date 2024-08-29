import { useState } from 'react';
import { DebouncedInput, ExportCSV } from './components';
import DateRange from './components/DateRange';
import { FilterColumn, FullFilter } from './components/Filter';
import { PdfButton, Title } from './ui';
import { Indicator } from './ui/Title';

export default function Index(props) {
	const [open, setOpen] = useState((prev) => ({
		...prev,
	}));

	const showDateRange = props
		.getAllLeafColumns()
		.some((column) => column.id === 'created_at');

	return (
		<div key={props.title} className='mb-4 flex flex-col'>
			<div className='mb-4 flex w-full flex-col justify-between gap-2 border-b pb-4 lg:flex-row lg:items-end'>
				<Title
					{...{
						title: props.title,
						subtitle: props.subtitle,
					}}
				/>

				{props.showSearchBox && (
					<DebouncedInput
						className='lg:max-w-[400px]'
						placeholder='Search...'
						value={props.globalFilter ?? ''}
						onChange={(value) =>
							props.setGlobalFilter(String(value))
						}
					/>
				)}
			</div>

			<div className='flex w-full items-end justify-between'>
				<div className='flex w-fit items-end gap-2'>
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
						<DateRange getHeaderGroups={props.getHeaderGroups} />
					)}

					{props.select}
					{props.extraButton}

					{props.onClickPdfDownload && (
						<PdfButton onClick={props.onClickPdfDownload} />
					)}

					<ExportCSV
						{...{
							getAllLeafColumns: props.getAllLeafColumns,
							filteredRows: props.filteredRows,
							title: props.title,
						}}
					/>
				</div>

				{props.accessor && props.handelAdd && (
					<Indicator
						value={props.indicatorValue}
						onClick={props.handelAdd}
					/>
				)}
			</div>
		</div>
	);
}
