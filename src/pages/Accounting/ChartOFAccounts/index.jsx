import React, { useEffect, useState } from 'react';
import { Separator } from '@radix-ui/react-select';
import { Book, ChevronDown, ChevronRight } from 'lucide-react';

import { useChartOfAccounts } from '../Report/config/query';

const AccountList = ({ node, forceExpanded = false }) => {
	const [isExpanded, setIsExpanded] = useState(forceExpanded);
	const hasChildren = node.children && node.children.length > 0;

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
						<div className='flex h-4 w-4 items-center justify-center'>
							<div className='h-2 w-2 rounded-full bg-accent'></div>
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
					{node.children.map((child, idx) => (
						<AccountList
							key={idx}
							node={child}
							forceExpanded={forceExpanded}
						/>
					))}
				</ul>
			)}
		</li>
	);
};

const AdvancedAccountList = () => {
	const [expandAll, setExpandAll] = useState(false);
	const { data: accountData, isLoading } = useChartOfAccounts();

	if (isLoading) return <span>Loading...</span>;

	return (
		<div className='w-full p-2'>
			<div className='card bg-transparent shadow-2xl'>
				<div className='card-body'>
					<div className='mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center'>
						<h2 className='card-title flex items-center gap-2 text-2xl text-primary'>
							<Book className='h-8 w-6' />
							Chart of Accounts
						</h2>
						<button
							className={`btn btn-sm ${
								expandAll ? 'btn-primary' : 'btn-outline'
							}`}
							onClick={() => setExpandAll(!expandAll)}
						>
							{expandAll ? 'Collapse All' : 'Expand All'}
						</button>
					</div>
					<hr />
					<div className='menu rounded-box bg-transparent p-2'>
						<ul className='space-y-2'>
							{accountData?.map((account, idx) => (
								<AccountList
									key={idx}
									node={account}
									forceExpanded={expandAll}
								/>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdvancedAccountList;
