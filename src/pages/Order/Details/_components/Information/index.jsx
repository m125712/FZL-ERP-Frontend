import { useEffect, useState } from 'react';
import { PDF } from '@/assets/icons';
import { useAuth } from '@/context/auth';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import SectionContainer from '@/ui/Others/SectionContainer';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { LinkWithCopy, StatusButton } from '@/ui';

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

export function OrderInformation({
	order,
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
			<div className='flex items-center gap-2'>
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
			<div className='grid grid-cols-1 bg-base-100 md:grid-cols-3 md:gap-8'>
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
					className={'border-secondary/30 md:border-l'}
					title='Status Details'
					items={renderItems().status_details}
				/>
			</div>
		</SectionContainer>
	);
}
