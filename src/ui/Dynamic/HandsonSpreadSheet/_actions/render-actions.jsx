import handleActions from './handle-actions';

function renderActions(handleRemove, handleCopy) {
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
				handleCopy
			),
		readOnly: true,
		width: 160,
	};
}

export default renderActions;
