export default function SectionName({ section }) {
	const { type, area } = res[section];
	return (
		<div className="flex flex-col gap-0.5">
			<div className="badge badge-primary badge-sm">{type}</div>
			<div className="badge badge-primary badge-sm ">{area}</div>
		</div>
	);
}

const res = {
	tape_making: {
		name: "Tape Making",
		short_name: "Tape Making",
		type: "All",
		area: "Tape Making",
	},
	coil_forming: {
		name: "Coil Forming",
		short_name: "Coil Forming",
		type: "All",
		area: "Coil Forming",
	},
	dying_and_iron: {
		name: "Dying and Iron",
		short_name: "Dying and Iron",
		type: "All",
		area: "Dying and Iron",
	},
	m_gapping: {
		name: "Metal Gapping",
		short_name: "Metal Gapping",
		type: "Metal",
		area: "Gapping",
	},
	v_gapping: {
		name: "Vislon Gapping",
		short_name: "Vislon Gapping",
		type: "Vislon",
		area: "Gapping",
	},
	v_teeth_molding: {
		name: "Vislon Teeth Molding",
		short_name: "Vislon Teeth Molding",
		type: "Vislon",
		area: "Teeth Molding",
	},
	m_teeth_molding: {
		name: "Metal Teeth Molding",
		short_name: "Metal Teeth Molding",
		type: "Metal",
		area: "Teeth Molding",
	},
	teeth_assembling_and_polishing: {
		name: "Teeth Assembling and Polishing",
		short_name: "Teeth Assembling and Polishing",
		type: "Metal",
		area: "Teeth Assembling and Polishing",
	},
	m_teeth_cleaning: {
		name: "Metal Teeth Cleaning",
		short_name: "Metal Teeth Cleaning",
		type: "Metal",
		area: "Teeth Cleaning",
	},
	v_teeth_cleaning: {
		name: "Vislon Teeth Cleaning",
		short_name: "Vislon Teeth Cleaning",
		type: "Vislon",
		area: "Teeth Cleaning",
	},
	plating_and_iron: {
		name: "Plating and Iron",
		short_name: "Plating and Iron",
		type: "Metal",
		area: "Plating and Iron",
	},
	m_sealing: {
		name: "Metal Sealing",
		short_name: "Metal Sealing",
		type: "Metal",
		area: "Sealing",
	},
	v_sealing: {
		name: "Vislon Sealing",
		short_name: "Vislon Sealing",
		type: "Vislon",
		area: "Sealing",
	},
	n_t_cutting: {
		name: "Nylon T Cutting",
		short_name: "Nylon T Cutting",
		type: "Nylon",
		area: "T Cutting",
	},
	v_t_cutting: {
		name: "Vislon T Cutting",
		short_name: "Vislon T Cutting",
		type: "Vislon",
		area: "T Cutting",
	},
	m_stopper: {
		name: "Metal Stopper",
		short_name: "Metal Stopper",
		type: "Metal",
		area: "Stopper",
	},
	v_stopper: {
		name: "Vislon Stopper",
		short_name: "Vislon Stopper",
		type: "Vislon",
		area: "Stopper",
	},
	n_stopper: {
		name: "Nylon Stopper",
		short_name: "Nylon Stopper",
		type: "Nylon",
		area: "Stopper",
	},
	cutting: {
		name: "Cutting",
		short_name: "Cutting",
		type: "All",
		area: "Cutting",
	},
	qc_and_packing: {
		name: "QC and Packing",
		short_name: "QC and Packing",
		type: "All",
		area: "QC and Packing",
	},
	die_casting: {
		name: "Die Casting",
		short_name: "Die Casting",
		type: "All",
		area: "Die Casting",
	},
	slider_assembly: {
		name: "Slider Assembly",
		short_name: "Slider Assembly",
		type: "All",
		area: "Slider Assembly",
	},
	coloring: {
		name: "Coloring",
		short_name: "Coloring",
		type: "All",
		area: "Coloring",
	},
};
