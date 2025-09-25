// SimpleTooltip.js
import { useState } from 'react';

export default function SimpleTooltip({ content, children, position = 'top' }) {
	const [visible, setVisible] = useState(false);

	return (
		<div className='group relative inline-block'>
			<div className='flex justify-start gap-1 text-gray-600 transition-colors duration-200 hover:text-blue-500 focus:outline-none dark:text-gray-200 dark:hover:text-blue-400'>
				{children}
			</div>
			<p className='absolute -top-12 left-1/2 z-10 -translate-x-1/2 truncate rounded-lg bg-white px-5 py-3 text-center text-gray-600 opacity-0 shadow-lg shadow-gray-200 group-hover:opacity-100 dark:bg-gray-800 dark:text-white dark:shadow-none'>
				{content}
			</p>
		</div>
	);
}
