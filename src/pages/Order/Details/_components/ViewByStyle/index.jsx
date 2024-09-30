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
				});
			});
		});

		// Update state once after the loop
		setEntries(allEntries);
	}, [initial_orders]); // include `initial_orders` as a dependency

	const sliderQuantity = entrys?.reduce((sum, item) => {
		return sum + parseFloat(item.quantity);
	}, 0);

	const hasInitialOrder =
		Object.keys(initial_orders || []).length > 0 ? true : false;

	// console.log('initial_orders', initial_orders);
	// console.log('entrys', entrys);
	// console.log('sliderQuantity', sliderQuantity);

	return (
		<div>
			<Suspense>
				{initial_orders?.map((order, idx) => (
					<SingleInformation
						order={order}
						idx={idx}
						hasInitialOrder={hasInitialOrder}
					/>
				))}
			</Suspense>
			<Suspense>
				<Table order_entry={entrys} sliderQuantity={sliderQuantity} />
			</Suspense>
		</div>
	);
};

export default Index;
