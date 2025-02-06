import React from 'react';

const Item = ({ columns }) => {
	return (
		<div>
			{columns?.map(
				({
					id,
					getIsVisible,
					getToggleVisibilityHandler,
					columnDef: { header },
				}) => {
					return (
						<li key={id}>
							<label className='text-sm font-medium text-secondary'>
								<input
									type='checkbox'
									className='checkbox-accent checkbox checkbox-xs rounded-md'
									checked={getIsVisible()}
									onChange={getToggleVisibilityHandler()}
								/>
								<span> {header}</span>
							</label>
						</li>
					);
				}
			)}
		</div>
	);
};

export default Item;
