import React from 'react';
import * as yup from 'yup';

import 'handsontable/dist/handsontable.full.min.css';

import { BaseEditorComponent, HotColumn, HotTable } from '@handsontable/react';
import { DevTool } from '@hookform/devtools';
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import { useFieldArray } from 'react-hook-form';
import { useRHF } from '@/hooks';

import { NUMBER_DOUBLE_REQUIRED, STRING, STRING_REQUIRED } from '@/util/Schema';

registerAllModules();

const TEST_SCHEMA = {
	employees: yup.array().of(
		yup.object().shape({
			name: STRING_REQUIRED,
			address: NUMBER_DOUBLE_REQUIRED,
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

const Test = () => {
	const form = useRHF(TEST_SCHEMA, TEST_NULL);

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'employees',
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

	const columnHeaders = [
		'Name',
		'Address',
		'Number',
		'Department',
		'Actions',
	];
	const data = fields.map((field) => ({
		name: field.name,
		address: field.address,
		number: field.number,
		department: field.department,
	}));

	data.forEach((item, index) => {
		Object.keys(item).forEach((key) => {
			form.register(`employees.${index}.${key}`);
		});
	});

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
			<button
				type='button'
				onClick={handleAdd}
				className='btn btn-primary btn-sm'>
				Add new
			</button>
			<HotTable
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
						form.setValue(`employees.${row}.${prop}`, newValue);
					});
				}}
				licenseKey='non-commercial-and-evaluation' // for non-commercial use only
			>
				{Object.keys(data[0]).map((key) => (
					<HotColumn key={key} data={key} />
				))}
			</HotTable>

			<button className='btn btn-primary btn-sm'>Submit</button>

			<DevTool control={form.control} />
		</form>
	);
};

export default Test;
