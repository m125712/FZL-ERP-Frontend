import { TitleValue } from '@/ui';

export default function Information({ info }) {
	return (
		<div className='my-2 flex flex-col rounded-md px-2 shadow-md'>
			<span className='flex items-center gap-2 text-2xl font-semibold capitalize leading-tight text-primary md:text-3xl'>
				Info
			</span>
			<hr className='border-1 my-2 border-secondary-content' />
			<div className='mx-2 flex flex-col items-stretch justify-between md:flex-row'>
				<div className='flex flex-col gap-0.5 divide-y-2 divide-primary/20 md:divide-y-0'>
					<TitleValue title='info ID' value={info?.info_id} />
					<TitleValue title='Order ID' value={info?.order_number} />
					<TitleValue title='name' value={info?.name} />
					<TitleValue title='buyer name' value={info?.buyer_name} />
					<TitleValue title='party name' value={info?.party_name} />
					<TitleValue
						title='marketing name'
						value={info?.marketing_name}
					/>
					<TitleValue
						title='merchandiser name'
						value={info?.merchandiser_name}
					/>
					<TitleValue
						title='factory_name'
						value={info?.factory_name}
					/>
					{/* <TitleValue
						title='lab status'
						value={
							Number(info?.lab_status) === 0
								? 'Pending'
								: 'Approved'
						}
					/> */}

					<TitleValue
						title='Created By'
						value={info?.created_by_name}
					/>
					<TitleValue
						title='Status'
						value={Number(info?.lab_status) === 0 ? 'No' : 'Yes'}
					/>

					<TitleValue title='Remarks' value={info?.remarks} />
				</div>
			</div>
		</div>
	);
}
