import { useState } from 'react';
import { Book, Grid3X3, List } from 'lucide-react';

import { useChartOfAccounts } from '../Report/config/query';
import TableView from './TableView';
import TreeView from './TreeView';
import TreeViewV2 from './TreeViewV2';

const ChartOfAccounts = () => {
	const [view, setView] = useState('tree');
	const [expandAll, setExpandAll] = useState(false);
	const { isLoading } = useChartOfAccounts();

	if (isLoading) return <span>Loading...</span>;

	return (
		<div className='w-full'>
			<div className='card bg-transparent'>
				<div className='card-body'>
					{/* Header */}
					<div className='mb-2 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center'>
						<h2 className='card-title flex items-center gap-2 text-2xl text-primary'>
							<Book className='h-8 w-6' />
							Chart of Accounts
						</h2>
						<div className='btn-group'>
							<button
								type='button'
								className={`btn btn-sm mr-2 gap-2 ${
									view === 'tree'
										? 'btn-primary'
										: 'btn-outline'
								}`}
								onClick={() => setView('tree')}
							>
								<List className='h-4 w-4' />
								Tree View
							</button>
							<button
								type='button'
								className={`btn btn-sm mr-2 gap-2 ${
									view === 'treeV2'
										? 'btn-primary'
										: 'btn-outline'
								}`}
								onClick={() => setView('treeV2')}
							>
								<List className='h-4 w-4' />
								Tree View V2
							</button>
							<button
								type='button'
								className={`btn btn-sm gap-2 ${
									view === 'table'
										? 'btn-primary'
										: 'btn-outline'
								}`}
								onClick={() => setView('table')}
							>
								<Grid3X3 className='h-4 w-4' />
								Table View
							</button>
						</div>
						{/* Expand All Button */}

						<button
							type='button'
							className={`btn btn-sm ${
								expandAll ? 'btn-primary' : 'btn-outline'
							}`}
							disabled={view === 'table'}
							onClick={() => setExpandAll(!expandAll)}
						>
							{expandAll ? 'Collapse All' : 'Expand All'}
						</button>
					</div>

					<hr className='mb-8' />

					{/* Conditional Rendering of Views - No Titles */}
					{view === 'tree' && <TreeView expandAll={expandAll} />}
					{view === 'treeV2' && <TreeViewV2 expandAll={expandAll} />}
					{view === 'table' && <TableView expandAll={expandAll} />}
				</div>
			</div>
		</div>
	);
};

export default ChartOfAccounts;
