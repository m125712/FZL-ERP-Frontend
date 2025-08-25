export default function BalanceStatus({
	totalDr,
	totalCr,
	currencySymbol = '',
	precision = 2,
	showDifference = true,
	className = '',
}) {
	const isBalanced = totalCr === totalDr && totalCr > 0 && totalDr > 0;
	const difference = Math.abs(totalDr - totalCr);

	if (isBalanced) {
		return (
			<div className={`flex flex-col items-center ${className}`}>
				<span className='flex items-center gap-1 font-medium text-success'>
					<svg
						className='h-4 w-4'
						fill='currentColor'
						viewBox='0 0 20 20'
					>
						<path
							fillRule='evenodd'
							d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
							clipRule='evenodd'
						/>
					</svg>
					Balanced
				</span>
			</div>
		);
	}

	return (
		<div className={`flex flex-col items-center ${className}`}>
			<span className='flex items-center gap-1 font-medium text-error'>
				<svg
					className='h-4 w-4'
					fill='currentColor'
					viewBox='0 0 20 20'
				>
					<path
						fillRule='evenodd'
						d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
						clipRule='evenodd'
					/>
				</svg>
				Unbalanced
			</span>
			{showDifference && (
				<span className='mt-1 text-xs text-gray-500'>
					Difference: {currencySymbol}
					{difference.toFixed(precision)}
				</span>
			)}
		</div>
	);
}
