import { CustomLink } from '@/ui';

import { cn } from '@/lib/utils';

export default function QuantityCard({
	item_description_quantity,
	batch_numbers,
	production_capacity_quantity,
}) {
	if (!batch_numbers?.length) return '--';

	const totals = batch_numbers?.reduce(
		(acc, item) => ({
			batch_quantity: acc.batch_quantity + item.batch_quantity,
			production_quantity:
				acc.production_quantity + item.production_quantity,
			balance_quantity: acc.balance_quantity + item.balance_quantity,
		}),
		{ batch_quantity: 0, production_quantity: 0, balance_quantity: 0 }
	);

	const hasExceededDailyProduction =
		totals.batch_quantity > production_capacity_quantity;

	return (
		<table
			className={cn(
				'table table-xs rounded-md border-2 border-primary/20 align-top',
				hasExceededDailyProduction ? 'border-error/80' : ''
			)}
		>
			<thead>
				<tr>
					{/* <th>Item</th> */}
					<th>BA/N</th>
					<th>O/N</th>
					<th>BA/Q</th>
					<th>P/Q</th>
					<th>BL/Q</th>
				</tr>
			</thead>
			<tbody>
				{batch_numbers?.map((item, index) => (
					<tr key={index}>
						{/* <td>{item_description_quantity}</td> */}
						<td>
							<CustomLink
								label={item.batch_number}
								url={`/planning/finishing-batch/${item.batch_uuid}`}
								showCopyButton={false}
								openInNewTab
							/>
						</td>
						<td>
							<CustomLink
								label={item.order_number}
								url={`/order/details/${item.order_number}/${item.order_description_uuid}`}
								showCopyButton={false}
								openInNewTab
							/>
						</td>
						<td>{item.batch_quantity || 0}</td>
						<td>{item.production_quantity || 0}</td>
						<td>{item.balance_quantity || 0}</td>
					</tr>
				))}
				<tr>
					<td className='font-bold'>Total</td>
					<td></td>
					<td>{totals?.batch_quantity || 0}</td>
					<td>{totals?.production_quantity || 0}</td>
					<td>{totals?.balance_quantity || 0}</td>
				</tr>
			</tbody>
		</table>
	);
}
