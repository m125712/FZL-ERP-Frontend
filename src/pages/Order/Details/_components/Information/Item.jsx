import RenderTable from '@/ui/Others/Table/RenderTable';

import cn from '@/lib/cn';
import { useFetch } from '@/hooks';

// * function to get similar garment_wash
const getGarmentInfo = (order_description) => {
	const { value: garments } = useFetch(
		`/other/order-properties/by/garments_wash`
	);

	if (order_description?.garments_wash) {
		const parsedObject =
			typeof order_description?.garments_wash === 'string'
				? JSON.parse(order_description?.garments_wash)
				: order_description?.garments_wash;

		const matchingLabels = garments
			?.filter((item) => parsedObject.values.includes(item.value)) // Filter by matching value
			.map((item) => item.label);
		return matchingLabels;
	} else {
		return [];
	}
};

export default function ItemDescription({ order_description, className }) {

	const [sliderQuantity, total_size, tape_production] =
		order_description?.order_entry.reduce(
			([sliderQuantity, total_size, tape_production], item) => {
				return [
					sliderQuantity + parseFloat(item.quantity),
					total_size +
						parseFloat(item.size) * parseFloat(item.quantity),
					tape_production + parseFloat(item.dying_and_iron_prod),
				];
			},
			[0, 0, 0]
		);

	const total_top_bottom =
		sliderQuantity *
		(Number(order_description?.top || 0) +
			Number(order_description?.bottom || 0));

	const total_tape_in_mtr = Number(
		(total_size + total_top_bottom) / 100
	).toFixed(3);

	// * garments info
	const ginfo = getGarmentInfo(order_description);

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
			is_inch,
			is_meter,
			is_cm,
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
			puller_color_name,
			coloring_type_name,
			slider_finishing_stock,

			// garments
			end_user_name,
			light_preference_name,
			garments_remarks,

			// tape
			tape_name,
			tape_received,
			tape_transferred,
			teeth_color_name,
			special_requirement_name,
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
			...(item_name?.toLowerCase() === 'nylon'
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
			...(end_type_name?.toLowerCase() === 'open end'
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
				label: 'special requirement',
				value:
					special_requirement_name == null
						? 'M/F'
						: special_requirement_name + ', M/F',
			},
			{
				label: 'Size Unit',
				value: is_inch? 'Inch' : is_meter? 'Meter' : is_cm? 'Cm' : '--',
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
				label: 'Material',
				value: slider_name,
			},
			{
				label: 'provided by party?',
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
				label: 'body shape',
				value: slider_body_shape_name,
			},
			{
				label: 'link',
				value: slider_link_name,
			},

			{
				label: 'coloring',
				value: coloring_type_name,
			},
			{
				label: 'Required',
				value: `${sliderQuantity.toFixed(2)} pcs`,
			},
			{
				label: 'Stock',
				value: `${parseInt(slider_finishing_stock)} pcs`,
			},
		];

		const pullerInfo = [
			{
				label: 'name',
				value: puller_type_name,
			},
			{
				label: 'color',
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
				value: ginfo?.join(', '),
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
				label: 'name',
				value: tape_name,
			},
			{
				label: 'Required',
				value: `${total_tape_in_mtr} mtr`,
			},
			{
				label: 'Raw (mtr/kg)',
				value: `${Number(
					total_tape_in_mtr /
						Number(order_description?.raw_per_kg_meter)
				).toFixed(3)} kg`,
			},
			{
				label: 'received',
				value: `${tape_received} kg`,
			},

			{
				label: 'Dyed (mtr/kg)',
				value: `${Number(
					total_tape_in_mtr /
						parseFloat(order_description?.dyed_per_kg_meter)
				).toFixed(3)} kg`,
			},
			{
				label: 'production',
				value: `${tape_production} kg`,
			},
			{
				label: 'transfer',
				value: `${tape_transferred} kg`,
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
				title={'Zipper'}
				items={baseInfo}
			/>

			<RenderTable
				className={
					'border-b border-secondary/30 md:border-b-0 md:border-l 2xl:border-x'
				}
				title={'Tape'}
				items={tapeInfo}
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
		</div>
	);
}
