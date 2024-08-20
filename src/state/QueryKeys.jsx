/**
 *? Effective React Query Keys
 ** https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
 ** https://tkdodo.eu/blog/leveraging-the-query-function-context#query-key-factories
 **/

import { all } from 'axios';
import { useVislonFinishingRM } from './Vislon';

export const orderQK = {
	all: () => ['order'],

	// details
	details: () => [...orderQK.all(), 'details'],
	detail: (uuid) => [...orderQK.details(), uuid],
	detailByOrderNumber: (orderNumber) => [...orderQK.details(), orderNumber],
	detailsByOrderDescription: (orderNumber, uuid) => [
		...orderQK.details(),
		orderNumber,
		uuid,
	],

	// Description
	descriptions: () => [...orderQK.all(), 'description'],
	description: (uuid) => [...orderQK.descriptions(), uuid],

	// Entry
	entries: () => [...orderQK.all(), 'entries'],
	entry: (uuid) => [...orderQK.entries(), uuid],

	// info
	infos: () => [...orderQK.all(), 'info'],
	info: (id) => [...orderQK.infos(), id],

	// buyers
	buyers: () => [...orderQK.all(), 'buyer'], // [order, buyer]
	buyer: (uuid) => [...orderQK.buyers(), uuid], // [order, buyer, uuid]

	// marketing
	marketings: () => [...orderQK.all(), 'marketing'],
	marketing: (uuid) => [...orderQK.marketings(), uuid],

	// marketing
	factories: () => [...orderQK.all(), 'factory'],
	factory: (uuid) => [...orderQK.factories(), uuid],

	// merchandisers
	merchandisers: () => [...orderQK.all(), 'merchandisers'],
	merchandiser: (uuid) => [...orderQK.merchandisers(), uuid],
	//Party
	party: () => [...orderQK.all(), 'party'],
	partyByUUID: (uuid) => [...orderQK.party(), uuid],
	//properties
	properties: () => [...orderQK.all(), 'properties'],
	propertiesByUUID: (uuid) => [...orderQK.party(), uuid],

	// info
	info: () => [...orderQK.all(), 'info'],
	infoByUUID: (uuid) => [...orderQK.info(), uuid],
};

export const adminQK = {
	all: () => ['admin'],

	// departments
	departments: () => [...adminQK.all(), 'departments'],
	department: (uuid) => [...adminQK.departments(), uuid],

	// designation
	designations: () => [...adminQK.all(), 'designations'],
	designation: (uuid) => [...adminQK.designations(), uuid],

	// users
	users: () => [...adminQK.all(), 'users'],
	user: (uuid) => [...adminQK.users(), uuid],
};

export const commercialQK = {
	all: () => ['commercial'],

	// bank
	banks: () => [...commercialQK.all(), 'bank'],
	bank: (uuid) => [...commercialQK.banks(), uuid],

	// pi
	pis: () => [...commercialQK.all(), 'pi'],
	pi: (uuid) => [...commercialQK.pis(), uuid],
	piByOrderInfo: (orderId, partyId, marketingId) => [
		...commercialQK.pis(),
		orderId,
		partyId,
		marketingId,
	],

	// pi-entry
	piEntries: () => [...commercialQK.all(), 'pi-entry'],
	piEntry: (uuid) => [...commercialQK.piEntries(), uuid],

	// lc
	lcs: () => [...commercialQK.all(), 'lc'],
	lc: (uuid) => [...commercialQK.lcs(), uuid],
	lcPi: (uuid) => [...commercialQK.all(), 'lc-pi', uuid],
	lcNumber: (uuid) => [...commercialQK.all(), 'lc-number', uuid],
};

// Material Query Keys
export const materialQK = {
	all: () => ['material'],

	// section
	sections: () => [...materialQK.all(), 'section'],
	section: (uuid) => [...materialQK.sections(), uuid],

	// types
	types: () => [...materialQK.all(), 'type'],
	type: (uuid) => [...materialQK.types(), uuid],

	// infos
	infos: () => [...materialQK.all(), 'info'],
	info: (uuid) => [...materialQK.infos(), uuid],

	// trx
	trxs: () => [...materialQK.all(), 'trx'],
	trx: (uuid) => [...materialQK.trxs(), uuid],

	// stock to sfg
	stockToSGFs: () => [...materialQK.all(), 'stock-to-sfg'],
	stockToSFG: (uuid) => [...materialQK.stockToSGFs(), uuid],

	// *TrxAgainstOrderDescription//
	trxAgainstOrderDescriptions: () => [
		...materialQK.all(),
		'trx-against-order-description',
	],
	trxAgainstOrderDescription: (uuid) => [
		...materialQK.trxAgainstOrderDescriptions(),
		uuid,
	],
};

// Purchase Query Keys
export const purchaseQK = {
	all: () => ['purchase'],

	// vendor
	vendors: () => [...purchaseQK.all(), 'vendors'],
	vendor: (uuid) => [...purchaseQK.vendors(), uuid],

	// description
	descriptions: () => [...purchaseQK.all(), 'description'],
	description: (uuid) => [...purchaseQK.descriptions(), uuid],

	// entry
	entries: () => [...purchaseQK.all(), 'entries'],
	entry: (uuid) => [...purchaseQK.entries(), uuid],

	// details
	details: () => [...purchaseQK.all(), 'details'],
	detail: (uuid) => [...purchaseQK.details(), uuid],
};

//Library
export const libraryQK = {
	all: () => ['library'],
	// users
	users: () => [...libraryQK.all(), 'users'],
	userByUUID: (uuid) => [...libraryQK.users(), uuid],
	// policies
	policies: () => [...libraryQK.all(), 'policies'],
	policyByUUID: (uuid) => [...libraryQK.policies(), uuid],
};

//Common
export const commonQK = {
	all: () => ['common'],

	// * tapeSFG
	tapeSFG: () => [...commonQK.all(), 'tape/SFG'],
	tapeSFGByUUID: (uuid) => [...commonQK.tapeSFG(), uuid],
	// * tapeProduction
	tapeProduction: () => [...commonQK.all(), 'tape/production'],
	tapeProductionByUUID: (uuid) => [...commonQK.tapeProduction(), uuid],

	// * tapeToCoil
	tapeToCoil: () => [...commonQK.all(), 'tape/to-coil'],
	tapeToCoilByUUID: (uuid) => [...commonQK.tapeToCoil(), uuid],
	// * tapeRM
	tapeRM: () => [...commonQK.all(), 'tape/rm'],
	tapeRMByUUID: (uuid) => [...commonQK.tapeRM(), uuid],

	// * tapeRMLog
	tapeRMLog: () => [...commonQK.all(), 'tape/rm-log'],
	tapeRMLogByUUID: (uuid) => [...commonQK.tapeRMLog(), uuid],

	// *  Order Against Tape RM Log * //
	orderAgainstTapeRMLog: () => [
		...commonQK.all(),
		'tape/order/against/rm-log',
	],
	orderAgainstTapeRMLogByUUID: (uuid) => [
		...commonQK.orderAgainstTapeRMLog(),
		uuid,
	],
	// * coilSFG
	coilSFG: () => [...commonQK.all(), 'coil/SFG'],
	coilSFGByUUID: (uuid) => [...commonQK.coilSFG(), uuid],

	// * coilProduction
	coilProduction: () => [...commonQK.all(), 'coil/production'],
	coilProductionByUUID: (uuid) => [...commonQK.coilProduction(), uuid],

	// * coilRM
	coilRM: () => [...commonQK.all(), 'coil/rm'],
	coilRMByUUID: (uuid) => [...commonQK.coilRM(), uuid],
	// * coilRMLog
	coilRMLog: () => [...commonQK.all(), 'coil/rm-log'],
	coilRMLogByUUID: (uuid) => [...commonQK.coilRMLog(), uuid],
	// * materialUsed
	materialUsed: () => [...commonQK.all(), 'material/used'],
	materialUsedByUUID: (uuid) => [...commonQK.materialUsed(), uuid],

	// * Coil Order Against Coil RM Log * //
	orderAgainstCoilRMLog: () => [
		...commonQK.all(),
		'coil/order/against/rm-log',
	],
	orderAgainstCoilRMLogByUUID: (uuid) => [
		...commonQK.orderAgainstCoilRMLog(),
		uuid,
	],
	// * MATERIAL TRX *//
	materialTrx: () => [...commonQK.all(), 'material/trx'],
	materialTrxByUUID: (uuid) => [...commonQK.materialTrx(), uuid],
};

// * LabDip * //
export const labDipQK = {
	all: () => ['labDip'],
	// recipe
	recipe: () => [...labDipQK.all(), 'recipe'],
	recipeByUUID: (uuid) => [...labDipQK.recipe(), uuid],

	// info
	info: () => [...labDipQK.all(), 'info'],
	infoByUUID: (uuid) => [...labDipQK.info(), uuid],

	// * RM
	LabDipRM: () => [...labDipQK.all(), 'rm'],
	LabDipRMByUUID: (uuid) => [...labDipQK.LabDipRM(), uuid],

	// * RM Log
	LabDipRMLog: () => [...labDipQK.all(), 'rm-log'],
	LabDipRMLogByUUID: (uuid) => [...labDipQK.LabDipRMLog(), uuid],

	// * Order Against lab_dip RM Log * //
	orderAgainstLabDipRMLog: () => [
		...labDipQk.all(),
		'lab_dip/order-against-rm-log',
	],
	orderAgainstLabDipRMLogByUUID: (uuid) => [
		...labDipQk.orderAgainstLabDipRMLog(),
		uuid,
	],
};

// * Dyeing

export const dyeingQK = {
	all: () => ['dyeing'],

	// * RM
	dyeingRM: () => [...dyeingQK.all(), 'rm'],
	dyeingRMByUUID: (uuid) => [...dyeingQK.dyeingRM(), uuid],

	// * RM Log
	dyeingRMLog: () => [...dyeingQK.all(), 'rm-log'],
	dyeingRMLogByUUID: (uuid) => [...dyeingQK.dyeingRMLog(), uuid],

	// * swatch
	swatch: () => [...dyeingQK.all(), 'swatch'],
	swatchByUUID: (uuid) => [...dyeingQK.swatch(), uuid],

	// * planning
	planning: () => [...dyeingQK.all(), 'planning'],
	planningByUUID: (uuid) => [...dyeingQK.planning(), uuid],
	// * Order Against dyeing RM Log * //
	orderAgainstDyeingRMLog: () => [
		...dyeingQk.all(),
		'dyeing/order-against-rm-log',
	],
	orderAgainstDyeingRMLogByUUID: (uuid) => [
		...dyeingQk.orderAgainstDyeingRMLog(),
		uuid,
	],
};

// * Nylon
export const nylonQK = {
	all: () => ['nylon'],

	// * Metallic Finishing
	// * RM

	nylonMetallicFinishingRM: () => [...nylonQK.all(), 'rm'],
	nylonMetallicFinishingRMByUUID: (uuid) => [
		...nylonQK.nylonMetallicFinishingRM(),
		uuid,
	],

	//* RM Log
	nylonMetallicFinishingRMLog: () => [...nylonQK.all(), 'rm-log'],
	nylonMetallicFinishingLogByUUID: (uuid) => [
		...nylonQK.nylonMetallicFinishingRMLog(),
		uuid,
	],

	// * Order Against nylonFinishing RM Log * //
	orderAgainstNylonFinishingRMLog: () => [
		...nylonFinishingQk.all(),
		'nylonFinishing/order-against-rm-log',
	],
	orderAgainstNylonFinishingRMLogByUUID: (uuid) => [
		...nylonFinishingQk.orderAgainstNylonFinishingRMLog(),
		uuid,
	],
};
// *Vislon
export const vislonQK = {
	all: () => ['vislon'],
	//* Teeth Molding

	// * RM
	VislonTMRM: () => [...vislonQK.all(), 'tm-rm'],
	VislonTMRMByUUID: (uuid) => [...vislonQK.VislonTMRM(), uuid],

	// * RM Log
	VislonTMRMLog: () => [...vislonQK.all(), 'tm-rm-log'],
	VislonTMRMLogByUUID: (uuid) => [...vislonQK.VislonTMRMLog(), uuid],

	// * Order Against vislonTMRMLog * //// * Order Against vislonTM RM Log * //
	orderAgainstVislonTMRMLog: () => [
		...vislonTMQk.all(),
		'vislonTM/order-against-rm-log',
	],
	orderAgainstVislonTMRMLogByUUID: (uuid) => [
		...vislonTMQk.orderAgainstVislonTMRMLog(),
		uuid,
	],

	// * Finishing

	//*RM
	VislonFinishingRM: () => [...vislonQK.all(), 'fin-rm'],
	VislonFinishingRMByUUID: (uuid) => [
		...vislonQK.VislonFinishingRM(),
		'rm',
		uuid,
	],

	//*RM Log
	VislonFinishingRMLog: () => [...vislonQK.all(), 'fin-rm-log'],
	VislonFinishingRMLogByUUID: (uuid) => [
		...vislonQK.VislonFinishingRMLog(),
		'rm-log',
		uuid,
	],

	// * Order Against vislonFinishing RM Log * //
	orderAgainstVislonFinishingRMLog: () => [
		...vislonFinishingQk.all(),
		'vislonFinishing/order-against-rm-log',
	],
	orderAgainstVislonFinishingRMLogByUUID: (uuid) => [
		...vislonFinishingQk.orderAgainstVislonFinishingRMLog(),
		uuid,
	],
};

// * Metal

export const metalQK = {
	all: () => ['metal'],

	//* Teeth Molding

	// * RM
	metalTMRM: () => [...metalQK.all(), 'tm-rm'],
	metalTMRMByUUID: (uuid) => [...metalQK.metalTMRM(), uuid],

	// * RM Log
	metalTMRMLog: () => [...metalQK.all(), 'tm-rm-log'],
	metalTMRMLogByUUID: (uuid) => [...metalQK.metalTMRMLog(), uuid],

	// * Order Against Metal TM RM Log * //
	orderAgainstMetalTMRMLog: () => [
		...metalTMQk.all(),
		'metalTM/order-against-rm-log',
	],
	orderAgainstMetalTMRMLogByUUID: (uuid) => [
		...metalTMQk.orderAgainstMetalTMRMLog(),
		uuid,
	],

	// * Finishing

	//*RM
	metalFinishingRM: () => [...metalQK.all(), 'fin-rm'],
	metalFinishingRMByUUID: (uuid) => [...metalQK.metalFinishingRM(), uuid],

	//*RM Log
	metalFinishingRMLog: () => [...metalQK.all(), 'fin-rm-log'],
	metalFinishingRMLogByUUID: (uuid) => [
		...metalQK.metalFinishingRMLog(),
		uuid,
	],

	// * Order Against metalFinishing RM Log * //
	orderAgainstMetalFinishingRMLog: () => [
		...metalFinishingQk.all(),
		'metalFinishing/order-against-rm-log',
	],
	orderAgainstMetalFinishingRMLogByUUID: (uuid) => [
		...metalFinishingQk.orderAgainstmetalFinishingRMLog(),
		uuid,
	],

	//* Teeth Coloring

	// * RM
	metalTCRM: () => [...metalQK.all(), 'tc-rm'],
	metalTCRMByUUID: (uuid) => [...metalQK.metalTCRM(), uuid],

	// * RM Log
	metalTCRMLog: () => [...metalQK.all(), 'tc-rm-log'],
	metalTCRMLogByUUID: (uuid) => [...metalQK.metalTCRMLog(), uuid],
	// * Order Against metalTC RM Log * //
	orderAgainstMetalTCRMLog: () => [
		...metalTCQk.all(),
		'metalTC/order-against-rm-log',
	],
	orderAgainstMetalTCRMLogByUUID: (uuid) => [
		...metalTCQk.orderAgainstMetalTCRMLog(),
		uuid,
	],
};

// *Slider

export const sliderQK = {
	all: () => ['slider'],
	// *Slider Assembly

	// * RM
	sliderAssemblyRM: () => [...sliderQK.all(), 'assembly-rm'],
	sliderAssemblyRMByUUID: (uuid) => [...sliderQK.sliderAssemblyRM(), uuid],

	// * RM Log
	sliderAssemblyRMLog: () => [...sliderQK.all(), 'assembly-rm-log'],
	sliderAssemblyRMLogByUUID: (uuid) => [
		...sliderQK.sliderAssemblyRMLog(),
		uuid,
	],

	// * Order Against sliderAssembly RM Log * //
	orderAgainstSliderAssemblyRMLog: () => [
		...sliderAssemblyQk.all(),
		'sliderAssembly/order-against-rm-log',
	],
	orderAgainstSliderAssemblyRMLogByUUID: (uuid) => [
		...sliderAssemblyQk.orderAgainstSliderAssemblyRMLog(),
		uuid,
	],

	//* Die Casting
	// * RM
	sliderDieCastingRM: () => [...sliderQK.all(), 'dc-rm'],
	sliderDieCastingRMByUUID: (uuid) => [
		...sliderQK.sliderDieCastingRM(),
		uuid,
	],

	// * RM Log
	sliderDieCastingRMLog: () => [...sliderQK.all(), 'dc-rm-log'],
	sliderDieCastingRMLogByUUID: (uuid) => [
		...sliderQK.sliderDieCastingRMLog(),
		uuid,
	],
	// * Order Against dieCasting RM Log * //
	orderAgainstDieCastingRMLog: () => [
		...dieCastingQk.all(),
		'dieCasting/order-against-rm-log',
	],
	orderAgainstDieCastingRMLogByUUID: (uuid) => [
		...dieCastingQk.orderAgainstDieCastingRMLog(),
		uuid,
	],

	//* Coloring
	// * RM
	sliderColoringRM: () => [...sliderQK.all(), 'c-rm'],
	sliderColoringRMByUUID: (uuid) => [...sliderQK.sliderColoringRM(), uuid],

	// * RM Log
	sliderColoringRMLog: () => [...sliderQK.all(), 'c-rm-log'],
	sliderColoringRMLogByUUID: (uuid) => [
		...sliderQK.sliderColoringRMLog(),
		uuid,
	],
	// * Order Against sliderColor RM Log * //
	orderAgainstSliderColorRMLog: () => [
		...sliderColorQk.all(),
		'sliderFinishing/order-against-rm-log',
	],
	orderAgainstSliderColorRMLogByUUID: (uuid) => [
		...sliderColorQk.orderAgainstSliderColorRMLog(),
		uuid,
	],
};
//* Delivery

export const deliveryQk = {
	all: () => ['delivery'],
	// *RM
	deliveryRM: () => [...deliveryQk.all(), 'rm'],
	deliveryRMByUUID: (uuid) => [...deliveryQk.deliveryRM(), uuid],

	// *RM Log
	deliveryRMLog: () => [...deliveryQk.all(), 'rm-log'],
	deliveryRMLogByUUID: (uuid) => [...deliveryQk.deliveryRMLog(), uuid],

	// *  Order Against Delivery RM Log * //
	orderAgainstDeliveryRMLog: () => [
		...deliveryQk.all(),
		'delivery/order-against-rm-log',
	],
	orderAgainstDeliveryRMLogByUUID: (uuid) => [
		...deliveryQk.orderAgainstDeliveryRMLog(),
		uuid,
	],
};
