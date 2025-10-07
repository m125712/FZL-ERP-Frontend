import { useState } from 'react';

export default function SimpleTooltip({ content, children, position = 'top' }) {
	const [visible, setVisible] = useState(false);

	// Position-specific classes for the tooltip
	const getPositionClasses = (pos) => {
		const positions = {
			top: {
				container: 'absolute -top-12 left-1/2 -translate-x-1/2',
				arrow: 'absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-gray-800',
			},
			bottom: {
				container: 'absolute -bottom-12 left-1/2 -translate-x-1/2',
				arrow: 'absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-white dark:border-b-gray-800',
			},
			left: {
				container: 'absolute right-full top-1/2 -translate-y-1/2 -mr-3',
				arrow: 'absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-white dark:border-l-gray-800',
			},
			right: {
				container: 'absolute left-full top-1/2 -translate-y-1/2 -ml-3',
				arrow: 'absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-white dark:border-r-gray-800',
			},
			'top-start': {
				container: 'absolute -top-12 left-0',
				arrow: 'absolute top-full left-4 border-4 border-transparent border-t-white dark:border-t-gray-800',
			},
			'top-end': {
				container: 'absolute -top-12 right-0',
				arrow: 'absolute top-full right-4 border-4 border-transparent border-t-white dark:border-t-gray-800',
			},
			'bottom-start': {
				container: 'absolute -bottom-12 left-0',
				arrow: 'absolute bottom-full left-4 border-4 border-transparent border-b-white dark:border-b-gray-800',
			},
			'bottom-end': {
				container: 'absolute -bottom-12 right-0',
				arrow: 'absolute bottom-full right-4 border-4 border-transparent border-b-white dark:border-b-gray-800',
			},
		};

		return positions[pos] || positions.top;
	};

	const positionClasses = getPositionClasses(position);

	return (
		<div className='group relative inline-block'>
			<div className='flex justify-start gap-1 text-gray-600 transition-colors duration-200 hover:text-blue-500 focus:outline-none dark:text-gray-200 dark:hover:text-blue-400'>
				{children}
			</div>

			{/* Tooltip Container */}
			<div
				className={`${positionClasses.container} z-50 whitespace-nowrap rounded-lg bg-white px-3 py-2 text-sm text-gray-600 opacity-0 shadow-lg shadow-gray-200 transition-opacity duration-200 group-hover:opacity-100 dark:bg-gray-800 dark:text-white dark:shadow-none`}
			>
				{content}

				{/* Tooltip Arrow */}
				<div className={positionClasses.arrow}></div>
			</div>
		</div>
	);
}
