import { flexRender } from "@tanstack/react-table";
import clsx from "clsx";

const Body = ({ getVisibleCells, extraClass = "" }) => (
	<tr className="cursor-pointer transition-colors duration-300 ease-in even:bg-secondary/10 hover:bg-secondary/30 focus:bg-secondary/30">
		{getVisibleCells().map(({ id, getContext, column: { columnDef } }) => {
			return (
				<td
					key={id}
					className={clsx(
						"group px-3 py-2 text-left text-sm font-normal tracking-wide",
						!columnDef.width && "whitespace-nowrap",
						extraClass
					)}
				>
					{flexRender(columnDef.cell, getContext())}
				</td>
			);
		})}
	</tr>
);

export default function Row({ rows, extraClass = "" }) {
	return rows?.map(({ id, getVisibleCells }) => (
		<Body
			key={id}
			getVisibleCells={getVisibleCells}
			extraClass={extraClass}
		/>
	));
}
