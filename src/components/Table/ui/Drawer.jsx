import { CircleX, Funnel } from 'lucide-react';

export const Drawer = ({ htmlId, children }) => (
	<div className='drawer drawer-end z-50 mt-1.5 w-auto'>
		<input id={htmlId} type='checkbox' className='drawer-toggle' />
		<div className='drawer-content'>
			<label htmlFor={htmlId} className='btn-filter-outline'>
				<Funnel className='size-4' />
				<span className='hidden lg:block'>Filter</span>
			</label>
		</div>
		<div className='drawer-side overflow-x-hidden'>
			<label
				htmlFor={htmlId}
				aria-label='filter all columns'
				className='drawer-overlay'
			/>
			<div className='relative min-h-full min-w-[16.5rem] bg-base-200'>
				<div className='flex items-center justify-between bg-primary px-4 py-2 text-xl font-bold text-primary-content'>
					Filter
					<Funnel className='size-5' />
				</div>
				<div className='p-2'>{children}</div>
			</div>
		</div>
	</div>
);

export const Template = ({
	columnName,
	onClick,
	showResetButton = false,
	children,
}) => (
	<div className='flex flex-col gap-1 p-2'>
		<span className='mb-0.5 flex items-center justify-between gap-2 text-sm font-semibold'>
			{columnName}
			{showResetButton && (
				<button
					type='button'
					className='group/btn btn btn-circle btn-ghost btn-error btn-xs'
					onClick={onClick}
				>
					<CircleX className='h-4 w-4 text-error group-hover/btn:text-primary-content' />
				</button>
			)}
		</span>
		{children}
	</div>
);
