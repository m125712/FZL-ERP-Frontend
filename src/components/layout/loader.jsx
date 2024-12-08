import React from 'react';
import GridLoader from 'react-spinners/GridLoader';

import { colors } from '@/config/tailwind';

const Loader = () => {
	return (
		<div className='flex h-full w-full items-center justify-center'>
			<GridLoader
				color={colors.ACCENT}
				size={10}
				aria-label='Loading Spinner'
				data-testid='loader'
			/>
		</div>
	);
};

export default Loader;
