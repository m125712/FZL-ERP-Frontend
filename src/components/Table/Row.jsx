import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';

const Body = ({ getVisibleCells, extraClass = '' }) => (
	<tr className='hover:bg-base-200/40 focus:bg-base-200/40 cursor-pointer text-base transition-colors duration-300 ease-in'>
		{getVisibleCells().map(({ id, getContext, column: { columnDef } }) => {
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
		})}
	</tr>
);

export default function Row({ rows, extraClass = '' }) {
	return rows?.map(({ id, getVisibleCells }) => (
		<Body
			key={id}
			getVisibleCells={getVisibleCells}
			extraClass={extraClass}
		/>
	));
}
