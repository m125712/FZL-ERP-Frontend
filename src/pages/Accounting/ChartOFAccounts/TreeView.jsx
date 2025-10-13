import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, FileX } from 'lucide-react';

const AccountList = ({ node, forceExpanded = false }) => {
	const [isExpanded, setIsExpanded] = useState(forceExpanded);
	const hasChildren = node.children && node.children.length > 0;
	const isEmptyGroup = node.children && node.children.length === 0;

	// Update state when forceExpanded prop changes
	useEffect(() => {
		setIsExpanded(forceExpanded);
	}, [forceExpanded]);

	const toggleExpanded = () => {
		// Allow expansion for both groups with children AND empty groups
		if (hasChildren || isEmptyGroup) {
			setIsExpanded(!isExpanded);
		}
	};

	return (
		<li>
			<div
				className={`flex cursor-pointer rounded-md p-1 transition-colors ${
					hasChildren || isEmptyGroup
						? 'cursor-pointer hover:bg-base-200'
						: 'cursor-default'
				}`}
				onClick={toggleExpanded}
			>
				<div className='flex flex-1 gap-2'>
					{hasChildren || isEmptyGroup ? (
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

			{/* Render children or empty state when expanded */}
			{(hasChildren || isEmptyGroup) && isExpanded && (
				<ul className='ml-2 mt-2 space-y-1 border-l-2 border-base-300/50 pl-4'>
					{hasChildren ? (
						// Render actual children
						node.children.map((child, index) => (
							<AccountList
								key={`${child.name}-${index}`}
								node={child}
								forceExpanded={forceExpanded}
							/>
						))
					) : (
						// Render "no ledger" message as a child item
						<li className='flex text-gray-500'>
							<span className='text-xs'>(no ledger)</span>
						</li>
					)}
				</ul>
			)}
		</li>
	);
};

// Tree View Component remains the same
const TreeView = ({ expandAll, accountData }) => {
	return (
		<div className='menu rounded-box bg-transparent p-2'>
			<ul className='space-y-2'>
				{accountData?.map((account, index) => (
					<AccountList
						key={`${account.name}-${index}`}
						node={account}
						forceExpanded={expandAll}
					/>
				))}
			</ul>
		</div>
	);
};

export default TreeView;
