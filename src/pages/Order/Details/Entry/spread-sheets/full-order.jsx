import React from 'react';

import TestSpreadSheet from '@/ui/Dynamic/HandsonSpreadSheet/test';

const FullOrder = (
	{ title, extraHeader, fieldName, form, handleAdd } = {
		title: '',
		extraHeader: null,
		form: {},
		fieldName: '',
		handleAdd: () => {},
	}
) => {
	const columns = [
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
			data: 'quantity',
		},
		{
			data: 'company_price',
		},
		{
			data: 'party_price',
		},
	];
	const data = form.watch(fieldName).map((item) => {
		return {
			style: item.style,
			color: item.color,
			bleaching: item.bleaching,
			size: item.size,
			quantity: item.quantity,
			company_price: item.company_price,
			party_price: item.party_price,
		};
	});

	const colHeaders = [
		'Style',
		'Color',
		'Bleaching',
		'Size',
		'Quantity',
		'Company (USD/DZN)',
		'Party (USD/DZN)',
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
			}}
		/>
	);
};

export default FullOrder;
