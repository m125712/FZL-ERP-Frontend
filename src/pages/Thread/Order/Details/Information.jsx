import { TitleValue } from '@/ui';
import { useEffect } from 'react';

export default function Information({ orderInfo }) {
	useEffect(() => {
		document.title = `Shade Recipe Details of ${orderInfo?.id}`;
	}, []);

	return (
		<div className='my-2 flex flex-col rounded-md px-2 shadow-md'>
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
