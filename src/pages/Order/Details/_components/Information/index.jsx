import { useEffect, useState } from 'react';
import { PDF } from '@/assets/icons';
import { format } from 'date-fns';

import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { LinkWithCopy, StatusButton, TitleValue } from '@/ui';

import ItemDescription from './Item';
import OrderDescription from './Order';
import SliderDescription from './Slider';

export default function SingleInformation({ order, idx, hasInitialOrder }) {
	const [check, setCheck] = useState(true);

	useEffect(() => {
		// todo: need to be fixed
		order?.order_entry.map((item) => {
			if (
				Number(item?.company_price) <= 0 &&
				Number(item?.party_price) <= 0
			) {
				setCheck(false);
			}
		});
	}, [order]);

	const renderButtons = () => {
		return [
			<StatusButton
				className={'border-0'}
				key={'swatch_approval_status'}
				size='btn-xs md:btn-sm'
				value={check}
			/>,
			<StatusButton
				className={'border-0'}
				key={'swatch_approval_status'}
				size='btn-xs md:btn-sm'
				value={false}
			/>,
		];
	};

	return (
		<SectionContainer
			title={`${idx !== undefined && `${order?.item_description} #${idx + 1}`}`}
			buttons={renderButtons()}>
			{!hasInitialOrder && <OrderDescription order={order} />}
			<ItemDescription
				className={'border-secondary/30 md:border-b 2xl:border-b-0'}
				order_description={order}
			/>
		</SectionContainer>
	);
}

const renderCashOrLC = (is_cash, is_sample, is_bill, is_only_value) => {
	let value = is_cash == 1 ? 'Cash' : 'LC';
	let sample_bill = [];

	if (is_sample === 1) sample_bill.push('Sample');
	if (is_bill === 1) sample_bill.push('Bill');

	if (sample_bill.length > 0) value += ` (${sample_bill.join(', ')})`;

	if (is_only_value) return value;

	return <TitleValue title='Cash / LC' value={value} />;
};

export function OrderInformation({ order, handelPdfDownload }) {
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
			{
				label: 'Cash / LC',
				value: renderCashOrLC(
					order?.is_cash,
					order?.is_sample,
					order?.is_bill,
					true
				),
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
		return {
			order_details,
			buyer_details,
		};
	};

	const renderButtons = () => {
		return [
			<button
				key='pdf'
				type='button'
				className='btn btn-accent btn-sm rounded-badge'
				onClick={handelPdfDownload}>
				<PDF className='w-4' /> PDF
			</button>,
		];
	};

	return (
		<SectionContainer
			title='Order Information'
			buttons={renderButtons()}
			className={'mb-8'}>
			<div className='grid grid-cols-1 bg-base-100 md:grid-cols-2 md:gap-8'>
				<RenderTable
					className={
						'border-b border-secondary/30 md:border-b-0 md:border-r'
					}
					title='Order Details'
					items={renderItems().order_details}
				/>

				<RenderTable
					className={'border-secondary/30 md:border-l'}
					title='Buyer Details'
					items={renderItems().buyer_details}
				/>
			</div>
		</SectionContainer>
	);
}
