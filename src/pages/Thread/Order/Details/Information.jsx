import { useEffect, useState } from 'react';
import { format } from 'date-fns';

import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { DateTime, StatusButton, TitleValue } from '@/ui';
import { useAccess } from '@/hooks';

export default function Information({ orderInfo }) {
	const haveAccess = useAccess('thread__order_info_in_details');
	const [check, setCheck] = useState(true);
	const [checkSwatch, setCheckSwatch] = useState(true);

	useEffect(() => {
		document.title = `Thread Order Details of ${orderInfo?.uuid}`;
	}, []);

	useEffect(() => {
		orderInfo?.order_info_entry.map((item, i) => {
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
	}, [orderInfo]);

	const {
		uuid,
		order_number,
		party_name,
		buyer_name,
		marketing_name,
		factory_name,
		factory_address,
		merchandiser_name,
		is_sample,
		is_bill,
		is_cash,
		delivery_date,
		pi_numbers,
		created_by_name,
		remarks,
		revision_no,
		created_at,
		updated_at,
	} = orderInfo;

	const renderItems = () => {
		const order_details = [
			{
				label: 'O/N',
				value: order_number,
			},
			{
				label: 'Is Sample',
				value: (
					<StatusButton
						className={'border-0'}
						size='btn-xs'
						value={is_sample}
					/>
				),
			},
			{
				label: 'Is Bill',
				value: haveAccess.includes('show_cash_bill_lc') ? (
					<StatusButton
						className={'border-0'}
						size='btn-xs'
						value={is_bill}
					/>
				) : (
					'--'
				),
			},
			{
				label: 'Is Cash',
				value: haveAccess.includes('show_cash_bill_lc') ? (
					<StatusButton
						className={'border-0'}
						size='btn-xs'
						value={is_cash}
					/>
				) : (
					'--'
				),
			},
			{
				label: 'PI No.',
				value: pi_numbers?.join(', '),
			},
			{
				label: 'Revision No.',
				value: revision_no,
			},
			{
				label: 'Delivery Date',
				value: format(new Date(delivery_date), 'dd/MM/yyyy'),
			},
		];

		const buyer_details = [
			{
				label: 'Party',
				value: party_name,
			},

			{
				label: 'Buyer',
				value: buyer_name,
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
			{
				label: 'Marketing',
				value: marketing_name,
			},
		];

		const created_details = [
			{
				label: 'Created By',
				value: created_by_name,
			},
			{
				label: 'Created At',
				value: format(new Date(created_at), 'dd/MM/yyyy'),
			},
			{
				label: 'Updated At',
				value: updated_at
					? format(new Date(updated_at), 'dd/MM/yyyy')
					: '',
			},

			{
				label: 'Remarks',
				value: remarks,
			},
		];
		return {
			order_details,
			buyer_details,
			created_details,
		};
	};

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
				value={checkSwatch}
			/>,
		];
	};

	return (
		<SectionContainer title={'Information'} buttons={renderButtons()}>
			<div className='grid grid-cols-1 lg:grid-cols-3'>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Order Details'}
					items={renderItems().order_details}
				/>
				<RenderTable
					className={'border-secondary/30'}
					title={'Buyer Details'}
					items={renderItems().buyer_details}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-l'}
					title={'Created Details'}
					items={renderItems().created_details}
				/>
			</div>
		</SectionContainer>
	);
}
