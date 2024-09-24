import { useFetch } from '@/hooks';

import { StatusButton, TitleValue } from '@/ui';

export default function Information({ recipe }) {
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

					<TitleValue
						title='Status'
						value={Number(recipe?.status) === 0 ? 'No' : 'Yes'}
					/>
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
