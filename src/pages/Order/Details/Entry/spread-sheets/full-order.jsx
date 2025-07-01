import renderActions from '@/ui/Dynamic/HandsonSpreadSheet/_actions/render-actions';
import TestSpreadSheet from '@/ui/Dynamic/HandsonSpreadSheet/test';

const FullOrder = (
	{
		title,
		extraHeader,
		fieldName,
		form,
		handleAdd,
		handleRemove,
		handleCopy,
		handleUploadFile,
		csvData,
		haveAccess,
	} = {
		title: '',
		extraHeader: null,
		form: {},
		fieldName: '',
		handleAdd: () => {},
		handleRemove: () => {},
		handleCopy: () => {},
		handleUploadFile: () => {},
		csvData: [],
		haveAccess: [],
	}
) => {
	const data = form.watch(fieldName).map((item) => {
		return {
			index: item.index,
			style: item.style,
			color: item.color,
			color_ref: item.color_ref,
			bleaching: item.bleaching,
			size: item.size,
			quantity: item.quantity,
			planning_batch_quantity: item.planning_batch_quantity,
			company_price: item.company_price,
			party_price: item.party_price,
		};
	});

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
			data: 'color_ref',
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
			data: 'planning_batch_quantity',
		},
		{
			data: 'company_price',
		},
		{
			data: 'party_price',
		},

		renderActions(handleRemove, handleCopy, data, haveAccess),
	];

	const colHeaders = [
		'Id',
		'Style',
		'Color',
		'Color Ref',
		'Bleaching',
		'Size',
		'Quantity',
		'P.Batch',
		'Company (USD/DZN)',
		'Party (USD/DZN)',
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
				handleUploadFile,
				columns,
				colHeaders,
				data,
				readOnlyIndex: [7],
				isIndex: true,
				csvData,
				haveAccess,
			}}
		/>
	);
};

export default FullOrder;
