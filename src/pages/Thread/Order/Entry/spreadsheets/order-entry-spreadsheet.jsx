import React from 'react';
import { useOtherCountLength } from '@/state/Other';

import handleActions from '@/ui/Dynamic/HandsonSpreadSheet/_actions/handle-actions';
import handleSelect from '@/ui/Dynamic/HandsonSpreadSheet/_actions/handle-select';
import renderActions from '@/ui/Dynamic/HandsonSpreadSheet/_actions/render-actions';
import TestSpreadSheet from '@/ui/Dynamic/HandsonSpreadSheet/test';
import SelectEditor from '@/ui/Dynamic/HandsonSpreadSheet/test/select-editor';

const OrderEntrySpreadsheet = (
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
	const { data: countLength } = useOtherCountLength();
	const columns = [
		{
			data: 'index',
		},
		{
			data: 'color',
		},
		{
			data: 'color_ref',
		},
		{
			data: 'style',
		},
		{
			editor: SelectEditor,
			renderer: (
				_instance,
				td,
				_row,
				_col,
				_prop,
				value,
				_cellProperties
			) =>
				handleSelect(
					_instance,
					td,
					_row,
					_col,
					_prop,
					value,
					_cellProperties,
					countLength
				),
			data: 'count_length_uuid',
			type: 'select',
			selectOptions: countLength
				? countLength.map((item) => item.value)
				: [],
			fullOptions: countLength ? countLength : [],
		},

		{
			data: 'bleaching',
			type: 'select',
			selectOptions: ['bleach', 'non-bleach'],
		},
		{
			data: 'quantity',
		},
		{
			data: 'batch_quantity',
		},
		{
			data: 'company_price',
		},
		{
			data: 'party_price',
		},
		{
			data: 'remarks',
		},
		renderActions(handleRemove, handleCopy),
	];
	const data = form.watch(fieldName).map((item) => {
		return {
			index: item.index,
			color: item.color,
			color_ref: item.color_ref,
			style: item.style,
			count_length_uuid: item.count_length_uuid,
			bleaching: item.bleaching,
			quantity: item.quantity,
			batch_quantity: item.batch_quantity,
			company_price: item.company_price,
			party_price: item.party_price,
			remarks: item.remarks,
		};
	});

	const colHeaders = [
		'Id',
		'Color',
		'Color Ref',
		'Style',
		'Count Length',
		'Bleaching',
		'Quantity',
		'Batch',
		'Company (USD/CONE)',
		'Party (USD/CONE)',
		'Remarks',
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
				readOnlyIndex: [7],
				data,
				isIndex: true,
			}}
		/>
	);
};

export default OrderEntrySpreadsheet;
