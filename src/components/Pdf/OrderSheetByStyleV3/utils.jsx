import { FZL_LOGO } from '@/assets/img/base64';
import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE } from '../ui';
import { company } from '../utils';

export const getPageHeader = (order_info, currentPage, pageCount) => {
	const order_number =
		order_info.is_sample === 1
			? order_info.order_number + ' (S)'
			: order_info.order_number;

	let formatedDate = '';
	if (order_info?.order_description_created_at) {
		formatedDate = format(
			new Date(order_info?.order_description_created_at),
			'dd-MM-yyyy'
		);
	} else if (order_info?.created_at) {
		formatedDate = format(new Date(order_info?.created_at), 'dd-MM-yyyy');
	}
	return [
		// CompanyAndORDER
		[
			{
				colSpan: 4,
				text: `Page ${currentPage} of ${pageCount}`,
				alignment: 'center',
				border: [false, false, false, false],
			},
			'',
			'',
			'',
		],
		[
			{
				image: FZL_LOGO.src,
				width: 70,
				height: 40,
				alignment: 'left',
			},
			{
				text: [
					`${company.address}\n`,
					`${company.email}\n`,
					`${company.phone}\n`,
					`${company.bin}, ${company.tax}\n`,
				],
				alignment: 'left',
				margin: [40, 0, 0, 0],
			},
			{
				colSpan: 2,
				text: [
					{
						text: 'Order Sheet\n',
						fontSize: DEFAULT_FONT_SIZE + 4,
						bold: true,
					},
					`O/N: ${order_number} ${order_info.revisions > 0 ? `Rev ${order_info.revisions}` : ''} \n`,
					`Date: ${formatedDate}\n`,
					`PI No.: ${order_info?.pi_numbers ? order_info?.pi_numbers.join(', ') : '---'}\n`,
				],
				alignment: 'right',
			},
			'',
		],
		[
			{ text: 'Party', bold: true },
			order_info.party_name,
			{ text: 'Buyer', bold: true },
			order_info.buyer_name,
		],

		[
			{ text: 'Factory', bold: true },
			order_info.factory_name,

			{ text: 'Marketing', bold: true },
			order_info.marketing_name,
		],
		[
			{ text: 'Address', bold: true },
			{ colSpan: 3, text: order_info.factory_address },
			'',
			'',
		],
	];
};

export const getPageFooter = ({ currentPage, pageCount }) => {
	return {
		widths: ['*', '*', '*'],
		body: [
			[
				{
					text: 'SNO',
					alignment: 'center',
					border: [false, true, false, false],
				},
				{
					text: '',
					alignment: 'center',
					border: [false, false, false, false],
				},
				{
					text: 'Managing Director',
					alignment: 'center',
					border: [false, true, false, false],
				},
			],
			[
				{
					colSpan: 3,
					text: `Page ${currentPage} of ${pageCount}`,
					alignment: 'center',
					border: [false, false, false, false],
				},
				'',
				'',
			],
		],
	};
};

export const TableHeader = (item, idx) => {
	return [
		[
			{
				text: item.style,
				style: 'tableHeader',
				colSpan: 5,
			},
			{},
			{},
			{},
			{},
		],
		[
			{ text: 'Details', style: 'tableHeader' },
			{ text: 'Color', style: 'tableHeader' },
			{ text: 'Size', style: 'tableHeader', alignment: 'right' },
			{ text: 'Unit', style: 'tableHeader' },
			{ text: 'Qty.', style: 'tableHeader', alignment: 'right' },
		],
	];
};

export const getSpecialReqInfo = (order_description, sr) => {
	if (order_description?.special_requirement) {
		const parsedObject =
			typeof order_description?.special_requirement === 'string'
				? JSON.parse(order_description?.special_requirement)
				: order_description?.special_requirement;

		const matchingLabels = sr
			?.filter((item) => parsedObject.values.includes(item.value)) // Filter by matching value
			.map((item) => item.label);
		return matchingLabels;
	} else {
		return [];
	}
};

export const getGarmentInfo = (order_description, garments) => {
	if (order_description?.garments_wash) {
		const parsedObject =
			typeof order_description?.garments_wash === 'string'
				? JSON.parse(order_description?.garments_wash)
				: order_description?.garments_wash;

		const matchingLabels = garments
			?.filter((item) => parsedObject.values.includes(item.value)) // Filter by matching value
			.map((item) => item.label);
		return matchingLabels;
	} else {
		return [];
	}
};

export const getInnerTable = (
	entry,
	special_req,
	garments_info,
	TotalDescQty
) => {
	var body = [];

	// Tape row
	body.push([
		{
			text: 'Tape: ' + entry.tape,
			border: [false, false, false, true], // Only bottom border
			margin: [0, 0, 0, 2], // Optional: adds spacing below the text
		},
	]);

	// Slider row
	body.push([
		{
			text: 'Slider: ' + entry.slider,
			border: [false, false, false, true],
			margin: [0, 0, 0, 2],
		},
	]);

	// Special Request row (if available)
	if (special_req && special_req.length > 0) {
		body.push([
			{
				text: 'Special Req: ' + special_req.join(', '),
				border: [false, false, false, true],
				margin: [0, 0, 0, 2],
			},
		]);
	}

	// Garments row (if available)
	if (garments_info && garments_info.length > 0) {
		body.push([
			{
				text: 'Garments: ' + garments_info.join(', '),
				border: [false, false, false, true],
				margin: [0, 0, 0, 2],
			},
		]);
	}

	// Description row (if available)
	if (entry.description) {
		body.push([
			{
				text: 'Description: ' + entry.description,
				border: [false, false, false, true],
				margin: [0, 0, 0, 2],
			},
		]);
	}

	// Remarks row (if available)
	if (entry.remarks) {
		body.push([
			{
				text: 'Remarks: ' + entry.remarks,
				border: [false, false, false, true],
				margin: [0, 0, 0, 2],
			},
		]);
	}

	// Total row
	body.push([
		{
			text: '(Total: ' + TotalDescQty + ')',
			alignment: 'left',
			border: [false, false, false, false],
			margin: [0, 0, 0, 2],
		},
	]);

	return body;
};
