import { useFetch } from '@/hooks';

import { StatusButton, TitleValue } from '@/ui';

export default function Information({ batch }) {
	return (
		<div className='my-2 flex flex-col rounded-md px-2 shadow-md'>
			<span className='flex items-center gap-2 text-2xl font-semibold capitalize leading-tight text-primary md:text-3xl'>
				Planning Batch
			</span>
			<hr className='border-1 my-2 border-secondary-content' />
			<div className='mx-2 flex flex-col items-stretch justify-between md:flex-row'>
				<div className='flex flex-col gap-0.5 divide-y-2 divide-primary/20 md:divide-y-0'>
					<TitleValue title='ID' value={batch?.batch_id} />
					<TitleValue title='Machine' value={batch?.machine_name} />
					<TitleValue
						title='Slot'
						value={batch?.slot === 0 ? '-' : "Slot " + batch?.slot}
					/>
					<TitleValue
						title='Created By'
						value={batch?.created_by_name}
					/>
					{/* <TitleValue
						title='Status'
						value={Number(batch?.status) === 0 ? 'No' : 'Yes'}
					/>
					<TitleValue
						title='Approved'
						value={
							Number(batch?.approved) === 0
								? 'Pending'
								: 'Approved'
						}
					/> */}
					<TitleValue title='Status' value={batch?.batch_status} />
					<TitleValue title='Remarks' value={batch?.remarks} />
				</div>
			</div>
		</div>
	);
}
