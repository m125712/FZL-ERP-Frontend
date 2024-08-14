import { useFetch } from '@/hooks';

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

			<div className='flex flex-col md:flex-row md:gap-8'>
				<div className='w-full flex-1'>
					<div className='overflow-x-auto'>
						<table className='table table-sm'>
							<tbody>
								{renderItems()
									.slice(0, 6)
									.map((item, index) => (
										<tr
											key={index}
											className='odd:bg-secondary-content/5'>
											<th className='capitalize'>
												{item.title}
											</th>
											<td>{item.value || '--'}</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>

				<div className='w-full flex-1'>
					<div className='overflow-x-auto'>
						<table className='table table-sm'>
							<tbody>
								{renderItems()
									.slice(6, renderItems().length)
									.map((item, index) => (
										<tr
											key={index}
											className='odd:bg-secondary-content/5'>
											<th className='capitalize'>
												{item.title}
											</th>
											<td>{item.value || '--'}</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
