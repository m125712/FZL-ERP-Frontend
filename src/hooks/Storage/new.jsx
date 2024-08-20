const PAGES_DASHBOARD = {
	DASHBOARD: {
		page_name: 'dashboard',
		actions: ['read'],
	},
};

const PAGES_ORDER = {
	// ORDER
	ORDER__DETAILS: {
		page_name: 'order__details',
		actions: [
			'read',
			'update',
			'click_order_number',
			'click_item_description',
		],
	},
	ORDER__DETAILS_BY_ORDER_NUMBER: 'order__details_by_order_number',
	ORDER__DETAILS_BY_UUID: 'order__details_by_uuid',
	ORDER__ENTRY: 'order__entry',
	ORDER__PLANNING: {
		page_name: 'order__planning',
		actions: [
			'read',
			'click_order_number',
			'click_item_description',
			'click_factory_priority',
		],
	},
	ORDER__BUYER: {
		page_name: 'order__buyer',
		actions: ['create', 'read', 'update', 'delete'],
	},
	ORDER__MARKETING: {
		page_name: 'order__marketing',
		actions: ['create', 'read', 'update', 'delete'],
	},
	ORDER__PROPERTIES: {
		page_name: 'order__properties',
		actions: ['create', 'read', 'update', 'delete'],
	},
	ORDER__PARTY: {
		page_name: 'order__party',
		actions: ['create', 'read', 'update', 'delete'],
	},
	ORDER__MERCHANDISER: {
		page_name: 'order__merchandiser',
		actions: ['create', 'read', 'update', 'delete'],
	},
	ORDER__FACTORY: {
		page_name: 'order__factory',
		actions: ['create', 'read', 'update', 'delete'],
	},
};

const PAGES_STORE = {
	// STORE
	STORE__STOCK_FULL: {
		page_name: 'store__stock_full',
		actions: [
			'read',
			'click_name',
			'click_action',
			'click_trx_against_order',
		],
	},
	STORE__LOG: {
		page_name: 'store__log',
		actions: ['read', 'update', 'delete'],
	},
	STORE__LOG_AGAINST_ORDER: {
		page_name: 'store__log_against_order',
		actions: ['read', 'update', 'delete'],
	},
	STORE__STOCK: {
		page_name: 'store__stock',
		actions: ['create', 'read', 'update', 'delete'],
	},
	STORE__SECTION: {
		page_name: 'store__section',
		actions: ['create', 'read', 'update', 'delete'],
	},
	STORE__TYPE: {
		page_name: 'store__type',
		actions: ['create', 'read', 'update', 'delete'],
	},
	STORE__VENDOR: {
		page_name: 'store__vendor',
		actions: ['create', 'read', 'update', 'delete'],
	},
	STORE__RECEIVE: 'store__receive',
};

const PAGES_COMMON = {
	// TAPE MAKING
	TAPE__RM: {
		page_name: 'tape__rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	TAPE__SFG: {
		page_name: 'tape__sfg',
		actions: [
			'read',
			'click_production',
			'click_to_coil',
			'click_to_dyeing',
		],
	},
	TAPE__LOG: 'tape__log',
	// COIL MAKING
	COIL__RM: {
		page_name: 'coil__rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	COIL__SFG: {
		page_name: 'coil__sfg',
		actions: ['read', 'click_production', 'click_to_dyeing'],
	},
	COIL__LOG: 'coil__log',
	// // DYEING AND IRONING
	// DYEING__RM: {
	// 	page_name: "dyeing__rm",
	// 	actions: ["read", "click_name", "click_used"],
	// },
	// DYEING__SFG: {
	// 	page_name: "dyeing__sfg",
	// 	actions: ["read", "click_production", "click_transaction"],
	// },
	// DYEING__LOG: "dyeing__log",
};

const PAGES_DYEING_AND_IRONING = {
	// DYEING AND IRONING
	DYEING__RM: {
		page_name: 'dyeing__rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	DYEING__SFG: {
		page_name: 'dyeing__sfg',
		actions: ['read', 'click_production', 'click_transaction'],
	},
	DYEING__LOG: 'dyeing__log',
};

const PAGES_NYLON = {
	// NYLON METALLIC
	NYLON__METALLIC_FINISHING_RM: {
		page_name: 'nylon__metallic_finishing_rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	NYLON__METALLIC_FINISHING_SFG: {
		page_name: 'nylon__metallic_finishing_sfg',
		actions: ['read', 'click_production'],
	},
	NYLON__METALLIC_FINISHING_LOG: 'nylon__metallic_finishing_log',
	// NYLON PLASTIC
	NYLON__PLASTIC_FINISHING_RM: {
		page_name: 'nylon__plastic_finishing_rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	NYLON__PLASTIC_FINISHING_SFG: {
		page_name: 'nylon__plastic_finishing_sfg',
		actions: ['read', 'click_production'],
	},
	NYLON__PLASTIC_FINISHING_LOG: 'nylon__plastic_finishing_log',
};

const PAGES_VISLON = {
	// VISLON TEETH MOLDING
	VISLON__TEETH_MOLDING_RM: {
		page_name: 'vislon__teeth_molding_rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	VISLON__TEETH_MOLDING_SFG: {
		page_name: 'vislon__teeth_molding_sfg',
		actions: ['read', 'click_production', 'click_to_finishing'],
	},
	VISLON__TEETH_MOLDING_LOG: 'vislon__teeth_molding_log',
	// VISLON FINISHING
	VISLON__FINISHING_RM: {
		page_name: 'vislon__finishing_rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	VISLON__FINISHING_SFG: {
		page_name: 'vislon__finishing_sfg',
		actions: ['read', 'click_production'],
	},
	VISLON__FINISHING_LOG: 'vislon__finishing_log',
};

const PAGES_METAL = {
	// METAL TEETH MOLDING
	METAL__TEETH_MOLDING_RM: {
		page_name: 'metal__teeth_molding_rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	METAL__TEETH_MOLDING_SFG: {
		page_name: 'metal__teeth_molding_sfg',
		actions: ['read', 'click_production', 'click_to_teeth_coloring'],
	},
	METAL__TEETH_MOLDING_LOG: 'metal__teeth_molding_log',
	// METAL TEETH COLORING
	METAL__TEETH_COLORING__RM: {
		page_name: 'metal__teeth_coloring__rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	METAL__TEETH_COLORING__SFG: {
		page_name: 'metal__teeth_coloring__sfg',
		actions: ['read', 'click_production', 'click_to_finishing'],
	},
	METAL__TEETH_COLORING__LOG: 'metal__teeth_coloring_log',
	// METAL FINISHING
	METAL__FINISHING_RM: {
		page_name: 'metal__finishing_rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	METAL__FINISHING_SFG: {
		page_name: 'metal__finishing_sfg',
		actions: ['read', 'click_production'],
	},
	METAL__FINISHING_LOG: 'metal__finishing_log',
};

const PAGES_SLIDER = {
	// DIE CASTING
	DIE_CASTING__RM: {
		page_name: 'die_casting__rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	DIE_CASTING__SFG: 'die_casting__sfg',
	DIE_CASTING__LOG: 'die_casting__log',
	// SLIDER ASSEMBLY
	SLIDER_ASSEMBLY__RM: {
		page_name: 'slider_assembly__rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	SLIDER_ASSEMBLY__SFG: 'slider_assembly__sfg',
	SLIDER_ASSEMBLY__LOG: 'slider_assembly__log',
	// COLORING
	COLORING__RM: {
		page_name: 'coloring__rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	COLORING__SFG: 'coloring__sfg',
	COLORING__LOG: 'coloring__log',
};

const PAGES = {
	...PAGES_DASHBOARD,
	...PAGES_ORDER,
	...PAGES_STORE,
	...PAGES_COMMON,
	...PAGES_DYEING_AND_IRONING,
	...PAGES_NYLON,
	...PAGES_VISLON,
	...PAGES_METAL,
	...PAGES_SLIDER,
};

const ROLES = {
	SUPER_ADMIN: 'super_admin',
	ADMIN: 'admin',
	VIEWER: 'viewer',
	MANAGEMENT_EDIT: 'management_edit',
	MANAGEMENT_VIEW: 'management_view',
	SNO_EDIT: 'sno_edit',
	SNO_VIEW: 'sno_view',
	DGM_EDIT: 'dgm_edit',
	DGM_VIEW: 'dgm_view',
	STORE__EDIT: 'store__edit',
	STORE__VIEW: 'store__view',
	PROCUREMENT_EDIT: 'procurement_edit',
	PROCUREMENT_VIEW: 'procurement_view',
	// PMG
	// COMMON
	TAPE__MAKING_EDIT: 'tape__making_edit',
	TAPE__MAKING_VIEW: 'tape__making_view',
	COIL__MAKING_EDIT: 'coil__making_edit',
	COIL__MAKING_VIEW: 'coil__making_view',
	DYING_AND_IRONING_EDIT: 'dying_and_ironing_edit',
	DYING_AND_IRONING_VIEW: 'dying_and_ironing_view',
	// NYLON
	NYLON__METALLIC_FINISHING_EDIT: 'nylon__metallic_finishing_edit',
	NYLON__METALLIC_FINISHING_VIEW: 'nylon__metallic_finishing_view',
	NYLON__PLASTIC_FINISHING_EDIT: 'nylon__plastic_finishing_edit',
	NYLON__PLASTIC_FINISHING_VIEW: 'nylon__plastic_finishing_view',
	// VISLON
	VISLON__TEETH_MOLDING_EDIT: 'vislon__teeth_molding_edit',
	VISLON__TEETH_MOLDING_VIEW: 'vislon__teeth_molding_view',
	VISLON__FINISHING_EDIT: 'vislon__finishing_edit',
	VISLON__FINISHING_VIEW: 'vislon__finishing_view',
	// METAL
	METAL__TEETH_MOLDING_EDIT: 'metal__teeth_molding_edit',
	METAL__TEETH_MOLDING_VIEW: 'metal__teeth_molding_view',
	METAL__TEETH_COLORING__EDIT: 'metal__teeth_coloring__edit',
	METAL__TEETH_COLORING__VIEW: 'metal__teeth_coloring__view',
	METAL__FINISHING_EDIT: 'metal__finishing_edit',
	METAL__FINISHING_VIEW: 'metal__finishing_view',
	// SLIDER
	DIE_CASTING__EDIT: 'die_casting__edit',
	DIE_CASTING__VIEW: 'die_casting__view',
	SLIDER_ASSEMBLY__EDIT: 'slider_assembly__edit',
	SLIDER_ASSEMBLY__VIEW: 'slider_assembly__view',
	COLORING__EDIT: 'coloring__edit',
	COLORING__VIEW: 'coloring__view',
};

const CAN_DO = {};

// {"values":"{\"values\":[30,31,32,33]}"}
// {
// 	values: {
// 		values: [30, 31, 32, 33],
// 	}
// }
