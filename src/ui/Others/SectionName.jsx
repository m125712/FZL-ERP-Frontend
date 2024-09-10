export default function SectionName({ section }) {
	const { type, area } = res?.[section];
	return (
		<div className='flex flex-col gap-1'>
			<div className='badge badge-accent badge-sm'>{type}</div>
			<div className='badge badge-accent badge-sm'>{area}</div>
		</div>
	);
}

const res = {
	tape_making: {
		name: 'Tape Making',
		short_name: 'Tape Making',
		type: 'Common',
		area: 'Tape Making',
	},
	coil_forming: {
		name: 'Coil Forming',
		short_name: 'Coil Forming',
		type: 'Common',
		area: 'Coil Forming',
	},
	dying_and_iron: {
		name: 'Dying and Iron',
		short_name: 'Dying and Iron',
		type: 'Common',
		area: 'Dying and Iron',
	},
	m_gapping: {
		name: 'Metal Gapping',
		short_name: 'Metal Gapping',
		type: 'Metal',
		area: 'Gapping',
	},
	v_gapping: {
		name: 'Vislon Gapping',
		short_name: 'Vislon Gapping',
		type: 'Vislon',
		area: 'Gapping',
	},
	v_teeth_molding: {
		name: 'Vislon Teeth Molding',
		short_name: 'Vislon Teeth Molding',
		type: 'Vislon',
		area: 'Teeth Molding',
	},
	m_teeth_molding: {
		name: 'Metal Teeth Molding',
		short_name: 'Metal Teeth Molding',
		type: 'Metal',
		area: 'Teeth Molding',
	},
	teeth_assembling_and_polishing: {
		name: 'Teeth Assembling and Polishing',
		short_name: 'Teeth Assembling and Polishing',
		type: 'Metal',
		area: 'Teeth Assembling and Polishing',
	},
	m_teeth_cleaning: {
		name: 'Metal Teeth Cleaning',
		short_name: 'Metal Teeth Cleaning',
		type: 'Metal',
		area: 'Teeth Cleaning',
	},
	v_teeth_cleaning: {
		name: 'Vislon Teeth Cleaning',
		short_name: 'Vislon Teeth Cleaning',
		type: 'Vislon',
		area: 'Teeth Cleaning',
	},
	plating_and_iron: {
		name: 'Plating and Iron',
		short_name: 'Plating and Iron',
		type: 'Metal',
		area: 'Plating and Iron',
	},
	m_sealing: {
		name: 'Metal Sealing',
		short_name: 'Metal Sealing',
		type: 'Metal',
		area: 'Sealing',
	},
	v_sealing: {
		name: 'Vislon Sealing',
		short_name: 'Vislon Sealing',
		type: 'Vislon',
		area: 'Sealing',
	},
	n_t_cutting: {
		name: 'Nylon T Cutting',
		short_name: 'Nylon T Cutting',
		type: 'Nylon',
		area: 'T Cutting',
	},
	v_t_cutting: {
		name: 'Vislon T Cutting',
		short_name: 'Vislon T Cutting',
		type: 'Vislon',
		area: 'T Cutting',
	},
	m_stopper: {
		name: 'Metal Stopper',
		short_name: 'Metal Stopper',
		type: 'Metal',
		area: 'Stopper',
	},
	v_stopper: {
		name: 'Vislon Stopper',
		short_name: 'Vislon Stopper',
		type: 'Vislon',
		area: 'Stopper',
	},
	n_stopper: {
		name: 'Nylon Stopper',
		short_name: 'Nylon Stopper',
		type: 'Nylon',
		area: 'Stopper',
	},
	cutting: {
		name: 'Cutting',
		short_name: 'Cutting',
		type: 'All',
		area: 'Cutting',
	},
	m_qc_and_packing: {
		name: 'Metal QC and Packing',
		short_name: 'M QC and Packing',
		type: 'All',
		area: 'QC and Packing',
	},
	n_qc_and_packing: {
		name: 'Nylon QC and Packing',
		short_name: 'N QC and Packing',
		type: 'All',
		area: 'QC and Packing',
	},
	v_qc_and_packing: {
		name: 'Vislon QC and Packing',
		short_name: 'V QC and Packing',
		type: 'All',
		area: 'QC and Packing',
	},
	s_qc_and_packing: {
		name: 'Slider QC and Packing',
		short_name: 'S QC and Packing',
		type: 'All',
		area: 'QC and Packing',
	},
	die_casting: {
		name: 'Die Casting',
		short_name: 'Die Casting',
		type: 'All',
		area: 'Die Casting',
	},
	slider_assembly: {
		name: 'Slider Assembly',
		short_name: 'Slider Assembly',
		type: 'All',
		area: 'Slider Assembly',
	},
	coloring: {
		name: 'Coloring',
		short_name: 'Coloring',
		type: 'All',
		area: 'Coloring',
	},
	lab_dip: {
		name: 'Lab Dip',
		short_name: 'Lab Dip',
		type: 'All',
		area: 'Dyeing',
	},
	faulty_product: {
		name: 'Faulty Product',
		short_name: 'Faulty Product',
		type: 'All',
		area: 'Others',
	},
	loan_return: {
		name: 'Loan Return',
		short_name: 'Loan Return',
		type: 'All',
		area: 'Others',
	},
};
