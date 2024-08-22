import * as yup from 'yup';
import {
	BOOLEAN, // default
	BOOLEAN_DEFAULT_VALUE, // default
	BOOLEAN_REQUIRED, // default
	EMAIL, // default
	EMAIL_REQUIRED, // default
	FORTUNE_ZIP_EMAIL_PATTERN, // default
	JSON_STRING, // default
	JSON_STRING_REQUIRED, // default
	NAME,
	NAME_REQUIRED, // default
	NUMBER, // default
	NUMBER_DOUBLE, // default
	NUMBER_DOUBLE_REQUIRED, // default
	NUMBER_REQUIRED, // default
	ORDER_NUMBER, // default
	ORDER_NUMBER_NOT_REQUIRED, // default
	PASSWORD, // default
	PHONE_NUMBER, // default
	PHONE_NUMBER_REQUIRED, // default
	STRING, // default
	STRING_REQUIRED, // default
	URL, // default
	URL_REQUIRED, // default
	UUID, // default
	UUID_FK, // default
	UUID_PK, // default
	UUID_REQUIRED,
} from './utils';

export {
	BOOLEAN,
	BOOLEAN_REQUIRED,
	EMAIL,
	EMAIL_REQUIRED,
	FORTUNE_ZIP_EMAIL_PATTERN,
	JSON_STRING,
	JSON_STRING_REQUIRED,
	NUMBER,
	NUMBER_DOUBLE,
	NUMBER_DOUBLE_REQUIRED,
	NUMBER_REQUIRED,
	ORDER_NUMBER,
	ORDER_NUMBER_NOT_REQUIRED,
	PASSWORD,
	PHONE_NUMBER,
	PHONE_NUMBER_REQUIRED,
	STRING,
	STRING_REQUIRED,
};

// Library
//User
export const LIBRARY_USER_SCHEMA = {
	name: NAME_REQUIRED,
	email: FORTUNE_ZIP_EMAIL_PATTERN,
	department_designation: STRING_REQUIRED,
	ext: STRING.nullable(),
	phone: PHONE_NUMBER_REQUIRED,
};
export const LIBRARY_USER_NULL = {
	id: null,
	name: '',
	email: '',
	department_designation: null,
	designation_uuid: null,
	ext: '',
	phone: '',
};
// Policy
export const POLICY_SCHEMA = {
	type: STRING_REQUIRED,
	title: STRING_REQUIRED,
	sub_title: STRING_REQUIRED,
	status: NUMBER_REQUIRED,
	url: URL_REQUIRED,
	remarks: STRING.nullable(),
};

export const POLICY_NULL = {
	uuid: null,
	type: '',
	title: '',
	sub_title: '',
	status: 1,
	url: '',
	updated_at: '',
	remarks: '',
};

// Section
export const SECTION_SCHEMA = {
	name: STRING_REQUIRED,
	remarks: STRING.nullable(),
};

export const SECTION_NULL = {
	uuid: null,
	name: '',
	short_name: '',
	remarks: '',
};

// Buyer
export const BUYER_SCHEMA = {
	name: NAME_REQUIRED,
	short_name: STRING.nullable(),
	remarks: STRING.nullable(),
};

export const BUYER_NULL = {
	uuid: null,
	name: '',
	short_name: '',
	remarks: '',
};
export const PARTY_SCHEMA = {
	name: STRING_REQUIRED,
	short_name: STRING.nullable(),
	remarks: STRING.nullable(),
};

export const PARTY_NULL = {
	uuid: null,
	name: '',
	short_name: '',
	remarks: '',
};

// Merchandiser
export const MERCHANDISER_SCHEMA = {
	party_uuid: STRING_REQUIRED,
	name: STRING_REQUIRED,
	email: EMAIL.nullable(),
	phone: PHONE_NUMBER.nullable(),
	address: STRING.nullable(),
};

export const MERCHANDISER_NULL = {
	uuid: null,
	party_uuid: null,
	name: '',
	email: '',
	phone: '',
	address: '',
};

// Factory
// party_id	name	email	phone	address	created_at	updated_at
export const FACTORY_SCHEMA = {
	party_uuid: STRING_REQUIRED,
	name: STRING_REQUIRED,
	phone: STRING.nullable(),
	address: STRING_REQUIRED,
};

export const FACTORY_NULL = {
	uuid: null,
	party_uuid: null,
	name: '',
	phone: '',
	address: '',
};

// Marketing
export const MARKETING_SCHEMA = {
	user_uuid: STRING_REQUIRED,
	name: STRING_REQUIRED,
	short_name: STRING.nullable(),
	remarks: STRING.nullable(),
};

export const MARKETING_NULL = {
	uuid: null,
	user_uuid: null,
	name: '',
	short_name: '',
	remarks: '',
};

// Material
export const MATERIAL_SCHEMA = {
	name: STRING_REQUIRED,
	unit: STRING_REQUIRED,
	short_name: STRING,
	threshold: NUMBER_DOUBLE,
	description: STRING.nullable(),
	remarks: STRING.nullable(),
};

export const MATERIAL_NULL = {
	uuid: null,
	name: '',
	short_name: '',
	unit: 'kg',
	threshold: 0,
	description: '',
	section_uuid: null,
	type_uuid: null,
	remarks: '',
};

export const MATERIAL_STOCK_SCHEMA = {
	trx_to: STRING_REQUIRED,
	trx_quantity: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const MATERIAL_STOCK_NULL = {
	uuid: null,
	material_uuid: null,
	trx_to: '',
	trx_quantity: '',
	created_by: '',
	remarks: '',
};

export const MATERIAL_TRX_AGAINST_ORDER_SCHEMA = {
	order_description_uuid: STRING_REQUIRED,
	trx_to: STRING_REQUIRED,
	trx_quantity: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const MATERIAL_TRX_AGAINST_ORDER_NULL = {
	uuid: null,
	material_uuid: null,
	order_description_uuid: null,
	trx_to: '',
	trx_quantity: '',
	created_by: '',
	remarks: '',
};

export const SFG_TRANSFER_LOG_SCHEMA = {
	trx_to: STRING_REQUIRED,
	trx_quantity: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const SFG_TRANSFER_LOG_NULL = {
	id: null,
	order_entry_id: null,
	trx_from: '',
	trx_to: '',
	trx_quantity: '',
	created_by: '',
	remarks: '',
};

export const SFG_PRODUCTION_LOG_SCHEMA = {
	production_quantity: NUMBER_DOUBLE,
	remarks: STRING.nullable(),
};

export const SFG_PRODUCTION_LOG_NULL = {
	id: null,
	order_entry_id: null,
	section: '',
	used_quantity: null,
	production_quantity: null,
	wastage: null,
	remarks: '',
};

// Purchase

// vendor page
export const VENDOR_SCHEMA = {
	name: NAME_REQUIRED,
	contact_name: STRING.nullable(),
	contact_number: PHONE_NUMBER.nullable(),
	email: EMAIL.nullable(),
	office_address: STRING.nullable(),
	remarks: STRING.nullable(),
};

export const VENDOR_NULL = {
	uuid: null,
	name: '',
	contact_number: '',
	email: '',
	office_address: '',
	remarks: '',
};
// purchase page
export const PURCHASE_SCHEMA = {
	vendor_uuid: NUMBER_REQUIRED,
	is_local: NUMBER_REQUIRED.default(0),
	remarks: STRING.nullable(),
	purchase: yup.array().of(
		yup.object().shape({
			material_uuid: NUMBER_REQUIRED,
			quantity: NUMBER_DOUBLE_REQUIRED,
			price: NUMBER_DOUBLE_REQUIRED,
		})
	),
};

export const PURCHASE_NULL = {
	uuid: null,
	vendor_uuid: null,
	is_local: '',
	remarks: '',
	purchase: [
		{
			material_uuid: null,
			quantity: '',
			price: '',
		},
	],
};

// purchase entry page
export const PURCHASE_ENTRY_SCHEMA = {
	vendor_uuid: STRING_REQUIRED,
	is_local: NUMBER_REQUIRED.default(0),
	lc_number: STRING.nullable(),
	remarks: STRING.nullable(),
	purchase: yup.array().of(
		yup.object().shape({
			material_uuid: STRING_REQUIRED,
			quantity: NUMBER_DOUBLE_REQUIRED,
			price: NUMBER_DOUBLE_REQUIRED,
			remarks: STRING.nullable(),
		})
	),
};

export const PURCHASE_ENTRY_NULL = {
	uuid: null,
	vendor_uuid: null,
	is_local: null,
	lc_number: '',
	remarks: '',
	purchase: [
		{
			purchase_description_uuid: null,
			material_uuid: null,
			quantity: '',
			price: '',
			remarks: '',
		},
	],
};

// Received
export const RECEIVED_SCHEMA = {
	received_quantity: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const RECEIVED_NULL = {
	uuid: null,
	vendor_uuid: null,
	material_uuid: null,
	received_quantity: '',
	price: '',
	is_local: '',
	remarks: '',
};

// Order
// Order Properties
export const PROPERTIES_SCHEMA = {
	item_for: STRING_REQUIRED,
	type: STRING_REQUIRED,
	name: STRING_REQUIRED,
	short_name: STRING.nullable(),
	remarks: STRING.nullable(),
};

export const PROPERTIES_NULL = {
	uuid: null,
	item_for: '',
	type: '',
	name: '',
	short_name: '',
	remarks: '',
	created_by: '',
	created_at: '',
	updated_at: '',
};

// Product Order
export const handelNumberDefaultValue = (value) =>
	value === null ? undefined : value;

// Order Info
export const ORDER_INFO_SCHEMA = {
	reference_order_info_uuid: STRING.nullable(),
	is_sample: BOOLEAN_REQUIRED.default(false),
	is_bill: BOOLEAN.default(false),
	is_cash: BOOLEAN_REQUIRED,
	status: BOOLEAN_REQUIRED.default(false),
	marketing_uuid: STRING_REQUIRED,
	merchandiser_uuid: STRING, // No Merchandiser
	factory_uuid: STRING, // No Factory
	party_uuid: STRING_REQUIRED,
	buyer_uuid: STRING_REQUIRED,
	marketing_priority: STRING,
	factory_priority: STRING,
	remarks: STRING.nullable(),
};

export const ORDER_INFO_NULL = {
	uuid: null,
	reference_order_info_uuid: '',
	is_sample: false,
	is_bill: false,
	is_cash: false,
	status: false,
	marketing_uuid: null,
	merchandiser_uuid: null,
	factory_uuid: null,
	party_uuid: null,
	buyer_uuid: null,
	marketing_priority: '',
	factory_priority: '',
	remarks: '',
};

export const ORDER_SCHEMA = {
	order_info_uuid: UUID_REQUIRED,
	item: UUID_REQUIRED,
	zipper_number: UUID_REQUIRED,
	teeth_color: UUID_REQUIRED,
	coloring_type: UUID_REQUIRED,
	special_requirement: JSON_STRING_REQUIRED,
	description: STRING.nullable(),
	remarks: STRING.nullable(),

	// slider
	slider_starting_section: STRING_REQUIRED,
	end_type: UUID_REQUIRED,
	hand: UUID_FK,
	lock_type: UUID_REQUIRED,
	slider: UUID_REQUIRED,
	slider_body_shape: UUID_FK,
	slider_link: UUID_FK,

	// puller
	puller_type: UUID_REQUIRED,
	puller_color: UUID_REQUIRED,
	puller_link: UUID_FK,

	// logo
	logo_type: UUID_FK,
	is_logo_body: BOOLEAN_DEFAULT_VALUE(false),
	is_logo_puller: BOOLEAN_DEFAULT_VALUE(false),
	is_slider_provided: BOOLEAN_DEFAULT_VALUE(false),

	// stopper
	stopper_type: UUID_REQUIRED,
	top_stopper: UUID_FK,
	bottom_stopper: UUID_FK,

	// garments
	end_user: UUID_FK,
	garment: STRING.nullable(),
	light_preference: UUID_FK,
	garments_wash: UUID_FK,
	garments_remarks: STRING.nullable(),

	order_entry: yup.array().of(
		yup.object().shape({
			style: STRING.nullable(),
			color: STRING_REQUIRED,
			size: NUMBER_DOUBLE_REQUIRED,
			quantity: NUMBER_REQUIRED,
			company_price: NUMBER_DOUBLE_REQUIRED.transform(
				handelNumberDefaultValue
			).default(0),
			party_price: NUMBER_DOUBLE_REQUIRED.transform(
				handelNumberDefaultValue
			).default(0),
		})
	),
};

export const ORDER_NULL = {
	id: null,
	order_info_uuid: null,
	order_description_uuid: null,
	item: null,
	zipper_number: null,
	end_type: null,
	lock_type: null,
	puller_type: null,
	teeth_color: null,
	puller_color: null,
	hand: null,
	special_requirement: '',
	description: '',
	remarks: '',
	slider_starting_section: null,
	order_entry: [
		{
			order_description_uuid: null,
			style: '',
			color: '',
			size: '',
			quantity: '',
			company_price: 0,
			party_price: 0,
			status: 1,
			swatch_approval_date: null,
		},
	],
};

// * Lab recipe schema*//
export const LAB_RECIPE_SCHEMA = {
	lab_dip_info_uuid: null,
	name: STRING_REQUIRED,
	approved: BOOLEAN.transform(handelNumberDefaultValue).default(false),
	status: BOOLEAN.transform(handelNumberDefaultValue).default(false),
	remarks: STRING.nullable(),
	recipe_entry: yup.array().of(
		yup.object().shape({
			color: STRING_REQUIRED,
			quantity: NUMBER_REQUIRED,
			remarks: STRING.nullable(),
		})
	),
};

export const LAB_RECIPE_NULL = {
	lab_dip_info_uuid: null,
	name: '',
	approved: 0,
	status: 0,
	remarks: '',
	recipe_entry: [
		{
			color: '',
			quantity: '',
			remarks: '',
		},
	],
};

// * Lab info schema*//
export const LAB_INFO_SCHEMA = {
	order_info_uuid: UUID_FK,
	name: STRING_REQUIRED,
	lab_status: BOOLEAN.transform(handelNumberDefaultValue).default(false),
	remarks: STRING.nullable(),
	recipe: yup.array().of(
		yup.object().shape({
			recipe_uuid: UUID_FK,
		})
	),
};

export const LAB_INFO_NULL = {
	order_info_uuid: null,
	name: '',
	lab_status: 0,
	remarks: '',
	recipe: [
		{
			recipe_uuid: null,
		},
	],
};

// Issue
// Wastage
export const WASTAGE_SCHEMA = {
	order_uuid: STRING_REQUIRED,
	material_id: NUMBER_REQUIRED,
	assigned_quantity: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const WASTAGE_NULL = {
	id: null,
	order_uuid: '',
	material_id: '',
	quantity: '',
	remarks: '',
};
// ISSUE Order page
export const ORDER_ISSUE_SCHEMA = {
	quantity: NUMBER_DOUBLE_REQUIRED,
	isWastage: NUMBER_REQUIRED,
	remarks: STRING.nullable(),
};

export const ORDER_ISSUE_NULL = {
	id: null,
	order_uuid: null,
	material_id: null,
	quantity: '',
	isWastage: null,
	remarks: '',
};

// Maintenance
export const MAINTENANCE_SCHEMA = {
	material_id: NUMBER_REQUIRED,
	quantity: NUMBER_DOUBLE_REQUIRED,
	description: STRING_REQUIRED,
	remarks: STRING.nullable(),
};

export const MAINTENANCE_NULL = {
	id: null,
	material_id: null,
	quantity: '',
	description: '',
	remarks: '',
};

// Spare Parts
export const SPARE_PARTS_SCHEMA = {
	material_id: NUMBER_REQUIRED,
	quantity: NUMBER_DOUBLE_REQUIRED,
	description: STRING_REQUIRED,
	remarks: STRING.nullable(),
};

export const SPARE_PARTS_NULL = {
	id: null,
	material_id: null,
	quantity: '',
	description: '',
	remarks: '',
};

// Material Entry

// Material
export const MATERIAL_ENTRY_SCHEMA = {
	price: NUMBER_DOUBLE_REQUIRED,
	quantity: NUMBER_DOUBLE_REQUIRED,
	purchase_type: STRING_REQUIRED,
	remarks: STRING.nullable(),
};

export const MATERIAL_ENTRY_NULL = {
	id: null,
	price: '',
	quantity: '',
	purchase_type: '',
	material_id: null,
	remarks: '',
};

// Consumption to Issue
export const CONSUMPTION_TO_ISSUE_SCHEMA = {
	quantity: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const CONSUMPTION_TO_ISSUE_NULL = {
	id: null,
	order_uuid: null,
	order_number: null,
	material_id: null,
	material_name: null,
	material_unit: null,
	quantity: '',
	remarks: '',
};

// Waste to Issue
export const WASTE_TO_ISSUE_SCHEMA = {
	quantity: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const WASTE_TO_ISSUE_NULL = {
	id: null,
	order_uuid: null,
	material_id: null,
	quantity: '',
	remarks: '',
};

// Login
export const LOGIN_SCHEMA = {
	email: FORTUNE_ZIP_EMAIL_PATTERN,
	pass: PASSWORD,
};

export const LOGIN_NULL = {
	email: '',
	pass: '',
};

// User
export const USER_SCHEMA = {
	name: STRING_REQUIRED,
	email: FORTUNE_ZIP_EMAIL_PATTERN,
	department_designation: NUMBER_REQUIRED,
	// pass: PASSWORD,
	// repeatPass: yup
	// 	.string()
	// 	.min(4, "Password length should be at least 4 characters")
	// 	.max(12, "Password cannot exceed more than 12 characters")
	// 	.oneOf([yup.ref("pass")], "Passwords do not match"),
	ext: STRING.nullable(),
	phone: PHONE_NUMBER_REQUIRED,
	remarks: STRING.nullable(),
};

export const USER_NULL = {
	uuid: null,
	name: '',
	email: '',
	department_designation: null,
	pass: '',
	repeatPass: '',
	ext: '',
	phone: '',
	remarks: '',
};

// * User -> Department
export const USER_DEPARTMENT_SCHEMA = {
	department: STRING_REQUIRED,
};

export const USER_DEPARTMENT_NULL = {
	uuid: null,
	department: '',
};

// * User -> Designation
export const USER_DESIGNATION_SCHEMA = {
	department_uuid: UUID_PK,
	designation: STRING_REQUIRED,
};

export const USER_DESIGNATION_NULL = {
	uuid: null,
	department_uuid: null,
	department: '',
	designation: '',
};

// Reset Password
export const RESET_PASSWORD_SCHEMA = {
	pass: PASSWORD,
	repeatPass: PASSWORD.oneOf([yup.ref('pass')], 'Passwords do not match'),
};

export const RESET_PASSWORD_NULL = {
	pass: '',
	repeatPass: '',
};

// Common
// Tape Add
export const TAPE_STOCK_ADD_SCHEMA = {
	type: STRING_REQUIRED,
	zipper_number: NUMBER_REQUIRED,
	remarks: STRING.nullable(),
};

export const TAPE_STOCK_ADD_NULL = {
	uuid: null,
	type: '',
	zipper_number: '',
	remarks: '',
};
// Tape Production
export const TAPE_PROD_SCHEMA = {
	production_quantity: NUMBER_REQUIRED.moreThan(0),
	wastage: NUMBER,
	remarks: STRING.nullable(),
};

export const TAPE_PROD_NULL = {
	uuid: null,
	section: '',
	tape_or_coil_stock_id: '',
	production_quantity: '',
	wastage: '',
	remarks: '',
};
//Tape To Coil
export const TAPE_TO_COIL_TRX_SCHEMA = {
	trx_quantity: NUMBER_REQUIRED,
	remarks: STRING.nullable(),
};

export const TAPE_TO_COIL_TRX_NULL = {
	uuid: null,
	tape_coil_stock_uuid: '',
	created_by: '',
	trx_quantity: '',
	quantity: '',
	wastage: '',
	remarks: '',
};

export const TAPE_STOCK_TRX_TO_DYING_SCHEMA = {
	order_entry_id: NUMBER_REQUIRED,
	trx_quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0),
	remarks: STRING.nullable(),
};

export const TAPE_STOCK_TRX_TO_DYING_NULL = {
	id: null,
	order_entry_id: '',
	trx_quantity: '',
	trx_from: 'tape_making',
	trx_to: 'dying_and_iron_stock',
	issued_by: '',
	remarks: '',
};

export const TAPE_OR_COIL_PRODUCTION_LOG_SCHEMA = {
	production_quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0),
	remarks: STRING.nullable(),
};

export const TAPE_OR_COIL_PRODUCTION_LOG_NULL = {
	uuid: null,
	type_of_zipper: null,
	tape_or_coil_stock_id: null,
	prod_quantity: null,
	wastage: null,
	remarks: null,
};

// Coil Production
export const COIL_PROD_SCHEMA = {
	production_quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0),
	wastage: NUMBER_DOUBLE.moreThan(0),
	remarks: STRING.nullable(),
};

export const COIL_PROD_NULL = {
	uuid: null,
	section: '',
	tape_or_coil_stock_id: '',
	production_quantity: '',
	wastage: '',
	remarks: '',
};

// Coil Stock
export const COIL_STOCK_SCHEMA = {
	order_entry_id: NUMBER_REQUIRED,
	trx_quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0),
	remarks: STRING.nullable(),
};

export const COIL_STOCK_NULL = {
	uuid: null,
	order_entry_id: null,
	tape_or_coil_stock_id: null,
	quantity: '',
	remarks: '',
	zipper_number: null,
	trx_quantity: '',
};

// RM Material Used
// material_stock_id	section	quantity	wastage	issued_by

export const RM_MATERIAL_USED_SCHEMA = {
	remaining: NUMBER_DOUBLE_REQUIRED,
	wastage: NUMBER_DOUBLE,
	remarks: STRING.nullable(),
};

export const RM_MATERIAL_USED_NULL = {
	uuid: null,
	material_stock_id: null,
	used_quantity: '',
	section: '',
	remaining: '',
	wastage: '',
	issued_by: '',
	remarks: '',
	tape_making: '',
	coil_forming: '',
	dying_and_iron: '',
	lab_dip: '',
};

export const RM_MATERIAL_USED_EDIT_SCHEMA = {
	used_quantity: NUMBER_DOUBLE_REQUIRED,
	wastage: NUMBER_DOUBLE,
	remarks: STRING.nullable(),
};

export const RM_MATERIAL_USED_EDIT_NULL = {
	uuid: null,
	material_stock_id: null,
	section: '',
	used_quantity: '',
	wastage: '',
	issued_by: '',
	remarks: '',
};
export const RM_MATERIAL_ORDER_AGAINST_EDIT_SCHEMA = {
	trx_quantity: NUMBER_DOUBLE_REQUIRED,
	wastage: NUMBER_DOUBLE,
	remarks: STRING.nullable(),
};

export const RM_MATERIAL_ORDER_AGAINST_EDIT_NULL = {
	uuid: null,
	material_stock_id: null,
	section: '',
	trx_quantity: '',
	wastage: '',
	issued_by: '',
	remarks: '',
};

// Swatch Schema
export const SWATCH_SCHEMA = {
	remarks: STRING.nullable(),
};

export const SWATCH_NULL = {
	order_entry_id: null,
	remarks: '',
};

// SFG Production

export const SFG_PRODUCTION_SCHEMA = {
	production_quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0),
	wastage: NUMBER_DOUBLE,
	remarks: STRING.nullable(),
};

export const SFG_PRODUCTION_NULL = {
	id: null,
	order_entry_id: null,
	section: '',
	used_quantity: '',
	production_quantity: '',
	wastage: '',
	issued_by: '',
	remarks: '',
};

// SFG Transaction
// id	order_entry_id	trx_from	trx_to	trx_quantity	issued_by

export const SFG_TRX_SCHEMA = {
	trx_quantity: NUMBER_DOUBLE_REQUIRED.moreThan(0),
	remarks: STRING.nullable(),
};

export const SFG_TRX_NULL = {
	id: null,
	order_entry_id: null,
	trx_from: '',
	trx_to: '',
	trx_quantity: '',
	issued_by: '',
	remarks: '',
};

// Slider Die Casting

export const SLIDER_DIE_CASTING_SCHEMA = {
	array: yup.array().of(
		yup.object().shape({
			mc_no: NUMBER_REQUIRED,
			die_casting_uuid: STRING_REQUIRED,
			order_info_uuid: STRING_REQUIRED,
			cavity_goods: NUMBER_DOUBLE_REQUIRED,
			cavity_defect: NUMBER_DOUBLE_REQUIRED,
			push: NUMBER_DOUBLE_REQUIRED,
			weight: NUMBER_DOUBLE_REQUIRED,
			remarks: STRING.nullable(),
		})
	),
};

export const SLIDER_DIE_CASTING_NULL = {
	array: [
		{
			mc_no: '',
			die_casting_uuid: '',
			order_info_uuid: '',
			cavity_goods: '',
			cavity_defect: '',
			push: '',
			weight: '',
			remarks: '',
		},
	],
};

// Slider Assembly

export const SLIDER_SLIDER_ASSEMBLY_SCHEMA = {
	slider_slider_assembly_details: yup.array().of(
		yup.object().shape({
			slider_slider_assembly_uuid: STRING,
			order_number: STRING,
			party: STRING,
			slider_item_id: STRING_REQUIRED,
			production_quantity: NUMBER_DOUBLE_REQUIRED,
			production_weight: NUMBER_DOUBLE_REQUIRED,
			remarks: STRING.nullable(),
		})
	),
};

export const SLIDER_SLIDER_ASSEMBLY_NULL = {
	slider_slider_assembly_details: [
		{
			slider_slider_assembly_uuid: '',
			order_number: '',
			party: '',
			slider_item_id: '',
			production_quantity: '',
			production_weight: '',
			remarks: '',
		},
	],
};

// Item Library (Die Casting, Slider Assembly)

export const ITEM_LIBRARY_SCHEMA = {
	name: STRING_REQUIRED,
	short_name: STRING,
	remarks: STRING.nullable(),
};

export const ITEM_LIBRARY_NULL = {
	id: null,
	name: '',
	short_name: '',
	section: '',
	remarks: '',
};

// Slider Item Transaction (Die Casting, Slider Assembly)

export const SLIDER_ITEM_TRANSACTION_SCHEMA = {
	trx_quantity: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const SLIDER_ITEM_TRANSACTION_NULL = {
	id: null,
	order_entry_id: null,
	trx_from: '',
	trx_to: '',
	trx_quantity: '',
	issued_by: '',
	remarks: '',
};

// Delivery
// Challan
export const CHALLAN_SCHEMA = {
	order_info_id: NUMBER_REQUIRED,
	carton_quantity: NUMBER_REQUIRED,
	challan_entry: yup.array().of(
		yup.object().shape({
			sfg_id: NUMBER,
			max_assign: NUMBER,
			delivery_quantity: NUMBER.max(
				yup.ref('max_assign'),
				'Beyond Max Quantity'
			),
			remarks: STRING.nullable(),
		})
	),
};

export const CHALLAN_NULL = {
	id: null,
	order_info_id: '',
	carton_quantity: '',
	challan_entry: [
		{
			sfg_id: null,
			max_assign: null,
			delivery_quantity: null,
			remarks: '',
		},
	],
};

// Commercial
// PI
export const PI_SCHEMA = {
	lc_uuid: STRING.nullable(),
	marketing_uuid: STRING_REQUIRED,
	party_uuid: STRING_REQUIRED,
	order_info_uuids: JSON_STRING_REQUIRED,
	merchandiser_uuid: STRING_REQUIRED,
	factory_uuid: STRING_REQUIRED,
	bank_uuid: STRING_REQUIRED,
	validity: NUMBER_REQUIRED,
	payment: NUMBER_REQUIRED,
	remarks: STRING.nullable(),
	pi_entry: yup.array().of(
		yup.object().shape({
			is_checked: BOOLEAN,
			sfg_uuid: STRING_REQUIRED,
			pi_uuid: STRING,
			max_quantity: NUMBER,
			pi_quantity: NUMBER_REQUIRED.max(
				yup.ref('quantity'),
				'Beyond Max Quantity'
			),
			remarks: STRING.nullable(),
			isDeletable: BOOLEAN,
		})
	),
};

export const PI_NULL = {
	uuid: null,
	marketing_uuid: '',
	party_uuid: '',
	order_info_uuids: null,
	merchandiser_uuid: '',
	factory_uuid: '',
	bank_uuid: '',
	validity: '',
	payment: '',
	remarks: '',
	pi_entry: [
		{
			is_checked: false,
			sfg_uuid: '',
			pi_uuid: '',
			max_quantity: null,
			pi_quantity: null,
			remarks: '',
			isDeletable: false,
		},
	],
};

export const BANK_SCHEMA = {
	name: STRING_REQUIRED,
	swift_code: STRING_REQUIRED,
	address: STRING_REQUIRED,
	policy: STRING_REQUIRED,
};

export const BANK_NULL = {
	uuid: null,
	name: '',
	swift_code: '',
	address: '',
	policy: '',
	created_at: '',
	updated_at: '',
};

// LC
export const LC_SCHEMA = {
	party_uuid: STRING_REQUIRED,
	file_no: STRING_REQUIRED,
	lc_number: STRING_REQUIRED,
	lc_date: STRING_REQUIRED,
	payment_value: NUMBER_DOUBLE_REQUIRED,
	payment_date: STRING,
	ldbc_fdbc: STRING_REQUIRED,
	acceptance_date: STRING_REQUIRED,
	maturity_date: STRING_REQUIRED,
	commercial_executive: STRING_REQUIRED,
	party_bank: STRING_REQUIRED,
	production_complete: BOOLEAN_REQUIRED,
	lc_cancel: BOOLEAN_REQUIRED,
	handover_date: STRING,
	shipment_date: STRING,
	expiry_date: STRING,
	ud_no: STRING,
	ud_received: STRING,
	at_sight: STRING,
	amd_date: STRING_REQUIRED,
	amd_count: NUMBER_REQUIRED,
	problematical: BOOLEAN_REQUIRED,
	epz: BOOLEAN_REQUIRED,
	remarks: STRING.nullable(),
	pi: yup.array().of(yup.object().shape({})),
};

export const LC_NULL = {
	uuid: null,
	party_uuid: null,
	file_no: '',
	lc_number: '',
	lc_date: '',
	payment_value: '',
	payment_date: '',
	ldbc_fdbc: '',
	acceptance_date: '',
	maturity_date: '',
	commercial_executive: '',
	party_bank: '',
	production_complete: false,
	lc_cancel: false,
	handover_date: '',
	shipment_date: '',
	expiry_date: '',
	ud_no: '',
	ud_received: false,
	at_sight: false,
	amd_date: '',
	amd_count: '',
	problematical: false,
	epz: false,
	remarks: '',
	pi: [
		{
			uuid: null,
		},
	],
};

// Thread
// Count Length
export const THREAD_COUNT_LENGTH_SCHEMA = {
	count_length: STRING_REQUIRED,
	weight: NUMBER_DOUBLE_REQUIRED,
	sst: STRING_REQUIRED,
	remarks: STRING.nullable(),
};

export const THREAD_COUNT_LENGTH_NULL = {
	id: null,
	count_length: '',
	weight: null,
	sst: '',
	remarks: '',
};

// Shade Recipe
export const THREAD_SHADE_RECIPE_SCHEMA = {
	name: STRING_REQUIRED,
	sub_streat: STRING_REQUIRED,
	lab_status: STRING,
	remarks: STRING.nullable(),
	thread_shade_recipe_entry: yup.array().of(
		yup.object().shape({
			material_id: NUMBER_REQUIRED,
			quantity: NUMBER_DOUBLE_REQUIRED,
			remarks: STRING.nullable(),
		})
	),
};

export const THREAD_SHADE_RECIPE_NULL = {
	id: null,
	name: '',
	thread_shade_recipe_uuid: null,
	sub_streat: '',
	lab_status: '',
	remarks: '',
	thread_shade_recipe_entry: [
		{
			id: null,
			thread_shade_recipe_uuid: null,
			material_id: null,
			quantity: '',
			remarks: '',
		},
	],
};

// Order Info Entry
export const THREAD_ORDER_INFO_ENTRY_SCHEMA = {
	party_id: NUMBER_REQUIRED,
	marketing_id: NUMBER_REQUIRED,
	factory_id: NUMBER_REQUIRED,
	merchandiser_id: NUMBER_REQUIRED,
	buyer_id: NUMBER_REQUIRED,
	is_sample: BOOLEAN_REQUIRED,
	is_bill: BOOLEAN_REQUIRED,
	remarks: STRING.nullable(),
	thread_order_info_entry: yup.array().of(
		yup.object().shape({
			lab_ref: STRING,
			po: STRING,
			shade_id: NUMBER_REQUIRED,
			style: STRING_REQUIRED,
			color: STRING_REQUIRED,
			count_length_id: NUMBER_REQUIRED,
			type: STRING_REQUIRED,
			quantity: NUMBER_REQUIRED,
			company_price: NUMBER_DOUBLE,
			party_price: NUMBER_DOUBLE,
			swatch_status: STRING,
			swatch_approval_date: STRING,
			remarks: STRING.nullable(),
		})
	),
};

export const THREAD_ORDER_INFO_ENTRY_NULL = {
	id: null,
	party_id: null,
	marketing_id: null,
	factory_id: null,
	merchandiser_id: null,
	buyer_id: null,
	is_sample: false,
	is_bill: false,
	issued_by: null,
	remarks: '',
	thread_order_info_entry: [
		{
			id: null,
			thread_order_info_uuid: null,
			lab_ref: '',
			po: '',
			shade_id: null,
			style: '',
			color: '',
			count_length_id: null,
			type: '',
			quantity: null,
			company_price: 0,
			party_price: 0,
			swatch_status: '',
			swatch_approval_date: '',
			remarks: '',
		},
	],
};

// * Dyeing Planning SNO schema*//
export const DYEING_PLANNING_SNO_SCHEMA = {
	remarks: STRING.nullable(),
	planning_entry: yup.array().of(
		yup.object().shape({
			sno_quantity: NUMBER.nullable() // Allows the field to be null
				.transform((value, originalValue) =>
					String(originalValue).trim() === '' ? null : value
				) // Transforms empty strings to null
				.max(yup.ref('max_sno_quantity'), ({ max }) => {
					return `Beyond Max Quantity of ${Math.floor(max)}`;
				}),

			sno_remarks: STRING.nullable(),
		})
	),
};

export const DYEING_PLANNING_SNO_NULL = {
	week: '',
	remarks: '',
	planning_entry: yup.array().of(
		yup.object().shape({
			sno_quantity: null,
			factory_quantity: null,
			sno_remarks: '',
			factory_remarks: '',
		})
	),
};

// * Dyeing Planning Head Office schema*//
export const DYEING_PLANNING_HEADOFFICE_SCHEMA = {
	remarks: STRING.nullable(),
	planning_entry: yup.array().of(
		yup.object().shape({
			factory_quantity: NUMBER.nullable() // Allows the field to be null
				.transform((value, originalValue) =>
					String(originalValue).trim() === '' ? null : value
				) // Transforms empty strings to null
				.max(yup.ref('max_factory_quantity'), ({ max }) => {
					return `Beyond Max Quantity of ${Math.floor(max)}`;
				}),

			factory_remarks: STRING.nullable(),
		})
	),
};

export const DYEING_PLANNING_HEADOFFICE_NULL = {
	week: '',
	remarks: '',
	planning_entry: yup.array().of(
		yup.object().shape({
			factory_quantity: null,
			factory_remarks: '',
		})
	),
};

// * Dyeing Planning Batch schema*//

export const DYEING_BATCH_SCHEMA = {
	remarks: STRING.nullable(),
	batch_entry: yup.array().of(
		yup.object().shape({
			quantity: NUMBER.nullable() // Allows the field to be null
				.transform((value, originalValue) =>
					String(originalValue).trim() === '' ? null : value
				) // Transforms empty strings to null
				.max(yup.ref('order_quantity'), 'Beyond Max Quantity'),
			batch_remarks: STRING.nullable(),
		})
	),
};

export const DYEING_BATCH_NULL = {
	remarks: '',
	batch_entry: yup.array().of(
		yup.object().shape({
			quantity: null,
			batch_remarks: '',
		})
	),
};

// * Slide Die Casting Stock*//
export const SLIDER_DIE_CASTING_STOCK_SCHEMA = {
	name: STRING_REQUIRED, //
	item: STRING_REQUIRED, //
	zipper_number: STRING_REQUIRED, //
	end_type: STRING_REQUIRED, //
	puller_type: STRING_REQUIRED, //
	logo_type: STRING_REQUIRED, //
	slider_body_shape: STRING_REQUIRED, //
	puller_link: STRING_REQUIRED, //
	stopper_type: STRING_REQUIRED, //
	// quantity: NUMBER_REQUIRED, //
	// weight: NUMBER_REQUIRED, //
	// pcs_per_kg: NUMBER_REQUIRED, //
	remarks: STRING.nullable(),
	is_body: BOOLEAN_REQUIRED,
	is_puller: BOOLEAN_REQUIRED,
	is_cap: BOOLEAN_REQUIRED,
	is_link: BOOLEAN_REQUIRED,
	is_h_bottom: BOOLEAN_REQUIRED,
	is_u_top: BOOLEAN_REQUIRED,
	is_box_pin: BOOLEAN_REQUIRED,
	is_two_way_pin: BOOLEAN_REQUIRED,
};

export const SLIDER_DIE_CASTING_STOCK_NULL = {
	uuid: null,
	name: '',
	item: '',
	zipper_number: '',
	end_type: '',
	puller_type: '',
	logo_type: '',
	slider_body_shape: '',
	puller_link: '',
	stopper_type: '',
	// quantity: null,
	// weight: null,
	// pcs_per_kg: null,
	created_at: '',
	updated_at: '',
	remarks: '',
	is_body: false,
	is_puller: false,
	is_cap: false,
	is_link: false,
	is_h_bottom: false,
	is_u_top: false,
	is_box_pin: false,
	is_two_way_pin: false,
};
