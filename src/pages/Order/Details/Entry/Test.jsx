import React from 'react';
import { Copy } from '@/assets/icons';
import { DevTool } from '@hookform/devtools';
import { ArrowRight, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import Spreadsheet from 'react-spreadsheet';
import * as yup from 'yup';
import { useRHF } from '@/hooks';

import { DynamicField, ReactSelect } from '@/ui';

import cn from '@/lib/cn';
import {
	handelNumberDefaultValue,
	NUMBER_DOUBLE_REQUIRED,
	NUMBER_REQUIRED,
	STRING_REQUIRED,
} from '@/util/Schema';

export const TEST_SCHEMA = {
	test: yup.array().of(
		yup.object().shape({
			style: STRING_REQUIRED,
			color: STRING_REQUIRED,
			size: NUMBER_DOUBLE_REQUIRED,
			quantity: NUMBER_REQUIRED,
			company_price: NUMBER_DOUBLE_REQUIRED.transform(
				handelNumberDefaultValue
			).default(0),
			party_price: NUMBER_DOUBLE_REQUIRED.transform(
				handelNumberDefaultValue
			).default(0),
			bleaching: STRING_REQUIRED,
		})
	),
};

export const TEST_NULL = {
	test: [
		{
			style: '',
			color: '',
			size: 0,
			quantity: 0,
			company_price: 0,
			party_price: 0,
			bleaching: '',
		},
	],
};

const Test = (
	{ fieldArrayName, columnsDefs } = {
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
	}
) => {
	const {
		register,
		control,
		handleSubmit,
		errors,
		watch,
		setValue,
		getValues,
		clearErrors,
	} = useRHF(TEST_SCHEMA, TEST_NULL);

	const { fields, append, remove, update } = useFieldArray({
		control,
		name: fieldArrayName,
	});

	const columnLabels = columnsDefs.map((column) => {
		return column.header || column.accessorKey;
	});

	const tableData = fields.map((field, fieldIndex) => {
		const data = columnsDefs.map((column) => {
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
								<div className='flex flex-col space-y-1 p-2'>
									{cell.value}
									{errors?.[fieldArrayName]?.[fieldIndex]?.[
										`${column.accessorKey}`
									]?.message && (
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
									{column.options?.map((option) => (
										<option
											key={option.value}
											value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							);
						},

						DataViewer: ({ cell }) => {
							return (
								<div className='flex flex-col space-y-1 p-2'>
									<div className='jus flex items-center justify-between'>
										<span>{cell.value}</span>
										<ChevronDown className='size-4' />
									</div>

									{errors?.[fieldArrayName]?.[fieldIndex]?.[
										`${column.accessorKey}`
									]?.message && (
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
											append({
												...getValues(
													`${fieldArrayName}.${fieldIndex}`
												),
											});
										}}>
										<Copy className='size-5' />
									</button>
									<button
										type='button'
										className='btn btn-square btn-sm border-none bg-transparent text-error'
										onClick={() => {
											remove(fieldIndex);
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
	const addRow = () => {
		append({
			style: '',
			color: '',
			size: 0,
			quantity: 0,
			company_price: 0,
			party_price: 0,
			bleaching: '',
		});
	};

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
		<form onSubmit={handleSubmit((data) => console.log(data))}>
			<DynamicField title='Details' handelAppend={addRow}>
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
									'border-r bg-secondary p-2 text-left text-secondary-content last:border-none'
								)}>
								{e.label}
							</th>
						);
					}}
				/>
			</DynamicField>
			<input type='submit' />

			<DevTool control={control} />
		</form>
	);
};

export default Test;
