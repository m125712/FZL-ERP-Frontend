import React from 'react';

export default function JoinMultiInputButton() {
	return (
		<div>
			<div className='join'>
				<input className='input join-item' placeholder='Email' />
				<button className='btn join-item rounded-r-full'>
					Subscribe
				</button>
			</div>
		</div>
	);
}
