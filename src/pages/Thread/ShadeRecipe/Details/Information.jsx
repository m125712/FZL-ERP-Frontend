import { TitleValue } from "@/ui";
import { useEffect } from "react";

export default function Information({ shadeRecipe }) {
	useEffect(() => {
		document.title = `Shade Recipe Details of ${shadeRecipe?.name}`;
	}, []);
	return (
		<div className="my-2 flex flex-col rounded-md px-2 shadow-md">
			<span className="flex items-center gap-2 text-2xl font-semibold capitalize leading-tight text-primary md:text-3xl">
				Information
			</span>
			<hr className="border-1 my-2 border-secondary-content" />
			<div className="mx-2 flex flex-col items-stretch justify-between md:flex-row">
				<div className="flex gap-0.5 divide-y-2 divide-primary/20 md:divide-y-0">
					<TitleValue title="Name" value={shadeRecipe?.name} />
					<TitleValue
						title="Sub Streat"
						value={shadeRecipe?.sub_streat}
					/>
					<TitleValue
						title="Lab Status"
						value={shadeRecipe?.lab_status}
					/>
					<TitleValue title="Remarks" value={shadeRecipe?.remarks} />
					<TitleValue
						title="Issued By"
						value={shadeRecipe?.issued_by_name}
					/>
				</div>
			</div>
		</div>
	);
}
