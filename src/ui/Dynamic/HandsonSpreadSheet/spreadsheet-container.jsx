import React from 'react';
import { Plus } from 'lucide-react';

const SpreadSheetContainer = (
	{ children, extraHeader, handleAdd, title } = {
		children,
		title,
		extraHeader,
		handleAdd,
	}
) => {
	return (
		<div className='overflow-hidden rounded-md shadow-sm'>
			<div className='flex items-center justify-between bg-primary py-2 pl-4 pr-2'>
				<h3 className='text-lg font-medium text-primary-foreground'>
					{title || 'Dynamic Fields'}
				</h3>

				<div className='flex items-center gap-4'>
					{extraHeader}
					{handleAdd && (
						<button
							onClick={handleAdd}
							type='button'
							size={'xs'}
							className='btn btn-accent btn-xs gap-1 rounded'>
							<Plus className='size-4' />
							New
						</button>
					)}
				</div>
			</div>

			{children}
		</div>
	);
};

export default SpreadSheetContainer;
