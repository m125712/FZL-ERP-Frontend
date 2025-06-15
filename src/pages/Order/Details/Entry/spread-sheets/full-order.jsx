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

		renderActions(handleRemove, handleCopy),
	];
	const data = form.watch(fieldName).map((item) => {
		return {
			index: item.index,
			style: item.style,
			color: item.color,
			bleaching: item.bleaching,
			size: item.size,
			quantity: item.quantity,
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
				readOnlyIndex: [6],
				isIndex: true,
				csvData,
			}}
		/>
	);
};

export default FullOrder;
