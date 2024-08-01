import { useFetchFunc } from "@/hooks";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Information from "./Information";
import Table from "./Table";

export default function Index() {
	const { pi_id } = useParams();

	const [pi, setPi] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		document.title = `PI: ${pi_id}`;
		useFetchFunc(`/pi/details/by/${pi_id}`, setPi, setLoading, setError);
	}, [pi_id]);

	if (!pi) return <Navigate to="/not-found" />;
	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;

	return (
		<div className="container mx-auto my-2 w-full space-y-2 px-2 md:px-4">
			<Information pi={pi} />
			<Table pi={pi.pi_entry} />
		</div>
	);
}
