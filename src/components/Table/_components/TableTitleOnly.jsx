import cn from '@/lib/cn';

const TableTitleOnly = ({ title, subtitle }) => {
	return (
		<div
			className={cn(
				'mb-0 flex items-center justify-between gap-2 rounded-t-md border border-b-0 border-secondary/30 bg-primary px-4 py-3 md:justify-start'
			)}>
			<div className='flex flex-col'>
				<h1
					className={cn(
						'text-2xl font-semibold capitalize leading-tight text-primary-content md:text-3xl'
					)}>
					{title}
				</h1>
				{subtitle && (
					<p className='-mt-1 text-[0.8rem] capitalize text-secondary-content'>
						{subtitle}
					</p>
				)}
			</div>
		</div>
	);
};

export default TableTitleOnly;
