import { lazy, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useIssue } from '@/state/Maintenance';
import { differenceInMinutes } from 'date-fns';
import { Clock } from 'lucide-react';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { EyeBtn } from '@/ui/Others/Button';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { DateTime, EditDelete, StatusSelect, Transfer } from '@/ui';

import { cn } from '@/lib/utils';
import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

import { usePushSubscription } from './Notification';
import { sections } from './utils';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const Procurement = lazy(() => import('./Procurement'));
const Maintain = lazy(() => import('./Maintain'));
const History = lazy(() => import('./History'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const [status, setStatus] = useState('waiting_ongoing');
	const options = [
		{ value: 'okay', label: 'Okay' },
		{ value: 'waiting_ongoing', label: 'Waiting & On Going' },
		{ value: 'rejected', label: 'Rejected' },
		{ value: 'all', label: 'All' },
	];

	const { registerAndSubscribe, unregisterPushSubscription } =
		usePushSubscription();

	const { user } = useAuth();
	const haveAccess = useAccess('maintenance__issue');

	const { data, isLoading, url, deleteData, updateData } = useIssue(
		haveAccess.includes('show_own_issue')
			? `own_uuid=${user?.uuid}${status !== 'all' && `&maintain_condition=${status}`}`
			: `${status !== 'all' && `maintain_condition=${status}`}`
	);

	const info = new PageInfo('Issue', url, 'maintenance__issue');

	useEffect(() => {
		if (
			'serviceWorker' in navigator &&
			haveAccess.includes('notification')
		) {
			registerAndSubscribe();
		}
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden:
					!haveAccess.includes('update') &&
					!haveAccess.includes('delete'),
				cell: (info) => {
					const { verification_approved } = info.row.original;
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={
								haveAccess.includes('delete') &&
								!verification_approved
							}
							showUpdate={
								haveAccess.includes('update') &&
								!verification_approved
							}
						/>
					);
				},
			},
			{
				accessorKey: 'issue_id',
				header: 'আইডি (ID)',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'name',
				header: (
					<>
						জারি করেছেন <br />
						(Issued By)
					</>
				),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'section',
				header: (
					<>
						সেকশন <br /> (Section)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => {
					const { section, extra_section } = info.row.original;
					return (
						<div className='flex flex-col'>
							{
								sections.find((item) => item.value === section)
									?.label
							}
							<span className='text-xs italic'>
								{extra_section.toUpperCase()}
							</span>
						</div>
					);
				},
			},
			// {
			// 	accessorKey: 'extra_section',
			// 	header: () => (
			// 		<>
			// 			অন্যান্য সেকশন <br /> (Extra Section)
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// },
			{
				accessorKey: 'problem_type',
				header: (
					<>
						কোথায় সমস্যা <br />
						(Problem In)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue()?.toUpperCase(),
			},
			{
				accessorKey: 'parts_problem',
				header: (
					<>
						পার্টস সমস্যা <br /> (Parts Problem)
					</>
				),
				enableColumnFilter: false,
				cell: (info) =>
					info.getValue()
						? info.getValue()?.replaceAll('_', ' ')
						: '--',
			},
			{
				accessorKey: 'section_machine_name',
				header: (
					<>
						মেশিন নাম/নম্বর <br />
						(Machine Name/No.)
					</>
				),
				enableColumnFilter: false,
			},
			// {
			// 	accessorKey: 'description',
			// 	header: () => (
			// 		<>
			// 			বর্ণনা <br /> (Description)
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// },
			{
				accessorKey: 'emergence',
				header: (
					<>
						জরুরী <br /> (Emergency)
					</>
				),
				enableColumnFilter: false,
				width: 'w-44',
				cell: (info) => {
					const { emergence, description } = info.row.original;

					return (
						<div className='flex flex-col'>
							<span>{emergence}</span>
							<span className='text-xs italic'>
								{description}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'maintain',
				header: (
					<>
						রক্ষণাবেক্ষণ অবস্থা <br /> (Maintain Condition)
					</>
				),
				enableColumnFilter: false,
				width: 'w-80',
				cell: (info) => {
					const {
						maintain_by_name,
						maintain_date,
						maintain_condition,
						maintenance_desc,
						parts_details,
						verification_approved,
					} = info.row.original;
					return (
						<div className='flex items-center gap-2'>
							<Transfer
								disabled={
									!haveAccess.includes(
										'maintain_condition_access'
									) || verification_approved
								}
								onClick={() => handleMaintain(info.row.index)}
							/>
							<div
								className={cn(
									'flex w-full flex-col gap-2 rounded-2xl border p-4 shadow-md transition-all duration-300 hover:shadow-lg',
									{
										'border-red-200 bg-red-50 text-red-800':
											maintain_condition === 'waiting',
										'border-red-600 bg-red-500 text-white':
											maintain_condition === 'rejected',
										'border-yellow-200 bg-yellow-50 text-yellow-800':
											maintain_condition === 'ongoing',
										'border-green-200 bg-green-50 text-green-800':
											maintain_condition === 'okay',
									}
								)}
							>
								{/* Status badge */}
								<span
									className={cn('font-semibold', {
										'text-red-700':
											maintain_condition === 'waiting',
										'text-white':
											maintain_condition === 'rejected',
										'text-yellow-700':
											maintain_condition === 'ongoing',
										'text-green-700':
											maintain_condition === 'okay',
									})}
								>
									<strong>Status: </strong>
									{maintain_condition.toUpperCase()}
								</span>

								{/* Details */}
								{(parts_details || maintenance_desc) && (
									<div
										className={cn(
											'flex flex-col gap-1 text-sm text-gray-700',
											maintain_condition === 'rejected' &&
												'text-white'
										)}
									>
										{parts_details && (
											<p>
												<span className='font-semibold'>
													Parts:
												</span>{' '}
												{parts_details}
											</p>
										)}

										{maintenance_desc && (
											<p>
												<span className='font-semibold'>
													Main:
												</span>{' '}
												{maintenance_desc}
											</p>
										)}
									</div>
								)}

								{/* Maintainer */}
								{maintain_by_name && (
									<div className='mt-3 flex flex-col gap-2 text-xs'>
										<p className='block text-sm font-medium uppercase'>
											{maintain_by_name}
										</p>
										<span className='flex'>
											(
											<DateTime
												showInOneLine
												date={maintain_date}
												isTime
												customizedDateFormate='dd MMM, yy'
												classNameBody={cn(
													maintain_condition ===
														'rejected' &&
														'text-white'
												)}
											/>
											)
										</span>
									</div>
								)}
							</div>
						</div>
					);
				},
			},
			// {
			// 	accessorKey: 'maintain_condition',
			// 	header: () => (
			// 		<>
			// 			রক্ষণাবেক্ষণ অবস্থা <br /> (Maintain Condition)
			// 		</>
			// 	),
			// 	enableColumnFilter: false,
			// 	width: 'w-40',
			// 	cell: (info) => {
			// 		const { maintain_by_name, maintain_date } =
			// 			info.row.original;

			// 		const options = [
			// 			{ value: 'okay', label: 'OK' },
			// 			{ value: 'waiting', label: 'Waiting' },
			// 			{ value: 'rejected', label: 'Rejected' },
			// 			{ value: 'ongoing', label: 'On Going' },
			// 		];

			// 		return (
			// 			<div>
			// 				<ReactSelect
			// 					className={cn(
			// 						'w-40',
			// 						info.getValue() === 'waiting' &&
			// 							'bg-yellow-100',
			// 						info.getValue() === 'rejected' &&
			// 							'bg-red-100',
			// 						info.getValue() === 'ongoing' &&
			// 							'bg-blue-100',
			// 						info.getValue() === 'okay' && 'bg-green-100'
			// 					)}
			// 					menuPortalTarget={document.body}
			// 					placeholder='Select condition'
			// 					options={options}
			// 					value={options?.filter(
			// 						(item) => item.value === info.getValue()
			// 					)}
			// 					onChange={(e) => {
			// 						handelCondition(e.value, info.row.index);
			// 					}}
			// 				/>

			// 				<span className='mt-3 flex flex-col text-xs'>
			// 					{/* Maintainer name */}
			// 					<p className='text-center text-sm font-semibold uppercase text-gray-800'>
			// 						{maintain_by_name}
			// 					</p>

			// 					{/* Date + Duration card */}
			// 					<div className='mt-2 flex w-full items-center justify-evenly rounded-full border border-gray-200 bg-white px-2 py-1.5 shadow-sm'>
			// 						{/* Date */}
			// 						<div className='text-gray-600'>
			// 							<DateTime
			// 								showInOneLine
			// 								date={maintain_date}
			// 								isTime
			// 							/>
			// 						</div>
			// 					</div>
			// 				</span>
			// 			</div>
			// 		);
			// 	},
			// },
			{
				accessorKey: 'time_diff',
				header: 'Time Difference',
				enableColumnFilter: false,
				cell: (info) => {
					const { maintain_date, created_at } = info.row.original;

					let diffInMinutes = 0;
					if (!maintain_date) {
						diffInMinutes = differenceInMinutes(
							new Date(),
							new Date(created_at)
						);
					} else {
						diffInMinutes = differenceInMinutes(
							new Date(maintain_date),
							new Date(created_at)
						);
					}

					const hours = Math.floor(diffInMinutes / 60);
					const minutes = diffInMinutes % 60;

					// Format as "HH.MM"
					const duration = `${hours}.${minutes.toString().padStart(2, '0')}`;

					return (
						<div className='flex items-center gap-1 text-gray-700'>
							<Clock size={14} className='text-teal-500' />
							<span>{duration}</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'verification_approved',
				header: (
					<>
						অনুমোদন <br />
						(Approval)
					</>
				),
				enableColumnFilter: false,

				cell: (info) => {
					const {
						verification_approved,
						verification_by_name,
						verification_date,
						created_at,
						created_by,
					} = info.row.original;

					let duration = '';
					if (!verification_date) {
						const diffInMinutes = differenceInMinutes(
							new Date(),
							new Date(created_at)
						);

						const hours = Math.floor(diffInMinutes / 60);
						const minutes = diffInMinutes % 60;

						// Format as "HH.MM"
						duration = `${hours}.${minutes.toString().padStart(2, '0')}`;
					} else {
						const diffInMinutes = differenceInMinutes(
							new Date(verification_date),
							new Date(created_at)
						);

						const hours = Math.floor(diffInMinutes / 60);
						const minutes = diffInMinutes % 60;

						// Format as "HH.MM"
						duration = `${hours}.${minutes.toString().padStart(2, '0')}`;
					}

					const access =
						(haveAccess.includes('verification') &&
							user?.uuid === created_by &&
							!verification_approved) ||
						haveAccess.includes('override');

					return (
						<div className=''>
							<SwitchToggle
								disabled={!access}
								onChange={() => {
									handelVerificationApprove(info.row.index);
								}}
								checked={info.getValue() === true}
							/>

							<span className='mt-3 flex flex-col text-xs'>
								{/* Maintainer name */}
								<p className='text-sm font-semibold uppercase text-gray-800'>
									{verification_by_name}
								</p>

								{/* Date + Duration card */}
								<div className='mt-2 flex w-full items-center justify-evenly gap-2 rounded-full border border-gray-200 bg-white px-2 py-1.5 shadow-sm'>
									{/* Date */}
									<div className='text-gray-600'>
										<DateTime
											date={verification_date}
											isTime
											showInOneLine
										/>
									</div>

									{/* Divider line */}
									<div className='h-4 w-px bg-gray-300' />

									{/* Duration with clock */}
									<div className='flex items-center gap-1 text-gray-700'>
										<Clock
											size={14}
											className='text-teal-500'
										/>
										<span className='font-medium'>
											{duration}
										</span>
									</div>
								</div>
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'procurement',
				header: (
					<>
						সংগ্রহ <br />
						(Procurement)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<div className='flex gap-2'>
							<Transfer
								disabled={!haveAccess.includes('procurement')}
								onClick={() =>
									handelProcurement(info.row.index)
								}
							/>
							<EyeBtn
								disabled={!haveAccess.includes('procurement')}
								onClick={() =>
									handelProcurementHistory(info.row.index)
								}
							/>
						</div>
					);
				},
			},
			{
				accessorKey: 'created_by_name',
				header: (
					<>
						তৈরি করেছেন <br />
						(Created By)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: (
					<>
						তৈরির তারিখ <br />
						(Created)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: (
					<>
						পরিবর্তন তারিখ <br />
						(Updated)
					</>
				),
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
		],
		[data, haveAccess]
	);

	const handelVerificationApprove = async (idx) => {
		await updateData.mutateAsync({
			url: `/maintain/issue/${data[idx]?.uuid}`,
			updatedData: {
				verification_approved:
					data[idx]?.verification_approved === true ? false : true,
				verification_date:
					data[idx]?.verification_approved === true
						? null
						: GetDateTime(),
				verification_by: user?.uuid,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			},
		});
	};

	const handelCondition = async (e, idx) => {
		await updateData.mutateAsync({
			url: `/maintain/issue/${data[idx]?.uuid}`,
			updatedData: {
				maintain_condition: e,
				maintain_by: user?.uuid,
				maintain_date: GetDateTime(),
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			},
		});
	};

	const [procurement, setProcurement] = useState({
		uuid: null,
	});

	const handelProcurement = (idx) => {
		const val = data[idx];
		setProcurement((prev) => ({
			...prev,
			...val,
		}));

		window['ProcureModal'].showModal();
	};

	const [maintain, setMaintain] = useState({ uuid: null });

	const handleMaintain = (idx) => {
		const val = data[idx];
		setMaintain((prev) => ({
			...prev,
			...val,
		}));

		window['MaintainModal'].showModal();
	};

	const [history, setHistory] = useState(null);
	let title = 'ProcurementHistory';

	const handelProcurementHistory = (idx) => {
		const val = data[idx];
		title = title + idx + 1;
		setHistory((prev) => ({
			...prev,
			...val,
		}));

		window['ProcurementHistory'].showModal();
	};

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateIssueData, setUpdateIssueData] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateIssueData((prev) => ({
			...prev,
			uuid: data[idx].uuid,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
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
			itemName: data[idx].section,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
				extraButton={
					<>
						<StatusSelect
							status={status}
							setStatus={setStatus}
							options={options}
						/>
						{haveAccess.includes('unsubscribe') && (
							<button
								type='button'
								disabled={!localStorage.getItem('pushEndpoint')}
								onClick={() => unregisterPushSubscription()}
								className='btn btn-sm h-[2.3rem] border-none bg-rose-400 text-black hover:bg-rose-500'
							>
								{localStorage.getItem('pushEndpoint')
									? 'Unsubscribe'
									: 'Unsubscribed'}
							</button>
						)}
					</>
				}
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateIssueData,
						setUpdateIssueData,
					}}
				/>
			</Suspense>
			<Suspense>
				<Maintain
					modalId='MaintainModal'
					{...{
						maintain,
						setMaintain,
					}}
				/>
			</Suspense>
			<Suspense>
				<Procurement
					modalId='ProcureModal'
					{...{
						procurement,
						setProcurement,
					}}
				/>
			</Suspense>
			<Suspense>
				<History
					modalId={'ProcurementHistory'}
					{...{
						history,
						setHistory,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url: '/maintain/issue',
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}
