import { format } from 'date-fns';

import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { LinkWithCopy, StatusButton, TitleValue } from '@/ui';

export default function Information({ info }) {
	const {
		uuid,
		buyer_name,
		created_at,
		created_by_name,
		factory_name,
		info_id,
		is_thread_order,
		marketing_name,
		merchandiser_name,
		name,
		order_number,
		party_name,
		remarks,
		updated_at,
	} = info;

	const renderItems = () => {
		const basicInfo = [
			{
				label: 'Card ID',
				value: info_id,
			},
			{
				label: 'Name',
				value: name,
			},
			{
				label: 'Order No.',
				value: (
					<LinkWithCopy
						title={order_number}
						id={order_number}
						uri={`/order/details`}
					/>
				),
			},
			{
				label: 'Thread Order',
				value: (
					<StatusButton
						value={is_thread_order}
						className={'btn-xs'}
					/>
				),
			},
		];

		const buyerDetails = [
			{
				label: 'Buyer Name',
				value: buyer_name,
			},
			{
				label: 'Factory Name',
				value: factory_name,
			},
			{
				label: 'Marketing Name',
				value: marketing_name,
			},
			{
				label: 'Merchandiser Name',
				value: merchandiser_name,
			},
			{
				label: 'Party Name',
				value: party_name,
			},
		];

		const createdDetails = [
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
					: '--',
			},
			{
				label: 'Remarks',
				value: remarks,
			},
		];

		return {
			basicInfo,
			buyerDetails,
			createdDetails,
		};
	};
	return (
		<SectionContainer title={'Information'} contentClassName={'space-y-0'}>
			<div className='grid grid-cols-1 lg:grid-cols-3'>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Basic Info'}
					items={renderItems().basicInfo}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Buyer Details'}
					items={renderItems().buyerDetails}
				/>
				<RenderTable
					className={'border-secondary/30'}
					title={'Created Details'}
					items={renderItems().createdDetails}
				/>
			</div>
		</SectionContainer>
	);
}
