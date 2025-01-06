import { LinkWithCopy, TitleValue } from '@/ui';
import RenderTable from '@/ui/Others/Table/RenderTable';

const renderCashOrLC = (is_cash, is_sample, is_bill, is_only_value) => {
	let value = is_cash == 1 ? 'Cash' : 'LC';
	let sample_bill = [];

	if (is_sample === 1) sample_bill.push('Sample');
	if (is_bill === 1) sample_bill.push('Bill');

	if (sample_bill.length > 0) value += ` (${sample_bill.join(', ')})`;

	if (is_only_value) return value;

	return <TitleValue title='Cash / LC' value={value} />;
};

export default function OrderDescription({ order }) {
	const renderItems = () => {
		const {
			order_number,
			reference_order,
			item_description,
			marketing_name,
			marketing_priority,
			factory_priority,
			user_name,
			buyer_name,
			party_name,
			merchandiser_name,
			factory_name,
			is_cash,
			is_sample,
			is_bill,
		} = order;

		const order_details = [
			{
				label: 'O/N',
				value: order_number,
			},
			{
				label: 'Ref. O/N',
				value: reference_order && (
					<LinkWithCopy
						title={reference_order}
						id={reference_order}
						uri='/order/details'
					/>
				),
			},

			{
				label: 'Item',
				value: item_description,
			},
			{
				label: 'Marketing',
				value: marketing_name,
			},

			{
				label: 'Priority (Mark / Fact)',
				value: marketing_priority + ' / ' + factory_priority,
			},
			{
				label: 'Created By',
				value: user_name,
			},
		];

		const buyer_details = [
			{
				label: 'Buyer',
				value: buyer_name,
			},

			{
				label: 'Party',
				value: party_name,
			},

			{
				label: 'Merchandiser.',
				value: merchandiser_name,
			},
			{
				label: 'Factory',
				value: factory_name,
			},

			{
				label: 'Cash / LC',
				value: renderCashOrLC(is_cash, is_sample, is_bill, true),
			},
		];

		return {
			order_details,
			buyer_details,
		};
	};

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 md:gap-8'>
			<RenderTable
				className={
					'border-b border-r-0 border-secondary/30 md:border-r'
				}
				title={'Order Details'}
				items={renderItems().order_details}
			/>

			<RenderTable
				className={
					'border-b border-l-0 border-secondary/30 md:border-l'
				}
				title={'Buyer Details'}
				items={renderItems().buyer_details}
			/>
		</div>
	);
}
