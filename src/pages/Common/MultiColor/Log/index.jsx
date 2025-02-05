import React, { useEffect } from 'react';

import PageInfo from '@/util/PageInfo';

import TapeReceived from './TapeReceived';
import TapeToDyeing from './TapeToDyeing';

export default function index() {
	useEffect(() => {
		document.title = 'Log';
	}, []);

	return (
		<div className='flex flex-col gap-6'>
			<TapeToDyeing />
			<TapeReceived />
		</div>
	);
}
