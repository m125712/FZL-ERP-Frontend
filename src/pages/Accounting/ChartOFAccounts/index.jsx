import { useEffect, useState } from 'react';
import { Book, ChevronDown, ChevronRight } from 'lucide-react';

import { useChartOfAccounts } from '../Report/config/query';
import AdvancedAccountTable from './TableView';

const AccountList = ({ node, forceExpanded = false }) => {
	const [isExpanded, setIsExpanded] = useState(forceExpanded);

	const hasChildren = node.children && node.children.length > 0;

	// Update state when forceExpanded prop changes
	useEffect(() => {
		setIsExpanded(forceExpanded);
	}, [forceExpanded]);

	const toggleExpanded = () => {
		if (hasChildren) {
			setIsExpanded(!isExpanded);
		}
	};

	return (
		<li>
			<div
				className='flex cursor-pointer rounded-md p-1 transition-colors'
				onClick={toggleExpanded}
			>
				<div className='flex gap-2'>
					{hasChildren ? (
						<div className='flex-shrink-0'>
							{isExpanded ? (
								<ChevronDown className='h-4 w-4 text-primary' />
							) : (
								<ChevronRight className='h-4 w-4 text-primary' />
							)}
						</div>
					) : (
						<div className='flex h-4 w-2 items-center justify-center'>
							<div className='h-1 w-1 rounded-full bg-accent'></div>
						</div>
					)}
					<span className='text-sm font-medium capitalize text-base-content'>
						{node.name}
					</span>
				</div>
				<div className='flex gap-2'>
					{node.account_type && (
						<span className='badge badge-outline badge-xs py-1'>
							{node.account_type}
						</span>
					)}
					{node.account_tag && (
						<span className='badge badge-primary badge-xs py-1'>
							{node.account_tag}
						</span>
					)}
				</div>
			</div>
			{hasChildren && isExpanded && (
				<ul className='ml-2 mt-2 space-y-1 border-l-2 border-base-300/50 pl-4'>
					{node.children.map((child, index) => (
						<AccountList
							key={`${child.name}-${index}`} // Better key generation
							node={child}
							forceExpanded={forceExpanded}
						/>
					))}
				</ul>
			)}
		</li>
	);
};

// Fix the component props destructuring
const AdvancedAccountList = () => {
	const { data: accountData, isLoading } = useChartOfAccounts();
	const [expandAll, setExpandAll] = useState(false);

	if (isLoading) return <span>Loading...</span>;

	return (
		<div>
			<div className='mb-4 flex items-center justify-between pt-4'>
				<h3 className='text-lg font-semibold text-base-content'>
					Tree View
				</h3>

				<button
					type='button'
					className={`btn btn-sm ${
						expandAll ? 'btn-primary' : 'btn-outline'
					}`}
					onClick={() => setExpandAll(!expandAll)}
				>
					{expandAll ? 'Collapse All' : 'Expand All'}
				</button>
			</div>
			<div className='menu rounded-box bg-transparent p-2'>
				<ul className='space-y-2'>
					{accountData?.map((account, index) => (
						<AccountList
							key={`${account.name}-${index}`} // Better key generation
							node={account}
							forceExpanded={expandAll}
						/>
					))}
				</ul>
			</div>
		</div>
	);
};

const ChartOfAccounts = () => {
	const [isTableView, setIsTableView] = useState(false);
	const { isLoading } = useChartOfAccounts();

	if (isLoading) return <span>Loading...</span>;

	return (
		<div className='w-full'>
			<div className='card bg-transparent'>
				<div className='card-body'>
					<div className='mb-2 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center'>
						<h2 className='card-title flex items-center gap-2 text-2xl text-primary'>
							<Book className='h-8 w-6' />
							Chart of Accounts
						</h2>
						<button
							type='button'
							className={`btn btn-sm ${
								isTableView ? 'btn-primary' : 'btn-outline'
							}`}
							onClick={() => setIsTableView(!isTableView)}
						>
							{isTableView
								? 'Switch to Tree View'
								: 'Switch to Table View'}
						</button>
						{/* <button
							type='button'
							className={`btn btn-sm ${
								expandAll ? 'btn-primary' : 'btn-outline'
							}`}
							onClick={() => setExpandAll(!expandAll)}>
							{expandAll ? 'Collapse All' : 'Expand All'}
						</button> */}
					</div>
					<hr />
					{!isTableView && <AdvancedAccountList />}
					{isTableView && <AdvancedAccountTable />}
				</div>
			</div>
		</div>
	);
};

export default ChartOfAccounts;
