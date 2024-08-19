import { useFetch } from '@/hooks';
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

export default function ItemDescription({ order_description }) {
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
		];
		return items;
	};
	return (
		<div className=''>
			<div className='flex flex-col md:flex-row md:gap-8'>
				<div className='w-full flex-1'>
					<RenderTable
						title={'Zipper Type'}
						items={renderItems().slice(0, 6)}
					/>
				</div>

				<div className='w-full flex-1'>
					<RenderTable
						title={'Others'}
						items={renderItems().slice(6, renderItems().length)}
					/>
				</div>
			</div>
		</div>
	);
}
