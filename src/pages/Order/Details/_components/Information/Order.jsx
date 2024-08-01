import { LinkWithCopy, TitleValue } from "@/ui";

const renderCashOrLC = (is_cash, is_sample, is_bill) => {
	let value = is_cash == 1 ? "Cash" : "LC";
	let sample_bill = [];

	if (is_sample === 1) sample_bill.push("Sample");
	if (is_bill === 1) sample_bill.push("Bill");

	if (sample_bill.length > 0) value += ` (${sample_bill.join(", ")})`;

	return <TitleValue title="Cash / LC" value={value} />;
};

export default function OrderDescription({ order }) {
	return (
		<div className="flex w-full flex-col md:w-auto md:flex-row">
			<div className="mr-2 flex flex-col gap-0.5 divide-y-2 divide-primary/20">
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
				<TitleValue title="Item" value={order?.item_description} />
				<TitleValue title="Marketing" value={order?.marketing_name} />
				<TitleValue
					title="Priority (Mark / Fact)"
					value={
						order?.marketing_priority +
						" / " +
						order?.factory_priority
					}
				/>
				<TitleValue title="Created By" value={order?.user_name} />
			</div>
			<div className="flex flex-col gap-0.5 divide-y-2 divide-primary/20 border-t-2 border-primary/20 md:border-t-0">
				<TitleValue title="Buyer" value={order?.buyer_name} />
				<TitleValue title="Party" value={order?.party_name} />
				<TitleValue title="Merch." value={order?.merchandiser_name} />
				<TitleValue title="Factory" value={order?.factory_name} />
				{renderCashOrLC(
					order?.is_cash,
					order?.is_sample,
					order?.is_bill
				)}
			</div>
		</div>
	);
}
