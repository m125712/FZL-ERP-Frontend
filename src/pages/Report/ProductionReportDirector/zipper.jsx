import React, { useEffect } from 'react';
import { useProductionReport } from '@/state/Report';
import { useAccess } from '@/hooks';

import {  DynamicDeliveryField } from '@/ui';
import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, isLoading, url } = useProductionReport('director');
	const info = new PageInfo(
		'Production Report Director (Zipper)',
		url,
		'report__production_report_director'
	);

	const haveAccess = useAccess('report__production_report_director');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	function getItemDetails(data) {
		return data.map((item) => {
			const headers = [];
			const itemName = item.item_name;
			const descriptions = item.parties.flatMap((party) => {
				const parties_header = party.orders.flatMap((order) =>
					order.descriptions.map((description) => ({
						item_description: description.item_description,
						total_close_end_quantity:
							description.total_close_end_quantity,
						total_open_end_quantity:
							description.total_open_end_quantity,
						total_quantity: description.total_quantity,
					}))
				);

				headers.push({
					party_name: party.party_name,
					parties_header,
				});

				return parties_header;
			});
			return { itemName, descriptions, party: headers };
		});
	}

	const Type_header = getItemDetails(data);

	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';
	return (
		<>
			<DynamicDeliveryField
				title={`Production Report `}
				tableHead={
					<>
						{[
							'Type',
							'Party',
							'O/N',
							'Item',
							'C/E',
							'O/E',
							'Total',
						].map((item, index) => (
							<th
								key={index}
								scope='col'
								className='group cursor-pointer select-none whitespace-nowrap bg-secondary px-3 py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300'>
								{item}
							</th>
						))}
					</>
				}>
				{data.map((item, i) => (
					<React.Fragment key={i}>
						{item.parties.map((party, j) => (
							<React.Fragment key={j}>
								{party.orders.map((order, k) => (
									<React.Fragment key={k}>
										{order.descriptions.map((desc, l) => (
											<tr  key={l}>
												{/* Show Item Name only in the first row for each item */}
												{j === 0 &&
													k === 0 &&
													l === 0 && (
														<td
															className={`w-32 border-r ${rowClass}`}
															rowSpan={
																Type_header[i]
																	.descriptions
																	.length
															}>
															{item.item_name}
														</td>
													)}

												{/* Show Party Name only in the first row for each party */}
												{k === 0 && l === 0 && (
													<td
														className={`w-32 border-r ${rowClass}`}
														rowSpan={
															Type_header[i]
																.party[j]
																.parties_header
																.length
														}>
														{party.party_name}
													</td>
												)}

												{/* Show Order Number only in the first row for each order */}
												{l === 0 && (
													<td
														className={`w-32 border-r ${rowClass}`}
														rowSpan={
															order.descriptions
																.length
														}>
														{order.order_number}
													</td>
												)}

												{/* Render Item Description and Quantities */}
												<td
													className={`w-32 ${rowClass}`}>
													{desc.item_description}
												</td>
												<td
													className={`w-32 ${rowClass}`}>
													{
														desc.total_close_end_quantity
													}
												</td>
												<td
													className={`w-32 ${rowClass}`}>
													{
														desc.total_open_end_quantity
													}
												</td>
												<td
													className={`w-32 ${rowClass}`}>
													{desc.total_quantity}
												</td>
											</tr>
										))}
									</React.Fragment>
								))}
							</React.Fragment>
						))}
					</React.Fragment>
				))}
			</DynamicDeliveryField>
		</>
	);
}

