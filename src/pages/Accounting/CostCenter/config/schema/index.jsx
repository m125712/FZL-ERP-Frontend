import * as yup from 'yup';

import {
	BOOLEAN, // default
	BOOLEAN_DEFAULT_VALUE, // default
	BOOLEAN_REQUIRED, // default
	EMAIL, // default
	EMAIL_REQUIRED, // default
	FORTUNE_ZIP_EMAIL_PATTERN, // default
	JSON_STRING, // default
	JSON_STRING_REQUIRED,
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
	URL_REQUIRED, // default
	UUID, // default
	UUID_FK, // default
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

export const THREAD_COUNT_LENGTH_SCHEMA = {
	count: STRING_REQUIRED,
	length: NUMBER_REQUIRED,
	min_weight: NUMBER_DOUBLE_REQUIRED.max(
		yup.ref('max_weight'),
		'Beyond Max Weight'
	),
	max_weight: NUMBER_DOUBLE_REQUIRED.min(
		yup.ref('min_weight'),
		'Less than Min Weight'
	),
	con_per_carton: NUMBER_REQUIRED.default(0),
	price: NUMBER_DOUBLE_REQUIRED,
	sst: STRING_REQUIRED,
	remarks: STRING.nullable(),
};

export const THREAD_COUNT_LENGTH_NULL = {
	uuid: null,
	count: '',
	length: '',
	min_weight: null,
	max_weight: null,
	con_per_carton: 0,
	price: null,
	sst: '',
	remarks: '',
};
