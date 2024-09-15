import { useFetch } from '@/hooks';

import RenderTable from '@/ui/Others/Table/RenderTable';

import cn from '@/lib/cn';

const getSpecialRequirement = (special_requirement) =>
	special_requirement
		?.replace(/[^\d,]/g, '')
		.split(',')
		.map((item) =>
			useFetch(
				`/order/details/special-requirement/${parseInt(item)}`
			).value?.map((item) => item.name)
		)
		.join(', ') + ', M/F';

export default function ItemDescription({ order_description, className }) {
	const sliderQuantity = order_description?.order_entry.reduce(
		(sum, item) => {
			return sum + parseFloat(item.quantity);
		},
		0
	);

	// const total_size_in_cm = order_description?.order_entry.reduce(
	// 	(sum, item) => {
	// 		return sum + parseFloat(item.size);
	// 	},
	// 	0
	// );

	const renderItems = () => {
		const {
			item_name,
			zipper_number_name,
			end_type_name,
			lock_type_name,
			nylon_stopper_name,
			stopper_type_name,
			puller_type_name,
			hand_name,
			description,
			remarks,

			// slider
			slider_name,
			is_slider_provided,
			slider_starting_section,
			top_stopper_name,
			bottom_stopper_name,
			logo_type_name,
			slider_body_shape_name,
			slider_link_name,
			puller_link_name,
			puller_color_name,
			coloring_type_name,

			// garments
			end_user_name,
			light_preference_name,
			garments_wash,
			garments_remarks,

			// tape
			tape_name,
			tape_received,
			tape_transferred,
			teeth_color_name,
			special_requirement_name,
			nylon_plastic_finishing,
			vislon_teeth_molding,
			metal_teeth_molding,
			nylon_metallic_finishing,
		} = order_description;

		const baseInfo = [
			{
				label: 'item',
				value: item_name,
			},
			{
				label: 'zipper no',
				value: zipper_number_name,
			},
			...(item_name.toLowerCase() === 'nylon'
				? [
						{
							label: 'Nylon Stopper',
							value: nylon_stopper_name,
						},
					]
				: []),
			{
				label: 'end',
				value: end_type_name,
			},
			...(end_type_name.toLowerCase() === 'open end'
				? [
						{
							label: 'Hand',
							value: hand_name,
						},
					]
				: []),
			{
				label: 'lock',
				value: lock_type_name,
			},
			{
				label: 'stopper',
				value: stopper_type_name,
			},

			{
				label: 'special requirement',
				value:
					special_requirement_name == null
						? 'M/F'
						: special_requirement_name + ', M/F',
			},
			{
				label: 'description',
				value: description,
			},
			{
				label: 'remarks',
				value: remarks,
			},
		];

		const sliderInfo = [
			{
				label: 'slider',
				value: slider_name,
			},
			{
				label: 'is slider provided?',
				value: is_slider_provided ? 'Yes' : 'No',
			},
			{
				label: 'Starting section',
				value: slider_starting_section,
			},
			{
				label: 'top stopper',
				value: top_stopper_name,
			},
			{
				label: 'bottom stopper',
				value: bottom_stopper_name,
			},
			{
				label: 'logo type',
				value: logo_type_name,
			},
			{
				label: 'slider body shape',
				value: slider_body_shape_name,
			},
			{
				label: 'slider link',
				value: slider_link_name,
			},

			{
				label: 'coloring type',
				value: coloring_type_name,
			},
			{
				label: 'Sliders Required',
				value: `${sliderQuantity} pcs`,
			},
		];

		const pullerInfo = [
			{
				label: 'puller',
				value: puller_type_name,
			},
			{
				label: 'puller link',
				value: puller_link_name,
			},
			{
				label: 'puller color',
				value: puller_color_name,
			},
		];

		const garmentsInfo = [
			{
				label: 'end user',
				value: end_user_name,
			},
			{
				label: 'light preference',
				value: light_preference_name,
			},
			{
				label: 'wash',
				value: garments_wash,
			},
			{
				label: 'remarks',
				value: garments_remarks,
			},
		];

		const tapeInfo = [
			{
				label: 'teeth color',
				value: teeth_color_name,
			},
			{
				label: 'tape name',
				value: tape_name,
			},
			{
				label: 'tape received',
				value: tape_received,
			},
			{
				label: 'tape transferred',
				value: tape_transferred,
			},
			{
				label: 'nylon plastic finishing',
				value: nylon_plastic_finishing,
			},
			{
				label: 'vislon teeth molding',
				value: vislon_teeth_molding,
			},
			{
				label: 'metal teeth molding',
				value: metal_teeth_molding,
			},
			{
				label: 'nylon metallic finishing',
				value: nylon_metallic_finishing,
			},
			{
				label: 'Tape Required',
				value: 'Not added yet',
			},
		];

		return { baseInfo, sliderInfo, garmentsInfo, tapeInfo, pullerInfo };
	};

	const { baseInfo, sliderInfo, garmentsInfo, tapeInfo, pullerInfo } =
		renderItems();
	return (
		<div
			className={cn(
				'grid h-full grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
				className
			)}>
			<RenderTable
				className={
					'border-b border-secondary/30 md:border-b-0 md:border-r'
				}
				title={'Zipper Type'}
				items={baseInfo}
			/>

			<RenderTable
				className={
					'border-b border-secondary/30 md:border-b-0 md:border-l 2xl:border-x'
				}
				title={'Slider'}
				items={sliderInfo}
			/>
			<RenderTable
				className={
					'border-b border-secondary/30 md:border-b-0 md:border-l 2xl:border-x'
				}
				title={'Puller'}
				items={pullerInfo}
			/>
			<RenderTable
				className={
					'border-b border-secondary/30 md:border-b-0 md:border-l 2xl:border-x'
				}
				title={'Garments'}
				items={garmentsInfo}
			/>

			<RenderTable
				className={
					'border-b border-secondary/30 md:border-b-0 md:border-l 2xl:border-x'
				}
				title={'Tape'}
				items={tapeInfo}
			/>
		</div>
	);
}
