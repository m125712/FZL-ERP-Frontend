import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';

export default function Information({
	purchase = {
		uuid: null,
		vendor_name: null,
		lc_number: null,
		is_local: null,
	},
}) {
	const { uuid, vendor_name, lc_number, is_local } = purchase;
	const renderItems = () => {
		const items = [
			{
				label: 'Invoice Number',
				value: uuid,
			},

			{
				label: 'Vendor',
				value: vendor_name,
			},
			{
				label: 'LC Number',
				value: lc_number,
			},
			{
				label: 'LC/Local',
				value: is_local == 1 ? 'Local' : 'LC',
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
