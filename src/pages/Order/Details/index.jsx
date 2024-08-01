import ReactTable from "@/components/Table";
import { useAccess } from "@/hooks";
import { useOrderDetails } from "@/state/Order/details";
import { EditDelete, LinkWithCopy, StatusButton, UserName } from "@/ui";
import PageInfo from "@/util/PageInfo";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Progress = ({ value }) => {
	let cls = "progress-error tooltip-error";
	if (value >= 100) cls = "progress-success tooltip-success";
	else if (value >= 75) cls = "progress-primary tooltip-primary";
	else if (value >= 50) cls = "progress-info tooltip-info";
	else if (value >= 25) cls = "progress-warning tooltip-warning";

	return (
		<div className={`tooltip text-xs ${cls}`} data-tip={value + "%"}>
			<progress
				className={`progress w-20 ${cls}`}
				value={value}
				max="100"
			/>
		</div>
	);
};

export default function Index() {
	const { data, isLoading, isError } = useOrderDetails();
	const navigate = useNavigate();
	const info = new PageInfo(
		"Order/Details",
		"/order/details",
		"order__details"
	);
	const haveAccess = useAccess("order__details");

	const columns = useMemo(
		() => [
			{
				accessorKey: "order_number",
				header: "O/N",
				width: "w-12",
				cell: (info) => {
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={info.getValue()}
							uri="/order/details"
						/>
					);
				},
			},
			{
				accessorKey: "order_number_wise_rank",
				header: "Count",
				enableColumnFilter: false,
				width: "w-12",
				cell: (info) => {
					const { order_number_wise_count } = info.row.original;
					return `${info.getValue()} / ${order_number_wise_count}`;
				},
			},
			{
				accessorKey: "item_description",
				header: "Item Description",
				enableColumnFilter: false,
				cell: (info) => {
					const { order_description_uuid, order_number } =
						info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={order_description_uuid}
							uri={`/order/details/${order_number}`}
						/>
					);
				},
			},
			{
				accessorKey: "production_percentage",
				header: "Progress",
				enableColumnFilter: false,
				cell: (info) => <Progress value={info.getValue()} />,
			},
			{
				accessorKey: "marketing_name",
				header: "Marketing",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "buyer_name",
				header: "Buyer",
				width: "w-20",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "user_name",
				header: "Created By",
				enableColumnFilter: false,
				cell: (info) => {
					const { user_name, user_department } = info.row.original;
					return (
						<UserName
							name={user_name}
							department={user_department}
						/>
					);
				},
			},
			{
				accessorKey: "remarks",
				header: "Remarks",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "price_approval_status",
				header: "Status",
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<StatusButton size="btn-sm" value={info.getValue()} />
					);
				},
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
		[data]
	);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => navigate("/order/entry");

	// Update
	const handelUpdate = (idx) => {
		const { order_description_uuid, order_number } = data[idx];
		navigate(`/order/update/${order_number}/${order_description_uuid}`);
	};

	if (isLoading)
		return <span className="loading loading-dots loading-lg z-50" />;

	return (
		<div className="container mx-auto px-2 md:px-4">
			<ReactTable
				title={info.getTitle()}
				accessor={haveAccess.includes("create")}
				data={data}
				columns={columns}
				handelAdd={handelAdd}
				extraClass="py-2"
			/>
		</div>
	);
}
