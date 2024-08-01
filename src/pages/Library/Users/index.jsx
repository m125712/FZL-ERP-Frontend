import ReactTable from "@/components/Table";
import { useAccess, useFetchFunc } from "@/hooks";
import PageInfo from "@/util/PageInfo";
import { useEffect, useMemo, useState } from "react";

export default function Order() {
	const info = new PageInfo("Users", "user", "library__users");
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const columns = useMemo(
		() => [
			{
				accessorKey: "name",
				header: "Name",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "email",
				header: "Email",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "user_department",
				header: "Department",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "user_designation",
				header: "Designation",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "ext",
				header: "Ext",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "phone",
				header: "Phone",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[users]
	);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
		useFetchFunc(info.getFetchUrl(), setUsers, setLoading, setError);
	}, []);

	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className="container mx-auto px-2 sm:px-4">
			<ReactTable
				title={info.getTitle()}
				data={users}
				columns={columns}
				extraClass={"py-3"}
			/>
		</div>
	);
}
