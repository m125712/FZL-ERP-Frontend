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
		<tr className='border-b border-base-300 transition-colors hover:bg-base-200/50'>
			<td className='px-4 py-3'>
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
							<div className='h-2 w-2 rounded-full bg-accent'></div>
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
			<td className='px-4 py-3'>
				{item.account_type && (
					<span className='badge badge-outline badge-sm'>
						{item.account_type}
					</span>
				)}
			</td>
			<td className='px-4 py-3'>
				{item.account_tag && (
					<span className='badge badge-primary badge-sm'>
						{item.account_tag}
					</span>
				)}
			</td>
		</tr>
	);
};

// Main Table Component
const AdvancedAccountTable = () => {
	const [expandedItems, setExpandedItems] = useState(new Set());
	const [expandAll, setExpandAll] = useState(false);
	const { data: accountData, isLoading } = useChartOfAccounts();

	// Memoized flattened data
	const flattenedData = useMemo(() => {
		if (!accountData) return [];
		return flattenTreeData(accountData, 0, '', expandedItems);
	}, [accountData, expandedItems]);

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
			setExpandedItems(new Set());
		} else {
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
			if (accountData) {
				collectPaths(accountData);
			}
			setExpandedItems(allPaths);
		}
		setExpandAll(!expandAll);
	};

	// Update expandAll state based on expanded items
	useEffect(() => {
		if (!accountData) return;

		const totalExpandableItems = new Set();
		const collectExpandablePaths = (data, parentPath = '') => {
			data.forEach((node, index) => {
				const currentPath = parentPath
					? `${parentPath}.${index}`
					: String(index);
				if (node.children && node.children.length > 0) {
					totalExpandableItems.add(currentPath);
					collectExpandablePaths(node.children, currentPath);
				}
			});
		};

		collectExpandablePaths(accountData);
		setExpandAll(
			totalExpandableItems.size > 0 &&
				totalExpandableItems.size === expandedItems.size
		);
	}, [expandedItems, accountData]);

	if (isLoading) {
		return (
			<div className='flex w-full justify-center p-4'>
				<span className='loading loading-spinner loading-lg'></span>
			</div>
		);
	}

	return (
		<div className='w-full p-2'>
			<div className='card bg-transparent shadow-2xl'>
				<div className='card-body'>
					{/* Header */}
					<div className='mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center'>
						<h2 className='card-title flex items-center gap-2 text-2xl text-primary'>
							<Book className='h-8 w-6' />
							Chart of Accounts
						</h2>
						<div className='flex gap-2'>
							<button
								className={`btn btn-sm ${
									expandAll ? 'btn-primary' : 'btn-outline'
								}`}
								onClick={handleExpandAll}
							>
								{expandAll ? (
									<>
										<Minus className='h-4 w-4' />
										Collapse All
									</>
								) : (
									<>
										<Plus className='h-4 w-4' />
										Expand All
									</>
								)}
							</button>
							<div className='badge badge-neutral badge-sm'>
								{flattenedData.length} rows
							</div>
						</div>
					</div>

					{/* Table */}
					<div className='overflow-x-auto'>
						<table className='table table-zebra w-full'>
							{/* Table Header */}
							<thead>
								<tr className='border-b-2 border-base-300'>
									<th className='px-4 py-3 text-left font-semibold text-base-content'>
										Account Name
									</th>
									<th className='px-4 py-3 text-left font-semibold text-base-content'>
										Type
									</th>
									<th className='px-4 py-3 text-left font-semibold text-base-content'>
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
			</div>
		</div>
	);
};

export default AdvancedAccountTable;
