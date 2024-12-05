import FieldActionButton from '@/ui/Others/Button/field-action';

const sliderFieldDefs = ({ copy, remove, watch }) => {
	return [
		{
			header: 'Style',
			accessorKey: 'style',
			type: 'text',
		},

		{
			header: 'Quantity',
			accessorKey: 'quantity',
			type: 'text',
		},
		{
			header:
				watch('order_type') === 'tape'
					? 'Company (USD/MTR)'
					: 'Company (USD/DZN)',
			accessorKey: 'company_price',
			type: 'text',
		},

		{
			header: 'Actions',
			accessorKey: 'actions',
			type: 'custom',
			component: (index) => {
				return (
					<FieldActionButton
						handleCopy={copy}
						handleRemove={remove}
						index={index}
					/>
				);
			},
		},
	];
};

export default sliderFieldDefs;
