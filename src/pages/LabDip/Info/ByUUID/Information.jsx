import { useFetch } from '@/hooks';
import { StatusButton, TitleValue } from '@/ui';

export default function Information({ info }) {
	return (
		<div className='my-2 flex flex-col rounded-md px-2 shadow-md'>
			<span className='flex items-center gap-2 text-2xl font-semibold capitalize leading-tight text-primary md:text-3xl'>
				Info
			</span>
			<hr className='border-1 my-2 border-secondary-content' />
			<div className='mx-2 flex flex-col items-stretch justify-between md:flex-row'>
				<div className='flex flex-col gap-0.5 divide-y-2 divide-primary/20 md:divide-y-0'>
					<TitleValue title='info_id' value={info?.info_id} />
					<TitleValue title='name' value={info?.name} />
					<TitleValue title='buyer_name' value={info?.buyer_name} />
					<TitleValue title='party_name' value={info?.party_name} />
					<TitleValue
						title='marketing_name'
						value={info?.marketing_name}
					/>
					<TitleValue
						title='merchandiser_name'
						value={info?.merchandiser_name}
					/>
					<TitleValue
						title='factory_name'
						value={info?.factory_name}
					/>
					<TitleValue
						title='lab_status'
						value={
							Number(info?.lab_status) === 0
								? 'Pending'
								: 'Approved'
						}
					/>

					<TitleValue
						title='Created By'
						value={info?.created_by_name}
					/>
					<TitleValue
						title='Status'
						value={Number(info?.status) === 0 ? 'No' : 'Yes'}
					/>
					<TitleValue
						title='Approved'
						value={
							Number(info?.approved) === 0
								? 'Pending'
								: 'Approved'
						}
					/>
					<TitleValue title='Remarks' value={info?.remarks} />
				</div>
			</div>
		</div>
	);
}
