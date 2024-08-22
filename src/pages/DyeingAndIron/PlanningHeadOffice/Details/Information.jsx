import { useFetch } from '@/hooks';
import { StatusButton, TitleValue } from '@/ui';

export default function Information({ planningSNO }) {
	return (
		<div className='my-2 flex flex-col rounded-md px-2 shadow-md'>
			<span className='flex items-center gap-2 text-2xl font-semibold capitalize leading-tight text-primary md:text-3xl'>
				Planning Head Office
			</span>
			<hr className='border-1 my-2 border-secondary-content' />
			<div className='mx-2 flex flex-col items-stretch justify-between md:flex-row'>
				<div className='flex flex-col gap-0.5 divide-y-2 divide-primary/20 md:divide-y-0'>
					<TitleValue title='Week' value={planningSNO?.week} />
					<TitleValue title='ID' value={planningSNO?.week_id} />
					<TitleValue
						title='Created By'
						value={planningSNO?.created_by_name}
					/>
					{/* <TitleValue
						title='Status'
						value={Number(planningSNO?.status) === 0 ? 'No' : 'Yes'}
					/>
					<TitleValue
						title='Approved'
						value={
							Number(planningSNO?.approved) === 0
								? 'Pending'
								: 'Approved'
						}
					/> */}
					<TitleValue title='Remarks' value={planningSNO?.remarks} />
				</div>
			</div>
		</div>
	);
}
