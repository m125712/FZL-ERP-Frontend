import { useMemo } from 'react';
import { allFlatRoutes } from '@/routes';
import { useAdminPermissions } from '@/state/Admin';

const Index = () => {
	const { data: value, isLoading } = useAdminPermissions();

	// Memoized CanAccess data
	const CanAccess = useMemo(() => {
		if (!value) return [];
		return value
			.filter(({ can_access }) => can_access !== null)
			.map((item) => ({
				...item,
				can_access: JSON.parse(item.can_access),
			}));
	}, [value]);

	// Memoized unique actions
	const UniqueActions = useMemo(() => {
		const actionsSet = new Set();
		allFlatRoutes
			.filter((r) => r.actions !== undefined)
			.forEach(({ actions }) =>
				actions.forEach((action) => actionsSet.add(action))
			);
		return Array.from(actionsSet);
	}, []);

	// Memoized table data
	const tableData = useMemo(() => {
		return allFlatRoutes
			.filter((r) => r.actions !== undefined)
			.map(({ page_name }) => ({
				page_name,
				actions: UniqueActions.map((action) => {
					const users = CanAccess.filter(({ can_access }) =>
						can_access?.[page_name]?.includes(action)
					)
						.map(({ name }) => name)
						.join(', ');
					return { name: action, users };
				}),
			}));
	}, [UniqueActions, CanAccess]);

	// Memoized table header
	const header = useMemo(() => ['Page', ...UniqueActions], [UniqueActions]);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='h-screen overflow-x-auto'>
			<table className='table table-zebra table-pin-rows table-xs w-full'>
				<thead>
					<tr className='bg-primary text-left text-lg font-semibold capitalize text-primary-content'>
						{header.map((item, index) => (
							<th key={index} className='min-w-36'>
								{item}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{tableData.map((item, rowIndex) => (
						<tr key={rowIndex} className='border'>
							<td className='border text-left font-medium'>
								{item.page_name}
							</td>
							{item.actions.map((action, colIndex) => (
								<td
									key={colIndex}
									className='border text-left font-medium'>
									{action.users}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Index;
