import { useFetch } from '@/hooks';
import { TitleList, TitleValue } from '@/ui';

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
				title: 'item',
				value: item_name,
			},
			{
				title: 'zipper no',
				value: zipper_number_name,
			},
			{
				title: 'end',
				value: end_type_name,
			},
			{
				title: 'lock',
				value: lock_type_name,
			},
			{
				title: 'stopper',
				value: stopper_type_name,
			},
			{
				title: 'puller',
				value: puller_type_name,
			},
			{
				title: 'teeth color',
				value: teeth_color_name,
			},
			{
				title: 'special requirement',
				value:
					special_requirement_name == null
						? 'M/F'
						: special_requirement_name + ', M/F',
			},
			{
				title: 'puller color',
				value: puller_color_name,
			},
			{
				title: 'hand',
				value: hand_name,
			},
			{
				title: 'coloring type',
				value: coloring_type_name,
			},
			{
				title: 'description',
				value: description,
			},
			{
				title: 'remarks',
				value: remarks,
			},
		];
		return items;
	};
	return (
		<div className=''>
			<h4 className='bg-secondary-content px-3 py-2 text-lg font-medium capitalize leading-tight text-white'>
				Item Details
			</h4>

			<div className='overflow-x-auto'>
				<table className='table table-sm'>
					<tbody>
						{renderItems().map((item, index) => (
							<tr
								key={index}
								className='odd:bg-secondary-content/5'>
								<th className='capitalize'>{item.title}</th>
								<td>{item.value || '--'}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* <div className='flex w-full flex-col gap-8 px-4 py-2 md:w-auto md:flex-row'>
				<div className='flex flex-1 flex-col gap-0.5 divide-y-[1px] divide-secondary-content/20 rounded-sm'>
					<TitleValue
						title='item'
						value={order_description?.item_name}
					/>
					<TitleValue
						title='zipper no'
						value={order_description?.zipper_number_name}
					/>
					<TitleValue
						title='end'
						value={order_description?.end_type_name}
					/>
					<TitleValue
						title='lock'
						value={order_description?.lock_type_name}
					/>
					<TitleValue
						title='stopper'
						value={order_description?.stopper_type_name}
					/>
					<TitleValue
						title='puller'
						value={order_description?.puller_type_name}
					/>
				</div>

				<div className='flex flex-1 flex-col gap-0.5 divide-y-[1px] divide-secondary-content/20 rounded-sm border-t-2 border-primary/20 md:border-t-0'>
					<TitleValue
						title='teeth color'
						value={order_description?.teeth_color_name}
					/>
					<TitleValue
						title='puller color'
						value={order_description?.puller_color_name}
					/>
					<TitleValue
						title='special req'
						value={
							order_description?.special_requirement_name == null
								? 'M/F'
								: order_description?.special_requirement_name +
									', M/F'
						}
					/>
					<TitleValue
						title='hand'
						value={order_description?.hand_name}
					/>
					<TitleValue
						title='coloring'
						value={order_description?.coloring_type_name}
					/>
					<TitleValue
						title='description'
						value={order_description?.description}
					/>
					<TitleList
						title='remarks'
						value={order_description?.remarks}
					/>
				</div>
			</div> */}
		</div>
	);
}
