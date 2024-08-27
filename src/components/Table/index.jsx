import {
	getCoreRowModel,
	getFacetedMinMaxValues,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { lazy, useState } from 'react';
import { Suspense } from '../Feedback';

import cn from '@/lib/cn';
import { NoDataFound, TitleOnly } from './ui';
import { FuzzyFilter, isWithinRange } from './utils';

const Header = lazy(() => import('./Header'));
const TableHead = lazy(() => import('./TableHead'));
const Row = lazy(() => import('./Row'));
const Pagination = lazy(() => import('./Pagination'));

function Table({
	title = '',
	subtitle = '',
	handelAdd = () => {},
	accessor,
	data = [],
	columns,
	searchData = '',
	extraClass = '',
	showSearchBox = true,
	showPagination = true,
	showColumns = true,
	showTitleOnly = false,
	onClickPdfDownload,
	extraButton,
	children,
	select,
	error = null,
	indicatorValue,
	headerClassName = '',
	containerClassName = '',
	...props
}) {
	// Define state variables
	const [columnFilters, setColumnFilters] = useState([]);
	const [globalFilter, setGlobalFilter] = useState(searchData);
	const [columnVisibility, setColumnVisibility] = useState(
		columns?.reduce((acc, { accessorKey, hidden }) => {
			acc[accessorKey] = !hidden;
			return acc;
		}, {})
	);

	// Initialize React Table
	const table = useReactTable({
		data,
		columns,
		filterFns: {
			fuzzy: FuzzyFilter,
			isWithinRange,
		},
		state: {
			globalFilter,
			columnFilters,
			columnVisibility,
			rowSelection: props.rowSelection || {},
		},
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: FuzzyFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: props.setRowSelection,
	});

	// Extract React Table functions
	const {
		getAllLeafColumns,
		getRowModel,
		getHeaderGroups,
		getPreFilteredRowModel,
	} = table;

	// Extract rows from React Table
	const { rows } = getRowModel();
	const hasAnyRow = rows?.length > 0 && !error;
	const filteredRows = table._getFilteredRowModel()?.rows || [];

	// Render functions
	const renderHeader = (showTitleOnly) => {
		if (showTitleOnly)
			return (
				<Suspense>
					<TitleOnly
						title={title}
						subtitle={subtitle}
						className={headerClassName}
						handelAdd={handelAdd}
					/>
				</Suspense>
			);

		return (
			<Suspense>
				<Header
					title={title}
					subtitle={subtitle}
					handelAdd={handelAdd}
					accessor={accessor}
					indicatorValue={indicatorValue}
					getHeaderGroups={getHeaderGroups}
					getAllLeafColumns={getAllLeafColumns}
					getPreFilteredRowModel={getPreFilteredRowModel}
					filteredRows={filteredRows}
					onClickPdfDownload={onClickPdfDownload}
					globalFilter={globalFilter}
					setGlobalFilter={setGlobalFilter}
					showSearchBox={showSearchBox}
					showColumns={showColumns}
					extraButton={extraButton}
					select={select}
				/>
			</Suspense>
		);
	};

	const renderRow = (hasAnyRow) => {
		if (!hasAnyRow) return <NoDataFound colSpan={columns.length} />;

		return <Row rows={rows} extraClass={extraClass} />;
	};

	// Render table components
	return (
		<div className='flex flex-col'>
			{renderHeader(showTitleOnly)}
			<Suspense>
				<div
					className={cn(
						'overflow-x-auto rounded-md border-[1px] border-secondary/20',
						showTitleOnly && 'mb-6',
						containerClassName
					)}>
					<table className='w-full'>
						<TableHead
							{...{ getHeaderGroups, getPreFilteredRowModel }}
						/>

						<tbody className='divide-y-[1px] divide-secondary/20'>
							{renderRow(hasAnyRow)}
							{children}
						</tbody>
					</table>
				</div>
			</Suspense>
			{!showTitleOnly && showPagination && (
				<Suspense>
					<Pagination {...table} />
				</Suspense>
			)}
		</div>
	);
}

export default Table;
