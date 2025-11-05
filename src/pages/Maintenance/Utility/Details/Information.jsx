import { format, parseISO } from 'date-fns';

import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { StatusButton } from '@/ui';

export default function Information({
	utility = {
		uuid: null,
		date: null,
		previous_date: null,
		off_day: false,
		created_by: null,
		created_by_name: null,
		created_at: null,
		updated_at: null,
		updated_by_name: null,
		remarks: null,
	},
}) {
	const {
		date,
		previous_date,
		off_day,
		created_at,
		created_by_name,
		remarks,
		updated_at,
		updated_by_name,
		utility_id,
	} = utility;

	const renderItems = () => {
		const items = [
			{
				label: 'ID',
				value: utility_id || '-',
			},
			{
				label: 'Date',
				value: date ? format(parseISO(date), 'dd/MM/yyyy') : '-',
			},
			{
				label: 'Previous Date',
				value: previous_date
					? format(parseISO(previous_date), 'dd/MM/yyyy')
					: '-',
			},
			{
				label: 'Off Day',
				value: <StatusButton size='btn-xs' value={off_day} />,
			},
			{
				label: 'Remarks',
				value: remarks || '-',
			},
		];
		const create = [
			{
				label: 'Created By',
				value: created_by_name || '-',
			},
			{
				label: 'Created At',
				value: created_at
					? format(parseISO(created_at), 'dd/MM/yyyy - hh:mm a')
					: '-',
			},
			{
				label: 'Updated By',
				value: updated_by_name || '-',
			},
			{
				label: 'Updated At',
				value: updated_at
					? format(parseISO(updated_at), 'dd/MM/yyyy - hh:mm a')
					: '-',
			},
		];

		return {
			items,
			create,
		};
	};

	return (
		<SectionContainer title={'Utility Information'}>
			<div className='grid w-full grid-cols-1 border-secondary/30 lg:grid-cols-2'>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Utility Details'}
					items={renderItems().items}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Audit'}
					items={renderItems().create}
				/>
			</div>
		</SectionContainer>
	);
}
