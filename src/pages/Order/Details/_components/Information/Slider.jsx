import RenderTable from '@/ui/Others/Table/RenderTable';

import cn from '@/lib/cn';

const renderLogo = (logo_type_name, is_logo_body, is_logo_puller) => {
	if (logo_type_name === '---')
		return {
			label: 'Logo Type',
			value: logo_type_name,
		};

	let logoLocations = [];

	if (is_logo_body === 1) logoLocations.push('Body');
	if (is_logo_puller === 1) logoLocations.push('Puller');

	if (logoLocations.length > 0) {
		logo_type_name += ` (${logoLocations.join(', ')})`;
	}

	return {
		label: 'Logo Type',
		value: logo_type_name,
	};
};

export default function SliderDescription({ order_description, className }) {
	const sliderQuantity = order_description?.order_entry.reduce(
		(sum, item) => {
			return sum + parseFloat(item.quantity);
		},
		0
	);

	const renderItems = () => {
		const {
			slider_name,
			is_slider_provided,
			slider_starting_section,
			bottom_stopper_name,
			top_stopper_name,
			logo_type_name,
			is_logo_body,
			is_logo_puller,
			slider_body_shape_name,
			slider_link_name,
			end_user_name,
			light_preference,
			garments_wash_name,
			puller_link_name,
			garments_remarks,
		} = order_description;

		const items = [
			{
				label: 'Slider Name',
				value: slider_name,
			},
			{
				label: 'Slider Provided',
				value: is_slider_provided === 1 ? 'Yes' : 'No',
			},
			{
				label: 'Slider Starting Section',
				value: slider_starting_section?.replace(/_/g, ' '),
			},
			{
				label: 'Top Stopper Name',
				value: top_stopper_name,
			},
			{
				label: 'Bottom Stopper Name',
				value: bottom_stopper_name,
			},
			renderLogo(logo_type_name, is_logo_body, is_logo_puller),
			{
				label: 'Slider Body Shape',
				value: slider_body_shape_name,
			},
			{
				label: 'Slider Link',
				value: slider_link_name,
			},
			{
				label: 'End User',
				value: end_user_name,
			},
			{
				label: 'Light Preference',
				value: light_preference,
			},
			{
				label: 'Garments Wash',
				value: garments_wash_name,
			},
			{
				label: 'Puller Link',
				value: puller_link_name,
			},
			{
				label: 'Garments Remarks',
				value: garments_remarks,
			},
			{
				label: 'Sliders Required',
				value: sliderQuantity,
			},
		];
		return items;
	};

	return (
		<RenderTable
			className={cn(className)}
			title={'Slider Details'}
			items={renderItems()}
		/>
	);
}

// {
// 	renderLogo(
// 		order_description?.logo_type_name,
// 		order_description?.is_logo_body,
// 		order_description?.is_logo_puller
// 	);
// }
