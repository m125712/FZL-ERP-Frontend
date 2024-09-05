import clsx from 'clsx';
import { flexRender } from '@tanstack/react-table';

const TableBody = ({ rows, extraClass = '' }) => {
	return rows?.map(({ id, getVisibleCells }) => (
		<tr
			key={id}
			className='cursor-pointer text-base transition-colors duration-300 ease-in hover:bg-base-200/40 focus:bg-base-200/40'>
			{getVisibleCells().map(
				({ id, getContext, column: { columnDef } }) => {
					return (
						<td
							key={id}
							className={clsx(
								'group px-3 py-2 text-left text-sm font-normal tracking-wide first:pl-6',
								!columnDef.width && 'whitespace-nowrap',
								extraClass
							)}>
							{flexRender(columnDef.cell, getContext())}
						</td>
					);
				}
			)}
		</tr>
	));
};

export default TableBody;
