import React, { useEffect, useMemo, useState } from 'react';
import { Book, ChevronDown, ChevronRight, Minus, Plus } from 'lucide-react';

import { useChartOfAccounts } from '../Report/config/query';

// Utility function to flatten tree data for table display
const flattenTreeData = (
	data,
	level = 0,
	parentPath = '',
	expandedItems = new Set()
) => {
	if (!data) return [];

	const flattened = [];

	data.forEach((node, index) => {
		const currentPath = parentPath
			? `${parentPath}.${index}`
			: String(index);

		const flatNode = {
			id: node.id || currentPath,
			name: node.name || '',
			account_type: node.account_type || '',
			account_tag: node.account_tag || '',
			level,
			path: currentPath,
			hasChildren: Boolean(node.children && node.children.length > 0),
			isExpanded: expandedItems.has(currentPath),
			parentPath,
			originalNode: node,
		};

		flattened.push(flatNode);

		// Add children if this node is expanded
		if (node.children && expandedItems.has(currentPath)) {
			const childrenFlattened = flattenTreeData(
				node.children,
				level + 1,
				currentPath,
				expandedItems
			);
			flattened.push(...childrenFlattened);
		}
	});

	return flattened;
};

// Table Row Component
const TableRow = ({ item, onToggleExpand }) => {
	const handleToggle = () => {
		if (item.hasChildren) {
			onToggleExpand(item.path);
		}
	};

	return (
		<tr className='border border-base-300 bg-secondary-foreground transition-colors'>
			<td className='px-1 py-2'>
				<div
					className='flex items-center gap-2'
					style={{ paddingLeft: `${item.level * 24}px` }}
				>
					<div className='flex h-4 w-4 flex-shrink-0 items-center justify-center'>
						{item.hasChildren ? (
							<button
								onClick={handleToggle}
								className='rounded p-0.5 transition-colors hover:bg-base-300'
								aria-label={
									item.isExpanded ? 'Collapse' : 'Expand'
								}
							>
								{item.isExpanded ? (
									<ChevronDown className='h-3 w-3 text-primary' />
								) : (
									<ChevronRight className='h-3 w-3 text-primary' />
								)}
							</button>
						) : (
							<div className='h-1 w-1 rounded-full bg-accent'></div>
						)}
					</div>
					<span
						className={`text-sm font-medium capitalize text-base-content ${
							item.hasChildren ? 'cursor-pointer' : ''
						}`}
						onClick={handleToggle}
					>
						{item.name}
					</span>
				</div>
			</td>
			<td className='px-4 py-3 capitalize'>
				{item.account_type && item.account_type}
			</td>
			<td className='px-4 py-3'>
				{item.account_tag && item.account_tag}
			</td>
		</tr>
	);
};

// Main Table Component
export const AdvancedAccountTable = () => {
	const [expandedItems, setExpandedItems] = useState(new Set());
	const [expandAll, setExpandAll] = useState(false);
	const { data: accountData, isLoading } = useChartOfAccounts();

	// Memoized flattened data
	const flattenedData = useMemo(() => {
		if (!accountData) return [];
		return flattenTreeData(accountData, 0, '', expandedItems);
	}, [accountData, expandedItems]);

	// Get all expandable paths
	const getAllExpandablePaths = useMemo(() => {
		if (!accountData) return new Set();

		const allPaths = new Set();
		const collectPaths = (data, parentPath = '') => {
			data.forEach((node, index) => {
				const currentPath = parentPath
					? `${parentPath}.${index}`
					: String(index);
				if (node.children && node.children.length > 0) {
					allPaths.add(currentPath);
					collectPaths(node.children, currentPath);
				}
			});
		};
		collectPaths(accountData);
		return allPaths;
	}, [accountData]);

	// Handle individual item toggle
	const handleToggleExpand = (path) => {
		setExpandedItems((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(path)) {
				newSet.delete(path);
			} else {
				newSet.add(path);
			}
			return newSet;
		});
	};

	// Handle expand/collapse all
	const handleExpandAll = () => {
		if (expandAll) {
			// Collapse all
			setExpandedItems(new Set());
		} else {
			// Expand all
			setExpandedItems(new Set(getAllExpandablePaths));
		}
		setExpandAll(!expandAll);
	};

	// Update expandAll state based on expanded items
	useEffect(() => {
		const totalExpandableCount = getAllExpandablePaths.size;
		const expandedCount = expandedItems.size;

		setExpandAll(
			totalExpandableCount > 0 &&
				expandedCount === totalExpandableCount &&
				Array.from(getAllExpandablePaths).every((path) =>
					expandedItems.has(path)
				)
		);
	}, [expandedItems, getAllExpandablePaths]);

	if (isLoading) {
		return (
			<div className='flex w-full justify-center p-4'>
				<span className='loading loading-spinner loading-lg'></span>
			</div>
		);
	}

	return (
		<div className='w-full'>
			{/* Header with Expand All Button */}
			<div className='mb-4 flex items-center justify-between'>
				<h3 className='text-lg font-semibold text-base-content'></h3>
				<button
					type='button'
					className={`btn btn-sm gap-2 ${
						expandAll ? 'btn-primary' : 'btn-outline'
					}`}
					onClick={handleExpandAll}
					disabled={getAllExpandablePaths.size === 0}
				>
					{expandAll ? <>Collapse All</> : <>Expand All</>}
				</button>
			</div>

			{/* Table */}
			<div className='overflow-x-auto'>
				<table className='table w-full'>
					{/* Table Header */}
					<thead>
						<tr className='border-2 border-base-300'>
							<th className='bg-secondary-foreground px-4 py-3 text-left text-sm font-semibold text-base-content'>
								Account Name
							</th>
							<th className='px-4 py-3 text-left text-sm font-semibold text-base-content'>
								Type
							</th>
							<th className='px-4 py-3 text-left text-sm font-semibold text-base-content'>
								Tag
							</th>
						</tr>
					</thead>
					{/* Table Body */}
					<tbody>
						{flattenedData.map((item) => (
							<TableRow
								key={item.path}
								item={item}
								onToggleExpand={handleToggleExpand}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AdvancedAccountTable;
