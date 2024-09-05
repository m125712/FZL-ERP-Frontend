import { notShowingColumns } from '../../components/Filter/_components';
import { FilterButton } from '../../ui';
import Item from './Item';

const ColumnVisibility = ({ columns }) => {
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
						<Item
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
};

export default ColumnVisibility;
