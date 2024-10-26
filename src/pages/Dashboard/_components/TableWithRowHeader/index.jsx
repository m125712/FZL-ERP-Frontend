import React from 'react';
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';

export function TableWithRowHeader(props) {
	const data = props?.data;
	if (!data || data.length === 0) {
		return (
			<div className='flex h-screen items-center justify-center text-4xl'>
				Not Found
			</div>
		);
	}
	if (props.isLoading) {
		return <span className='loading loading-dots loading-lg z-50' />;
	}
	const columns = [
		{
			accessorKey: 'label',
			header: '',
			cell: ({ getValue }) => <strong>{getValue()}</strong>,
		},
		{ accessorKey: 'value', header: '' },
	];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className='mx-auto max-w-full'>
			<div className='overflow-x-auto'>
				<table className='w-full border-collapse overflow-hidden rounded-t-lg'>
					<thead>
						<tr className='bg-gray-800 text-white'>
							<th
								className='p-3 text-left text-lg font-bold'
								colSpan={2}>
								{props.title}
							</th>
						</tr>
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row, index) => (
							<tr
								key={row.id}
								className={
									index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
								}>
								{row.getVisibleCells().map((cell) => (
									<td
										key={cell.id}
										className={`p-2 ${
											cell.column.id === 'value'
												? 'text-right sm:text-left'
												: 'text-left'
										}`}>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext()
										)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
