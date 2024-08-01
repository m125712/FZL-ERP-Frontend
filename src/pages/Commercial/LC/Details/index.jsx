import { useFetchFunc } from "@/hooks";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Information from "./Information";
import Table from "./Table";

export default function Index() {
	const { lc_number } = useParams();
	const [lc, setLc] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		document.title = `LC: ${lc_number}`;
		useFetchFunc(
			`/lc/by/lc-number/${lc_number}`,
			setLc,
			setLoading,
			setError
		);
	}, [lc_number]);

	if (!lc) return <Navigate to="/not-found" />;
	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;

	return (
		<div className="container mx-auto my-2 w-full space-y-2 px-2 md:px-4">
			<Information lc={lc[0]} />
		</div>
	);
}
