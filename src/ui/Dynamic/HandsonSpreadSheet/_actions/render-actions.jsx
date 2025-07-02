import handleActions from './handle-actions';

function renderActions(
	handleRemove,
	handleCopy,
	isZipperEntryDisabled = false,
	data = [],
	haveAccess = []
) {
	return {
		data: 'actions',
		renderer: (_instance, td, _row, _col, _prop, value, _cellProperties) =>
			handleActions(
				_instance,
				td,
				_row,
				_col,
				_prop,
				value,
				_cellProperties,
				handleRemove,
				handleCopy,
				isZipperEntryDisabled,
				data,
				haveAccess
			),
		readOnly: true,
		width: 160,
	};
}

export default renderActions;
