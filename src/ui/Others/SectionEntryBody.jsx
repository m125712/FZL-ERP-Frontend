import { cn } from '@/lib/utils';

export default function BodyTemplate({ title, header, className, children }) {
	return (
		<div className='rounded-md bg-primary text-primary-content'>
			<div className='mr-2 flex items-center justify-between'>
				<span className='flex items-center gap-4 px-4 py-3 text-lg font-semibold capitalize text-primary-content'>
					{title}
				</span>
				{header}
			</div>
			<div
				className={cn(
					'flex flex-col gap-1.5 border border-t-0 border-secondary/30 bg-base-100 p-3 text-secondary-content',
					className
				)}
			>
				{children}
			</div>
		</div>
	);
}
