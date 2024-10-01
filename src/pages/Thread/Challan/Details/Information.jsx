import { PDF } from '@/assets/icons';
import { format } from 'date-fns';

import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { StatusButton } from '@/ui';

export default function Information({ challan }) {
	const {
		assign_to_name,
		carton_quantity,
		challan_number,
		created_at,
		created_by_name,
		remarks,
		gate_pass,
		order_number,
		receive_status,
		updated_at,
	} = challan;

	const renderItems = () => {
		return [
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
				label: 'Gate Pass',
				value: <StatusButton className={'btn-xs'} status={gate_pass} />,
			},
			{
				label: 'Receive Status',
				value: (
					<StatusButton
						className={'btn-xs'}
						status={receive_status}
					/>
				),
			},
			{
				label: 'Assign To',
				value: assign_to_name,
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
				value: format(new Date(updated_at), 'dd/MM/yy'),
			},
		];
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
			<RenderTable items={renderItems()} />
		</SectionContainer>
	);
}
