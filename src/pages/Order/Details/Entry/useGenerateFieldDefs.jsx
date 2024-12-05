import FieldActionButton from '@/ui/Others/Button/field-action';

const useGenerateFieldDefs = ({ copy, remove, watch }) => {
	const bleachingOptions = [
		{ label: 'Bleach', value: 'bleach' },
		{ label: 'Non-Bleach', value: 'non-bleach' },
	];

	if (watch('order_type') === 'tape') {
		return [
			{
				header: 'Style',
				accessorKey: 'style',
				type: 'text',
			},
			{
				header: 'Color',
				accessorKey: 'color',
				type: 'text',
			},

			{
				header: 'Bleach',
				accessorKey: 'bleaching',
				type: 'select',
				options: bleachingOptions,
			},

			{
				header:
					watch('order_type') === 'tape'
						? 'Size (MTR)'
						: watch('is_inch')
							? 'Size (INCH)'
							: 'Size (CM)',

				accessorKey: 'size',
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
	}

	if (watch('order_type') === 'slider') {
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
	}

	return [
		{
			header: 'Style',
			accessorKey: 'style',
			type: 'text',
		},
		{
			header: 'Color',
			accessorKey: 'color',
			type: 'text',
		},

		{
			header: 'Bleach',
			accessorKey: 'bleaching',
			type: 'select',
			options: bleachingOptions,
		},

		{
			header:
				watch('order_type') === 'tape'
					? 'Size (MTR)'
					: watch('is_inch')
						? 'Size (INCH)'
						: 'Size (CM)',

			accessorKey: 'size',
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

export default useGenerateFieldDefs;
