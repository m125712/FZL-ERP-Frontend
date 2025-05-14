import HotTable from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';

import HandsonSpreadSheet from '@/ui/Dynamic/HandsonSpreadSheet';

import SpreadSheetContainer from '../spreadsheet-container';

registerAllModules();

const TestSpreadSheet = (
	{
		title,
		extraHeader,
		fieldName,
		form,
		handleAdd,
		handleUploadFile,
		columns,
		colHeaders,
		data,
		isIndex,
		readOnlyIndex = [],
		onChange,
		csvData,
	} = {
		title: '',
		extraHeader: null,
		form: {},
		fieldName: '',
		handleAdd: () => {},
		handleUploadFile: () => {},
		columns: [],
		colHeaders: [],
		data: [],
		isIndex: false,
		onChange: (newData, setValue, fieldName, row, prop) => {},
		csvData: [],
	}
) => {
	data?.map((item, index) => {
		Object.keys(item).map((key) => {
			form.register(`${fieldName}.${index}.${key}`);
		});
	});

	const columnsWithIndex = (row, form, fieldName) => {
		// Calculate the index value for the current row
		let newIndex;
		if (row > 0) {
			// Get the index value of the previous row
			const previousIndex = form.getValues(
				`${fieldName}.${row - 1}.index`
			);
			newIndex = previousIndex ? previousIndex + 1 : row + 1;
		} else {
			// For the first row, set index to 1
			newIndex = 1;
		}

		// Update the index value for the current row
		form.setValue(`${fieldName}.${row}.index`, newIndex, {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: false,
		});
	};

	return (
		<SpreadSheetContainer
			{...{ title, extraHeader, handleAdd, handleUploadFile, csvData }}
		>
			<HotTable
				layoutDirection='ltr'
				headerClassName='h-8 flex items-center whitespace-nowrap !px-3 text-left align-middle text-sm font-medium tracking-wide text-primary first:pl-6 dark:text-neutral-400 [&:has([role=checkbox])]:pr-0 bg-base-200'
				afterChange={(changes) => {
					changes?.forEach(([row, prop, oldValue, newValue]) => {
						form.setValue(`${fieldName}.${row}.${prop}`, newValue, {
							shouldDirty: true,
							shouldTouch: true,
							shouldValidate: false,
						});
						onChange &&
							onChange(
								newValue,
								form.setValue,
								fieldName,
								row,
								prop
							);

						if (isIndex) {
							columnsWithIndex(row, form, fieldName);
						}
					});
				}}
				cells={(row, col) => {
					const cellProperties = {};
					if (col === 0 && isIndex) {
						cellProperties.readOnly = true; // Make the index column read-only
					}
					for (const index of readOnlyIndex) {
						if (col === index) {
							cellProperties.readOnly = true; // Make the specified column read-only
						}
					}

					return cellProperties;
				}}
				data={data}
				columns={columns}
				colHeaders={colHeaders}
				height='auto'
				width='100%'
				stretchH='all'
				autoWrapRow={true}
				autoWrapCol={true}
				licenseKey='non-commercial-and-evaluation'
			/>
		</SpreadSheetContainer>
	);
};

export default TestSpreadSheet;
