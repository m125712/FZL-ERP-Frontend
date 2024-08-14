import { TitleValue } from '@/ui';

const renderLogo = (logo_type_name, is_logo_body, is_logo_puller) => {
	if (logo_type_name === '---')
		return <TitleValue title='Logo' value={logo_type_name} />;

	let logoLocations = [];

	if (is_logo_body === 1) logoLocations.push('Body');
	if (is_logo_puller === 1) logoLocations.push('Puller');

	if (logoLocations.length > 0) {
		logo_type_name += ` (${logoLocations.join(', ')})`;
	}

	return <TitleValue title='Logo' value={logo_type_name} />;
};

export default function SliderDescription({ order_description }) {
	const renderItems = () => {
		const {
			slider_name,
			is_slider_provided,
			slider_starting_section,
			bottom_stopper_name,
			top_stopper_name,
		} = order_description;

		const items = [
			{
				title: 'Slider Name',
				value: slider_name,
			},
			{
				title: 'Slider Provided',
				value: is_slider_provided === 1 ? 'Yes' : 'No',
			},
			{
				title: 'Slider Starting Section',
				value: slider_starting_section?.replace(/_/g, ' '),
			},
			{
				title: 'Top Stopper Name',
				value: top_stopper_name,
			},
			{
				title: 'Bottom Stopper Name',
				value: bottom_stopper_name,
			},
		];
		return items;
	};
	return (
		<div className=''>
			<h4 className='bg-secondary-content px-3 py-2 text-lg font-medium capitalize leading-tight text-white'>
				Slider Details
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
			{/* <div className='flex w-full flex-col divide-y-[1px] divide-primary/20 px-4 py-2 md:w-auto'>
				<TitleValue
					title='Slider'
					value={order_description?.slider_name}
				/>

				<TitleValue
					title='Slider Provided'
					value={
						order_description?.is_slider_provided === 1
							? 'Yes'
							: 'No'
					}
				/>

				<TitleValue
					title='Starting Section'
					value={order_description?.slider_starting_section?.replace(
						/_/g,
						' '
					)}
				/>
				<TitleValue
					title='Top Stopper'
					value={order_description?.top_stopper_name}
				/>
				<TitleValue
					title='Bottom Stopper'
					value={order_description?.bottom_stopper_name}
				/>
				{renderLogo(
					order_description?.logo_type_name,
					order_description?.is_logo_body,
					order_description?.is_logo_puller
				)}
			</div> */}
		</div>
	);
}

// {
// 	renderLogo(
// 		order_description?.logo_type_name,
// 		order_description?.is_logo_body,
// 		order_description?.is_logo_puller
// 	);
// }
