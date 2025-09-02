import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useOtherShadeRecipe } from '@/state/Other';
import { useThreadSwatch, useThreadSwatchBulk } from '@/state/Thread';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import {
	DateTime,
	LinkWithCopy,
	ReactSelect,
	StatusButton,
	StatusSelect,
} from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

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

	const { data, updateData, isLoading } = useThreadSwatch(
		status2 === 'complete_order'
			? `order_type=${status2}`
			: `type=${status}&order_type=${status2}`
	);
	const { data: bulkSwatch, isLoading: isLoadingBulkSwatch } =
		useThreadSwatchBulk(
			status2 === 'complete_order'
				? `order_type=${status2}`
				: `type=${status}&order_type=${status2}`
		);
	const info = new PageInfo(
		'LabDip/Thread Swatch',
		'order/swatch',
		'lab_dip__thread_swatch'
	);
	const haveAccess = useAccess('lab_dip__thread_swatch');

	// * fetching the data
	const { data: shade_recipe } = useOtherShadeRecipe();

	const handleSwatchApprovalDate = async (idx) => {
		await updateData.mutateAsync({
			url: `/thread/swatch-approval-received-bulk/${data[idx]?.order_number}`,
			updatedData: {
				uuids: bulkSwatch[idx].uuids,
				swatch_approval_received: data[idx]?.swatch_approval_received
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
	};
	const handleSwatchStatus = async (e, idx) => {
		await updateData.mutateAsync({
			url: `/thread/update/order-swatch-bulk/${bulkSwatch[idx]?.order_number}`,
			updatedData: {
				uuids: bulkSwatch[idx].uuids,
				recipe_uuid: e.value,
				swatch_approval_date: GetDateTime(),
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			},
			isOnCloseNeeded: false,
		});
	};
	const handleSwatchApprovalDateLog = async (idx) => {
		await updateData.mutateAsync({
			url: `/thread/swatch-approval-received/${data[idx]?.order_entry_uuid}`,
			updatedData: {
				swatch_approval_received: data[idx]?.swatch_approval_received
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
	};
	const handleSwatchStatusLog = async (e, idx) => {
		await updateData.mutateAsync({
			url: `/thread/order-entry/${data[idx]?.order_entry_uuid}`,
			updatedData: {
				recipe_uuid: e.value,
				swatch_approval_date: GetDateTime(),
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			},
			isOnCloseNeeded: false,
		});
	};

	const columns = useMemo(
		() =>
			createColumns({
				shade_recipe,
				handleSwatchStatus,
				haveAccess,
				handleSwatchApprovalDate,
			}),
		[data, shade_recipe, haveAccess]
	);
	const columnLog = useMemo(
		() =>
			createColumnsLog({
				shade_recipe,
				handleSwatchStatusLog,
				haveAccess,
				handleSwatchApprovalDateLog,
			}),
		[data, shade_recipe, haveAccess]
	);

	if (isLoading || isLoadingBulkSwatch)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex flex-col gap-2'>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columnLog}
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
		</div>
	);
}
