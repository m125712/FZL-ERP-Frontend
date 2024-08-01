import ReactTable from "@/components/Table";
import { useAccess, useFetchFunc } from "@/hooks";
import { DateTime, EditDelete, LinkWithCopy } from "@/ui";
import PageInfo from "@/util/PageInfo";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
	const navigate = useNavigate();
	const info = new PageInfo("PI", "pi", "commercial__pi");
	const haveAccess = useAccess("commercial__pi");
	const [pi, setPi] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		document.title = info.getTabName();
		useFetchFunc(info.getFetchUrl(), setPi, setLoading, setError);
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: "pi_id",
				header: "PI ID",
				enableColumnFilter: false,
				cell: (info) => (
					<LinkWithCopy
						title={info.getValue()}
						id={info.getValue()}
						uri={`details`}
					/>
				),
			},
			{
				accessorKey: "lc_number",
				header: "LC Number",
				enableColumnFilter: false,
				cell: (info) =>
					info.getValue() === "-" ? (
						info.getValue()
					) : (
						<LinkWithCopy
							title={info.getValue()}
							id={info.getValue()}
							uri={`/commercial/lc/details`}
						/>
					),
			},
			{
				accessorKey: "marketing_name",
				header: "Marketing",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "party_name",
				header: "Party",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "merchandiser_name",
				header: "Merchandiser",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "factory_name",
				header: "Factory",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "bank_name",
				header: "Bank",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "created_at",
				header: "Created At",
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: "updated_at",
				header: "Updated",
				enableColumnFilter: false,
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: "remarks",
				header: "Remarks",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "actions",
				header: "Actions",
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes("update"),
				width: "w-24",
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						showDelete={false}
					/>
				),
			},
		],
		[pi]
	);

	const handelAdd = () => navigate("/commercial/pi/entry");

	const handelUpdate = (idx) =>
		navigate(`/commercial/pi/update/${pi[idx].id}/${pi[idx].pi_uuid}`);

	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div className="container mx-auto px-2 md:px-4">
			<ReactTable
				title={info.getTitle()}
				data={pi}
				columns={columns}
				accessor={haveAccess.includes("create")}
				handelAdd={handelAdd}
				extraClass="py-2"
			/>
		</div>
	);
}
