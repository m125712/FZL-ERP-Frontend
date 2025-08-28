import { useCallback, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useDyeingSwatch, useDyeingSwatchBulk } from '@/state/Dyeing';
import { useOtherRecipe } from '@/state/Other';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { StatusSelect } from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

// Import the column configurations
import { createColumns, createColumnsLog } from './columns';

const options = [
	{ value: 'all', label: 'All' },
	{ value: 'pending', label: 'Pending' },
	{ value: 'completed', label: 'Completed' },
];

const options2 = [
	{ value: 'complete_order', label: 'Complete Order' },
	{ value: 'incomplete_order', label: 'Incomplete Order' },
];

export default function Index() {
	const { user } = useAuth();
	const [status, setStatus] = useState('pending');
	const [status2, setStatus2] = useState('incomplete_order');

	const { data, isLoading, updateData } = useDyeingSwatch(
		status2 === 'complete_order'
			? `order_type=${status2}`
			: `type=${status}&order_type=${status2}`
	);

	const { data: bulkSwatch, isLoading: isLoadingBulkSwatch } =
		useDyeingSwatchBulk(
			status2 === 'complete_order'
				? `order_type=${status2}`
				: `type=${status}&order_type=${status2}`
		);

	const info = new PageInfo(
		'LabDip/ZipperSwatch',
		'order/swatch',
		'lab_dip__zipper_swatch'
	);
	const haveAccess = useAccess('lab_dip__zipper_swatch');
	const { data: recipe } = useOtherRecipe(`approved=true`);

	// Handler functions
	const handleSwatchStatusLog = useCallback(
		async (e, idx) => {
			await updateData.mutateAsync({
				url: `/zipper/sfg-swatch/${data[idx]?.uuid}`,
				updatedData: {
					recipe_uuid: e.value,
					swatch_approval_date: GetDateTime(),
					updated_at: GetDateTime(),
					updated_by: user?.uuid,
				},
				isOnCloseNeeded: false,
			});
		},
		[updateData, data]
	);

	const handleSwatchStatus = useCallback(
		async (e, idx) => {
			await updateData.mutateAsync({
				url: `/zipper/sfg-swatch-bulk-update/${bulkSwatch[idx]?.order_number}`,
				updatedData: {
					uuids: bulkSwatch[idx].uuids,
					recipe_uuid: e.value,
					swatch_approval_date: GetDateTime(),
					updated_at: GetDateTime(),
					updated_by: user?.uuid,
				},
				isOnCloseNeeded: false,
			});
		},
		[updateData, bulkSwatch]
	);

	const handleSwatchApprovalDate = useCallback(
		async (idx) => {
			await updateData.mutateAsync({
				url: `/zipper/swatch-approval-received-bulk-update/${bulkSwatch[idx]?.order_number}`,
				updatedData: {
					uuids: bulkSwatch[idx].uuids,
					swatch_approval_received: bulkSwatch[idx]
						?.swatch_approval_received
						? false
						: true,
					swatch_approval_received_date: bulkSwatch[idx]
						?.swatch_approval_received
						? null
						: GetDateTime(),
					swatch_approval_received_by: user?.uuid,
					updated_at: GetDateTime(),
					updated_by: user?.uuid,
				},
				isOnCloseNeeded: false,
			});
		},
		[updateData, bulkSwatch, user]
	);

	const handleSwatchApprovalDateLog = useCallback(
		async (idx) => {
			await updateData.mutateAsync({
				url: `/zipper/swatch-approval-received/${data[idx]?.uuid}`,
				updatedData: {
					swatch_approval_received: data[idx]
						?.swatch_approval_received
						? false
						: true,
					swatch_approval_received_date: data[idx]
						?.swatch_approval_received
						? null
						: GetDateTime(),
					swatch_approval_received_by: user?.uuid,
					updated_at: GetDateTime(),
					updated_by: user?.uuid,
				},
				isOnCloseNeeded: false,
			});
		},
		[updateData, data, user]
	);

	// Create columns using the factory functions
	const columns = useMemo(
		() =>
			createColumns({
				data: bulkSwatch,
				recipe,
				handleSwatchStatus,
				haveAccess,
				handleSwatchApprovalDate,
				user,
			}),
		[
			bulkSwatch,
			recipe,
			handleSwatchStatus,
			haveAccess,
			handleSwatchApprovalDate,
			user,
		]
	);

	const columnsLog = useMemo(
		() =>
			createColumnsLog({
				data,
				recipe,
				handleSwatchStatusLog,
				haveAccess,
				handleSwatchApprovalDateLog,
				user,
			}),
		[
			data,
			recipe,
			handleSwatchStatusLog,
			haveAccess,
			handleSwatchApprovalDateLog,
			user,
		]
	);

	if (isLoading && isLoadingBulkSwatch)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex flex-col gap-2'>
			<ReactTable
				title={info.getTitle()}
				data={bulkSwatch}
				columns={columns}
				extraButton={
					<>
						{status2 === 'incomplete_order' && (
							<StatusSelect
								options={options}
								status={status}
								setStatus={setStatus}
							/>
						)}
						<StatusSelect
							options={options2}
							status={status2}
							setStatus={setStatus2}
						/>
					</>
				}
			/>
			<ReactTable title={'Log'} data={data} columns={columnsLog} />
		</div>
	);
}
