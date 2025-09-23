import { Plus } from 'lucide-react';

export default function VoucherEntryHeader({ appendCrEntry, appendDrEntry }) {
	return (
		<div className='flex items-center justify-between rounded-lg border bg-primary p-4 text-white shadow-sm'>
			<div>
				<h2 className='text-lg font-semibold text-white'>
					Voucher Entry
				</h2>
				<p className='mt-1 text-sm text-white'>
					Add debit and credit entries for your voucher
				</p>
			</div>
			<div className='flex items-center gap-3'>
				<button
					type='button'
					onClick={appendDrEntry}
					className='btn btn-accent btn-sm flex items-center gap-2 rounded-lg px-4 py-2'
				>
					<Plus className='h-4 w-4' /> DR
				</button>
				<button
					type='button'
					onClick={appendCrEntry}
					className='btn btn-error btn-sm flex items-center gap-2 rounded-lg px-4 py-2'
				>
					<Plus className='h-4 w-4' /> CR
				</button>
			</div>
		</div>
	);
}
