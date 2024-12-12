import { format } from 'date-fns';

import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { LinkWithCopy, StatusButton, TitleValue } from '@/ui';

export default function Information({ recipe }) {
	const {
		approved,
		approved_date,
		bleaching,
		created_at,
		created_by_name,
		info_id,
		name,
		order_number,
		recipe_id,
		remarks,
		status,
		sub_streat,
		updated_at,
	} = recipe;

	const renderItems = () => {
		const basicInfo = [
			{
				label: 'Name',
				value: name,
			},
			// {
			// 	label: 'Order No.',
			// 	value: (
			// 		<LinkWithCopy
			// 			title={order_number}
			// 			id={order_number}
			// 			uri={`/order/details`}
			// 		/>
			// 	),
			// },
			{
				label: 'Recipe ID',
				value: recipe_id,
			},
			// {
			// 	label: 'Info ID',
			// 	value: info_id,
			// },
			// {
			// 	label: 'Status',
			// 	value: <StatusButton value={status} className={'btn-xs'} />,
			// },
		];

		const otherDetails = [
			// {
			// 	label: 'Approved',
			// 	value: <StatusButton value={approved} className={'btn-xs'} />,
			// },
			// {
			// 	label: 'Approved Date',
			// 	value: format(new Date(approved_date), 'dd/MM/yyyy'),
			// },
			{
				label: 'Bleaching',
				value: bleaching,
			},
			{
				label: 'Sub Streat',
				value: sub_streat,
			},
			{
				label: 'Remarks',
				value: remarks,
			},
		];

		const createdDetails = [
			{
				label: 'Created By',
				value: created_by_name,
			},
			{
				label: 'Created At',
				value: format(new Date(created_at), 'dd/MM/yyyy'),
			},
			{
				label: 'Updated At',
				value: updated_at
					? format(new Date(updated_at), 'dd/MM/yyyy')
					: '--',
			},
		];

		return {
			basicInfo,
			otherDetails,
			createdDetails,
		};
	};
	return (
		<SectionContainer title={'Information'} contentClassName={'space-y-0'}>
			<div className='grid grid-cols-1 lg:grid-cols-3'>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Basic Info'}
					items={renderItems().basicInfo}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Other Details'}
					items={renderItems().otherDetails}
				/>
				<RenderTable
					className={'border-secondary/30'}
					title={'Created Details'}
					items={renderItems().createdDetails}
				/>
			</div>
		</SectionContainer>
	);
}
