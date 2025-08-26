import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { DateTime } from '@/ui';

export default function Information({ batch }) {
	const renderItems = () => {
		const basicInfo = [
			{
				label: 'Batch ID',
				value: batch?.batch_id,
			},
			{
				label: 'Machine',
				value: batch?.machine_name,
			},

			{
				label: 'Slot',
				value: batch?.slot,
			},
			{
				label: 'Status',
				value:
					batch?.batch_status === 'pending' ? (
						<span className='badge badge-warning badge-sm h-5 capitalize'>
							{batch?.batch_status}
						</span>
					) : batch?.batch_status === 'completed' ? (
						<span className='badge badge-success badge-sm h-5 capitalize'>
							{batch?.batch_status}
						</span>
					) : (
						<span className='badge badge-error badge-sm h-5 capitalize'>
							{batch?.batch_status}
						</span>
					),
			},
			{
				label: 'Production Date',
				value: (
					<DateTime date={batch?.production_date} isTime={false} />
				),
			},
			{
				label: 'Yarn Issued',
				value: (
					<div className='flex gap-1'>
						<span>{batch?.yarn_issued}</span>
						(
						<DateTime
							date={batch?.yarn_issued_date}
							isTime={false}
						/>
						)
					</div>
				),
			},
		];

		const created_details = [
			{
				label: 'Created By',
				value: batch?.created_by_name,
			},
			{
				label: 'Created At',
				value: <DateTime date={batch?.created_at} isTime={false} />,
			},
			{
				label: 'Updated At',
				value: <DateTime date={batch?.updated_at} isTime={false} />,
			},
			{
				label: 'Remarks',
				value: batch?.remarks,
			},
		];

		return { basicInfo, created_details };
	};

	return (
		<SectionContainer title={'Planning Batch'}>
			<div className='grid lg:grid-cols-2'>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title='Basic Info'
					items={renderItems().basicInfo}
				/>
				<RenderTable
					title='Created Details'
					items={renderItems().created_details}
				/>
			</div>
		</SectionContainer>
	);
	// return (
	// 	<div className='my-2 flex flex-col rounded-md px-2 shadow-md'>
	// 		<span className='flex items-center gap-2 text-2xl font-semibold capitalize leading-tight text-primary md:text-3xl'>
	// 			Planning Batch
	// 		</span>
	// 		<hr className='border-1 my-2 border-secondary-content' />
	// 		<div className='mx-2 flex flex-col items-stretch justify-between md:flex-row'>
	// 			<div className='flex flex-col gap-0.5 divide-y-2 divide-primary/20 md:divide-y-0'>
	// 				<TitleValue title='ID' value={batch?.batch_id} />
	// 				<TitleValue title='Machine' value={batch?.machine_name} />
	// 				<TitleValue
	// 					title='Slot'
	// 					value={batch?.slot === 0 ? '-' : 'Slot ' + batch?.slot}
	// 				/>
	// 				<TitleValue
	// 					title='Production Date'
	// 					value={<DateTime date={batch?.production_date} />}
	// 				/>
	// 				<TitleValue
	// 					title='Created By'
	// 					value={batch?.created_by_name}
	// 				/>
	// 				{/* <TitleValue
	// 					title='Status'
	// 					value={Number(batch?.status) === 0 ? 'No' : 'Yes'}
	// 				/>
	// 				<TitleValue
	// 					title='Approved'
	// 					value={
	// 						Number(batch?.approved) === 0
	// 							? 'Pending'
	// 							: 'Approved'
	// 					}
	// 				/> */}
	// 				<TitleValue title='Status' value={batch?.batch_status} />
	// 				<TitleValue title='Remarks' value={batch?.remarks} />
	// 			</div>
	// 		</div>
	// 	</div>
	// );
}
