import { useAuth } from '@context/auth';

const PAGES = {
	// DASHBOARD
	DASHBOARD: 'dashboard',
	// ORDER
	ORDER_DETAILS: 'order-details',
	ORDER_DETAILS_BY_ORDER_NUMBER: 'order-details-by-order-number',
	ORDER_DETAILS_BY_UUID: 'order-details-by-uuid',
	ORDER_ENTRY: 'order-entry',
	ORDER_BUYER: 'order-buyer',
	ORDER_MARKETING: 'order-marketing',
	ORDER_PROPERTIES: 'order-properties',
	ORDER_PARTY: 'order-party',
	ORDER_MERCHANDISER: 'order-merchandiser',
	ORDER_FACTORY: 'order-factory',
	// STORE
	STORE_STOCK: 'store-stock',
	STORE_LOG: 'store-log',
	STORE_DETAILS: 'store-details',
	STORE_SECTION: 'store-section',
	STORE_TYPE: 'store-type',
	STORE_VENDOR: 'store-vendor',
	STORE_RECEIVE: 'store-receive',
	// COMMON
	// TAPE MAKING
	TAPE_RM: 'tape-rm',
	TAPE_SFG: 'tape-sfg',
	TAPE_LOG: 'tape-log',
	// COIL MAKING
	COIL_RM: 'coil-rm',
	COIL_SFG: 'coil-sfg',
	COIL_LOG: 'coil-log',
	// DYEING AND IRONING
	DYEING_RM: 'dyeing-rm',
	DYEING_SFG: 'dyeing-sfg',
	DYEING_LOG: 'dyeing-log',
	// NYLON
	// NYLON METALLIC
	NYLON_METALLIC_FINISHING_RM: 'nylon-metallic-finishing-rm',
	NYLON_METALLIC_FINISHING_SFG: 'nylon-metallic-finishing-sfg',
	NYLON_METALLIC_FINISHING_LOG: 'nylon-metallic-finishing-log',
	// NYLON PLASTIC
	NYLON_PLASTIC_FINISHING_RM: 'nylon-plastic-finishing-rm',
	NYLON_PLASTIC_FINISHING_SFG: 'nylon-plastic-finishing-sfg',
	NYLON_PLASTIC_FINISHING_LOG: 'nylon-plastic-finishing-log',
	// VISLON
	// VISLON TEETH MOLDING
	VISLON_TEETH_MOLDING_RM: 'vislon-teeth-molding-rm',
	VISLON_TEETH_MOLDING_SFG: 'vislon-teeth-molding-sfg',
	VISLON_TEETH_MOLDING_LOG: 'vislon-teeth-molding-log',
	// VISLON FINISHING
	VISLON_FINISHING_RM: 'vislon-finishing-rm',
	VISLON_FINISHING_SFG: 'vislon-finishing-sfg',
	VISLON_FINISHING_LOG: 'vislon-finishing-log',
	// METAL
	// METAL TEETH MOLDING
	METAL_TEETH_MOLDING_RM: 'metal-teeth-molding-rm',
	METAL_TEETH_MOLDING_SFG: 'metal-teeth-molding-sfg',
	METAL_TEETH_MOLDING_LOG: 'metal-teeth-molding-log',
	// METAL TEETH COLORING
	METAL_TEETH_COLORING_RM: 'metal-teeth-coloring-rm',
	METAL_TEETH_COLORING_SFG: 'metal-teeth-coloring-sfg',
	METAL_TEETH_COLORING_LOG: 'metal-teeth-coloring-log',
	// METAL FINISHING
	METAL_FINISHING_RM: 'metal-finishing-rm',
	METAL_FINISHING_SFG: 'metal-finishing-sfg',
	METAL_FINISHING_LOG: 'metal-finishing-log',
	// SLIDER
	// DIE CASTING
	DIE_CASTING_RM: 'die-casting-rm',
	DIE_CASTING_SFG: 'die-casting-sfg',
	DIE_CASTING_LOG: 'die-casting-log',
	// SLIDER ASSEMBLY
	SLIDER_ASSEMBLY_RM: 'slider-assembly-rm',
	SLIDER_ASSEMBLY_SFG: 'slider-assembly-sfg',
	SLIDER_ASSEMBLY_LOG: 'slider-assembly-log',
	// COLORING
	COLORING_RM: 'coloring-rm',
	COLORING_SFG: 'coloring-sfg',
	COLORING_LOG: 'coloring-log',
};

const ROLES = {
	SUPER_ADMIN: 'super-admin',
	ADMIN: 'admin',
	VIEWER: 'viewer',
	MANAGEMENT_EDIT: 'management-edit',
	MANAGEMENT_VIEW: 'management-view',
	SNO_EDIT: 'sno-edit',
	SNO_VIEW: 'sno-view',
	DGM_EDIT: 'dgm-edit',
	DGM_VIEW: 'dgm-view',
	STORE_EDIT: 'store-edit',
	STORE_VIEW: 'store-view',
	PROCUREMENT_EDIT: 'procurement-edit',
	PROCUREMENT_VIEW: 'procurement-view',
	// PMG
	// COMMON
	TAPE_MAKING_EDIT: 'tape-making-edit',
	TAPE_MAKING_VIEW: 'tape-making-view',
	COIL_MAKING_EDIT: 'coil-making-edit',
	COIL_MAKING_VIEW: 'coil-making-view',
	DYING_AND_IRONING_EDIT: 'dying-and-ironing-edit',
	DYING_AND_IRONING_VIEW: 'dying-and-ironing-view',
	// NYLON
	NYLON_METALLIC_FINISHING_EDIT: 'nylon-metallic-finishing-edit',
	NYLON_METALLIC_FINISHING_VIEW: 'nylon-metallic-finishing-view',
	NYLON_PLASTIC_FINISHING_EDIT: 'nylon-plastic-finishing-edit',
	NYLON_PLASTIC_FINISHING_VIEW: 'nylon-plastic-finishing-view',
	// VISLON
	VISLON_TEETH_MOLDING_EDIT: 'vislon-teeth-molding-edit',
	VISLON_TEETH_MOLDING_VIEW: 'vislon-teeth-molding-view',
	VISLON_FINISHING_EDIT: 'vislon-finishing-edit',
	VISLON_FINISHING_VIEW: 'vislon-finishing-view',
	// METAL
	METAL_TEETH_MOLDING_EDIT: 'metal-teeth-molding-edit',
	METAL_TEETH_MOLDING_VIEW: 'metal-teeth-molding-view',
	METAL_TEETH_COLORING_EDIT: 'metal-teeth-coloring-edit',
	METAL_TEETH_COLORING_VIEW: 'metal-teeth-coloring-view',
	METAL_FINISHING_EDIT: 'metal-finishing-edit',
	METAL_FINISHING_VIEW: 'metal-finishing-view',
	// SLIDER
	DIE_CASTING_EDIT: 'die-casting-edit',
	DIE_CASTING_VIEW: 'die-casting-view',
	SLIDER_ASSEMBLY_EDIT: 'slider-assembly-edit',
	SLIDER_ASSEMBLY_VIEW: 'slider-assembly-view',
	COLORING_EDIT: 'coloring-edit',
	COLORING_VIEW: 'coloring-view',
};

const CAN_DO = {};

const CanAccess = (departments = []) => {
	const { user } = useAuth();
	return ['admin', ...departments].some((department) =>
		user?.user_department?.includes(department)
	);
};

function useHaveAccess() {
	// admin
	const USER_EDIT_ACCESS = CanAccess([]);
	// material
	const STOCK_EDIT_ACCESS = CanAccess(['procurement']);
	const SECTION_EDIT_ACCESS = CanAccess(['procurement']);
	const TYPE_EDIT_ACCESS = CanAccess(['procurement']);
	// purchase
	const PURCHASE_EDIT_ACCESS = CanAccess(['procurement']);
	const RECEIVED_EDIT_ACCESS = CanAccess(['store', 'procurement']);
	const VENDOR_EDIT_ACCESS = CanAccess(['procurement']);
	// issue
	const ISSUE_EDIT_ACCESS = CanAccess(['store']);
	const MAINTENANCE_EDIT_ACCESS = CanAccess(['store', 'spare-parts']);
	const SPARE_PARTS_ADD_ACCESS = CanAccess(['spare-parts']);
	const SPARE_PARTS_EDIT_ACCESS = CanAccess(['spare-parts']);
	const WASTAGE_EDIT_ACCESS = CanAccess([]);
	// order details
	const ORDER_DETAILS_EDIT_ACCESS = CanAccess(['ppc']);
	const ORDER_DETAILS_ISSUE_EDIT_ACCESS = CanAccess(['store']); //** */
	// order entry
	const BUYER_EDIT_ACCESS = CanAccess(['ppc']);
	const MARKETING_EDIT_ACCESS = CanAccess(['ppc']);

	// NEW
	const DASHBOARD_VIEW_ACCESS = CanAccess(['store', 'procurement', 'ppc']);

	return {
		USER_EDIT_ACCESS,
		STOCK_EDIT_ACCESS,
		SECTION_EDIT_ACCESS,

		TYPE_EDIT_ACCESS,
		PURCHASE_EDIT_ACCESS,
		RECEIVED_EDIT_ACCESS,
		VENDOR_EDIT_ACCESS,
		ISSUE_EDIT_ACCESS,
		WASTAGE_EDIT_ACCESS,
		ORDER_DETAILS_ISSUE_EDIT_ACCESS,
		BUYER_EDIT_ACCESS,
		MARKETING_EDIT_ACCESS,
		MAINTENANCE_EDIT_ACCESS,
		ORDER_DETAILS_EDIT_ACCESS,
		SPARE_PARTS_EDIT_ACCESS,
		SPARE_PARTS_ADD_ACCESS,
	};
}

export { useHaveAccess };
