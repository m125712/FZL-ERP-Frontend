import { useMemo } from 'react';

import { Drawer } from '@/components/Table/ui';
import { GetFlatHeader, notShowingColumns } from '@/components/Table/utils';

import FilterColumn from './FilterColumn';

const GlobalFilter = ({ getHeaderGroups, getPreFilteredRowModel, title }) => {
	const htmlId = title.replace(/\s/g, '-').toLowerCase();

	const headers = useMemo(
		() =>
			getHeaderGroups().reduce(
				(acc, { headers }) =>
					headers.reduce((acc, column) => {
						if (
							notShowingColumns.includes(column.id) ||
							column.hidden
						)
							return acc;
						acc.push(column);
						return acc;
					}, acc),
				[]
			),
		[getHeaderGroups()]
	);

	return (
		<Drawer htmlId={htmlId}>
			{headers
				.filter(({ column }) => column.columnDef.header !== '')
				.map(({ id, column }) => (
					<div key={id} className='flex flex-col text-xs'>
						<FilterColumn
							key={id}
							columnName={GetFlatHeader(column.columnDef.header)}
							column={column}
							getPreFilteredRowModel={getPreFilteredRowModel}
							isFullFilter={true}
						/>
					</div>
				))}
		</Drawer>
	);
};

export default GlobalFilter;
