import React from 'react';



import renderActions from '@/ui/Dynamic/HandsonSpreadSheet/_actions/render-actions';
import TestSpreadSheet from '@/ui/Dynamic/HandsonSpreadSheet/test';





const Tape = (
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
			data: 'index',
		},
		{
			data: 'style',
		},
		{
			data: 'color',
		},
		{
			data: 'bleaching',
			type: 'select',
			selectOptions: ['bleach', 'non-bleach'],
		},

		{
			data: 'size',
		},
		{
			data: 'planning_batch_quantity',
		},
		{
			data: 'company_price',
		},
		{
			data: 'party_price',
		},
		renderActions(handleRemove, handleCopy),
	];
	const data = form.watch(fieldName).map((item) => {
		return {
			index: item.index,
			style: item.style,
			color: item.color,
			bleaching: item.bleaching,
			size: item.size,
			planning_batch_quantity: item.planning_batch_quantity,
			company_price: item.company_price,
			party_price: item.party_price,
		};
	});

	const colHeaders = [
		'Id',
		'Style',
		'Color',
		'Bleaching',
		'Size (MTR)',
		'P.Batch',
		'Company (USD/MTR)',
		'Party (USD/MTR)',
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
				readOnlyIndex:[5],
			}}
		/>
	);
};

export default Tape;