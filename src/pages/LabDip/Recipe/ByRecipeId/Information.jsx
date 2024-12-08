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
			{
				label: 'Order No.',
				value: (
					<LinkWithCopy
						title={order_number}
						id={order_number}
						uri={`/order/details`}
					/>
				),
			},
			{
				label: 'Recipe ID',
				value: recipe_id,
			},
			{
				label: 'Info ID',
				value: info_id,
			},
			{
				label: 'Status',
				value: <StatusButton value={status} className={'btn-xs'} />,
			},
		];

		const otherDetails = [
			{
				label: 'Approved',
				value: <StatusButton value={approved} className={'btn-xs'} />,
			},
			{
				label: 'Approved Date',
				value: format(new Date(approved_date), 'dd/MM/yyyy'),
			},
			{
				label: 'Bleaching',
				value: bleaching,
			},
			{
				label: 'Sub Streat',
				value: sub_streat,
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
			{
				label: 'Remarks',
				value: remarks,
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
	return (
		<div className='my-2 flex flex-col rounded-md px-2 shadow-md'>
			<span className='flex items-center gap-2 text-2xl font-semibold capitalize leading-tight text-primary md:text-3xl'>
				Recipe
			</span>
			<hr className='border-1 my-2 border-secondary-content' />
			<div className='mx-2 flex flex-col items-stretch justify-between md:flex-row'>
				<div className='flex flex-col gap-0.5 divide-y-2 divide-primary/20 md:divide-y-0'>
					<TitleValue title='recipe_id' value={recipe?.recipe_id} />
					<TitleValue
						title='O/N'
						value={
							recipe?.order_info_uuid ? recipe?.order_number : '-'
						}
					/>
					<TitleValue
						title='Info ID'
						value={
							recipe?.lab_dip_info_uuid ? recipe?.info_id : '-'
						}
					/>
					<TitleValue title='name' value={recipe?.name} />
					<TitleValue title='Bleaching' value={recipe?.bleaching} />
					<TitleValue title='sub streat' value={recipe?.sub_streat} />
					<TitleValue
						title='Created By'
						value={recipe?.created_by_name}
					/>
					<TitleValue title='Created At' value={recipe?.created_at} />
					<TitleValue title='Updated At' value={recipe?.updated_at} />

					{/* <TitleValue
						title='Status'
						value={Number(recipe?.status) === 0 ? 'No' : 'Yes'}
					/> */}
					<TitleValue
						title='Approved'
						value={
							Number(recipe?.approved) === 0
								? 'Pending'
								: 'Approved'
						}
					/>
					<TitleValue title='Remarks' value={recipe?.remarks} />
				</div>
			</div>
		</div>
	);
}
