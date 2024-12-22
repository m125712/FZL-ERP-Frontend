import HotTable from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';

import SpreadSheetContainer from '../spreadsheet-container';

registerAllModules();

const TestSpreadSheet = (
	{
		title,
		extraHeader,
		fieldName,
		form,
		handleAdd,
		columns,
		colHeaders,
		data,
	} = {
		title: '',
		extraHeader: null,
		form: {},
		fieldName: '',
		handleAdd: () => {},
		columns: [],
		colHeaders: [],
		data: [],
	}
) => {
	data.map((item, index) => {
		Object.keys(item).map((key) => {
			form.register(`${fieldName}.${index}.${key}`);
		});
	});

	return (
		<SpreadSheetContainer {...{ title, extraHeader, handleAdd }}>
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
					});
				}}
				data={data}
				height='auto'
				width='100%'
				stretchH='all'
				colHeaders={colHeaders}
				autoWrapRow={true}
				autoWrapCol={true}
				licenseKey='non-commercial-and-evaluation'
				columns={columns}></HotTable>
		</SpreadSheetContainer>
	);
};

export default TestSpreadSheet;
