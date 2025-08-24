// components/Modal/FieldChangeWarning.jsx
import React from 'react';

export default function FieldChangeWarning({
	isOpen,
	onConfirm,
	onCancel,
	fieldName,
	currentValue,
	newValue,
}) {
	if (!isOpen) return null;

	return (
		<div className='modal modal-open'>
			<div className='modal-box'>
				<h3 className='text-lg font-bold'>⚠️ Confirm Field Change</h3>
				<div className='py-4'>
					<p className='mb-2 text-sm text-gray-600'>
						You are about to change the <strong>{fieldName}</strong>{' '}
						field.
					</p>
					<div className='rounded border border-yellow-200 bg-yellow-50 p-3'>
						<p className='text-sm'>
							<span className='font-medium'>From:</span>{' '}
							{currentValue || 'Not selected'}
						</p>
						<p className='text-sm'>
							<span className='font-medium'>To:</span>{' '}
							{newValue || 'Not selected'}
						</p>
					</div>
					<p className='mt-3 text-sm font-medium text-red-600'>
						Warning: This action may clear related data.
					</p>
				</div>
				<div className='modal-action'>
					<button
						type='button'
						className='btn btn-ghost'
						onClick={onCancel}
					>
						Cancel
					</button>
					<button
						type='button'
						className='btn btn-warning'
						onClick={onConfirm}
					>
						Confirm Change
					</button>
				</div>
			</div>
		</div>
	);
}
