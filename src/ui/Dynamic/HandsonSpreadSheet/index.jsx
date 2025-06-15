import SpreadSheet from './spread-sheet';
import SpreadSheetContainer from './spreadsheet-container';

const HandsonSpreadSheet = (
	{ title, extraHeader, fieldDefs, fieldName, fields, form, handleAdd } = {
		title: '',
		extraHeader: null,
		form: {},
		fieldName: '',
		fieldDefs: [],
		handleAdd: () => {},
		fields: [],
	}
) => {
	return (
		<SpreadSheetContainer {...{ title, extraHeader, handleAdd }}>
			<SpreadSheet
				fieldDefs={fieldDefs}
				fieldName={fieldName}
				form={form}
			/>
		</SpreadSheetContainer>
	);
};

export default HandsonSpreadSheet;
