import { Check, Undo } from 'lucide-react';
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
	showUndoButton = true,
	showSubmitButton = true,
	handleUndoButton,
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
								className={`input input-sm join-item w-16 border border-gray-300 ${
									index === 0 ? 'rounded-sm' : ''
								} ${index === numberOfInputFields - 1 && numberOfInputFields > 1 ? 'rounded-r-none' : ''}`}
								placeholder={placeholders[index]}
								value={
									type === 'number' ? Number(value) : value
								}
								onChange={onChange}
								onBlur={onBlur}
								disabled={disabled}
							/>
						)}
					/>
				);
			})}
			<button
				className='btn join-item btn-sm rounded-r-full border border-gray-300 bg-red-100'
				type='button'
				onClick={handleUndoButton}
				disabled={disabled || !showUndoButton}
			>
				<Undo size={16} />
			</button>

			<button
				className='btn join-item btn-sm rounded-r-full border border-gray-300'
				type='button'
				onClick={handleSubmit}
				disabled={disabled || !showSubmitButton}
			>
				<Check size={16} />
			</button>
		</div>
	);
}
