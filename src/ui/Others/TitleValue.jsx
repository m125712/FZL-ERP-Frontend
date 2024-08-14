import cn from '@/lib/cn';

const TitleValue = ({ title, value, className }) => {
	return (
		<div
			className={cn(
				'grid grid-cols-3 gap-1 p-0.5 text-[0.8rem] sm:grid-cols-5 sm:gap-4 md:p-1',
				className
			)}>
			<dt className='font-bold capitalize text-primary sm:col-span-2'>
				{title}
			</dt>
			<dd className='col-span-2 max-w-52 capitalize text-gray-700 sm:col-span-3'>
				{value || '-'}
			</dd>
		</div>
	);
};

const TitleList = ({ title, value }) => {
	return (
		<div className='grid grid-cols-3 gap-1 p-0.5 text-[0.8rem] sm:grid-cols-5 sm:gap-4 md:p-1'>
			<dt className='font-bold capitalize text-primary sm:col-span-2'>
				{title}
			</dt>
			<dd className='col-span-2 max-w-52 capitalize text-gray-700 sm:col-span-3'>
				<ul className='list-inside list-disc space-y-1'>
					{value?.split(';').map((item, index) => (
						<li key={index} className='capitalize'>
							{item}
						</li>
					)) || '-'}
				</ul>
			</dd>
		</div>
	);
};

export { TitleList, TitleValue };
