import { flexRender } from '@tanstack/react-table';

import { cn } from '@/lib/utils';

const TableBody = ({ rows, extraClass = '' }) => {
	return rows?.map(({ id, getVisibleCells }) => (
		<tr
			key={id}
			className='cursor-pointer text-black transition-colors duration-500 ease-in-out hover:bg-primary/20 focus:bg-primary/20'
		>
			{getVisibleCells().map(
				({ id, getContext, column: { columnDef } }) => {
					return (
						<td
							key={id}
							className={cn(
								'group px-3 py-2 text-left text-sm font-normal tracking-wide first:pl-6',
								!columnDef.width && 'whitespace-nowrap',
								extraClass
							)}
						>
							{flexRender(columnDef.cell, getContext())}
						</td>
					);
				}
			)}
		</tr>
	));
};

export default TableBody;
