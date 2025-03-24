const TableTitle = ({ title, subtitle }) => {
	return (
		<div className='flex items-start justify-between gap-2 md:justify-start'>
			<div className='flex flex-col'>
				<h1 className='text-xl font-semibold capitalize leading-tight text-primary md:text-2xl'>
					{title}
				</h1>
				{subtitle && (
					<div className='mt-0.5 text-sm capitalize text-secondary'>
						{subtitle}
					</div>
				)}
			</div>
		</div>
	);
};

export default TableTitle;
