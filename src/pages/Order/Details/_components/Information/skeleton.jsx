import React from 'react';

export default function Index() {
	return (
		<div className='flex w-full flex-col gap-1'>
			<div className='flex items-center gap-4'>
				<div className='skeleton h-12 w-72 shrink-0'></div>
			</div>
			<hr className='border-1 border-secondary-content' />
			<div className='skeleton h-56 w-full'></div>
		</div>
	);
}
