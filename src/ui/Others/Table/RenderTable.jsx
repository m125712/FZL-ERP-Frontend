import cn from '@/lib/cn';

const RenderTable = ({ items, title, className }) => {
	return (
		<div className={cn('h-full', className)}>
			{title && (
				<h4 className='bg-base-200 px-3 py-2 text-lg font-medium capitalize leading-tight text-primary'>
					{title}
				</h4>
			)}
			<div className='overflow-x-auto'>
				<table className='table table-sm'>
					<tbody>
						{items?.map((item, index) => (
							<tr
								key={index}
								className='cursor-pointer transition-colors duration-100 hover:bg-base-200/50'>
								<th className='w-1/2 capitalize text-primary'>
									{item.label}
								</th>
								<td className='w-1/2 text-primary'>
									{item.value || '--'}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default RenderTable;
