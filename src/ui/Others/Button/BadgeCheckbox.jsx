const options = [
	{ id: '1', name: 'One' },
	{ id: '2', name: 'Two' },
	{ id: '3', name: 'Three' },
];
//
const CheckboxButtons = () => (
	<div className='flex gap-1'>
		{options.map((option) => (
			<div key={option.id}>
				<input
					id={option.id}
					type='checkbox'
					className='peer hidden'
					value={option.id}
				/>
				<label
					htmlFor={option.id}
					className='badge badge-sm cursor-pointer select-none border border-primary transition-colors duration-300 ease-in-out peer-checked:badge-primary hover:bg-primary/30'>
					<div className='flex w-full items-center justify-center'>
						<div className='text-brand-black text-sm'>
							{option.name}
						</div>
					</div>
				</label>
			</div>
		))}
	</div>
);

export default CheckboxButtons;
