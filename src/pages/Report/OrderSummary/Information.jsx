import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { DateTime } from '@/ui';

export default function Information({ data }) {
	// order_info_uuid: 'wRqHljudFWJesak';

	const renderItems = () => {
		const col1 = [
			{
				label: 'Order No.',
				value: data?.order_number,
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
				value: data?.pi_numbers,
			},
			{
				label: 'LC',
				value: data?.lc_numbers,
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
