import { useAccess, useFetchFunc } from "@/hooks";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import Information from "./Information";
import Table from "./Table";

export default function Index() {
	const { purchase_description_uuid } = useParams();
	const [purchase, setPurchase] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const haveAccess = useAccess("store__receive_by_uuid");

	useEffect(() => {
		document.title = "Purchase Details";
	}, []);

	useEffect(() => {
		useFetchFunc(
			`/purchase-details/by/${purchase_description_uuid}`,
			setPurchase,
			setLoading,
			setError
		);
	}, [purchase_description_uuid]);

	if (!purchase) return <Navigate to="/not-found" />;
	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;

	return (
		<div className="container mx-auto my-2 w-full space-y-2 px-2 md:px-4">
			<Information purchase={purchase} />
			<Table {...purchase} />
		</div>
	);
}
