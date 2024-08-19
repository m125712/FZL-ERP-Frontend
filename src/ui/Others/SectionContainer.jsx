import cn from '@/lib/cn';

const SectionContainer = ({ title, children, className, buttons }) => {
	return (
		<div
			className={cn(
				'container mx-auto rounded border border-primary/10 shadow-sm',
				className
			)}>
			<div className='flex items-center gap-2 bg-secondary-content/5 px-4 py-3 text-2xl font-semibold capitalize leading-tight text-primary md:text-3xl'>
				{title}

				{buttons && buttons.length > 0 && (
					<div className='flex gap-2'>{buttons.map((e) => e)}</div>
				)}
			</div>
			<hr className='border-1 border-primary/20' />
			{children}
		</div>
	);
};

export default SectionContainer;
