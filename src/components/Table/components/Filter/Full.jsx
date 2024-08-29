import { useMemo } from 'react';
import { GetFlatHeader } from '../../utils';
import FilterColumnValue from './ColumnValue';
import { DrawerBody, notShowingColumns } from './_components';

export default function FilterFull({
	getHeaderGroups,
	getPreFilteredRowModel,
	title,
}) {
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
		<DrawerBody htmlId={htmlId}>
			{headers
				.filter(({ column }) => column.columnDef.header !== '')
				.map(({ id, column }) => (
					<div key={id} className='flex flex-col text-xs'>
						<FilterColumnValue
							key={id}
							columnName={GetFlatHeader(column.columnDef.header)}
							column={column}
							getPreFilteredRowModel={getPreFilteredRowModel}
							isFullFilter={true}
						/>
					</div>
				))}
		</DrawerBody>
	);
}
