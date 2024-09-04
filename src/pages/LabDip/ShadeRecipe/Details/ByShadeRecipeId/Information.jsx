import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';

export default function Information({
	data = {
		shade_recipe_id: null,
		name: null,
		sub_streat: null,
		lab_status: null,
		bleaching: null,
		remarks: null,
	},
}) {
	const {
		shade_recipe_id,
		name,
		sub_streat,
		lab_status,
		bleaching,
		remarks,
	} = data;
	const bleaching_uppercase =
		bleaching.charAt(0).toUpperCase() + bleaching.slice(1);
	const sub_streat_uppercase = sub_streat.toUpperCase();

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
				value: sub_streat_uppercase,
			},
			{
				label: 'Bleaching',
				value: bleaching_uppercase,
			},
			{
				label: 'Lab Status',
				value: lab_status === 1 ? 'Done' : 'Pending',
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
