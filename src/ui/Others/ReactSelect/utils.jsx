import cn from '@lib/cn';

const controlStyles = {
	base: 'bg-base-100 input input-primary w-full  rounded-md px-2 text-sm transition-all duration-200 ease-in-out text-primary',
	focus: '!border-secondary/50 outline outline-2 outline-offset-2 outline-secondary',
	nonFocus: 'border-secondary/30',
	disabled:
		'!bg-error/5 border-[1px] border-error/50 !text-error cursor-not-allowed',
};
const placeholderStyles = 'text-secondary text-sm ';

// Single Value
const selectInputStyles = 'grow';
const singleValueStyles = 'grow';

// Multi Value
const multiValueLabelStyles = 'rounded-md mr-1 ';
const multiValueStyles =
	'mr-2 border px-2 py-1 rounded-md border-secondary/30 bg-base-100 text-secondary ';
const multiValueRemoveStyles =
	'size-5 text-error bg-error/10 text-sm rounded-md hover:bg-error/40 hover:text-error hover:cursor-pointer hover:shadow-2xl hover:active:bg-error/60 hover:active:text-error hover:active:shadow-none';

// Indicators
const indicatorsContainerStyles = 'text-secondary';
const clearIndicatorStyles =
	'text-error bg-error/10 text-sm rounded-md hover:bg-error/40';
const indicatorSeparatorStyles = '';
// const indicatorSeparatorStyles = "bg-primary";

// drop down menu
const dropdownIndicatorStyles = '';
const menuStyles =
	'bg-base-100 border border-secondary/30 rounded shadow-2xl shadow-inner text-sm';

// group heading
const groupHeadingStyles = 'text-gray-500 text-sm bg-error';
const optionStyles = {
	base: 'p-2  border-b last:border-0 border-secondary/30 text-black shadow-2xl text-sm hover:cursor-pointer hover:bg-secondary',
	focus: 'bg-secondary text-secondary-content  hover:text-secondary-content  hover:bg-secondary',
	selected:
		"after:content-['✔'] after:ml-2 after:text-success flex justify-between bg-primary text-primary-content active:bg-primary",
};
const noOptionsMessageStyles =
	' p-2 bg-error/10 text-error border border-dashed border-error rounded-md';

const classNames = {
	control: ({ isFocused, isDisabled }) =>
		cn(
			isFocused ? controlStyles.focus : controlStyles.nonFocus,
			isDisabled && controlStyles.disabled,
			controlStyles.base
		),
	placeholder: () => placeholderStyles,
	input: () => selectInputStyles,
	singleValue: () => singleValueStyles,
	multiValue: () => multiValueStyles,
	multiValueLabel: () => multiValueLabelStyles,
	multiValueRemove: () => multiValueRemoveStyles,
	indicatorsContainer: () => indicatorsContainerStyles,
	clearIndicator: () => clearIndicatorStyles,
	indicatorSeparator: () => indicatorSeparatorStyles,
	dropdownIndicator: () => dropdownIndicatorStyles,
	menu: () => menuStyles,
	groupHeading: () => groupHeadingStyles,
	option: ({ isFocused, isSelected }) =>
		cn(
			optionStyles.base,
			isFocused && optionStyles.focus,
			isSelected && optionStyles.selected
		),
	noOptionsMessage: () => noOptionsMessageStyles,
};

const styles = {
	input: (base) => ({
		...base,
		// "input:focus": {
		// 	border: "ring-2 ring-primary ring",
		// },
	}),
	multiValueLabel: (base) => ({
		...base,
		whiteSpace: 'normal',
		overflow: 'visible',
	}),
};

export { classNames, styles };
