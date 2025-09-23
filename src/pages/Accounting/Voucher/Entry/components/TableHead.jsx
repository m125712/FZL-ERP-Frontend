import React from 'react';

export default function TableHead({ rowClass, watch, currencyOptions }) {
	return (
		<thead>
			<tr className='bg-secondary text-secondary-content'>
				<th className={`${rowClass} text-left font-semibold`}>No.</th>
				<th className={`${rowClass} text-left font-semibold`}>Type</th>
				<th className={`${rowClass} text-left font-semibold`}>
					Ledger
				</th>
				<th className={`${rowClass} text-left font-semibold`}>
					Txn No.
				</th>
				<th className={`${rowClass} text-left font-semibold`}>Date</th>
				<th className={`${rowClass} text-right font-semibold`}>
					Debit (
					{
						currencyOptions.find(
							(c) => c.value === watch('currency_uuid')
						)?.symbol
					}
					)
				</th>
				<th className={`${rowClass} text-right font-semibold`}>
					Credit (
					{
						currencyOptions.find(
							(c) => c.value === watch('currency_uuid')
						)?.symbol
					}
					)
				</th>
				<th className={`${rowClass} text-center font-semibold`}>
					Action
				</th>
			</tr>
		</thead>
	);
}
