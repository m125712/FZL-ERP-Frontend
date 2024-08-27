import { Close, FilterIcon } from '@/assets/icons';
import { cn } from '@nextui-org/react';

// export const Template = ({
// 	columnName,
// 	onClick,
// 	showResetButton = false,
// 	children,
// }) => (
// 	<details className="group overflow-hidden rounded border border-primary [&_summary::-webkit-details-marker]:hidden">
// 		<summary className="flex cursor-pointer select-none items-center justify-between gap-2 bg-white p-2 text-gray-900 transition">
// 			<span className="flex items-center gap-2 text-sm font-medium">
// 				{columnName}
// 				{showResetButton && (
// 					<button
// 						type="button"
// 						onClick={onClick}
// 						className="group/btn btn btn-circle btn-outline btn-error btn-xs"
// 					>
// 						<Close className="h-4 w-4 text-error group-hover/btn:text-primary-content" />
// 					</button>
// 				)}
// 			</span>

// 			<span className="transition group-open:-rotate-180">
// 				<svg
// 					xmlns="http://www.w3.org/2000/svg"
// 					fill="none"
// 					viewBox="0 0 24 24"
// 					strokeWidth="1.5"
// 					stroke="currentColor"
// 					className="h-4 w-4"
// 				>
// 					<path
// 						strokeLinecap="round"
// 						strokeLinejoin="round"
// 						d="M19.5 8.25l-7.5 7.5-7.5-7.5"
// 					/>
// 				</svg>
// 			</span>
// 		</summary>
// 		<div className="flex w-full flex-col gap-1 border-t border-secondary p-2">
// 			{children}
// 		</div>
// 	</details>
// );

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
					onClick={onClick}>
					<Close className='text-error group-hover/btn:text-primary-content h-4 w-4' />
				</button>
			)}
		</span>
		{children}
	</div>
);

export const DrawerBody = ({ htmlId, children }) => (
	<div className='drawer drawer-end z-50 mt-1.5 w-auto'>
		<input id={htmlId} type='checkbox' className='drawer-toggle' />
		<div className='drawer-content'>
			<label htmlFor={htmlId} className='btn-filter-outline'>
				<FilterIcon className='h-4 w-4' />
				<span>Filter</span>
			</label>
		</div>
		<div className='drawer-side overflow-x-hidden'>
			<label
				htmlFor={htmlId}
				aria-label='filter all columns'
				className='drawer-overlay'
			/>
			<div className='bg-base-200 relative min-h-full min-w-[16.5rem]'>
				<div className='text-primary-content flex items-center justify-between bg-primary px-4 py-2 text-xl font-bold'>
					Filter
					<FilterIcon />
				</div>
				<div className='p-2'>{children}</div>
			</div>
		</div>
	</div>
);

export const notShowingColumns = [
	'id',
	'action',
	'actions',
	'created_at',
	'updated_at',
	'reset_password',
	'page_assign',
];

export const SlicedColumn = ({ columns }) => {
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
						<li key={id} className=''>
							<label
								className={cn(
									'text-sm font-medium text-secondary'
								)}>
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
