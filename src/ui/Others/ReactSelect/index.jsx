import Select from 'react-select';

import cn from '@/lib/cn';

import { ButtonComponents } from './buttons';
import { classNames, styles } from './utils';

const ReactSelect = ({ className, ...props }) => {
	// console.log(props);
	return (
		<Select
			unstyled
			classNamePrefix={'react-select-'}
			classNames={{
				...classNames,
				control: ({ isFocused, isDisabled }) =>
					cn(
						classNames.control({ isDisabled, isFocused }),
						className
					),
			}}
			styles={styles}
			components={ButtonComponents}
			closeMenuOnSelect={!props.isMulti}
			hideSelectedOptions
			maxMenuHeight={150}
			placeholder={props.placeholder}
			{...props}
		/>
	);
};

export default ReactSelect;
