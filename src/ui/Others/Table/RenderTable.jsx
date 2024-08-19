const RenderTable = ({ items, title }) => {
	return (
		<>
			{title && (
				<h4 className='bg-secondary-content px-3 py-2 text-lg font-medium capitalize leading-tight text-white'>
					{title}
				</h4>
			)}
			<div className='overflow-x-auto'>
				<table className='table table-sm'>
					<tbody>
						{items?.map((item, index) => (
							<tr
								key={index}
								className='odd:bg-secondary-content/5'>
								<th className='capitalize'>{item.label}</th>
								<td>{item.value || '--'}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default RenderTable;
