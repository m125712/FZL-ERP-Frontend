import { PDF } from "@/assets/icons";
import { LinkWithCopy, StatusButton, TitleValue } from "@/ui";
import { format } from "date-fns";
import ItemDescription from "./Item";
import OrderDescription from "./Order";
import SliderDescription from "./Slider";

export default function SingleInformation({ order, idx, hasInitialOrder }) {
	console.log(order);
	
	return (
		<div className="my-2 flex flex-col rounded-md px-2 shadow-md">
			<span className="flex items-center gap-2 text-2xl font-semibold capitalize leading-tight text-primary md:text-3xl">
				Information {idx !== undefined && `#${idx + 1}`}
				<StatusButton
					size="btn-xs md:btn-sm"
					value={order?.swatch_approval_status}
				/>
			</span>
			<hr className="border-1 border-secondary-content" />

			{hasInitialOrder ? (
				<div className="flex flex-col items-baseline justify-between text-sm md:flex-row">
					<ItemDescription order_description={order} />
					<hr className="divider divider-primary divider-vertical md:divider-horizontal" />
					<SliderDescription order_description={order} />
				</div>
			) : (
				<div className="flex flex-col items-baseline justify-between text-sm md:flex-row">
					<OrderDescription order={order} />
					<hr className="divider divider-primary divider-vertical md:divider-horizontal" />
					<ItemDescription order_description={order} />
					<hr className="divider divider-primary divider-vertical md:divider-horizontal" />
					<SliderDescription order_description={order} />
				</div>
			)}
		</div>
	);
}

const renderCashOrLC = (is_cash, is_sample, is_bill) => {
	let value = is_cash == 1 ? "Cash" : "LC";
	let sample_bill = [];

	if (is_sample === 1) sample_bill.push("Sample");
	if (is_bill === 1) sample_bill.push("Bill");

	if (sample_bill.length > 0) value += ` (${sample_bill.join(", ")})`;

	return <TitleValue title="Cash / LC" value={value} />;
};

export function OrderInformation({ order, handelPdfDownload }) {
	return (
		<div className="m-2 flex flex-col justify-between rounded-md bg-white px-2 shadow-md md:m-4">
			<span className="flex items-center gap-2 text-2xl font-semibold capitalize leading-tight text-primary md:text-3xl">
				Order
				<button
					type="button"
					className="btn btn-primary btn-sm rounded-badge"
					onClick={handelPdfDownload}
				>
					<PDF className="w-4" /> PDF
				</button>
			</span>
			<hr className="border-1 border-secondary-content" />
			<div className="flex">
				<div className="flex flex-col">
					<TitleValue title="O/N" value={order?.order_number} />
					<TitleValue
						title="Ref. O/N"
						value={
							order?.reference_order && (
								<LinkWithCopy
									title={order?.reference_order}
									id={order?.reference_order}
									uri="/order/details"
								/>
							)
						}
					/>
					{renderCashOrLC(
						order?.is_cash,
						order?.is_sample,
						order?.is_bill
					)}
				</div>
				<div className="flex flex-col">
					<TitleValue
						title="Marketing"
						value={order?.marketing_name}
					/>
					<TitleValue title="Buyer" value={order?.buyer_name} />
				</div>
				<div className="flex flex-col">
					<TitleValue title="Party" value={order?.party_name} />
					<TitleValue
						title="Merch."
						value={order?.merchandiser_name}
					/>
				</div>
				<div className="flex flex-col">
					<TitleValue title="Factory" value={order?.factory_name} />
					<TitleValue
						title="Factory Address"
						value={order?.factory_address}
					/>
				</div>
				<div className="flex flex-col">
					<TitleValue
						title="Priority (Mark / Fact)"
						value={
							(order?.marketing_priority || "-") +
							" / " +
							(order?.factory_priority || "-")
						}
					/>
					<TitleValue title="Created By" value={order?.user_name} />
					<TitleValue
						title="Date"
						value={format(
							new Date(order?.created_at),
							"dd/MM/yyyy"
						)}
					/>
				</div>
			</div>
		</div>
	);
}
