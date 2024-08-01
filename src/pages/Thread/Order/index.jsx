import ReactTable from "@/components/Table";
import { useAuth } from "@/context/auth";
import { useAccess, useFetchFunc } from "@/hooks";
import { DateTime, EditDelete, LinkWithCopy } from "@/ui";
import PageInfo from "@/util/PageInfo";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const haveAccess = useAccess("thread__order_info_details");
	const info = new PageInfo(
		"Order Info",
		"thread/order-info",
		"thread__order_info_details"
	);

	const [shadeRecipe, setShadeRecipe] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const columns = useMemo(
		() => [
			{
				accessorKey: "id",
				header: "ID",
				width: "w-12",
				cell: (info) => {
					const { id, thread_order_info_uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={thread_order_info_uuid}
							uri={`/thread/order-info/details/${id}`}
						/>
					);
				},
			},
			{
				accessorKey: "party_name",
				header: "Party",
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
				accessorKey: "merchandiser_name",
				header: "Merchandiser",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "buyer_name",
				header: "Buyer",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "is_sample",
				header: "Sample",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "is_bill",
				header: "Bill",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "delivery_date",
				header: "Delivery Date",
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: "issued_by_name",
				header: "Issued By",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "created_at",
				header: "Created",
				width: "w-20",
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: "updated_at",
				header: "Updated",
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: "remarks",
				header: "Remarks",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "action",
				header: "Action",
				enableColumnFilter: false,
				hidden: !haveAccess.includes("update"),
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							showDelete={false}
						/>
					);
				},
			},
		],
		[shadeRecipe]
	);

	// console.log(shadeRecipe);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
		useFetchFunc(info.getFetchUrl(), setShadeRecipe, setLoading, setError);
	}, []);

	// Add
	const handelAdd = () => navigate("/thread/order-info/entry");

	// Update
	const handelUpdate = (idx) => {
		const { thread_order_info_uuid, id } = shadeRecipe[idx];
		navigate(`/thread/order-info/update/${id}/${thread_order_info_uuid}`);
	};

	if (loading)
		return <span className="loading loading-dots loading-lg z-50" />;

	return (
		<div className="container mx-auto px-2 md:px-4">
			<ReactTable
				title={info.getTitle()}
				accessor={haveAccess.includes("create")}
				data={shadeRecipe}
				columns={columns}
				handelAdd={handelAdd}
				extraClass="py-2"
			/>
		</div>
	);
}
