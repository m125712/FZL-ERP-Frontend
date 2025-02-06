import { lazy, Suspense, useEffect, useState } from 'react';

const Table = lazy(() => import('./Table'));
const SingleInformation = lazy(() => import('../Information'));

const Index = ({ initial_orders }) => {
	const [entrys, setEntries] = useState([]);

	useEffect(() => {
		const allEntries = [];

		initial_orders?.forEach((order) => {
			order?.order_entry?.forEach((entry) => {
				allEntries.push({
					...entry,
					item_description: order?.item_description,
					item_name: order?.item_name,
					is_cm: order?.is_cm,
					is_inch: order?.is_inch,
					is_meter: order?.is_meter,
					is_sample: order?.is_sample,
					order_type: order?.order_type,
				});
			});
		});

		// Update state once after the loop
		setEntries(allEntries);
	}, [initial_orders]); // include `initial_orders` as a dependency

	const total = entrys.reduce(
		(totals, item) => {
			totals.Quantity += parseFloat(item.quantity) || 0;
			totals.piQuantity += parseFloat(item.total_pi_quantity) || 0;
			totals.deliveryQuantity +=
				parseFloat(item.total_delivery_quantity) || 0;
			totals.warehouseQuantity +=
				parseFloat(item.total_warehouse_quantity) || 0;
			totals.rejectQuantity +=
				parseFloat(item.total_reject_quantity) || 0;
			totals.shortQuantity += parseFloat(item.total_short_quantity) || 0;
			totals.tapeQuantity += parseFloat(item.dying_and_iron_prod) || 0;
			totals.sliderQuantity += parseFloat(item.coloring_prod) || 0;

			return totals;
		},
		{
			Quantity: 0,
			piQuantity: 0,
			deliveryQuantity: 0,
			warehouseQuantity: 0,
			rejectQuantity: 0,
			shortQuantity: 0,
			tapeQuantity: 0,
			sliderQuantity: 0,
		}
	);

	const hasInitialOrder =
		Object.keys(initial_orders || []).length > 0 ? true : false;

	return (
		<div>
			<Suspense>
				{initial_orders?.map((order, idx) => (
					<SingleInformation
						key={idx}
						order={order}
						idx={idx}
						hasInitialOrder={hasInitialOrder}
					/>
				))}
			</Suspense>
			<Suspense>
				<Table order_entry={entrys} total={total} />
			</Suspense>
		</div>
	);
};

export default Index;
