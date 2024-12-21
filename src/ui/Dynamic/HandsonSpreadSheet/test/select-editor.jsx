import Handsontable from 'handsontable';

class SelectEditor extends Handsontable.editors.BaseEditor {
	/**
	 * Initializes editor instance, DOM Element and mount hooks.
	 */
	init() {
		// Create detached node, add CSS class and make sure its not visible
		this.select = this.hot.rootDocument.createElement('SELECT');
		this.select.classList.add('htSelectEditor');
		this.select.style.display = 'none';

		// Attach node to DOM, by appending it to the container holding the table
		this.hot.rootElement.appendChild(this.select);
	}

	// Create options in prepare() method
	prepare(row, col, prop, td, originalValue, cellProperties) {
		// Remember to invoke parent's method
		super.prepare(row, col, prop, td, originalValue, cellProperties);

		const selectOptions = this.cellProperties.selectOptions;
		const fullOptions = this.cellProperties.fullOptions;
		let options;

		if (typeof selectOptions === 'function') {
			options = this.prepareOptions(
				selectOptions(this.row, this.col, this.prop)
			);
		} else {
			options = this.prepareOptions(selectOptions);
		}

		this.select.innerText = '';

		Object.keys(options).forEach((key) => {
			const optionElement = this.hot.rootDocument.createElement('OPTION');
			optionElement.value = key;
			optionElement.innerText = fullOptions.find(
				(item) => item.value === key
			).label;
			this.select.appendChild(optionElement);
		});
	}

	prepareOptions(optionsToPrepare) {
		let preparedOptions = {};

		if (Array.isArray(optionsToPrepare)) {
			for (let i = 0, len = optionsToPrepare.length; i < len; i++) {
				preparedOptions[optionsToPrepare[i]] = optionsToPrepare[i];
			}
		} else if (typeof optionsToPrepare === 'object') {
			preparedOptions = optionsToPrepare;
		}

		return preparedOptions;
	}

	getValue() {
		return this.select.value;
	}

	setValue(value) {
		const inputValue = this.cellProperties.fullOptions.find(
			(item) => item.value === value
		).value;

		this.select.value = inputValue;
	}

	open() {
		const { top, start, width, height } = this.getEditedCellRect();
		const selectStyle = this.select.style;

		this._opened = true;

		selectStyle.height = `${height}px`;
		selectStyle.minWidth = `${width}px`;
		selectStyle.top = `${top}px`;
		selectStyle[this.hot.isRtl() ? 'right' : 'left'] = `${start}px`;
		selectStyle.margin = '0px';
		selectStyle.display = '';
	}

	focus() {
		this.select.focus();
	}

	close() {
		this._opened = false;
		this.select.style.display = 'none';
	}
}

export default SelectEditor;
