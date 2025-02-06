import React from 'react';

import renderActions from '@/ui/Dynamic/HandsonSpreadSheet/_actions/render-actions';
import TestSpreadSheet from '@/ui/Dynamic/HandsonSpreadSheet/test';

const ManualPiSpreadsheet = (
	{
		title,
		extraHeader,
		fieldName,
		form,
		handleAdd,
		handleCopy,
		handleRemove,
	} = {
		title: '',
		extraHeader: null,
		form: {},
		fieldName: '',
		handleAdd: () => {},
		handleRemove: () => {},
		handleCopy: () => {},
	}
) => {
	const columns = [
		{
			data: 'order_number',
		},
		{
			data: 'po',
		},
		{
			data: 'style',
		},
		{
			data: 'size',
		},
		{
			data: 'item',
		},
		{
			data: 'specification',
		},
		{
			data: 'quantity',
		},
		{
			data: 'unit_price',
		},

		{
			data: 'is_zipper',
			type: 'select',
			selectOptions: ['Yes', 'No'],
		},

		renderActions(handleRemove, handleCopy),
	];
	const data = form.watch(fieldName).map((item) => {
		return {
			order_number: item.order_number,
			po: item.po,
			style: item.style,
			size: item.size,
			item: item.item,
			specification: item.specification,
			quantity: item.quantity,
			unit_price: item.unit_price,
			is_zipper: item.is_zipper === true ? 'Yes' : 'No',
		};
	});

	const colHeaders = [
		'O/N',
		'Po',
		'Style',
		'Size',
		'Item',
		'Specification',
		'Quantity',
		'Unit Price',
		'Zipper',
		'Actions',
	];
	return (
		<TestSpreadSheet
			{...{
				title,
				extraHeader,
				fieldName,
				form,
				handleAdd,
				columns,
				colHeaders,
				data,
				isIndex: true,
				onChange: (newData, setValue, fieldName, row, prop) => {
					if (prop === 'is_zipper') {
						setValue(
							`${fieldName}.${row}.${prop}`,
							newData === 'Yes' ? true : false,
							{
								shouldDirty: true,
								shouldTouch: true,
								shouldValidate: false,
							}
						);
					}
				},
			}}
		/>
	);
};

export default ManualPiSpreadsheet;
