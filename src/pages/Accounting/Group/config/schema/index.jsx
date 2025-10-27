import {
	BOOLEAN, // default
	BOOLEAN_DEFAULT_VALUE, // default
	BOOLEAN_REQUIRED, // default
	EMAIL, // default
	EMAIL_REQUIRED, // default
	FORTUNE_ZIP_EMAIL_PATTERN, // default
	JSON_STRING, // default
	JSON_STRING_REQUIRED, // default
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
	STRING_REQUIRED,
} from '@/util/Schema/utils';

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

export const GROUP_SCHEMA = {
	// group_number: STRING_REQUIRED,
	// index: NUMBER_REQUIRED,
	name: STRING_REQUIRED,
	head_uuid: STRING_REQUIRED,
	code: STRING_REQUIRED,
	// type: STRING_REQUIRED.default('asset'),
	is_fixed: BOOLEAN_DEFAULT_VALUE(true),
	remarks: STRING.nullable(),
};

export const GROUP_NULL = {
	group_number: null,
	index: 0,
	name: '',
	head_uuid: '',
	code: '',
	is_fixed: true,
	remarks: null,
};
