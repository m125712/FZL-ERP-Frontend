import cn from '@/lib/cn';

const SectionContainer = ({
	title,
	children,
	className,
	buttons,
	selector,
	contentClassName,
}) => {
	return (
		<div className={cn('', className)}>
			<div className='flex items-center justify-between gap-2 rounded-t-md bg-primary px-4 py-3 text-2xl font-semibold capitalize leading-tight text-secondary-content md:text-3xl'>
				<div className='flex items-center gap-2'>
					{title}

					{buttons && buttons.length > 0 && (
						<div className='flex gap-2'>
							{buttons.map((e) => e)}
						</div>
					)}

				</div>
				<div className='w-32'>{selector}</div>
			</div>
			<div
				className={cn(
					'overflow-hidden rounded-md rounded-t-none border border-secondary/30',
					contentClassName
				)}>
				{children}
			</div>
		</div>
	);
};

export default SectionContainer;
