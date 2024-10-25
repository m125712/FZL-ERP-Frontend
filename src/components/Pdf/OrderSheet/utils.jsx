import { FZL_LOGO } from '@/assets/img/base64';
import { format } from 'date-fns';

import { DEFAULT_FONT_SIZE } from '../ui';

export const company = {
	name: 'Fortune Zipper LTD.',
	address: 'Aukpara, Ashulia, Savar, DHK-1340',
	contact: 'Email: info@fortunezip.com,\n Phone: 01521533595',
	bin_tax_hscode: 'BIN: 000537296-0403, VAT: 17141000815',
};

const renderCashOrLC = (is_cash, is_sample, is_bill, is_only_value) => {
	let value = is_cash == 1 ? 'Cash' : 'LC';
	let sample_bill = [];

	if (is_sample === 1) sample_bill.push('Sample');
	if (is_bill === 1) sample_bill.push('Bill');

	if (sample_bill.length > 0) value += ` (${sample_bill.join(', ')})`;

	if (is_only_value) return value;

	return value;
};

export const getPageHeader = (order_info) => {
	const order_number =
		order_info.is_sample === 1
			? order_info.order_number + ' (S)'
			: order_info.order_number;

	// const lc_or_cash =
	// 	order_info.is_cash === 1
	// 		? `Cash${order_info?.is_bill === 1 && ' (Bill)'}`
	// 		: 'LC';

	const lc_or_cash = renderCashOrLC(
		order_info.is_cash,
		order_info.is_sample,
		order_info.is_bill,
		true
	);
	return [
		// CompanyAndORDER
		[
			{
				image: FZL_LOGO.src,
				width: 70,
				height: 40,
				alignment: 'left',
			},
			{
				text: [`${company.address}\n`, `${company.contact}\n`],
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
					`O/N: ${order_number}\n`,
					`Date: ${order_info?.created_at ? format(new Date(order_info?.created_at), 'dd-MM-yyyy') : ''}\n`,
					`PI No.: ${order_info?.pi_numbers ? order_info?.pi_numbers.join(', ') : '---'}\n`,
				],
				alignment: 'right',
			},
			'',
		],
		[
			{ text: 'LC/Cash', bold: true },
			lc_or_cash,
			{ text: 'Buyer', bold: true },
			order_info.buyer_name,
		],
		[
			{ text: 'Party', bold: true },
			order_info.party_name,
			{ text: 'Marketing', bold: true },
			order_info.marketing_name,
		],

		[
			{ text: 'Factory', bold: true },
			order_info.factory_name,
			{ text: 'Priority', bold: true },
			(order_info.marketing_priority || '-') +
				' / ' +
				(order_info.factory_priority || '-'),
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

const getItem = ({
	zipper_number_name,
	item_name,
	nylon_stopper_name,
	is_multi_color = 0,
}) => {
	let name = '#' + zipper_number_name + ' ';

	if (item_name === 'Nylon') {
		name += item_name + ' - ' + nylon_stopper_name;
	} else {
		name += item_name;
	}

	if (is_multi_color === 1) {
		name += ' (Multi Color)';
	}

	return name;
};

const getLogo = ({ logo_type_name, is_logo_body = 0, is_logo_puller = 0 }) => {
	let logo = `Logo: ${logo_type_name}`;

	if (is_logo_body === 1 && is_logo_puller === 1) {
		logo += ' (Body, Puller)';
	} else if (is_logo_body === 1) {
		logo += ' (Body)';
	} else if (is_logo_puller === 1) {
		logo += ' (Puller)';
	}

	return logo;
};

export const TableHeader = ({
	entry,
	uniqueSizes,
	column,
	special_req_info,
	i,
}) => {
	// "order_info_uuid": "ikoD2kn0onEp7Tg",
	//         "order_number": "Z24-0030",
	//         "order_description_uuid": "Q9u3VNyXh6VdQAz",
	//         "tape_received": 0,
	//         "tape_transferred": 0,
	//         "slider_finishing_stock": 0,
	//         "marketing_uuid": "nqVg8RF6B8O1grN",
	//         "marketing_name": "Abu Saeed",
	//         "buyer_uuid": "V419hTMe93NhfFT",
	//         "buyer_name": "MANGO",
	//         "merchandiser_uuid": "gT6AiJzQoo4hDz2",
	//         "merchandiser_name": "MIRZA MEHEDI",
	//         "factory_uuid": "dazGOUZCIl9Erj6",
	//         "factory_name": "Agami Apparels Ltd",
	//         "factory_address": "Kathgira, Nayapara, Ashulia, \nDhaka, Bangladesh",
	//         "party_uuid": "z12zPbU1UsBpnxK",
	//         "party_name": "DEKKO LEGACY GROUP",
	//         "created_by_uuid": "gvJJYFEowkvi7Vz",
	//         "created_by_name": "Tamanna",

	//         "order_status": 0,
	//         "created_at": "2024-10-24 14:48:08",
	//         "updated_at": null,
	//         "print_in": "portrait",
	//         "item_description": "M-4.5-CE-YG",
	//         "item": "7alneHz7d3zLZoZ",
	//         "item_name": "Metal",
	//         "item_short_name": "M",
	//         "nylon_stopper": null,
	//         "nylon_stopper_name": null,
	//         "nylon_stopper_short_name": null,
	//         "zipper_number": "6Vs8xVrvoEcfnWg",
	//         "zipper_number_name": "4.5",
	//         "zipper_number_short_name": "4.5",
	//         "end_type": "eE9nM0TDosBNqoT",
	//         "end_type_name": "Close End",
	//         "end_type_short_name": "CE",
	//         "puller_type": "Fh4j3mS5PpWSqpx",
	//         "puller_type_name": "YG Puller",
	//         "puller_type_short_name": "YG",
	//         "lock_type": "dXuYENebmB2FRWr",
	//         "lock_type_name": "Semi Lock",
	//         "lock_type_short_name": "SL",
	//         "teeth_color": "h3fvMiwrvPOXYXx",
	//         "teeth_color_name": "shiny silver",
	//         "teeth_color_short_name": "shiny silver",
	//         "puller_color": "h3fvMiwrvPOXYXx",
	//         "puller_color_name": "shiny silver",
	//         "puller_color_short_name": "shiny silver",
	//         "hand": null,
	//         "hand_name": null,
	//         "hand_short_name": null,
	//         "coloring_type": "uLZ5ivcFdciddYD",
	//         "coloring_type_name": "Electro-Plating",
	//         "coloring_type_short_name": "electro-plating",
	//         "is_slider_provided": 0,
	//         "slider": "fvxg0WfMXwahT3d",
	//         "slider_name": "---",
	//         "slider_short_name": "---",
	//         "slider_starting_section": "---",
	//         "top_stopper": "X7gplUffaaJoruI",
	//         "top_stopper_name": "---",
	//         "top_stopper_short_name": "---",
	//         "bottom_stopper": "ZccaXVoOg6jkBT3",
	//         "bottom_stopper_name": "H Bottom",
	//         "bottom_stopper_short_name": "HBottom",
	//         "logo_type": "dEVVEQQyuyH0chm",
	//         "logo_type_name": "FZL",
	//         "logo_type_short_name": "FZL",
	//         "is_logo_body": 1,
	//         "is_logo_puller": 0,
	//         "special_requirement": "{\"values\":[]}",
	//         "description": "",
	//         "order_description_status": 0,
	//         "order_description_created_at": "2024-10-24 14:48:08",
	//         "order_description_updated_at": "2024-10-24 15:47:07",
	//         "remarks": "",
	//         "slider_body_shape": null,
	//         "slider_body_shape_name": null,
	//         "slider_body_shape_short_name": null,
	//         "end_user": null,
	//         "end_user_name": null,
	//         "end_user_short_name": null,
	//         "garment": "",
	//         "light_preference": null,
	//         "light_preference_name": null,
	//         "light_preference_short_name": null,
	//         "garments_wash": "",
	//         "slider_link": null,
	//         "slider_link_name": null,
	//         "slider_link_short_name": null,
	//         "marketing_priority": "---",
	//         "factory_priority": "---",
	//         "garments_remarks": "",
	//         "stock_uuid": "j9WJZbhNHSMLZMX",
	//         "stock_order_quantity": 63000,
	//         "tape_coil_uuid": null,
	//         "tape_name": null,
	//         "teeth_type": "DRPT0U9JmYQXTL1",
	//         "teeth_type_name": "Y-Teeth",
	//         "teeth_type_short_name": "y_teeth",
	//         "is_inch": 0,
	//         "is_meter": 0,
	//         "is_cm": 1,
	//         "order_type": "full",
	//         "is_multi_color": 0,
	//         "top": 2,
	//         "bottom": 2,
	//         "raw_per_kg_meter": null,
	//         "dyed_per_kg_meter": null,

	const {
		item_name,
		nylon_stopper_name,
		end_type_name,
		hand_name,
		zipper_number_name,
		lock_type_name,
		teeth_color_name,
		teeth_type_name,
		puller_type_name,
		puller_color_name: slider_color_name,
		logo_type_name,
		top_stopper_name,
		bottom_stopper_name,

		// new
		coloring_type_name,
		slider_name: slider_material,
		slider_body_shape_name,
		slider_link_name,

		// short_name,
		item_short_name,
		zipper_number_short_name,
		end_type_short_name,
		lock_type_short_name,
		teeth_color_short_name,
		puller_type_short_name,
		puller_color_short_name: slider_color_short_name,
		logo_type_short_name,
		top_stopper_short_name,
		bottom_stopper_short_name,

		stopper_type_short_name,
		hand_short_name,
		coloring_type_short_name,

		// is logo
		is_logo_body,
		is_logo_puller,

		// unite size
		is_cm,
		is_meter,
		is_inch,
		is_multi_color,

		description,
	} = entry;

	console.log(entry.is_multi_color);

	let tape = [
		item_name
			? getItem({
					zipper_number_name,
					item_name,
					nylon_stopper_name,
					is_multi_color,
				})
			: '',
		end_type_name
			? end_type_name === 'Open End'
				? end_type_name + ' - ' + hand_name
				: end_type_name
			: '',
		lock_type_name,
		teeth_color_name
			? `Teeth: ${teeth_type_name ? teeth_type_name + ' - ' : ''} ${teeth_color_name} Color`
			: '',
	];
	let slider = [
		puller_type_name ? `${puller_type_name} Puller` : '',
		coloring_type_name,
		slider_color_name ? `Slider: ${slider_color_name}` : '',
		slider_material,
		slider_body_shape_name,
		slider_link_name,
		logo_type_name
			? getLogo({ logo_type_name, is_logo_body, is_logo_puller })
			: '',
		top_stopper_name ? `Top Stopper: ${top_stopper_name}` : '',
		bottom_stopper_name ? `Bottom Stopper: ${bottom_stopper_name}` : '',
	];

	return [
		[
			{
				text: `Tape #${i + 1}`,
				style: 'tableHeader',
				alignment: 'Center',
			},
			{
				colSpan: uniqueSizes.length + 2,
				text: [tape.filter(Boolean).join(' / ')],
				style: 'tableHeader',
			},
			...Array.from({ length: uniqueSizes.length + 1 }, () => ''),
		],
		[
			{
				text: `Slider #${i + 1}`,
				style: 'tableHeader',
				alignment: 'Center',
			},
			{
				colSpan: uniqueSizes.length + 2,
				text: [slider.filter(Boolean).join(' / ')],
				style: 'tableHeader',
			},
			...Array.from({ length: uniqueSizes.length + 1 }, () => ''),
		],
		...(special_req_info?.length > 0 || description
			? [
					[
						{
							text: `Others #${i + 1}`,
							style: 'tableHeader',
							alignment: 'Center',
						},
						{
							colSpan: uniqueSizes.length + 2,
							text: [
								special_req_info?.length > 0
									? `${special_req_info?.join(', ')}`
									: '',
								special_req_info?.length > 0 && description
									? ' / '
									: '',

								description ? `(${description})` : '',
							],
							style: 'tableHeader',
						},
						...Array.from(
							{ length: uniqueSizes.length + 1 },
							() => ''
						),
					],
				]
			: []),
		[
			{
				text: 'Style',
				style: 'tableFooter',
			},
			{
				text: 'Color / Size(CM)',
				style: 'tableFooter',
			},
			...uniqueSizes.map((size) => ({
				text: size
					? is_inch
						? Number(size * 2.54).toFixed(2)
						: is_meter
							? Number(size * 100).toFixed(2)
							: is_cm
								? size.toFixed(2)
								: size.toFixed(2)
					: '-',
				style: 'tableFooter',
				alignment: 'right',
			})),
			{
				text: 'Total',
				style: 'tableFooter',
				alignment: 'right',
			},
		],
	];
};

export const TableFooter = ({ total_quantity, total_value }) => [
	{
		colSpan: 3,
		text: `Total QTY: ${total_quantity}`,
		style: 'tableFooter',
		alignment: 'right',
	},
	'',
	'',
	{
		colSpan: 2,
		text: `US $${total_value}`,
		style: 'tableFooter',
		alignment: 'right',
	},
	'',
];

// * function to get similar garment_wash
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

// * function to get similar Special Requirement
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

// * function to calculate grand total
export const grandTotal = (total_entries) => {
	let total = 0;
	total_entries?.map((item) => {
		total += item.order_entry.reduce((acc, item) => {
			acc += item?.quantity;

			return acc;
		}, 0);
	});

	return total;
};

// * function to chunk array
export const chunkArray = (array, chunkSize) => {
	let chunks = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		let chunk = array.slice(i, i + chunkSize);

		// * here we are checking if the length of the chunk is less than the chunk size
		if (
			// i > 0 && // * 1st chunk length might be less than the chunk size so this condition is not required
			chunk.length < chunkSize
		)
			chunk = [...chunk, ...Array(chunkSize - chunk.length).fill(0)];

		chunks.push(chunk);
	}
	return chunks;
};
