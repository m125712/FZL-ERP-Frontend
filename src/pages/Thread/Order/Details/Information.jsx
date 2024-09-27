import { useEffect } from 'react';
import { format } from 'date-fns';

import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { DateTime, TitleValue } from '@/ui';

export default function Information({ orderInfo }) {
	useEffect(() => {
		document.title = `Thread Order Details of ${orderInfo?.uuid}`;
	}, []);

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
		created_by_name,
		remarks,
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
				value: is_sample === 1 ? 'Yes' : 'No',
			},

			{
				label: 'Is Bill',
				value: is_bill === 1 ? 'Yes' : 'No',
			},

			{
				label: 'Is Cash',
				value: is_cash === 1 ? 'Yes' : 'No',
			},

			{
				label: 'Delivery Date',
				value: format(new Date(delivery_date), 'dd/MM/yyyy'),
			},

			{
				label: 'Remarks',
				value: remarks,
			},

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
				value: format(new Date(updated_at), 'dd/MM/yyyy'),
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
		return {
			order_details,
			buyer_details,
		};
	};

	return (
		<SectionContainer title={'Information'}>
			<div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-8'>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Order Details'}
					items={renderItems().order_details}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-l'}
					title={'Buyer Details'}
					items={renderItems().buyer_details}
				/>
			</div>
		</SectionContainer>
	);
}
