import React from 'react';
import { useOtherCountLength } from '@/state/Other';

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
			data: 'style',
		},
		{
			editor: SelectEditor,
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
			style: item.style,
			count_length_uuid: item.count_length_uuid,
			bleaching: item.bleaching,
			quantity: item.quantity,
			company_price: item.company_price,
			party_price: item.party_price,
			remarks: item.remarks,
		};
	});

	const colHeaders = [
		'Id',
		'Color',
		'Style',
		'Count Length',
		'Bleaching',
		'Quantity',
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
				data,
				isIndex: true,
			}}
		/>
	);
};

export default OrderEntrySpreadsheet;
