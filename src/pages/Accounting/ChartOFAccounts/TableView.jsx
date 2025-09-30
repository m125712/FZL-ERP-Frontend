import {
	useChartOfAccounts,
	useChartOfAccountsTable,
} from '../Report/config/query';

// Table Row Component
const TableRow = ({ item }) => {
	return (
		<tr className='border border-base-300 transition-colors'>
			<td className='px-4 py-3 capitalize'>{item.type}</td>
			<td className='px-4 py-3 capitalize'>{item.head_name}</td>
			<td className='px-4 py-3 capitalize'>{item.group_name}</td>
			<td className='px-4 py-3 capitalize'>{item.ledger_name}</td>
		</tr>
	);
};

// Main Table Component - simplified without the problematic useEffect
const TableView = () => {
	const { data: accountData, isLoading } = useChartOfAccountsTable();

	if (isLoading) {
		return (
			<div className='flex w-full justify-center p-4'>
				<span className='loading loading-spinner loading-lg'></span>
			</div>
		);
	}

	return (
		<div className='w-full'>
			<div className='overflow-x-auto'>
				<table className='table w-full'>
					<thead>
						<tr className='border-2 border-base-300'>
							<th className='px-4 py-3 text-left text-sm font-semibold text-base-content'>
								Type
							</th>
							<th className='px-4 py-3 text-left text-sm font-semibold text-base-content'>
								Head
							</th>
							<th className='px-4 py-3 text-left text-sm font-semibold text-base-content'>
								Group
							</th>
							<th className='px-4 py-3 text-left text-sm font-semibold text-base-content'>
								Ledger
							</th>
						</tr>
					</thead>
					<tbody>
						{accountData.map((item) => (
							<TableRow key={item.path} item={item} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default TableView;
