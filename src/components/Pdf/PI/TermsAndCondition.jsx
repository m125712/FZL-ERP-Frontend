import { A4_PAGE_WIDTH, xMargin } from "../ui";

export const FooterTitleAndValue = (title, value) => [
	{
		text: `${title} `,
		bold: true,
	},
	{
		text: `${value || "-"}`,
	},
];

export const drawLine = ({
	endBefore = 0,
	width = 100,
	lineWidth = 1,
	lineColor = "black",
}) => {
	const res = A4_PAGE_WIDTH - xMargin - endBefore;
	return {
		canvas: [
			{
				type: "line",
				lineColor,
				x1: res - width,
				x2: res,
				y1: 0,
				y2: 0,
				lineWidth,
			},
		],
	};
};

export const TermsAndConditionForSIBL = (currentPage, pageCount, payment) => {
	return {
		widths: [55, "*"],
		body: [
			[
				{
					colSpan: 2,
					text: ["Terms & Conditions"],
					bold: true,
					decoration: "underline",
				},
				"",
			],
			FooterTitleAndValue(
				"Payment",
				`Irrevocable L/C at ${payment} days sight incorporating Export L/C no & date which will not be concerned to the openers export Realization`
			),
			FooterTitleAndValue(
				"Shipment",
				"Partial shipment allowed within 30 days from the opening date of L/C"
			),
			FooterTitleAndValue(
				"Negotiation",
				"Within 15 days from the date of shipment"
			),
			FooterTitleAndValue("Insurance", "Covered by the buyer"),
			FooterTitleAndValue(
				"Interest",
				"Interest will be paid by the opener for the usance period as per rate prescribed by the Bangladesh Bank, on advance for the export affairs"
			),
			FooterTitleAndValue(
				"Miscellaneous",
				"Interest for usance period at the prevailing on export rate bangladesh Bank at the time of payment by the opener"
			),
			FooterTitleAndValue(
				"Others",
				"L/C, UD copy and attested copy of Proforma Invoice by Bank & MAnaging Director have to be produced. L/C should be Transferable, Payment have to made in US($) at the date of maturity"
			),
			[
				drawLine({ x2: 0, width: 100 }),
				{
					text: "Authorized Signature",
					alignment: "right",
					margin: [16, 0],
				},
			],
			[
				{
					colSpan: 2,
					text: `Page ${currentPage} of ${pageCount}`,
					alignment: "center",
				},
				"",
			],
		],
	};
};
