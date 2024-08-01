import { FZL_LOGO } from "@/assets/img/base64";
import { DEFAULT_FONT_SIZE, TitleAndValue } from "../ui";
import { company } from "../utils";
import { TermsAndConditionForSIBL } from "./TermsAndCondition";

export const getPageHeader = (pi_info) => {
	return [
		// CompanyAndPI
		[
			{
				image: FZL_LOGO,
				width: 90,
				height: 45,
			},
			{
				text: [
					`${company.address}\n`,
					`${company.email}\n`,
					`${company.phone}\n`,
					`${company.bin}\n`,
					`${company.tax}\n`,
				],
				alignment: "left",
				margin: [50, 0, 0, 0],
				fontSize: DEFAULT_FONT_SIZE - 1,
			},

			{
				colSpan: 2,
				text: [
					{
						text: "Proforma Invoice\n",
						fontSize: DEFAULT_FONT_SIZE + 4,
						bold: true,
					},
					`PI No: ${pi_info.pi_number}\n`,
					`Date: ${pi_info.date}`,
				],
				alignment: "right",
			},
			"",
		],
		[
			{ text: "Factory", bold: true },
			`: ${pi_info.factory_name}`,
			{ text: "Bank", bold: true },
			`: ${pi_info.bank_name}`,
		],
		[
			{ text: "Address", bold: true },
			`: ${pi_info.factory_address}`,
			{ text: "Address", bold: true },
			`: ${pi_info.bank_address}`,
		],
		[
			{ text: "Buyers", bold: true },
			`: ${pi_info.buyer_names}`,
			{ text: "SWIFT", bold: true },
			`: ${pi_info.bank_swift_code}`,
		],
		[
			{ text: "Attention", bold: true },
			`: ${pi_info.marketing_name}`,
			{ text: "Country of Origin", bold: true },
			": Bangladesh",
		],
	];
};

export const getPageFooter = ({
	currentPage,
	pageCount,
	payment,
	bank_name,
}) => {
	if (
		bank_name === "BRAC Bank" ||
		bank_name === "SIBL" ||
		bank_name === "Shahjalal Islami Bank PLC"
	) {
		return TermsAndConditionForSIBL(currentPage, pageCount, payment);
	}
};

export const TableHeader = ({ order_numbers, styles }) => [
	[
		{
			colSpan: 6,
			text: [
				...TitleAndValue("Order Numbers", order_numbers),
				...TitleAndValue("Styles", styles),
			],
		},
		"",
		"",
		"",
		"",
		"",
	],
	[
		{
			text: "Item",
			style: "tableHeader",
		},
		{
			text: "Specification",
			style: "tableHeader",
		},
		{
			text: "Size (CM)",
			style: "tableHeader",
			alignment: "right",
		},
		{
			text: "Quantity (PCS)",
			style: "tableHeader",
			alignment: "right",
		},
		{
			text: "Unit Price ($)",
			style: "tableHeader",
			alignment: "right",
		},
		{
			text: "Value ($)",
			style: "tableHeader",
			alignment: "right",
		},
	],
];

export const TableFooter = ({ total_quantity, total_value }) => [
	{
		colSpan: 4,
		text: `Total QTY: ${total_quantity}`,
		style: "tableFooter",
		alignment: "right",
	},
	"",
	"",
	"",
	{
		colSpan: 2,
		text: `US $${total_value}`,
		style: "tableFooter",
		alignment: "right",
	},
	"",
];
