import { useFetchFunc } from "@/hooks";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Information from "./Information";
import Table from "./Table";

export default function Index() {
	const { challan_number } = useParams();

	const [challan, setChallan] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		document.title = `Challan: ${challan_number}`;
		useFetchFunc(
			`/challan/details/by/${challan_number}`,
			setChallan,
			setLoading,
			setError
		);
	}, [challan_number]);

	if (!challan) return <Navigate to="/not-found" />;
	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;

	return (
		<div className="container mx-auto my-2 w-full space-y-2 px-2 md:px-4">
			<Information challan={challan} />
			<Table challan={challan.challan_entry} />
		</div>
	);
}
