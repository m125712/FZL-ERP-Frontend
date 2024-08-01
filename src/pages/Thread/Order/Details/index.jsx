import { useFetchFunc } from "@/hooks";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import Information from "./Information";
import Table from "./Table";

export default function Index() {
	const { thread_order_info_uuid } = useParams();
	const [orderInfo, setShadeRecipe] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		useFetchFunc(
			`/thread/order-info-entry/by/thread_order_info_uuid/${thread_order_info_uuid}`,
			setShadeRecipe,
			setLoading,
			setError
		);
	}, [thread_order_info_uuid]);

	if (!orderInfo) return <Navigate to="/not-found" />;
	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;

	return (
		<div className="container mx-auto my-2 w-full space-y-2 px-2 md:px-4">
			<Information orderInfo={orderInfo} />
			<Table {...orderInfo} />
		</div>
	);
}
