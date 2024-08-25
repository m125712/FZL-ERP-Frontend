import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';

export default function Information({
	data = {
		shade_recipe_id: null,
		name: null,
		sub_streat: null,
		lab_status: null,
	},
}) {
	const { shade_recipe_id, name, sub_streat, lab_status } = data;
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
				value: sub_streat,
			},
			{
				label: 'Lab Status',
				value: lab_status === 1 ? 'Done' : 'Pending',
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
