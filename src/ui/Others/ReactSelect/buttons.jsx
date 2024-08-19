import { Close, MenuDown } from '@/assets/icons';
import { components } from 'react-select';

const DropdownIndicator = (props) => {
	const { menuIsOpen } = props.selectProps;

	return (
		<components.DropdownIndicator {...props}>
			<MenuDown
				className={`h-4 transform text-primary transition-transform duration-500 ${
					menuIsOpen ? 'rotate-0' : '-rotate-90'
				}`}
			/>
		</components.DropdownIndicator>
	);
};

const ClearIndicator = (props) => (
	<components.ClearIndicator {...props}>
		<Close />
	</components.ClearIndicator>
);

const MultiValueRemove = (props) => (
	<components.MultiValueRemove {...props}>
		<Close />
	</components.MultiValueRemove>
);

// const Input = (props) => (
// 	<div>
// 		<components.Input onFocus={(e) => e.target.select()} {...props} />
// 	</div>
// );

const ButtonComponents = {
	DropdownIndicator,
	ClearIndicator,
	MultiValueRemove,
	// Input,
};

export { ButtonComponents };
