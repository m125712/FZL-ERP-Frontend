import React from 'react';

import TestSpreadSheet from '@/ui/Dynamic/HandsonSpreadSheet/test';

const Slider = (
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
			quantity: item.quantity,
			company_price: item.company_price,
			party_price: item.party_price,
		};
	});

	const colHeaders = [
		'Style',
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

export default Slider;
