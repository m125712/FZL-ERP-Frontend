import { DEFAULT_FONT_SIZE, TitleAndValue } from '../ui';

export const company = {
	name: 'Fortune Zipper LTD.',
	address: 'Aukpara, Ashulia, Savar, DHK-1340',
	contact: 'Email: info@fortunezip.com, Phone: 01521533595',
	bin_tax_hscode:
		'BIN: 000537296-0403, VAT: 17141000815, HS-CODE: 9607.11.00',
};

export const getPageHeader = (challan_info) => {
	return [
		// CompanyAndChallanInfo
		[
			{
				colSpan: 2,
				text: [
					{
						text: `${company.name}\n`,
						fontSize: DEFAULT_FONT_SIZE + 4,
						bold: true,
					},
					`${company.address}\n`,
					`${company.contact}\n`,
					`${company.bin_tax_hscode}\n`,
				],
				alignment: 'left',
				fontSize: DEFAULT_FONT_SIZE - 1,
			},
			'',
			{
				colSpan: 2,
				text: [
					{
						text: 'Delivery Challan\n',
						fontSize: DEFAULT_FONT_SIZE + 4,
						bold: true,
					},
					`C/N: ${challan_info.challan_number}\n`,
					`O/N: ${challan_info.order_number}\n`,
					`Date: ${challan_info.date}`,
				],
				alignment: 'right',
			},
			'',
		],
		[
			{ text: 'Party', bold: true },
			challan_info.party_name,
			{ text: 'Marketing', bold: true },
			challan_info.marketing_name,
		],
		[
			{ text: 'Factory', bold: true },
			challan_info.factory_name,
			{ text: 'Merchandiser', bold: true },
			challan_info.merchandiser_name,
		],
		[
			{ text: 'Address', bold: true },
			challan_info.factory_address,
			{ text: 'Buyer', bold: true },
			challan_info.buyer_name,
		],
	];
};

export const getPageFooter = ({ currentPage, pageCount }) => {
	return {
		widths: ['*', '*', '*', '*', '*'],
		body: [
			[
				{
					text: 'Prepared By',
					alignment: 'center',
					border: [false, true, false, false],
				},
				{
					text: '',
					alignment: 'center',
					border: [false, false, false, false],
				},
				{
					text: 'Checked By',
					alignment: 'center',
					border: [false, true, false, false],
				},
				{
					text: '',
					alignment: 'center',
					border: [false, false, false, false],
				},
				{
					text: 'FZL Signature',
					alignment: 'center',
					border: [false, true, false, false],
				},
			],
			[
				{
					colSpan: 5,
					text: `Page ${currentPage} of ${pageCount}`,
					alignment: 'center',
					border: [false, false, false, false],
				},
				'',
				'',
				'',
				'',
			],
		],
	};
};

export const TableHeader = () => {
	return [
		[
			{
				text: 'Item Description',
				style: 'tableHeader',
			},
			{
				text: 'Style',
				style: 'tableHeader',
			},
			{
				text: 'Color',
				style: 'tableHeader',
			},
			{
				text: 'Size(CM)',
				style: 'tableHeader',
				alignment: 'right',
			},
			{
				text: 'Quantity(PCS)',
				style: 'tableHeader',
				alignment: 'right',
			},
		],
	];
};

export const TableFooter = ({
	carton_quantity,
	total_unique_colors,
	total_delivery_quantity,
}) => [
	{
		colSpan: 2,
		text: `Carton QTY: ${carton_quantity}`,
		style: 'tableFooter',
	},
	'',
	{
		text: `Total Color: ${total_unique_colors}`,
		style: 'tableFooter',
	},
	{
		colSpan: 2,
		text: `Total ${total_delivery_quantity}`,
		style: 'tableFooter',
		alignment: 'right',
	},
	'',
];
