import { PDF } from '@/assets/icons';
import { format } from 'date-fns';

import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { StatusButton } from '@/ui';

export default function Information({ challan }) {
	const {
		vehicle_name,
		carton_quantity,
		challan_number,
		created_at,
		created_by_name,
		remarks,
		gate_pass,
		order_number,
		receive_status,
		is_hand_delivery,
		name,
		delivery_date,
		delivery_cost,
		updated_at,
		is_own,
	} = challan;

	const renderItems = () => {
		const basicInfo = [
			{
				label: 'Challan Number',
				value: challan_number,
			},
			{
				label: 'Carton Quantity',
				value: carton_quantity,
			},
			{
				label: 'O/N',
				value: order_number,
			},
			{
				label: 'Hand Delivery',
				value: (
					<StatusButton
						className={'btn-xs'}
						value={is_hand_delivery ? 1 : 0}
					/>
				),
			},
			{
				label: 'Gate Pass',
				value: <StatusButton className={'btn-xs'} value={gate_pass} />,
			},
			{
				label: 'Receive Status',
				value: (
					<StatusButton className={'btn-xs'} value={receive_status} />
				),
			},
			{
				label: 'Own Delivery',
				value: <StatusButton className={'btn-xs'} value={is_own} />,
			},
		];

		const deliveryDetails = [
			{
				label: 'Name',
				value: name,
			},
			{
				label: 'Delivery Cost',
				value: delivery_cost,
			},
			{
				label: 'Assign To',
				value: vehicle_name,
			},
			{
				label: 'Delivery Date',
				value: format(new Date(delivery_date), 'dd/MM/yy'),
			},
		];

		const createdDetails = [
			{
				label: 'Created By',
				value: created_by_name,
			},
			{
				label: 'Created At',
				value: format(new Date(created_at), 'dd/MM/yy'),
			},
			{
				label: 'Updated At',
				value: format(new Date(updated_at), 'dd/MM/yy'),
			},
			{
				label: 'Remarks',
				value: remarks,
			},
		];

		return {
			basicInfo,
			deliveryDetails,
			createdDetails,
		};
	};

	const renderButtons = () => {
		return [
			<button
				key='pdf'
				type='button'
				className='btn btn-accent btn-sm rounded-badge'>
				<PDF className='w-4' /> PDF
			</button>,
		];
	};

	return (
		<SectionContainer buttons={renderButtons()} title={'Information'}>
			<div className='grid lg:grid-cols-3'>
				<RenderTable
					title={'Basic Info'}
					className='border-secondary/30 lg:border-r'
					items={renderItems().basicInfo}
				/>
				<RenderTable
					title={'Delivery Details'}
					className='border-secondary/30 lg:border-r'
					items={renderItems().deliveryDetails}
				/>
				<RenderTable
					title={'Created Details'}
					items={renderItems().createdDetails}
				/>
			</div>
		</SectionContainer>
	);
}
