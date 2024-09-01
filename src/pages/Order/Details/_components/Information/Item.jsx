import { useFetch } from '@/hooks';
import cn from '@/lib/cn';
import RenderTable from '@/ui/Others/Table/RenderTable';

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
	const renderItems = () => {
		const {
			item_name,
			zipper_number_name,
			end_type_name,
			lock_type_name,
			stopper_type_name,
			puller_type_name,
			teeth_color_name,
			special_requirement_name,
			puller_color_name,
			hand_name,
			coloring_type_name,
			description,
			remarks,
			tape_received,
			tape_transferred,
			nylon_plastic_finishing,
			vislon_teeth_molding,
			metal_teeth_molding,
			nylon_metallic_finishing,
		} = order_description;

		const items = [
			{
				label: 'item',
				value: item_name,
			},
			{
				label: 'zipper no',
				value: zipper_number_name,
			},
			{
				label: 'end',
				value: end_type_name,
			},
			{
				label: 'lock',
				value: lock_type_name,
			},
			{
				label: 'stopper',
				value: stopper_type_name,
			},
			{
				label: 'puller',
				value: puller_type_name,
			},
			{
				label: 'teeth color',
				value: teeth_color_name,
			},
			{
				label: 'special requirement',
				value:
					special_requirement_name == null
						? 'M/F'
						: special_requirement_name + ', M/F',
			},
			{
				label: 'puller color',
				value: puller_color_name,
			},
			{
				label: 'hand',
				value: hand_name,
			},
			{
				label: 'coloring type',
				value: coloring_type_name,
			},
			{
				label: 'description',
				value: description,
			},
			{
				label: 'remarks',
				value: remarks,
			},
			{
				label: 'Tape Received',
				value: tape_received,
			},
			{
				label: 'Tape Transferred',
				value: tape_transferred,
			},
			{
				label: 'Nylon Plastic Finishing',
				value: nylon_plastic_finishing,
			},
			{
				label: 'Vislon Teeth Molding',
				value: vislon_teeth_molding,
			},
			{
				label: 'Metal Teeth Molding',
				value: metal_teeth_molding,
			},
			{
				label: 'Nylon Metallic Finishing',
				value: nylon_metallic_finishing,
			},
		];
		return items;
	};
	return (
		<div
			className={cn(
				'grid h-full grid-cols-1 md:grid-cols-2 md:gap-8',
				className
			)}>
			<RenderTable
				className={
					'border-b border-secondary/30 md:border-b-0 md:border-r'
				}
				title={'Zipper Type'}
				items={renderItems().slice(0, 6)}
			/>

			<RenderTable
				className={
					'border-b border-secondary/30 md:border-b-0 md:border-l 2xl:border-x'
				}
				title={'Others'}
				items={renderItems().slice(6, renderItems().length)}
			/>
		</div>
	);
}
