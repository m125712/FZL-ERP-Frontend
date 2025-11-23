import { lazy, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useThreadOrderInfoByQuery } from '@/state/Thread';
import { useNavigate } from 'react-router';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import {
	CustomLink,
	DateTime,
	EditDelete,
	LinkOnly,
	StatusButton,
	StatusSelect,
} from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_all_orders')) {
		return `?all=true`;
	}
	if (
		haveAccess.includes('show_approved_orders') &&
		haveAccess.includes('show_own_orders') &&
		userUUID
	) {
		return `?own_uuid=${userUUID}&approved=true`;
	}

	if (haveAccess.includes('show_approved_orders')) {
		return '?all=false&approved=true';
	}

	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `?own_uuid=${userUUID}`;
	}

	return `?all=false`;
};

export default function Index() {
	const [status, setStatus] = useState('all');
	// * options for extra select in table
	const options = [
		{ value: 'bulk', label: 'Bulk' },
		{ value: 'sample', label: 'Sample' },
		{ value: 'all', label: 'All' },
	];

	const navigate = useNavigate();
	const haveAccess = useAccess('thread__order_info_details');
	const { user } = useAuth();

	const { data, isLoading, url, deleteData, updateData } =
		useThreadOrderInfoByQuery(
			getPath(haveAccess, user?.uuid) + `&type=${status}`,
			{
				enabled: !!user?.uuid,
			}
		);
	const handelSNOFromHeadOfficeStatus = async (idx) => {
		await updateData.mutateAsync({
			url: `/thread/order-info/send-from-ho/update/by/${data[idx]?.uuid}`,
			updatedData: {
				sno_from_head_office:
					data[idx]?.sno_from_head_office === true ? false : true,
				sno_from_head_office_time:
					data[idx]?.sno_from_head_office === true
						? null
						: GetDateTime(),
				sno_from_head_office_by:
					data[idx]?.sno_from_head_office === true ? null : user.uuid,
				updated_at: GetDateTime(),
				updated_by: user.uuid,
			},
			isOnCloseNeeded: false,
		});
	};
	const handelReceiveByFactoryStatus = async (idx) => {
		await updateData.mutateAsync({
			url: `/thread/order-info/receive-from-factory/update/by/${data[idx]?.uuid}`,
			updatedData: {
				receive_by_factory:
					data[idx]?.receive_by_factory === true ? false : true,
				receive_by_factory_time:
					data[idx]?.receive_by_factory === true
						? null
						: GetDateTime(),
				receive_by_factory_by:
					data[idx]?.receive_by_factory === true ? null : user.uuid,
				updated_at: GetDateTime(),
				updated_by: user.uuid,
			},
			isOnCloseNeeded: false,
		});
	};
	const handelProductionPausedStatus = async (idx) => {
		await updateData.mutateAsync({
			url: `/thread/order-info/production-pause/update/by/${data[idx]?.uuid}`,
			updatedData: {
				production_pause:
					data[idx]?.production_pause === true ? false : true,
				production_pause_time:
					data[idx]?.production_pause === true ? null : GetDateTime(),
				production_pause_by:
					data[idx]?.production_pause === true ? null : user.uuid,
				updated_at: GetDateTime(),
				updated_by: user.uuid,
			},
			isOnCloseNeeded: false,
		});
	};
	const info = new PageInfo('Order Info', url, 'thread__order_info_details');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'action',
				header: 'Action',
				enableColumnFilter: false,
				hidden: !haveAccess.includes('update'),
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							showUpdate={haveAccess.includes('update')}
							showDelete={false}
						/>
					);
				},
			},
			{
				accessorKey: 'is_sample',
				header: () =>
					haveAccess.includes('show_cash_bill_lc')
						? 'Sample/Bill/Cash'
						: 'Sample',
				enableColumnFilter: false,
				width: 'w-28',
				cell: (info) => {
					const { is_sample, is_bill, is_cash } = info.row.original;
					return (
						<div className='flex gap-6'>
							<StatusButton size='btn-xs' value={is_sample} />
							{haveAccess.includes('show_cash_bill_lc') && (
								<>
									<StatusButton
										size='btn-xs'
										value={is_bill}
									/>
									<StatusButton
										size='btn-xs'
										value={is_cash}
									/>
								</>
							)}
						</div>
					);
				},
			},

			{
				accessorKey: 'sno_from_head_office',
				header: (
					<>
						SNO From <br />
						Head Office
					</>
				),
				enableColumnFilter: true,
				width: 'w-24',
				cell: (info) => {
					const permission = haveAccess.includes(
						'click_status_sno_from_head_office'
					);
					const {
						sno_from_head_office_time,
						sno_from_head_office_by_name,
					} = info.row.original;

					return (
						<div className='flex flex-col'>
							<SwitchToggle
								disabled={!permission}
								onChange={() => {
									handelSNOFromHeadOfficeStatus(
										info.row.index
									);
								}}
								checked={info.getValue() === true}
							/>
							<DateTime date={sno_from_head_office_time} />
							<span className='text-xs'>
								{sno_from_head_office_by_name}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'receive_by_factory',
				header: (
					<>
						Receive By <br />
						Factory
					</>
				),
				enableColumnFilter: true,
				width: 'w-24',
				cell: (info) => {
					const permission = haveAccess.includes(
						'click_status_receive_by_factory'
					);

					const {
						receive_by_factory_time,
						receive_by_factory_by_name,
					} = info.row.original;
					const { sno_from_head_office } = info.row.original;

					return (
						<div className='flex flex-col'>
							<SwitchToggle
								disabled={!permission || !sno_from_head_office}
								onChange={() => {
									handelReceiveByFactoryStatus(
										info.row.index
									);
								}}
								checked={info.getValue() === true}
							/>
							<DateTime date={receive_by_factory_time} />
							<span className='text-xs'>
								{receive_by_factory_by_name}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: true,
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/thread/order-info/${uuid}`}
							openInNewTab={true}
						/>
					);
				},
			},
			{
				accessorKey: 'marketing_name',
				header: 'Marketing',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'factory_name',
				header: 'Factory',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'merchandiser_name',
				header: 'Merchandiser',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					`${row.swatch_approval_count || 0}/${row.order_entry_count || 0}`,
				id: 'swatch_status',
				header: 'Swatch',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'is_swatches_approved',
				header: 'Status',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<div className='flex space-x-1'>
							<StatusButton
								size='btn-xs'
								value={info.getValue()}
							/>
						</div>
					);
				},
			},
			{
				accessorFn: (row) =>
					`${row.price_approval_count || 0}/${row.order_entry_count || 0}`,
				id: 'price_approval_count',
				header: 'Price App',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'delivery_date',
				header: 'Delivery Date',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
				width: 'max-w-40',
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				width: 'w-20',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'production_pause',
				header: (
					<>
						Production <br />
						Paused
					</>
				),
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					const permission = haveAccess.includes(
						'click_status_production_paused'
					);
					const { production_pause_time, production_pause_by_name } =
						info.row.original;
					return (
						<div className='flex flex-col'>
							<SwitchToggle
								disabled={!permission}
								onChange={() => {
									handelProductionPausedStatus(
										info.row.index
									);
								}}
								checked={info.getValue() === true}
							/>
							<DateTime date={production_pause_time} />
							<span className='text-xs'>
								{production_pause_by_name}
							</span>
						</div>
					);
				},
			},
		],
		[data]
	);

	// Add
	const handelAdd = () => window.open('/thread/order-info/entry', '_blank');

	const handelUpdate = (idx) => {
		const { uuid } = data[idx];
		window.open(`/thread/order-info/${uuid}/update`, '_blank');
	};

	// Delete
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});
	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: data[idx].uuid,
			itemName: data[idx].uuid,
		}));

		window[info.getDeleteModalId()].showModal();
	};
	if (!user?.uuid) return null;
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
				extraButton={
					<StatusSelect
						status={status}
						setStatus={setStatus}
						options={options}
					/>
				}
			/>

			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url,
						deleteData,
					}}
				/>
			</Suspense>
		</>
	);
}
