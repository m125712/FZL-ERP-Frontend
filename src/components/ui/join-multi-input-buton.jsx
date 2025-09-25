import { Check } from 'lucide-react';
import { Controller } from 'react-hook-form';

export default function JoinMultiInputButton({
	names,
	control, // Use control instead of register
	numberOfInputFields = 1,
	placeholder,
	disabled = false,
	className = '',
	onSubmit: customOnSubmit,
	getValues,
	type = 'text',
	values = [],
	showSubmitButton = true,
}) {
	const fieldNames = Array.isArray(names)
		? names
		: Array(numberOfInputFields).fill(names || 'input');

	const getPlaceholderArray = () => {
		if (numberOfInputFields === 1) {
			return [placeholder || 'Enter value'];
		}
		return Array.isArray(placeholder)
			? placeholder
			: Array(numberOfInputFields).fill(placeholder || 'Enter value');
	};

	const placeholders = getPlaceholderArray();

	const handleSubmit = () => {
		const values = fieldNames.map(
			(fieldName) => getValues(fieldName) || ''
		);
		const returnValue = numberOfInputFields === 1 ? values[0] : values;
		customOnSubmit?.(returnValue, fieldNames);
	};

	return (
		<div className={`join ${className}`}>
			{Array.from({ length: numberOfInputFields }, (_, index) => {
				const fieldName = fieldNames[index] || `input_${index}`;

				return (
					<Controller
						key={fieldName}
						name={fieldName}
						control={control}
						render={({ field: { value, onChange, onBlur } }) => (
							<input
								type={type}
								className={`input input-sm join-item w-24 border border-gray-300 ${
									index === 0 ? 'rounded-sm' : ''
								} ${index === numberOfInputFields - 1 && numberOfInputFields > 1 ? 'rounded-r-none' : ''}`}
								placeholder={placeholders[index]}
								value={value} // Now properly controlled
								onChange={onChange}
								onBlur={onBlur}
								disabled={disabled}
							/>
						)}
					/>
				);
			})}
			{showSubmitButton && (
				<button
					className='btn join-item btn-sm rounded-r-full border border-gray-300'
					type='button'
					onClick={handleSubmit}
					disabled={disabled}
				>
					<Check size={16} />
				</button>
			)}
		</div>
	);
}
