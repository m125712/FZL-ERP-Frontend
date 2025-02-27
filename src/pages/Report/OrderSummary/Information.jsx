import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { CustomLink, DateTime } from '@/ui';

export default function Information({ data }) {
	// order_info_uuid: 'wRqHljudFWJesak';

	const renderItems = () => {
		const col1 = [
			{
				label: 'Order No.',
				value: (
					<CustomLink
						label={data?.order_number}
						url={`/order/details/${data?.order_number}`}
						openInNewTab={true}
					/>
				),
			},
			{
				label: 'Party',
				value: data?.party_name,
			},
			{
				label: 'Merchandiser',
				value: data?.merchandiser_name,
			},
			{
				label: 'Buyer',
				value: data?.buyer_name,
			},
		];

		const col2 = [
			{
				label: 'PI',
				value: (
					<CustomLink
						label={data?.pi_numbers}
						url={`/commercial/pi/${data?.pi_numbers}`}
						openInNewTab={true}
					/>
				),
			},
			{
				label: 'LC',
				value: (
					<CustomLink
						label={data?.lc_numbers}
						url={`/commercial/lc/details/${data?.lc_numbers}`}
						openInNewTab={true}
					/>
				),
			},
			{
				label: 'Marketing',
				value: data?.marketing_name,
			},
			{
				label: 'created at',
				value: <DateTime date={data?.created_at} isTime={false} />,
			},
		];

		return {
			col1,
			col2,
		};
	};
	return (
		<SectionContainer title={'Information'} contentClassName={'space-y-0'}>
			<div className='grid grid-cols-1 lg:grid-cols-2'>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					items={renderItems().col1}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					items={renderItems().col2}
				/>
			</div>
		</SectionContainer>
	);
}
