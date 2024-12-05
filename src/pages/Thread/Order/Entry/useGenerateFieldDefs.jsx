import { useOtherCountLength } from '@/state/Other';

import FieldActionButton from '@/ui/Others/Button/field-action';

const useGenerateFieldDefs = ({ copy, remove }) => {
	const { data: countLength } = useOtherCountLength();

	const bleachingOptions = [
		{ label: 'Bleach', value: 'bleach' },
		{ label: 'Non-Bleach', value: 'non-bleach' },
	];

	return [
		{
			header: 'Color',
			accessorKey: 'color',
			type: 'text',
		},
		{
			header: 'Style',
			accessorKey: 'style',
			type: 'text',
		},
		{
			header: 'Count Length',
			accessorKey: 'count_length_uuid',
			type: 'select',
			options: countLength || [],
		},
		{
			header: 'Bleaching',
			accessorKey: 'bleaching',
			type: 'select',
			options: bleachingOptions,
		},
		{
			header: 'Quantity',
			accessorKey: 'quantity',
			type: 'text',
		},
		{
			header: 'Company (USD/CONE)',
			accessorKey: 'company_price',
			type: 'text',
		},
		{
			header: 'Party (USD/CONE)',
			accessorKey: 'party_price',
			type: 'text',
		},
		{
			header: 'Remarks',
			accessorKey: 'remarks',
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
