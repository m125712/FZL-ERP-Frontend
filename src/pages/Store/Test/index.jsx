import React from 'react';
import * as yup from 'yup';

import 'handsontable/dist/handsontable.full.min.css';

import { HotColumn, HotTable } from '@handsontable/react';
import { ErrorMessage } from '@hookform/error-message';
import { registerAllModules } from 'handsontable/registry';
import { Copy, Trash2 } from 'lucide-react';
import { FormProvider, useFieldArray, useFormContext } from 'react-hook-form';
import { useRHF } from '@/hooks';

import { ReactSelect } from '@/ui';

import { DevTool } from '@/lib/react-hook-devtool';
import {
	BOOLEAN_REQUIRED,
	NUMBER_DOUBLE_REQUIRED,
	STRING,
	STRING_REQUIRED,
} from '@/util/Schema';

registerAllModules();

const TEST_SCHEMA = {
	employees: yup.array().of(
		yup.object().shape({
			name: STRING_REQUIRED,
			address: STRING_REQUIRED,
			number: NUMBER_DOUBLE_REQUIRED,
			department: STRING.nullable(),
		})
	),
};

const TEST_NULL = {
	employees: [
		{
			name: 'Alif',
			address: 'Dhaka',
			number: '01660141086',
			department: 'IT',
		},
	],
};

// type RendererProps = {
// 	TD?: HTMLTableCellElement;
// 	value?: string | number;
// 	row?: number;
// 	col?: number;
// 	cellProperties?: Handsontable.CellProperties;
//   };

function CustomRenderer(props) {
	const {
		formState: { errors },
	} = useFormContext();

	if (!props.TD) return;

	if (props.field.cell) {
		return (
			<div className='relative z-50 flex items-center px-4 py-2'>
				{props.field.cell()}
			</div>
		);
	}

	return (
		<div className='flex flex-col justify-center px-4 py-2'>
			{props.field.type === 'text' && props.value}
			{props.field.type === 'select' && (
				<select
					value={props.value}
					disabled
					className='bg-transparent disabled:text-primary'
				>
					{props.field.options.map((option) => (
						<option value={option}>{option}</option>
					))}
				</select>
			)}
			<ErrorMessage
				errors={errors}
				name={`${props.fieldArrayName}.${props.row}.${props.prop}`}
				render={({ message }) => (
					<p className='text-error'>{message}</p>
				)}
			/>
		</div>
	);
}

const Test = () => {
	const fieldArrayName = 'employees';
	const form = useRHF(TEST_SCHEMA, TEST_NULL);

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: fieldArrayName,
	});

	const onSubmit = (data) => {
		console.log(data);
	};

	const handleAdd = () => {
		append({
			name: '',
			address: '',
			number: '',
			department: '',
		});
	};

	const useGenerateFields = () => {
		return [
			{
				header: 'Name',
				accessorKey: 'name',
				type: 'text',
				readOnly: false,
			},
			{
				header: 'Address',
				accessorKey: 'address',
				type: 'text',
				readOnly: false,
			},
			{
				header: 'Number',
				accessorKey: 'number',
				type: 'text',
				readOnly: false,
			},
			{
				header: 'Department',
				accessorKey: 'department',
				type: 'select',
				options: ['IT', 'HR', 'Other'],
				readOnly: false,
			},

			{
				header: 'Actions',
				accessorKey: 'actions',
				type: 'text',
				readOnly: true,
				cell: () => (
					<div className='flex items-center gap-1'>
						<button
							type='button'
							className='btn btn-circle btn-ghost btn-sm'
							onClick={() => alert('Hello World!')}
						>
							<Copy className='size-4' />
						</button>
						<button
							type='button'
							className='btn btn-circle btn-ghost btn-sm text-error hover:bg-error/10'
							onClick={() => alert('Hello World!')}
						>
							<Trash2 className='size-4' />
						</button>
					</div>
				),
			},
		];
	};

	const columnHeaders = useGenerateFields().map((field) => field.header);

	const data = form.watch(fieldArrayName)?.map((field) => {
		const fields = useGenerateFields()
			.filter((field) => field.accessorKey !== 'actions')
			.map((field) => field.accessorKey);

		return fields.reduce((obj, key) => {
			obj[key] = field[key];
			return obj;
		}, {});
	});

	data.forEach((item, index) => {
		Object.keys(item).forEach((key) => {
			form.register(`${fieldArrayName}.${index}.${key}`);
		});
	});

	return (
		<FormProvider {...form.context}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				<button
					type='button'
					onClick={handleAdd}
					className='btn btn-primary btn-sm'
				>
					Add new
				</button>
				<HotTable
					headerClassName='font-semibold text-primary h-8 flex items-center ml-4'
					layoutDirection='ltr'
					data={data}
					rowHeaders={false}
					colHeaders={columnHeaders}
					height='auto'
					width='100%'
					stretchH='all'
					autoWrapRow={true}
					autoWrapCol={true}
					customBorders={true}
					afterChange={(changes, source) => {
						changes?.forEach(([row, prop, oldValue, newValue]) => {
							form.clearErrors(
								`${fieldArrayName}.${row}.${prop}`
							);
							form.setValue(
								`${fieldArrayName}.${row}.${prop}`,
								newValue
							);
						});
					}}
					licenseKey='non-commercial-and-evaluation' // for non-commercial use only
				>
					{useGenerateFields().map((field) => (
						<HotColumn
							key={field.accessorKey}
							data={field.accessorKey}
							readOnly={field.readOnly}
							type={field.type}
							selectOptions={field.options}
						>
							<CustomRenderer
								hot-renderer
								field={field}
								fieldArrayName={fieldArrayName}
							/>
						</HotColumn>
					))}
				</HotTable>

				<button className='btn btn-primary btn-sm'>Submit</button>

				<DevTool control={form.control} />
			</form>
		</FormProvider>
	);
};

export default Test;
