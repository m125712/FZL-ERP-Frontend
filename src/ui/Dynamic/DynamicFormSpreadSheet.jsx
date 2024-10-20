import React from 'react';
import { Copy } from '@/assets/icons';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import Spreadsheet from 'react-spreadsheet';

import cn from '@/lib/cn';

import { ReactSelect } from '..';

const DynamicFormSpreadSheet = (
	{
		title,
		fieldArrayName,
		columnsDefs,
		headerButtons,
		handelAppend,
		handleRemove,
		formContext: {
			register,
			watch,
			setValue,
			getValues,
			clearErrors,
			errors,
		},
		fields,
		append,
		update,
		remove,
	} = {
		title: '',
		headerButtons: [],
		handelAppend: () => {},
		handleRemove: (index) => {},
		fieldArrayName: 'test',
		columnsDefs: [
			{
				header: '',
				accessorKey: '',
				readOnly: false,
				type: 'text',
				options: [{ label: '', value: '' }],
			},
		],

		formContext: {
			register: () => {},
			watch: () => {},
			setValue: () => {},
			getValues: () => {},
			clearErrors: () => {},
			errors: {},
		},

		fields: [],
		append: () => {},
		update: () => {},
		remove: () => {},
	}
) => {
	const columnLabels = columnsDefs
		.filter((column) => column.hidden !== true)
		.map((column) => {
			return column.header || column.accessorKey;
		});

	const tableData = fields.map((field, fieldIndex) => {
		const data = columnsDefs
			.filter((column) => column.hidden !== true)
			.map((column) => {
				switch (column.type) {
					case 'text':
						return {
							value: watch(
								`${fieldArrayName}.${fieldIndex}.${column.accessorKey}`
							),
							DataEditor: ({ cell, onChange }) => {
								return (
									<input
										autoFocus
										className='w-full px-2 py-2 focus:outline-none'
										onChange={(e) => {
											onChange(e.target.value);
											update(fieldIndex, {
												...field,
												[column.accessorKey]:
													e.target.value,
											});
											clearErrors(
												`${fieldArrayName}.${fieldIndex}.${column.accessorKey}`
											);
										}}
										{...register(
											`${fieldArrayName}.${fieldIndex}.${column.accessorKey}`
										)}
									/>
								);
							},

							DataViewer: ({ cell }) => {
								return (
									<div className='flex flex-col space-y-1 p-2 text-sm'>
										{cell.value}
										{errors?.[fieldArrayName]?.[
											fieldIndex
										]?.[`${column.accessorKey}`]
											?.message && (
											<span className='text-xs text-red-500'>
												{
													errors?.[fieldArrayName]?.[
														fieldIndex
													]?.[`${column.accessorKey}`]
														?.message
												}
											</span>
										)}
									</div>
								);
							},
						};

					case 'select':
						return {
							value: watch(
								`${fieldArrayName}.${fieldIndex}.${column.accessorKey}`
							),
							// DataEditor: ({ cell, onChange }) => {
							// 	return (
							// 		<ReactSelect
							// 			placeholder='Select Material'
							// 			options={column.options}
							// 			value={column.options?.find(
							// 				(inItem) =>
							// 					inItem.value ==
							// 					getValues(
							// 						`${fieldArrayName}.${fieldIndex}.${column.accessorKey}`
							// 					)
							// 			)}
							// 			onChange={(e) => {
							// 				onChange(e.target.value);
							// 				update(fieldIndex, {
							// 					...field,
							// 					[column.accessorKey]:
							// 						e.target.value,
							// 				});
							// 				clearErrors(
							// 					`${fieldArrayName}.${fieldIndex}.${column.accessorKey}`
							// 				);
							// 			}}
							// 			menuPortalTarget={document.body}
							// 		/>
							// 	);
							// },
							DataEditor: ({ cell, onChange }) => {
								return (
									<select
										autoFocus
										aria-placeholder='Select'
										className='w-full px-2 py-2 focus:outline-none'
										onChange={(e) => {
											onChange(e.target.value);
											update(fieldIndex, {
												...field,
												[column.accessorKey]:
													e.target.value,
											});
											clearErrors(
												`${fieldArrayName}.${fieldIndex}.${column.accessorKey}`
											);
										}}
										{...register(
											`${fieldArrayName}.${fieldIndex}.${column.accessorKey}`
										)}>
										{column?.options?.map((option) => (
											<option
												key={option?.value}
												value={option?.value}>
												{option?.label}
											</option>
										))}
									</select>
								);
							},

							DataViewer: ({ cell }) => {
								return (
									<div className='flex flex-col space-y-1 p-2'>
										<div className='jus flex items-center justify-between'>
											<span>
												{
													column.options.find(
														(option) =>
															option.value ===
															watch(
																`${fieldArrayName}.${fieldIndex}.${column.accessorKey}`
															)
													)?.label
												}
											</span>
											<ChevronDown className='size-4' />
										</div>

										{errors?.[fieldArrayName]?.[
											fieldIndex
										]?.[`${column.accessorKey}`]
											?.message && (
											<span className='text-xs text-red-500'>
												{
													errors?.[fieldArrayName]?.[
														fieldIndex
													]?.[`${column.accessorKey}`]
														?.message
												}
											</span>
										)}
									</div>
								);
							},
						};

					case 'action':
						return {
							value: null,
							readOnly: true,
							className: '!text-black',
							DataViewer: ({ cell }) => {
								return (
									<div className='relative z-50 flex pl-1'>
										<button
											type='button'
											className='btn btn-square btn-ghost btn-sm'
											onClick={() => {
												const columnsDefsKeys =
													columnsDefs.map(
														(column) =>
															column.accessorKey
													);

												const newRow = getValues(
													`${fieldArrayName}.${fieldIndex}`
												);
												const newRowKeys =
													Object.keys(newRow);

												newRowKeys.forEach((key) => {
													if (
														!columnsDefsKeys.includes(
															key
														)
													) {
														delete newRow[key];
													}
												});

												append({
													...newRow,
												});
											}}>
											<Copy className='size-5' />
										</button>
										<button
											type='button'
											className='btn btn-square btn-sm border-none bg-transparent text-error'
											onClick={() => {
												handleRemove(fieldIndex);
											}}>
											<Trash2 className='size-5' />
										</button>
									</div>
								);
							},
						};
					default:
						return {
							value: watch(
								`${fieldArrayName}.${fieldIndex}.${column.accessorKey}`
							),
						};
				}
			});

		return data;
	});

	let data = [];

	const handleTransformData = () => {
		data.map((row, rowIndex) => {
			columnsDefs
				.filter((column) => column.type !== 'action')
				.map((column, columnIndex) => {
					setValue(
						`${fieldArrayName}.${rowIndex}.${column.accessorKey}`,
						row?.[columnIndex]?.value,
						{
							shouldValidate: true,
							shouldDirty: true,
							shouldTouch: true,
						}
					);
				});
		});
	};

	return (
		<div className='rounded bg-primary text-primary-content'>
			<div className='flex items-center justify-between px-4 py-3'>
				<span className='flex items-center gap-4 text-lg font-semibold capitalize text-primary-content'>
					{title}
				</span>

				<div className='flex items-center gap-4'>
					{headerButtons.length > 0 && headerButtons.map((e) => e)}

					{handelAppend && (
						<button
							type='button'
							className='btn btn-accent btn-xs rounded'
							onClick={handelAppend}>
							<Plus className='w-5' /> NEW
						</button>
					)}
				</div>
			</div>

			<Spreadsheet
				className='flex w-full'
				columnLabels={columnLabels}
				data={tableData}
				hideRowIndicators
				onBlur={() => {
					handleTransformData();
				}}
				onChange={(e) => {
					data = e;
				}}
				ColumnIndicator={(e) => {
					return (
						<th
							className={cn(
								'border-r bg-secondary p-2 text-left text-sm text-secondary-content last:border-none'
							)}>
							{e.label}
						</th>
					);
				}}
			/>
		</div>
	);
};

export default DynamicFormSpreadSheet;
