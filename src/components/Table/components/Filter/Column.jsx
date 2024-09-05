import FilterButton from '../../ui/FilterButton';
import { notShowingColumns, SlicedColumn } from './_components';

function FilterColumn({ columns }) {
	const showItem = 6;
	const allColumn = columns?.filter(
		(column) =>
			!column.columnDef?.hidden &&
			!notShowingColumns.includes(column.id) &&
			column.getCanHide()
	);

	return (
		<FilterButton title='Columns'>
			<div className='flex h-full flex-col overflow-y-auto'>
				{Array.from(
					{ length: Math.ceil(allColumn.length / showItem) },
					(_, i) => (
						<SlicedColumn
							key={i}
							columns={allColumn.slice(
								i * showItem,
								i * showItem + showItem
							)}
						/>
					)
				)}
			</div>
		</FilterButton>
	);
}

export default FilterColumn;
