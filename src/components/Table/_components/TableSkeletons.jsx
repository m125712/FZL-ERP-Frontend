const TableSkeletons = ({ columns }) => {
	return Array.from({ length: 10 }).map((_, index) => (
		<tr
			key={index}
			className='cursor-pointer text-base transition-colors duration-300 ease-in hover:bg-base-200/40 focus:bg-base-200/40'>
			{Array.from({ length: columns?.length }).map((_, i) => (
				<td key={i} className='px-3 py-2'>
					<div className='skeleton h-6 w-full rounded-md bg-base-200'></div>
				</td>
			))}
		</tr>
	));
};

export default TableSkeletons;
