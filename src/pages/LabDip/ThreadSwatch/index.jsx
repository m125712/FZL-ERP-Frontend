import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useOtherShadeRecipe } from '@/state/Other';
import { useThreadSwatch } from '@/state/Thread';
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

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={uuid}
							uri='/thread/order-info'
						/>
					);
				},
			},

			{
				accessorKey: 'style',
				header: 'Style',
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color_ref',
				header: 'Color Ref',
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'count_length_name',
				header: 'Count Length',
				width: 'w-24',
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'order_quantity',
				header: (
					<>
						QTY <br />
						(Cone)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'bleaching',
				header: 'Bleach',
				enableColumnFilter: true,
				enableSorting: true,
				// cell: (info) => {
				// 	const isBleach = info.getValue() === 'bleach';
				// 	return (
				// 		<StatusButton className={'btn-xs'} value={isBleach} />
				// 	);
				// },
			},
			{
				accessorFn: (row) => (row.is_batch_created ? 'Yes' : 'No'),
				id: 'is_dyeing_batch_entry',
				header: (
					<>
						Batch <br />
						Created
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton
						className={'btn-xs'}
						value={info.row.original.is_batch_created}
					/>
				),
			},
			{
				accessorKey: 'receive_by_factory_time',
				header: (
					<>
						Factory <br />
						Received
					</>
				),
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.receive_by_factory_time}
					/>
				),
			},
			{
				accessorFn: (row) =>
					row.swatch_approval_received ? 'Yes' : 'No',
				id: 'swatch_approval_received',
				header: (
					<>
						Swatch <br />
						Rcv.
					</>
				),
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => (
					<div className='flex flex-col'>
						<SwitchToggle
							disabled={
								!haveAccess.includes('click_swatch_status')
							}
							onChange={() => {
								handleSwatchApprovalDate(info.row.index);
							}}
							checked={
								info.row.original.swatch_approval_received ===
								true
							}
						/>
						{/* <DateTime date={info.row.original.bulk_approval_date} /> */}
						<span>
							{info.row.original.swatch_approval_received_by_name}
						</span>
					</div>
				),
			},
			{
				accessorFn: (row) => {
					if (row.swatch_approval_received_date === null) return null;

					return format(
						row.swatch_approval_received_date,
						'dd/MM/yyyy'
					);
				},
				id: 'swatch_approval_received_date',
				header: (
					<>
						Swatch App <br />
						Rcv Date
					</>
				),
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime
						date={info.row.original.swatch_approval_received_date}
					/>
				),
			},
			{
				accessorKey: 'recipe_name',
				header: 'Recipe',
				width: 'min-w-60',
				enableColumnFilter: false,
				cell: (info) => {
					const { recipe_uuid, bleaching } = info.row.original;
					const { uuid } = info.row.original;

					const swatchAccess = haveAccess.includes(
						'click_swatch_status'
					);
					const swatchAccessOverride = haveAccess.includes(
						'click_swatch_status_override'
					);

					let isDisabled = true;
					if (swatchAccessOverride) isDisabled = false;
					if (recipe_uuid === null && swatchAccess)
						isDisabled = false;

					return (
						<ReactSelect
							className={'input-xs'}
							key={recipe_uuid}
							placeholder='Select order info uuid'
							options={
								shade_recipe?.filter(
									(item) =>
										(item.bleaching == bleaching &&
											item.thread_order_info_uuid ===
												uuid) ||
										item.label === '---'
								) ?? []
							}
							value={shade_recipe?.filter(
								(item) => item.value == recipe_uuid
							)}
							onChange={(e) =>
								handleSwatchStatus(e, info.row.index)
							}
							isDisabled={isDisabled}
							menuPortalTarget={document.body}
						/>
					);
				},
			},
			{
				accessorFn: (row) => {
					if (row.swatch_approval_date === null) return '---';

					return format(row.swatch_approval_date, 'dd/MM/yyyy');
				},
				id: 'swatch_approval_date',
				header: (
					<span>
						Setup <br />
						Date
					</span>
				),
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime date={info.row.original.swatch_approval_date} />
				),
			},
			{
				accessorKey: 'color_ref_entry_date',
				header: (
					<>
						Color Ref <br /> Entry
					</>
				),
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'color_ref_update_date',
				header: (
					<>
						Color Ref <br /> Update
					</>
				),
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
		],
		[data, shade_recipe, haveAccess]
	);

	const handleSwatchStatus = async (e, idx) => {
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

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				data={data}
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
		</div>
	);
}
