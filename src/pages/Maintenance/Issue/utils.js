export const sections = [
	{
		value: 'tape_loom_section',
		label: 'টেপ লুম',
		new: ['tape_loom'],
	},
	{
		value: 'dyeing',
		label: 'ডাইং',
		new: ['dyeing'],
	},
	{
		value: 'metal_moulding_section',
		label: 'মেটাল মোল্ডিং',
		new: ['metal'],
	},
	{
		value: 'vislon_teeth_moulding',
		label: 'ভিসলন টিথ মোল্ডিং',
		new: ['vislon'],
	},
	{
		value: 'metal_vislon_nylon',
		label: 'মেটাল + ভিসলন + নাইলন',
		new: ['vislon', 'metal', 'nylon'],
	},
	{
		value: 'coil_forming_section',
		label: 'কয়েল ফরমিং',
		new: ['coil_forming'],
	},
	{
		value: 'slider_assembly_section',
		label: 'স্লাইডার অ্যাসেম্বলি',
		new: ['slider'],
	},
	{
		value: 'electroplating_section',
		label: 'ইলেক্ট্রোপ্লেটিং',
		new: ['slider'],
	},
	{
		value: 'slider_painting',
		label: 'স্লাইডার পেইন্টিং',
		new: ['slider'],
	},
	{
		value: 'sewing_thread',
		label: 'সুইং থ্রেড',
		new: ['sewing_thread'],
	},
	{
		value: 'vislon_open_section',
		label: 'ভিসলন ওপেন',
		new: ['vislon'],
	},
	{
		value: 'vislon_injection_section',
		label: 'ভিসলন ইঞ্জেকশন',
		new: ['vislon'],
	},
	{
		value: 'vislon_finishing_section',
		label: 'ভিসলন ফিনিশিং',
		new: ['vislon'],
	},
	{
		value: 'soft_coning_section',
		label: 'সফট কোনিং',
		new: ['sewing_thread'],
	},
	{
		value: 'all_utility',
		label: 'অল ইউটিলিটি',
		new: ['all_utility'],
	},
	{
		value: 'die_casting_section',
		label: 'ডাই কাস্টিং',
		new: ['dyeing'],
	},
	{
		value: 'metal_finishing_section',
		label: 'মেটাল ফিনিশিং',
		new: ['metal'],
	},
	{
		value: 'metal_teeth_color_section',
		label: 'মেটাল টিথ কালার',
		new: ['metal'],
	},
	{
		value: 'nylon_finishing_section',
		label: 'নাইলন ফিনিশিং',
		new: ['nylon'],
	},
	{
		value: 'painting',
		label: 'পেইন্টিং',
		new: ['slider'],
	},
];

export const extraSectionOptions = [
	{ value: 'normal', label: 'Normal' },
	{ value: 'utility', label: 'Utility' },
	{ value: 'others', label: 'Others' },
];

export const types = [
	{ value: 'machine', label: 'Machine' },
	{ value: 'others', label: 'Others' },
];

export const emergenceOptions = [
	{
		value: 'প্রোডাকশন লাইন বন্ধ হয়ে গেছে',
		label: 'প্রোডাকশন লাইন বন্ধ হয়ে গেছে',
	},
	{ value: 'ফ্লোর থেমে আছে', label: 'ফ্লোর থেমে আছে' },
	{ value: 'প্রোডাকশন স্লো হয়ে গেছে', label: 'প্রোডাকশন স্লো হয়ে গেছে' },
	{ value: 'যেকোন সময় লাগতে পারে।', label: 'যেকোন সময় লাগতে পারে।' },
];

export const partsDyeing = [
	{ value: 'thread', label: 'থ্রেড' },
	{ value: 'zipper', label: 'জিপার' },
];

export const machineVislon = [
	{ value: 'teeth_molding', label: 'টিথ মোল্ডিং' },
	{ value: 'box_pin', label: 'বক্স পিন' },
	{ value: 'iron', label: 'আইরন' },
	{ value: 'assembly', label: 'এসেম্বলি' },
	{ value: 'finishing', label: 'ফিনিশিং' },
];

// metal_moulding_section
export const partsMetal = [
	{ value: 'teeth_molding', label: 'টিথ মোল্ডিং' },
	{ value: 'teeth_coloring', label: 'টিথ কালারিং' },
	{ value: 'iron', label: 'আইরন' },
	{ value: 'finishing', label: 'ফিনিশিং' },
];

export const partsSlider = [
	{ value: 'die_casting', label: 'ডাই কাস্টিং' },
	{ value: 'assembly', label: 'এসেম্বলি' },
	{ value: 'electro_plating', label: 'ইলেক্ট্রো- প্লেটিং' },
	{ value: 'painting', label: 'পেইন্টিং' },
];
