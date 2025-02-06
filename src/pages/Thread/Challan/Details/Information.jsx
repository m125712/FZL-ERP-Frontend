import { PDF } from '@/assets/icons';
import { format } from 'date-fns';

import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { StatusButton } from '@/ui';

export default function Information({ challan }) {
	const {
		assign_to_name,
		carton_quantity,
		challan_id,
		created_at,
		created_by_name,
		remarks,
		gate_pass,
		order_number,
		received,
		updated_at,
		is_hand_delivery,
		name,
		delivery_cost,
	} = challan;

	const renderItems = () => {
		return [
			{
				label: 'Challan Number',
				value: challan_id,
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
				value: <StatusButton className={'btn-xs'} value={received} />,
			},
			{
				label: 'Assign To',
				value: assign_to_name,
			},

			{ label: 'Name', value: name },
			{ label: 'Delivery Cost', value: delivery_cost },
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
				value: updated_at
					? format(new Date(updated_at), 'dd/MM/yy')
					: null,
			},
		];
	};

	const renderButtons = () => {
		return [
			<button
				key='pdf'
				type='button'
				className='btn btn-accent btn-sm rounded-badge'
			>
				<PDF className='w-4' /> PDF
			</button>,
		];
	};

	return (
		<SectionContainer buttons={renderButtons()} title={'Information'}>
			<RenderTable items={renderItems()} />
		</SectionContainer>
	);
}
