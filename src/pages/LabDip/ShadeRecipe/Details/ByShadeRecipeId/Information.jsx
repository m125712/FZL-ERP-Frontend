import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';

export default function Information({
	data = {
		shade_recipe_id: null,
		name: null,
		sub_streat: null,
		lab_status: null,
		bleaching: null,
		created_by_name: null,
		created_at: null,
		updated_at: null,
		remarks: null,
	},
}) {
	const {
		shade_recipe_id,
		name,
		sub_streat,
		lab_status,
		bleaching,
		created_by_name,
		created_at,
		updated_at,
		remarks,
	} = data;

	const renderItems = () => {
		const items = [
			{
				label: 'Invoice Number',
				value: shade_recipe_id,
			},

			{
				label: 'Name',
				value: name,
			},
			{
				label: 'Sub Streat',
				value:
					sub_streat === 'txp'
						? 'TXP'
						: sub_streat === 'ssp'
							? 'SSP'
							: 'Others',
			},
			{
				label: 'Bleaching',
				value: bleaching === 'bleach' ? 'Bleach' : 'Non-Bleach',
			},
			{
				label: 'Lab Status',
				value: lab_status === 1 ? 'Done' : 'Pending',
			},
			{
				label: 'Created By',
				value: created_by_name,
			},
			{
				label: 'Created At',
				value: created_at,
			},
			{
				label: 'Updated At',
				value: updated_at,
			},
			{
				label: 'Remarks',
				value: remarks,
			},
		];
		return items;
	};

	return (
		<SectionContainer title={'Information'}>
			<RenderTable items={renderItems()} />
		</SectionContainer>
	);
}
