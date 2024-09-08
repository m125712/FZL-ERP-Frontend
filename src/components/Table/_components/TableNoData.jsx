const TableNoData = ({ colSpan }) => {
	return (
		<tr>
			<td
				colSpan={colSpan}
				className='animate-pulse py-6 text-center text-2xl font-semibold text-error'>
				No Data Found
			</td>
		</tr>
	);
};

export default TableNoData;
