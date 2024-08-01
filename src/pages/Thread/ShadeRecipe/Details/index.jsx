import { useAccess, useFetchFunc } from "@/hooks";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import Information from "./Information";
import Table from "./Table";

export default function Index() {
	const { id, thread_shade_recipe_uuid } = useParams();
	const [shadeRecipe, setShadeRecipe] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		useFetchFunc(
			`/thread/shade-recipe/by/thread_shade_recipe_uuid/${thread_shade_recipe_uuid}`,
			setShadeRecipe,
			setLoading,
			setError
		);
	}, [thread_shade_recipe_uuid]);

	if (!shadeRecipe) return <Navigate to="/not-found" />;
	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;

	return (
		<div className="container mx-auto my-2 w-full space-y-2 px-2 md:px-4">
			<Information shadeRecipe={shadeRecipe} />
			<Table {...shadeRecipe} />
		</div>
	);
}
