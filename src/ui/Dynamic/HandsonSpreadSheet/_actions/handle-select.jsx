function handleSelect(
	_instance,
	td,
	_row,
	_col,
	_prop,
	value,
	_cellProperties,
	options
) {
	const label = options
		? options.find((item) => item.value === value)?.label || ''
		: '';

	td.innerText = label;

	return td;
}

export default handleSelect;
