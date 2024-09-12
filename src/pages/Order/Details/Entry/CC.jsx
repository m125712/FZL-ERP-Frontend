import * as React from 'react';
import Select from 'react-select';

const OPTIONS = [
	{ value: 'vanilla', label: 'Vanilla' },
	{ value: 'chocolate', label: 'Chocolate' },
	{ value: 'caramel', label: 'Caramel' },
];

export const SelectView = ({ cell }) => {
	const option = React.useMemo(
		() => cell && OPTIONS.find((option) => option.value === cell.value),
		[cell]
	);
	return <Select value={option} options={OPTIONS} isDisabled />;
};

export const SelectEdit = ({ cell, onChange, exitEditMode }) => {
	const handleChange = React.useCallback(
		(selection) => {
			onChange({ ...cell, value: selection ? selection.value : null });
		},
		[cell, onChange]
	);
	const option = React.useMemo(
		() => cell && OPTIONS.find((option) => option.value === cell.value),
		[cell]
	);
	return (
		<Select
			value={option}
			onChange={handleChange}
			options={OPTIONS}
			autoFocus
			defaultMenuIsOpen
			onMenuClose={() => exitEditMode()}
		/>
	);
};
