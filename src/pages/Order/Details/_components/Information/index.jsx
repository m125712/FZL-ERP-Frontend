import { PDF } from '@/assets/icons';
import { LinkWithCopy, StatusButton, TitleValue } from '@/ui';
import { format } from 'date-fns';
import ItemDescription from './Item';
import OrderDescription from './Order';
import SliderDescription from './Slider';

export default function SingleInformation({ order, idx, hasInitialOrder }) {
	console.log(order);

	return (
		<div className='flex flex-col rounded-md shadow-md'>
			<span className='flex items-center gap-2 bg-secondary-content/5 px-4 py-3 text-2xl font-semibold capitalize leading-tight text-primary md:text-3xl'>
				Information {idx !== undefined && `#${idx + 1}`}
				<StatusButton
					size='btn-xs md:btn-sm'
					value={order?.swatch_approval_status}
				/>
			</span>
			<hr className='border-1 border-secondary-content' />

			{hasInitialOrder ? (
				<div className='flex flex-col items-baseline gap-8 bg-secondary-content/5 text-sm md:flex-row'>
					<div className='w-full flex-1'>
						<ItemDescription order_description={order} />
					</div>

					<div className='w-full flex-1'>
						<SliderDescription order_description={order} />
					</div>
				</div>
			) : (
				<div className='flex flex-col items-baseline px-4 py-2 text-sm md:flex-row'>
					<OrderDescription order={order} />
					<hr className='divider divider-primary divider-vertical md:divider-horizontal' />
					<ItemDescription order_description={order} />
					<hr className='divider divider-primary divider-vertical md:divider-horizontal' />
					<SliderDescription order_description={order} />
				</div>
			)}
		</div>
	);
}

const renderCashOrLC = (is_cash, is_sample, is_bill, is_only_value) => {
	let value = is_cash == 1 ? 'Cash' : 'LC';
	let sample_bill = [];

	if (is_sample === 1) sample_bill.push('Sample');
	if (is_bill === 1) sample_bill.push('Bill');

	if (sample_bill.length > 0) value += ` (${sample_bill.join(', ')})`;

	if (is_only_value) return value;

	return <TitleValue title='Cash / LC' value={value} />;
};

export function OrderInformation({ order, handelPdfDownload }) {
	const {
		order_number,
		reference_order,
		marketing_priority,
		factory_priority,
		user_name,
		created_at,
		marketing_name,
		buyer_name,
		party_name,
		merchandiser_name,
		factory_name,
		factory_address,
	} = order;
	const renderOrderDetails = () => {
		const items = [
			{
				title: 'O/N',
				value: order_number,
			},
			{
				title: 'Ref. O/N',
				value: reference_order && (
					<LinkWithCopy
						title={reference_order}
						id={reference_order}
						uri='/order/details'
					/>
				),
			},

			{
				title: 'Cash / LC',
				value: renderCashOrLC(
					order?.is_cash,
					order?.is_sample,
					order?.is_bill,
					true
				),
			},

			{
				title: 'Priority (Mark / Fact)',
				value:
					(marketing_priority || '-') +
					' / ' +
					(factory_priority || '-'),
			},

			{
				title: 'Created By',
				value: user_name,
			},

			{
				title: 'Created At',
				value: created_at && format(new Date(created_at), 'dd/MM/yyyy'),
			},
		];
		return items;
	};

	const renderOrderOtherDetails = () => {
		const items = [
			{
				title: 'Marketing',
				value: marketing_name,
			},
			{
				title: 'Buyer',
				value: buyer_name,
			},

			{
				title: 'Party',
				value: party_name,
			},

			{
				title: 'Merchandiser',
				value: merchandiser_name,
			},

			{
				title: 'Factory',
				value: factory_name,
			},

			{
				title: 'Factory Address',
				value: factory_address,
			},
		];
		return items;
	};

	return (
		<div className='container mx-auto my-8'>
			<div className='flex flex-col rounded-md bg-white shadow-md md:justify-between'>
				<span className='flex items-center gap-2 bg-secondary-content/5 px-4 py-3 text-2xl font-semibold capitalize leading-tight text-primary md:text-3xl'>
					Order
					<button
						type='button'
						className='btn btn-primary btn-sm rounded-badge'
						onClick={handelPdfDownload}>
						<PDF className='w-4' /> PDF
					</button>
				</span>
				<hr className='border-1 border-secondary-content' />
				<div className='flex flex-col gap-8 bg-secondary-content/5 text-sm md:flex-row'>
					<div className='w-full flex-1'>
						<div className='overflow-x-auto'>
							<table className='table table-sm'>
								<tbody>
									{renderOrderDetails().map((item, index) => (
										<tr
											key={index}
											className='odd:bg-secondary-content/5'>
											<th className='capitalize'>
												{item.title}
											</th>
											<td>{item.value || '--'}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					<div className='w-full flex-1'>
						<div className='overflow-x-auto'>
							<table className='table table-sm'>
								<tbody>
									{renderOrderOtherDetails().map(
										(item, index) => (
											<tr
												key={index}
												className='odd:bg-secondary-content/5'>
												<th className='capitalize'>
													{item.title}
												</th>
												<td>{item.value || '--'}</td>
											</tr>
										)
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
