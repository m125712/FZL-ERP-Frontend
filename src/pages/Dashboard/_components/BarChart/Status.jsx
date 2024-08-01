import { BarChart } from "@/components/Chart";
import { errorColor, getApproval, primaryColor } from "../../_utils";

export default function StatusBarChart() {
	const data = {
		labels: ["Nylon Metallic", "Nylon Plastic", "Vislon", "Metal"],
		datasets: [
			{
				label: "Not Approved",
				backgroundColor: errorColor,
				data: [
					{
						x: "Nylon Metallic",
						y: getApproval()?.nylon_metallic_not_approved,
					},
					{
						x: "Nylon Plastic",
						y: getApproval()?.nylon_plastic_not_approved,
					},
					{
						x: "Vislon",
						y: getApproval()?.vislon__not_approved,
					},
					{ x: "Metal", y: getApproval()?.metal__not_approved },
				],
			},
			{
				label: "Approved",
				backgroundColor: primaryColor,
				data: [
					{
						x: "Nylon Metallic",
						y: getApproval()?.nylon_metallic_approved,
					},
					{
						x: "Nylon Plastic",
						y: getApproval()?.nylon_plastic_approved,
					},
					{ x: "Vislon", y: getApproval()?.vislon__approved },
					{ x: "Metal", y: getApproval()?.metal__approved },
				],
			},
		],
	};

	return <BarChart title="Status" data={data} />;
}
