import { lazy, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useDyeingBatch } from '@/state/Dyeing';
import { useNavigate } from 'react-router';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import {
	BatchType,
	CustomLink,
	DateTime,
	EditDelete,
	StatusButton,
	StatusSelect,
	Transfer,
} from '@/ui';

import { cn } from '@/lib/utils';
import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

const Yarn = lazy(() => import('./Yarn'));

export default function Index() {
	const options = [
		{ value: 'all', label: 'All' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'completed', label: 'Completed' },
	];

	const orderTypeOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'bulk', label: 'Bulk' },
		{ value: 'sample', label: 'Sample' },
	];

	const { user } = useAuth();

	const [status, setStatus] = useState('pending');
	const [orderType, setOrderType] = useState('bulk');
	const { data, url, isLoading, updateData } = useDyeingBatch(
		`type=${status}&order_type=${orderType}`
	);
	const info = new PageInfo('Batch', url, 'dyeing__zipper_batch');
	const haveAccess = useAccess('dyeing__zipper_batch');
	const navigate = useNavigate();

	const columns = useMemo(
		() => [
			// * actions
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						showUpdate={
							haveAccess.includes('update') &&
							info.row.original.received == 0
						}
						showDelete={false}
					/>
				),
			},
			{
				accessorKey: 'batch_id',
				header: 'Batch ID',
				// enableColumnFilter: false,
				cell: (info) => (
					<CustomLink
						label={info.getValue()}
						id={info.row.original.uuid}
						url={`/dyeing-and-iron/zipper-batch/${info.row.original.uuid}`}
					/>
				),
			},
			{
				accessorFn: (row) => {
					return row.order_numbers
						?.map((order_number) => order_number)
						?.join(', ');
				},
				id: 'order_numbers',
				header: 'O/N',
				width: 'w-28',
				// enableColumnFilter: false,
				cell: (info) => {
					const idx = info.row.index;
					return info?.row?.original?.order_numbers?.map(
						(order_number, index) => {
							return (
								<CustomLink
									key={order_number + index + idx}
									label={order_number}
									url={`/order/details/${order_number}`}
								/>
							);
						}
					);
				},
			},
			{
				accessorFn: (row) => {
					return row.item_descriptions
						?.map((item) => item.item_description)
						.join(', ');
				},
				id: 'item_descriptions',
				header: 'Item Description',
				// enableColumnFilter: true,
				width: 'w-44',
				cell: (info) => {
					const idx = info.row.index;

					return info?.row?.original?.item_descriptions?.map(
						(item, index) => {
							return (
								<CustomLink
									key={item.item_description + index + idx}
									label={item.item_description}
									url={`/order/details/${item.order_number}/${item.order_description_uuid}`}
									openInNewTab={true}
								/>
							);
						}
					);
				},
			},
			{
				accessorKey: 'batch_type',
				header: 'Type',
				enableColumnFilter: false,
				cell: (info) => <BatchType value={info.getValue()} />,
			},
			{
				accessorKey: 'production_date',
				header: (
					<>
						Production <br />
						Date
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<DateTime date={info.getValue()} isTime={false} />
				),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.style?.map((style) => style)?.join(', '),
				id: 'style',
				header: 'Style',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn: (row) =>
					row.color?.map((color) => color)?.join(', '),
				id: 'color',
				header: 'Color',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'bulk_approval_date',
				header: () => (
					<>
						Bulk <br />
						App.
					</>
				),
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => (
					<div className='flex flex-col gap-2'>
						<StatusButton
							size='btn-sm'
							value={info.getValue() ? true : false}
						/>

						{info.getValue() && (
							<DateTime date={info.getValue()} isTime={false} />
						)}
					</div>
				),
			},

			{
				accessorKey: 'total_quantity',
				header: (
					<>
						Total Qty <br />
						(Pcs)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'yarn_issued',
				header: () => (
					<>
						Yarn <br />
						Issued (KG)
					</>
				),
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					const { batch_status } = info.row.original;
					return (
						<div className='flex gap-2'>
							<div className='py-1'>
								<Transfer
									onClick={() =>
										handelYarnIssued(info.row.index)
									}
									disabled={
										batch_status === 'completed' ||
										!haveAccess.includes('click_production')
									}
								/>
							</div>
							<div className='flex flex-col gap-1'>
								<span>{info.getValue()}</span>
								<DateTime
									date={info.row.original.yarn_issued_date}
									isTime={false}
								/>
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: 'expected_kg',
				header: (
					<span>
						Exp Prod <br />
						Qty (kg)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},

			{
				accessorKey: 'add_actions',
				header: '',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('create'),
				cell: (info) => {
					const { uuid, batch_status } = info.row.original;
					return (
						<Transfer
							onClick={() =>
								navigate(
									`/dyeing-and-iron/zipper-batch/batch-production/${uuid}`
								)
							}
							disabled={
								batch_status === 'completed' ||
								!haveAccess.includes('click_production')
							}
						/>
					);
				},
			},
			{
				accessorKey: 'total_actual_production_quantity',
				header: (
					<span>
						Total Prod <br />
						Qty (kg)
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'batch_status',
				header: () => (
					<>
						Dyeing <br /> Status
					</>
				),
				enableColumnFilter: false,
				cell: (info) => {
					const res = {
						cancelled: 'badge-error',
						running: 'badge-info',
						completed: 'badge-success',
						pending: 'badge-warning',
					};
					return (
						<div className='flex flex-col gap-1'>
							<span
								className={cn(
									'badge badge-sm uppercase',
									res[info.getValue()]
								)}
							>
								{info.getValue()}
							</span>
							<DateTime
								date={info.row.original.batch_status_date}
								isTime={false}
							/>
						</div>
					);
				},
			},

			{
				accessorKey: 'received',
				header: (
					<span>
						Stock
						<br />
						Received
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => {
					const { received } = info.row.original;
					const access = haveAccess.includes('click_receive_status');
					const overrideAccess = haveAccess.includes(
						'click_receive_status_override'
					);
					// overrideAccess ? false : access ? received === 1 : true;
					let isDisabled = false;
					if (!overrideAccess) {
						if (access) {
							isDisabled = received === 1;
						} else {
							isDisabled = true;
						}
					}
					return (
						<div className='flex flex-col gap-1'>
							<SwitchToggle
								disabled={isDisabled}
								onChange={() => handelReceived(info.row.index)}
								checked={info.getValue() === 1}
							/>
							<DateTime
								date={info.row.original.received_date}
								isTime={false}
							/>
						</div>
					);
				},
			},
			{
				accessorKey: 'machine_name',
				header: 'Machine',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'slot',
				header: 'Slot',
				enableColumnFilter: false,
				cell: (info) => {
					const value = info.getValue();
					if (value === 0) {
						return '-';
					}
					return 'Slot ' + value;
				},
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			// * created_at
			{
				accessorKey: 'created_at',
				header: 'Created at',
				width: 'w-24',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			// * updated_at
			{
				accessorKey: 'updated_at',
				header: 'Updated at',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			// * remarks
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				width: 'w-24',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data, status]
	);

	// Add
	const handelAdd = () => navigate('/dyeing-and-iron/zipper-batch/entry');

	// Update
	const handelUpdate = (idx) => {
		const { uuid } = data[idx];

		navigate(`/dyeing-and-iron/zipper-batch/${uuid}/update`);
	};
	// Received
	const handelReceived = async (idx) => {
		await updateData.mutateAsync({
			url: `zipper/dyeing-batch/${data[idx]?.uuid}`,
			updatedData: {
				received: data[idx]?.received === 1 ? 0 : 1,
				received_date: data[idx]?.received === 1 ? null : GetDateTime(),
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			},
			isOnCloseNeeded: false,
		});
	};
	// Update
	const [updatedData, setUpdatedData] = useState({
		uuid: null,
	});

	const handelYarnIssued = (idx) => {
		setUpdatedData((prev) => ({
			...prev,
			uuid: data[idx].uuid,
			batch_id: data[idx].batch_id,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				handelAdd={handelAdd}
				title={info.getTitle()}
				data={data}
				columns={columns}
				accessor={haveAccess.includes('create')}
				extraButton={
					<>
						<StatusSelect
							options={options}
							status={status}
							setStatus={setStatus}
						/>
						<StatusSelect
							options={orderTypeOptions}
							status={orderType}
							setStatus={setOrderType}
						/>
					</>
				}
			/>
			<Suspense>
				<Yarn
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updatedData,
						setUpdatedData,
					}}
				/>
			</Suspense>
		</div>
	);
}
