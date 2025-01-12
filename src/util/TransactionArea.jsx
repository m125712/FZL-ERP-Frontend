const getTransactionArea = () => {
	return [
		{ label: 'Box Pin (Metal section)', value: 'box_pin_metal' }, // Metal Finishing
		{ label: 'Chemicals - Dyeing', value: 'chemicals_dyeing' }, // dyeing & ironing
		{ label: 'Chemicals:Coating', value: 'chemicals_coating' },
		{
			label: 'Coating Section:Epoxy Paint (Harmes)',
			value: 'coating_epoxy_paint_harmes',
		},
		{ label: 'Coil Forming/Sewing', value: 'coil_forming_sewing' }, // Tape preparation coil
		{
			label: 'Coil Forming/Sewing Forming',
			value: 'coil_forming_sewing_forming',
		}, // Tape preparation coil
		{ label: 'Die Casting Section', value: 'die_casting' }, // Slider diecasting
		{ label: 'Dyeing Section', value: 'dyeing' }, // dyeing and ironing
		{ label: 'Elastic Section', value: 'elastic' },
		{ label: 'Electroplating Section', value: 'electroplating' },
		{
			label: 'Gtz (india) Pvt. Ltd Electroplating Section',
			value: 'gtz_india_pvt_ltd_electroplating',
		},
		{
			label: 'Gtz (india) Pvt. Ltd Teeth Plating section',
			value: 'gtz_india_pvt_ltd_teeth_plating',
		},
		{ label: 'Invisible section', value: 'invisible' }, // nylon metalic finishing
		{ label: 'Metal Finishing Section', value: 'metal_finishing' }, // metal finishing
		{ label: 'Metal Section', value: 'metal' },
		{
			label: 'Metal Teeth Electroplating',
			value: 'metal_teeth_electroplating',
		}, // Metal teeth coloring
		{ label: 'Metal Teeth Molding Section', value: 'metal_teeth_molding' }, // metal teeth molding
		{ label: 'Metal Teeth Plating Section', value: 'metal_teeth_plating' }, // metal teeth coloring
		{ label: 'Nylon', value: 'nylon' },
		{ label: 'Nylon Finishing Section', value: 'nylon_finishing' }, // nylon metalic finishing
		{ label: 'Nylon Gapping', value: 'nylon_gapping' },
		{ label: 'Pigment Dye', value: 'pigment_dye' },
		{
			label: 'Qlq Enterprise Bangladesh Ltd :Chemical',
			value: 'qlq_enterprise_bangladesh_ltd_chemical',
		},
		{ label: 'Sewing Thread Finishing', value: 'sewing_thread_finishing' }, // thread conning
		{ label: 'Sewing Thread Section', value: 'sewing_thread' },
		{ label: 'Slider Assembly Section', value: 'slider_assembly' }, //* can not delete // slider assembly
		{
			label: 'Slider Coating Section /Epoxy Paint',
			value: 'slider_coating_epoxy_paint',
		}, // slider coloring
		{
			label: 'Slider Electroplating Section',
			value: 'slider_electroplating',
		}, // slider coloring
		{ label: 'Soft Winding', value: 'soft_winding' }, // dyeing and iron
		{ label: 'Tape Loom Section', value: 'tape_loom' }, // tape preparation tape
		{ label: 'Tape Making', value: 'tape_making' }, //* can not delete // tape preparation tape
		{ label: 'Thread Dying', value: 'thread_dying' }, // dyeing and ironing
		{ label: 'Vislon Finishing Section', value: 'vislon_finishing' }, // vislon finishing
		{ label: 'Vislon Gapping', value: 'vislon_gapping' }, // vislon finishing
		{ label: 'Vislon Injection', value: 'vislon_injection' }, // vislon finishing
		{
			label: 'Vislon Open Injection Section',
			value: 'vislon_open_injection',
		}, // vislon finishing
		{ label: 'Vislon Section', value: 'vislon' },
		{ label: 'Zipper Dying', value: 'zipper_dying' }, // dyeing and ironing
	];
};

export default getTransactionArea;

export const getTransactionAreaDyeing = [
	{ label: 'Zipper Dying', value: 'zipper_dying' }, // dyeing and ironing
	{ label: 'Thread Dying', value: 'thread_dying' }, // dyeing and ironing
	{ label: 'Soft Winding', value: 'soft_winding' }, // dyeing and iron
	{ label: 'Dyeing Section', value: 'dyeing' }, // dyeing and ironing
	{ label: 'Chemicals - Dyeing', value: 'chemicals_dyeing' }, // dyeing & ironing
];

export const getTransactionAreaVislonFinishing = [
	{
		label: 'Vislon Open Injection Section',
		value: 'vislon_open_injection',
	}, // vislon finishing
	{ label: 'Vislon Finishing Section', value: 'vislon_finishing' }, // vislon finishing
	{ label: 'Vislon Gapping', value: 'vislon_gapping' }, // vislon finishing
	{ label: 'Vislon Injection', value: 'vislon_injection' }, // vislon finishing
];

export const getTransferArea = [
	{ label: 'Nylon Plastic Finishing', value: 'nylon_plastic_finishing' },
	{ label: 'Nylon Metallic Finishing', value: 'nylon_metallic_finishing' },
	{ label: 'Vislon Teeth Molding', value: 'vislon_teeth_molding' },
	{ label: 'Metal Teeth Molding', value: 'metal_teeth_molding' },
];
