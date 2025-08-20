import React from 'react';

const VoucherDetailsTable = ({ data }) => {
	// Filter out UUID fields and unwanted fields
	const filterFields = (obj) => {
		if (typeof obj !== 'object' || obj === null) return obj;
		if (Array.isArray(obj)) {
			return obj.map((item) => filterFields(item));
		}
		const filtered = {};
		const excludeFields = [
			'uuid',
			'created_by',
			'updated_by',
			'created_by_name',
			'updated_by_name',
			'remarks',
			'created_at',
			'updated_at',
			'index',
			'is_need_cost_center',
			'is_payment',
			'_uuid',
		];
		for (const [key, value] of Object.entries(obj)) {
			if (!excludeFields.includes(key) && !key.endsWith('_uuid')) {
				filtered[key] = filterFields(value);
			}
		}
		return filtered;
	};

	const filteredData = filterFields(data);
	const entries = filteredData.voucher_entry || [];

	// Compute totals
	const totals = entries.reduce(
		(acc, entry) => {
			const amount = Number(entry.amount) || 0;
			if (entry.type === 'dr') acc.debit += amount;
			else if (entry.type === 'cr') acc.credit += amount;
			return acc;
		},
		{ debit: 0, credit: 0 }
	);

	// Render cost centers: only Amount column
	const renderCostCenterTable = (costCenters, parentType) => {
		if (!costCenters || costCenters.length === 0) return null;
		const isDebit = parentType === 'dr';
		return (
			<div className='mt-2'>
				<h4 className='mb-2 text-sm font-semibold text-gray-700'>
					Cost Centers
				</h4>
				<table className='min-w-full rounded border border-gray-300 bg-gray-50'>
					<thead className='bg-gray-100'>
						<tr>
							<th className='border-r border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700'>
								Cost Center Name
							</th>
							<th className='px-3 py-2 text-right text-xs font-medium text-gray-700'>
								Amount
							</th>
						</tr>
					</thead>
					<tbody>
						{costCenters.map((center, i) => (
							<tr key={i} className='border-t border-gray-200'>
								<td className='border-r border-gray-300 px-3 py-2 text-sm text-gray-800'>
									{center.cost_center_name || 'N/A'}
								</td>
								<td className='px-3 py-2 text-right text-sm text-gray-800'>
									{center.amount || 'N/A'}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	};

	// Render payments: only Credit column
	const renderPaymentTable = (payments, parentType) => {
		if (!payments || payments.length === 0) return null;
		return (
			<div className='mt-2'>
				<h4 className='mb-2 text-sm font-semibold text-gray-700'>
					Payments
				</h4>
				<table className='min-w-full rounded border border-gray-300 bg-gray-50'>
					<thead className='bg-gray-100'>
						<tr>
							<th className='border-r border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700'>
								Payment Type
							</th>
							<th className='border-r border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700'>
								Transaction No
							</th>
							<th className='border-r border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700'>
								Date
							</th>
							<th className='px-3 py-2 text-right text-xs font-medium text-gray-700'>
								Amount
							</th>
						</tr>
					</thead>
					<tbody>
						{payments.map((payment, i) => (
							<tr key={i} className='border-t border-gray-200'>
								<td className='border-r border-gray-300 px-3 py-2 text-sm text-gray-800'>
									{payment.payment_type || 'N/A'}
								</td>
								<td className='border-r border-gray-300 px-3 py-2 text-sm text-gray-800'>
									{payment.trx_no || 'N/A'}
								</td>
								<td className='border-r border-gray-300 px-3 py-2 text-sm text-gray-800'>
									{payment.date || 'N/A'}
								</td>
								<td className='px-3 py-2 text-right text-sm text-gray-800'>
									{payment.amount || 'N/A'}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	};

	if (!entries.length) {
		return (
			<div className='mx-auto max-w-6xl rounded-lg bg-white p-6 shadow-md'>
				<p className='text-center text-gray-500'>
					No voucher entries available
				</p>
			</div>
		);
	}

	return (
		<div className='min-h-screen w-full bg-gray-100'>
			<div className='mx-auto w-full overflow-hidden rounded-lg bg-white shadow-md'>
				<header className='bg-primary py-4 text-white'>
					<h1 className='mx-2 text-2xl font-semibold'>
						Voucher Entries
					</h1>
				</header>

				<div>
					<table className='min-w-full border border-gray-300'>
						<thead className='bg-gray-50'>
							<tr>
								<th className='border-r border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700'>
									Ledger Name
								</th>
								<th className='border-r border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700'>
									Description
								</th>
								<th className='border-r border-gray-300 px-4 py-3 text-right text-sm font-medium text-gray-700'>
									Debit
								</th>
								<th className='px-4 py-3 text-right text-sm font-medium text-gray-700'>
									Credit
								</th>
							</tr>
						</thead>
						<tbody>
							{entries.map((entry, idx) => {
								const {
									voucher_entry_cost_center,
									voucher_entry_payment,
									...fields
								} = entry;
								const hasCostCenter =
									voucher_entry_cost_center?.length > 0;
								const hasPayment =
									voucher_entry_payment?.length > 0;
								const isDebit = fields.type === 'dr';

								return (
									<React.Fragment key={idx}>
										<tr className='border-t border-gray-300 hover:bg-gray-50'>
											<td className='border-r border-gray-300 px-4 py-3 text-sm text-gray-800'>
												{fields.ledger_name || 'N/A'}
											</td>
											<td className='border-r border-gray-300 px-4 py-3 text-sm text-gray-800'>
												{fields.description || 'N/A'}
											</td>
											<td className='border-r border-gray-300 px-4 py-3 text-right text-sm font-medium text-gray-800'>
												{isDebit ? fields.amount : ''}
											</td>
											<td className='px-4 py-3 text-right text-sm font-medium text-gray-800'>
												{!isDebit ? fields.amount : ''}
											</td>
										</tr>
										{(hasCostCenter || hasPayment) && (
											<tr className='border-t border-gray-200'>
												<td
													colSpan='4'
													className='bg-gray-50 px-4 py-3'
												>
													<div className='space-y-4'>
														{renderCostCenterTable(
															voucher_entry_cost_center,
															fields.type
														)}
														{renderPaymentTable(
															voucher_entry_payment,
															fields.type
														)}
													</div>
												</td>
											</tr>
										)}
									</React.Fragment>
								);
							})}
						</tbody>
						<tfoot>
							<tr className='mx-2 h-10 border border-gray-300 bg-gray-100'>
								<td className={`font-bold`}>
									<span className='font-bold text-gray-700'>
										Narration
									</span>
								</td>
								<td></td>
								<td className={`text-right font-bold`}>
									{totals.debit.toFixed(2)}
								</td>
								<td className={`text-right font-bold`}>
									{totals.credit.toFixed(2)}
								</td>
								<td></td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		</div>
	);
};

export default VoucherDetailsTable;
