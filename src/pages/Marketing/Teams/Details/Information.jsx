import { format } from 'date-fns';

import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';

export default function Information({ data }) {
	const { name, created_by_name, created_at, updated_at, remarks } = data;

	const renderItems = () => {
		const basicInfo = [
			{
				label: 'Team name',
				value: name,
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
			{
				label: 'Remarks',
				value: remarks,
			},
		];

		return {
			basicInfo,
		};
	};

	return (
		<SectionContainer title={'Information'} contentClassName={'space-y-0 '}>
			<RenderTable
				className={'border-secondary/30 lg:border-b'}
				title={'Team Info'}
				items={renderItems().basicInfo}
			/>
		</SectionContainer>
	);
}
