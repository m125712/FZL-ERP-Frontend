import Select from 'react-select';
import { ButtonComponents } from './buttons';
import { classNames, styles } from './utils';

const ReactSelect = (props) => {
	// console.log(props);
	return (
		<Select
			unstyled
			classNamePrefix={'react-select-'}
			classNames={classNames}
			styles={styles}
			components={ButtonComponents}
			closeMenuOnSelect={!props.isMulti}
			hideSelectedOptions
			maxMenuHeight={150}
			{...props}
		/>
	);
};

export default ReactSelect;
