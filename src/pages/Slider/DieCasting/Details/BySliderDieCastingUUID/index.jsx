import ReactTable from "@/components/Table";
import { useFetchFunc } from "@/hooks";

import { DateTime } from "@/ui";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export default function Index() {
	const { slider_die_casting_uuid } = useParams();
	const [slider, setSlider] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		document.title = "Die Casting Details";
	}, []);

	useEffect(() => {
		useFetchFunc(
			`/slider/die-casting/production/by/${slider_die_casting_uuid}`,
			setSlider,
			setLoading,
			setError
		);
	}, [slider]);

	const columns = useMemo(
		() => [
			{
				accessorKey: "mc_no",
				header: "MC No",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "item_name_label",
				header: "Item Name",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "item_type",
				header: "Item Type",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "cavity_goods",
				header: "Cavity Goods",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "cavity_reject",
				header: "Cavity Reject",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "push_value",
				header: "Push",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "production_quantity",
				header: "PRODUCTION QTY (PCS)",
				enableColumnFilter: false,
				cell: (info) => {
					const { cavity_goods, push_value } = info.row.original;
					return (cavity_goods * push_value).toFixed(4);
				},
			},
			{
				accessorKey: "weight",
				header: "Weight (PCS/KG)",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "production_weight",
				header: "PRODUCTION WEIGHT (KG)",
				enableColumnFilter: false,
				cell: (info) => {
					const { cavity_goods, push_value, weight } =
						info.row.original;
					return ((cavity_goods * push_value) / weight).toFixed(4);
				},
			},
			{
				accessorKey: "remarks",
				header: "Remarks",
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: "created_at",
				header: "Created",
				filterFn: "isWithinRange",
				enableColumnFilter: false,
				width: "w-24",
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: "updated_at",
				header: "Updated",
				enableColumnFilter: false,
				width: "w-24",
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
		],
		[slider]
	);

	return (
		<ReactTable
			title="Details"
			data={slider}
			columns={columns}
			extraClass="py-2"
			showTitleOnly
		/>
	);
}
