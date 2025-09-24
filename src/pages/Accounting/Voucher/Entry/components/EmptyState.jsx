import { Plus } from 'lucide-react';

export default function EmptyState({ appendCrEntry, appendDrEntry }) {
	return (
		<div className='rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center'>
			<h3 className='mb-2 text-lg font-medium text-gray-700'>
				No voucher entries yet
			</h3>
			<p className='mb-4 text-gray-500'>
				Start by adding your first debit or credit entry
			</p>
			<div className='flex items-center justify-center gap-3'>
				<button
					type='button'
					onClick={appendDrEntry}
					className='btn btn-accent btn-sm flex items-center gap-2 rounded-lg'
				>
					<Plus className='h-4 w-4' /> Add Debit Entry
				</button>
				<button
					type='button'
					onClick={appendCrEntry}
					className='btn btn-error btn-sm flex items-center gap-2 rounded-lg'
				>
					<Plus className='h-4 w-4' /> Add Credit Entry
				</button>
			</div>
		</div>
	);
}
