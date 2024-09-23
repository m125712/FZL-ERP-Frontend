import { PDF } from '@/assets/icons';
import { format } from 'date-fns';

import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';

export default function Information({ packing_list }) {
	const {
		packing_number,
		remarks,
		carton_size,
		carton_weight,
		created_at,
		updated_at,
		created_by_name,
		order_number,
	} = packing_list;

	const renderItems = () => {
		return [
			{
				label: 'Packing List No',
				value: packing_number,
			},

			{
				label: 'O/N',
				value: order_number,
			},
			{
				label: 'Carton Size',
				value: carton_size,
			},
			{
				label: 'Carton Weight',
				value: carton_weight,
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
