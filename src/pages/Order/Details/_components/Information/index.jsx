import { useEffect, useMemo, useState } from 'react';
import { PDF } from '@/assets/icons';
import { useAuth } from '@/context/auth';
import { complainColumns } from '@/pages/Order/columns';
import { orderQK } from '@/state/QueryKeys';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { defaultFetch, useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTableWithoutTitle from '@/components/Table/ReactTableWithoutTitle';
import { ShowToast } from '@/components/Toast';
import SectionContainer from '@/ui/Others/SectionContainer';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { LinkWithCopy, StatusButton } from '@/ui';

import { api } from '@/lib/api';
import GetDateTime from '@/util/GetDateTime';

import ItemDescription from './Item';
import OrderDescription from './Order';

export default function SingleInformation({
	order,
	idx,
	hasInitialOrder,
	updateData,
}) {
	const [check, setCheck] = useState(true);
	const [checkSwatch, setCheckSwatch] = useState(true);
	const haveAccess = useAccess('order__details');
	const [marketingCheckedStatus, setMarketingCheckedStatus] = useState(
		order.is_marketing_checked
	);
	const { user } = useAuth();

	useEffect(() => {
		order?.order_entry.map((item, i) => {
			if (
				Number(item?.company_price) <= 0 &&
				Number(item?.party_price) <= 0
			) {
				setCheck(false);
			}
			if (!item?.swatch_approval_date) {
				setCheckSwatch(false);
			}
		});
	}, [order]);

	const renderButtons = () => {
		const permission = haveAccess.includes(
			'click_status_marketing_checked'
		);
		const handelMarketingChecked = async () => {
			await updateData.mutateAsync({
				url: `/zipper/order/description/update-is-marketing-checked/by/${order?.order_description_uuid}`,
				updatedData: {
					is_marketing_checked:
						marketingCheckedStatus === true ? false : true,
					marketing_checked_at:
						marketingCheckedStatus === true ? null : GetDateTime(),
					updated_by: user?.uuid,
					updated_at: GetDateTime(),
				},
				isOnCloseNeeded: false,
			});
		};
		return [
			<StatusButton
				className={'border-0'}
				key={'check'}
				size='btn-xs md:btn-sm'
				value={check}
			/>,
			<StatusButton
				className={'border-0'}
				key={'swatch_approval_status'}
				size='btn-xs md:btn-sm'
				value={checkSwatch}
			/>,
			<div className='flex items-center gap-2'>
				<SwitchToggle
					onChange={() => {
						handelMarketingChecked();
						setMarketingCheckedStatus((prevStatus) => !prevStatus);
					}}
					checked={marketingCheckedStatus}
					disabled={!permission}
				/>
				<span className='text-sm'>Marketing Checked</span>
			</div>,
		];
	};
	let title = order?.item_description;
	if (hasInitialOrder) {
		title += ` #${idx + 1}`;
	}
	return (
		<SectionContainer key={title} title={title} buttons={renderButtons()}>
			{!hasInitialOrder && <OrderDescription order={order} />}
			<ItemDescription
				className={'border-secondary/30 md:border-b 2xl:border-b-0'}
				order_description={order}
			/>
		</SectionContainer>
	);
}

const renderOrderStatus = (is_sample, is_bill) => {
	let value = is_sample == 1 ? 'Sample' : 'Bulk';
	value = is_bill == 1 ? `${value} (Bill)` : `${value} (No Bill)`;

	return value;
};

const EMPTY_ARRAY = [];

export function OrderInformation({
	order,
	orders = EMPTY_ARRAY,
	handelPdfDownload,
	handleViewChange,
	updateView,
}) {
	const {
		order_number,
		reference_order,
		marketing_priority,
		factory_priority,
		created_by_name,
		created_at,
		marketing_name,
		buyer_name,
		party_name,
		merchandiser_name,
		factory_name,
		factory_address,
		pi_numbers,
		revision_no,
		sno_from_head_office,
		sno_from_head_office_time,
		sno_from_head_office_by_name,
		receive_by_factory,
		receive_by_factory_time,
		receive_by_factory_by_name,
		production_pause,
		production_pause_time,
		production_pause_by_name,
	} = order;

	// Get all order_description_uuids from orders array
	const orderDescriptionUUIDs = useMemo(
		() =>
			orders
				?.map((o) => o?.order_description_uuid)
				?.filter((uuid) => uuid) || [],
		[orders]
	);

	// Fetch complains for all order descriptions using useQueries
	const complainQueries = useQueries({
		queries: orderDescriptionUUIDs.map((uuid) => ({
			queryKey: [
				...orderQK.complaintByProductDescriptionUUID(uuid),
				{
					url: `/public/complaint-by-order-description-uuid/${uuid}?is_zipper=true`,
				},
			],
			queryFn: () =>
				defaultFetch(
					`/public/complaint-by-order-description-uuid/${uuid}?is_zipper=true`
				),
			enabled: !!uuid,
		})),
	});

	// Aggregate all complain data
	const allComplainData = useMemo(() => {
		const complains = [];
		complainQueries.forEach((query) => {
			if (query?.data?.data && Array.isArray(query.data.data)) {
				complains.push(...query.data.data);
			}
		});
		return complains;
	}, [complainQueries]);

	const haveAccess = useAccess('order__complain');
	const navigation = useNavigate();

	// Delete state
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handelUpdate = (idx) => {
		const complain = allComplainData[idx];
		if (complain) {
			navigation(
				`/order/complain/${complain?.order_number}/${complain?.order_description_uuid}/${complain?.uuid}/update`
			);
		}
	};

	const handelDelete = (idx) => {
		const complain = allComplainData[idx];
		if (complain) {
			setDeleteItem((prev) => ({
				...prev,
				itemId: complain.uuid,
				itemName: complain.name,
			}));
			window['deleteComplainModal'].showModal();
		}
	};

	const queryClient = useQueryClient();

	// Mutation for updating complain
	const updateComplainMutation = useMutation({
		mutationFn: async ({ url, updatedData }) => {
			const response = await api.patch(url, updatedData);
			return response.data;
		},
		onSuccess: (data) => {
			ShowToast(data?.toast);
			// Invalidate all complain queries to refetch
			orderDescriptionUUIDs.forEach((uuid) => {
				queryClient.invalidateQueries({
					queryKey: orderQK.complaintByProductDescriptionUUID(uuid),
				});
			});
		},
		onError: (error) => {
			console.error(error);
			ShowToast(error?.response?.data?.toast);
		},
	});

	// Mutation for deleting complain
	const deleteComplainMutation = useMutation({
		mutationFn: async ({ url }) => {
			const response = await api.delete(url);
			return response.data;
		},
		onSuccess: (data) => {
			ShowToast(data?.toast);
			// Invalidate all complain queries to refetch
			orderDescriptionUUIDs.forEach((uuid) => {
				queryClient.invalidateQueries({
					queryKey: orderQK.complaintByProductDescriptionUUID(uuid),
				});
			});
		},
		onError: (error) => {
			console.error(error);
			ShowToast(error?.response?.data?.toast);
		},
	});

	const handelResolved = async (idx) => {
		const complain = allComplainData[idx];
		if (complain) {
			const is_resolved = complain.is_resolved ? false : true;
			await updateComplainMutation.mutateAsync({
				url: `/public/complaint/${complain.uuid}`,
				updatedData: {
					is_resolved,
					is_resolved_date: is_resolved ? GetDateTime() : null,
				},
			});
		}
	};

	const deleteData = {
		mutateAsync: deleteComplainMutation.mutateAsync,
	};

	const columns = complainColumns({
		handelUpdate,
		handelDelete,
		haveAccess,
		data: allComplainData,
		handelResolved,
	});

	const renderItems = () => {
		const order_details = [
			{
				label: 'O/N',
				value: order_number,
			},
			{
				label: 'Ref. O/N',
				value: reference_order && (
					<LinkWithCopy
						title={reference_order}
						id={reference_order}
						uri='/order/details'
					/>
				),
			},
			// {
			// 	label: 'Cash / LC',
			// 	value: haveAccess.includes('show_cash_bill_lc')
			// 		? renderCashOrLC(
			// 				order?.is_cash,
			// 				order?.is_sample,
			// 				order?.is_bill,
			// 				true
			// 			)
			// 		: '--',
			// },
			{
				label: 'Order Status',
				value: renderOrderStatus(order?.is_sample, order?.is_bill),
			},

			{
				label: 'PI No.',
				value: pi_numbers?.join(', '),
			},
			{
				label: 'Priority (Mark / Fact)',
				value:
					(marketing_priority || '-') +
					' / ' +
					(factory_priority || '-'),
			},
			{
				label: 'Created By',
				value: created_by_name,
			},
			{
				label: 'Created At',
				value: created_at && format(new Date(created_at), 'dd/MM/yyyy'),
			},
		];

		const buyer_details = [
			{
				label: 'Marketing',
				value: marketing_name,
			},
			{
				label: 'Buyer',
				value: buyer_name,
			},

			{
				label: 'Party',
				value: party_name,
			},

			{
				label: 'Merchandiser',
				value: merchandiser_name,
			},

			{
				label: 'Factory',
				value: factory_name,
			},

			{
				label: 'Factory Address',
				value: factory_address,
			},
		];
		const status_details = [
			{
				label: 'S/N From Head Office',

				value: (
					<div className='flex gap-2'>
						<StatusButton
							className={'btn-xs'}
							value={sno_from_head_office}
						/>
						<div className='flex flex-col gap-2'>
							{sno_from_head_office_time &&
								format(
									new Date(sno_from_head_office_time),
									'dd/MM/yyyy hh:mm aaa'
								)}
							<span>{sno_from_head_office_by_name}</span>
						</div>
					</div>
				),
			},

			{
				label: 'Receive By Factory',

				value: (
					<div className='flex gap-2'>
						<StatusButton
							className={'btn-xs'}
							value={receive_by_factory}
						/>
						<div className='flex flex-col gap-2'>
							{receive_by_factory_time &&
								format(
									new Date(receive_by_factory_time),
									'dd/MM/yyyy hh:mm aaa'
								)}
							<span>{receive_by_factory_by_name}</span>
						</div>
					</div>
				),
			},

			{
				label: 'Production Pause',
				value: (
					<div className='flex gap-2'>
						<StatusButton
							className={'btn-xs'}
							value={production_pause}
						/>
						<div className='flex flex-col gap-2'>
							{production_pause_time &&
								format(
									new Date(production_pause_time),
									'dd/MM/yyyy hh:mm aaa'
								)}
							<span>{production_pause_by_name}</span>
						</div>
					</div>
				),
			},
		];
		return {
			order_details,
			buyer_details,
			status_details,
		};
	};

	const renderButtons = () => {
		return [
			<button
				key='pdf'
				type='button'
				className='btn btn-accent btn-sm rounded-badge'
				onClick={handelPdfDownload}
			>
				<PDF className='w-4' /> PDF
			</button>,
			<div key='view-toggle' className='flex items-center gap-2'>
				<SwitchToggle
					onChange={handleViewChange}
					checked={updateView}
				/>
				<span className='text-sm'>
					{updateView ? 'View by Style' : 'Default View'}
				</span>
			</div>,
		];
	};

	return (
		<SectionContainer
			key='order_information_section'
			title='Order Information'
			buttons={renderButtons()}
			// selector={renderSelector()}
			className={'mb-8'}
		>
			<div className='grid grid-cols-1 bg-base-100 md:grid-cols-4 md:gap-8'>
				<RenderTable
					className={
						'border-b border-secondary/30 md:border-b-0 md:border-r'
					}
					title='Order Details'
					items={renderItems().order_details}
				/>

				<RenderTable
					className={'border-secondary/30 md:border-l md:border-r'}
					title='Buyer Details'
					items={renderItems().buyer_details}
				/>
				<RenderTable
					className={'border-secondary/30 md:border-l md:border-r'}
					title='Status Details'
					items={renderItems().status_details}
				/>
				<div className='border border-secondary/30'>
					<div className='flex items-center justify-between bg-base-200 px-3 py-2'>
						<h4 className='text-lg font-medium capitalize leading-tight text-primary'>
							Complain
						</h4>
						{haveAccess.includes('complain_entry') &&
							orderDescriptionUUIDs.length > 0 && (
								<button
									type='button'
									disabled={
										!haveAccess.includes('complain_entry')
									}
									className='flex items-center rounded-sm bg-accent p-2 text-xs text-secondary-foreground disabled:bg-slate-400'
									onClick={() =>
										navigation(
											`/order/complain/${order_number}/${orderDescriptionUUIDs[0]}`
										)
									}
								>
									New
									<Plus className='ml-2' size={16} />
								</button>
							)}
					</div>
					<ReactTableWithoutTitle
						title='Complain'
						data={allComplainData}
						columns={columns}
					/>
				</div>
			</div>
			{deleteData && (
				<Suspense>
					<DeleteModal
						modalId={'deleteComplainModal'}
						title={'Are you sure you want to delete this complain?'}
						{...{
							deleteItem,
							setDeleteItem,
							url: `/public/complaint`,
							deleteData,
						}}
					/>
				</Suspense>
			)}
		</SectionContainer>
	);
}
