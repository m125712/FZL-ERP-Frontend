import { useFetch } from "@/hooks";
import { TitleList, TitleValue } from "@/ui";

const getSpecialRequirement = (special_requirement) =>
	special_requirement
		?.replace(/[^\d,]/g, "")
		.split(",")
		.map((item) =>
			useFetch(
				`/order/details/special-requirement/${parseInt(item)}`
			).value?.map((item) => item.name)
		)
		.join(", ") + ", M/F";

export default function ItemDescription({ order_description }) {
	return (
		<div className="flex w-full flex-col md:w-auto md:flex-row">
			<div className="mr-2 flex flex-col gap-0.5 divide-y-2 divide-primary/20">
				<TitleValue title="item" value={order_description?.item_name} />
				<TitleValue
					title="zipper no"
					value={order_description?.zipper_number_name}
				/>
				<TitleValue
					title="end"
					value={order_description?.end_type_name}
				/>
				<TitleValue
					title="lock"
					value={order_description?.lock_type_name}
				/>
				<TitleValue
					title="stopper"
					value={order_description?.stopper_type_name}
				/>
				<TitleValue
					title="puller"
					value={order_description?.puller_type_name}
				/>
			</div>

			<div className="flex flex-col gap-0.5 divide-y-2 divide-primary/20 border-t-2 border-primary/20 md:border-t-0">
				<TitleValue
					title="teeth color"
					value={order_description?.teeth_color_name}
				/>
				<TitleValue
					title="puller color"
					value={order_description?.puller_color_name}
				/>
				<TitleValue
					title="special req"
					value={
						order_description?.special_requirement_name == null
							? "M/F"
							: order_description?.special_requirement_name +
								", M/F"
					}
				/>
				<TitleValue title="hand" value={order_description?.hand_name} />
				<TitleValue
					title="coloring"
					value={order_description?.coloring_type_name}
				/>
				<TitleValue
					title="description"
					value={order_description?.description}
				/>
				<TitleList title="remarks" value={order_description?.remarks} />
			</div>
		</div>
	);
}
