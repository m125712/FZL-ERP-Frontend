import { format } from 'date-fns';

import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { LinkWithCopy } from '@/ui';

export default function Information({ data }) {
	const {
		batch_number,
		order_number,
		order_description_uuid,
		item_description,
		slider_lead_time,
		dyeing_lead_time,
		status,
		created_by_name,
		created_at,
		updated_at,
		remarks,
	} = data;

	const renderItems = () => {
		const basicInfo = [
			{
				label: 'Batch ID',
				value: batch_number,
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
				label: 'Item',
				value: (
					<LinkWithCopy
						title={item_description}
						id={order_description_uuid}
						uri={`/order/details/${order_number}`}
					/>
				),
			},
			{
				label: 'Status',
				value: status,
			},
			{
				label: 'Slider Lead Time',
				value: slider_lead_time,
			},
			{
				label: 'dyeing Lead Time',
				value: dyeing_lead_time,
			},
			{
				label: 'Created By',
				value: created_by_name,
			},
			{
				label: 'Remarks',
				value: remarks,
			},
			{
				label: 'Created At',
				value: format(new Date(created_at), 'dd/MM/yy'),
			},
			{
				label: 'Updated At',
				value: updated_at? format(new Date(updated_at), 'dd/MM/yy'): '',
			},
		];

		return {
			basicInfo,
		};
	};

	return (
		<SectionContainer title={'Information'}>
			<RenderTable
				className={'border-secondary/30 lg:border-r'}
				title={'Basic Info'}
				items={renderItems().basicInfo}
			/>
		</SectionContainer>
	);
}
