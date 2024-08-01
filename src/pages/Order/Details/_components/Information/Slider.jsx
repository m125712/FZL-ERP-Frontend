import { TitleValue } from "@/ui";

const renderLogo = (logo_type_name, is_logo_body, is_logo_puller) => {
	if (logo_type_name === "---")
		return <TitleValue title="Logo" value={logo_type_name} />;

	let logoLocations = [];

	if (is_logo_body === 1) logoLocations.push("Body");
	if (is_logo_puller === 1) logoLocations.push("Puller");

	if (logoLocations.length > 0) {
		logo_type_name += ` (${logoLocations.join(", ")})`;
	}

	return <TitleValue title="Logo" value={logo_type_name} />;
};

export default function SliderDescription({ order_description }) {
	return (
		<div className="flex w-full flex-col divide-y-2 divide-primary/20 md:w-auto">
			<TitleValue title="Slider" value={order_description?.slider_name} />

			<TitleValue
				title="Slider Provided"
				value={
					order_description?.is_slider_provided === 1 ? "Yes" : "No"
				}
			/>

			<TitleValue
				title="Starting Section"
				value={order_description?.slider_starting_section?.replace(
					/_/g,
					" "
				)}
			/>
			<TitleValue
				title="Top Stopper"
				value={order_description?.top_stopper_name}
			/>
			<TitleValue
				title="Bottom Stopper"
				value={order_description?.bottom_stopper_name}
			/>
			{renderLogo(
				order_description?.logo_type_name,
				order_description?.is_logo_body,
				order_description?.is_logo_puller
			)}
		</div>
	);
}
