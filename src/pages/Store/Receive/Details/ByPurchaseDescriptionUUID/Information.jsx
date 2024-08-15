import { TitleValue } from '@/ui';

export default function Information({
	purchase = {
		uuid: null,
		vendor_name: null,
		lc_number: null,
		is_local: null,
	},
}) {
	return (
		<div className='my-2 flex flex-col rounded-md px-2 shadow-md'>
			<span className='flex items-center gap-2 text-2xl font-semibold capitalize leading-tight text-primary md:text-3xl'>
				Information
			</span>
			<hr className='border-1 my-2 border-secondary-content' />
			<div className='mx-2 flex flex-col items-stretch justify-between md:flex-row'>
				<div className='flex gap-0.5 divide-y-2 divide-primary/20 md:divide-y-0'>
					<TitleValue title='Invoice Number' value={purchase?.uuid} />
					<TitleValue title='Vendor' value={purchase?.vendor_name} />
					{purchase?.is_local == 0 ? (
						<TitleValue
							title='LC Number'
							value={purchase?.lc_number}
						/>
					) : (
						''
					)}
					<TitleValue
						title='LC/Local'
						value={purchase?.is_local == 1 ? 'Local' : 'LC'}
					/>
					<TitleValue title='Remarks' value={purchase?.remarks} />
				</div>
			</div>
		</div>
	);
}
