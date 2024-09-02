import { DateTime, TitleValue } from '@/ui';
import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { format } from 'date-fns';
import { useEffect } from 'react';

export default function Information({ orderInfo }) {
	useEffect(() => {
		document.title = `Shade Recipe Details of ${orderInfo?.uuid}`;
	}, []);

	console.log({
		orderInfo,
	});

	const {
		uuid,
		party_name,
		buyer_name,
		marketing_name,
		factory_name,
		merchandiser_name,
		is_sample,
		is_bill,
		delivery_date,
		created_by_name,
		remarks,
		created_at,
		updated_at,
	} = orderInfo;

	const renderItems = () => {
		const order_details = [
			{
				label: 'O/N',
				value: uuid,
			},
			{
				label: 'Is Sample',
				value: is_sample === 1 ? 'Yes' : 'No',
			},

			{
				label: 'Is Bill',
				value: is_bill === 1 ? 'Yes' : 'No',
			},

			{
				label: 'Delivery Date',
				value: format(new Date(delivery_date), 'dd/MM/yyyy'),
			},

			{
				label: 'Remarks',
				value: remarks,
			},

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
				value: format(new Date(updated_at), 'dd/MM/yyyy'),
			},
		];

		const buyer_details = [
			{
				label: 'Party',
				value: party_name,
			},

			{
				label: 'Buyer',
				value: buyer_name,
			},
			{
				label: 'Merchandiser',
				value: merchandiser_name,
			},
			{
				label: 'Factory',
				value: factory_name,
			},
			{
				label: 'Marketing',
				value: marketing_name,
			},
		];
		return {
			order_details,
			buyer_details,
		};
	};

	return (
		<SectionContainer title={'Information'}>
			<div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-8'>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Order Details'}
					items={renderItems().order_details}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-l'}
					title={'Buyer Details'}
					items={renderItems().buyer_details}
				/>
			</div>
		</SectionContainer>
	);

	return (
		<div className='sb-red my-2 flex flex-col rounded-md px-2 shadow-md'>
			<span className='flex items-center gap-2 text-2xl font-semibold capitalize leading-tight text-primary md:text-3xl'>
				Information
			</span>
			<hr className='border-1 my-2 border-secondary-content' />
			<div className='mx-2 flex flex-col items-stretch justify-between md:flex-row'>
				<div className='flex gap-0.5 divide-y-2 divide-primary/20 md:divide-y-0'>
					<TitleValue title='O/N' value={orderInfo?.id} />
					<TitleValue title='Party' value={orderInfo?.party_name} />
					<TitleValue title='Buyer' value={orderInfo?.buyer_name} />
					<TitleValue
						title='Marketing'
						value={orderInfo?.marketing_name}
					/>
					<TitleValue
						title='Factory'
						value={orderInfo?.factory_name}
					/>
					<TitleValue
						title='Merchandiser'
						value={orderInfo?.merchandiser_name}
					/>
					<TitleValue
						title='Sample'
						value={orderInfo?.is_sample == 1 ? 'Yes' : 'No'}
					/>
					<TitleValue
						title='Bill'
						value={orderInfo?.is_bill == 1 ? 'Yes' : 'No'}
					/>
					<TitleValue
						title='Delivery Date'
						value={orderInfo?.delivery_date}
					/>
					<TitleValue
						title='Issued By'
						value={orderInfo?.created_by_name}
					/>
					<TitleValue title='Remarks' value={orderInfo?.remarks} />
					<TitleValue title='Created' value={orderInfo?.created_at} />
					<TitleValue title='Updated' value={orderInfo?.updated_at} />
				</div>
			</div>
		</div>
	);
}
