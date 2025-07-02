function handleActions(
	_instance,
	td,
	_row,
	_col,
	_prop,
	value,
	_cellProperties,
	handleRemove,
	handleCopy,
	data,
	haveAccess
) {
	// Create delete button
	const deleteButton = document.createElement('button');
	deleteButton.innerHTML = 'Delete';
	deleteButton.type = 'button';

	deleteButton.classList.add('btn', 'btn-error', 'btn-sm', 'flex-1');
	deleteButton.addEventListener('click', () => {
		handleRemove(_row);
	});

	// Create copy button
	const copyButton = document.createElement('button');
	copyButton.innerHTML = 'Copy';
	copyButton.type = 'button';

	copyButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'flex-1');
	copyButton.addEventListener('click', () => {
		handleCopy(_row);
	});

	// Create div element
	const divElement = document.createElement('div');
	const hasBatchQty =
		data && data[_row] && data[_row].planning_batch_quantity > 0;
	if (!hasBatchQty || haveAccess.includes('override_access')) {
		divElement.appendChild(copyButton);
		divElement.appendChild(deleteButton);
	}

	divElement.classList.add('flex', 'items-center', 'gap-2');

	td.innerText = '';
	td.appendChild(divElement);

	return td;
}

export default handleActions;
