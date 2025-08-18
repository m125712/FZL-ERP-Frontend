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

export const FISCAL_YEAR_SCHEMA = {
	year_no: NUMBER_REQUIRED,
	start_date: STRING_REQUIRED,
	end_date: STRING_REQUIRED,
	active: BOOLEAN_REQUIRED,
	locked: BOOLEAN_REQUIRED,
	jan_budget: NUMBER_DOUBLE_REQUIRED,
	feb_budget: NUMBER_DOUBLE_REQUIRED,
	mar_budget: NUMBER_DOUBLE_REQUIRED,
	apr_budget: NUMBER_DOUBLE_REQUIRED,
	may_budget: NUMBER_DOUBLE_REQUIRED,
	jun_budget: NUMBER_DOUBLE_REQUIRED,
	jul_budget: NUMBER_DOUBLE_REQUIRED,
	aug_budget: NUMBER_DOUBLE_REQUIRED,
	sep_budget: NUMBER_DOUBLE_REQUIRED,
	oct_budget: NUMBER_DOUBLE_REQUIRED,
	nov_budget: NUMBER_DOUBLE_REQUIRED,
	dec_budget: NUMBER_DOUBLE_REQUIRED,
	currency_uuid: STRING_REQUIRED,
	rate: NUMBER_DOUBLE_REQUIRED,
	remarks: STRING.nullable(),
};

export const FISCAL_YEAR_NULL = {
	uuid: null,
	year_no: '',
	start_date: '',
	end_date: '',
	activate: false,
	locked: false,
	jan_budget: 0,
	feb_budget: 0,
	mar_budget: 0,
	apr_budget: 0,
	may_budget: 0,
	jun_budget: 0,
	jul_budget: 0,
	aug_budget: 0,
	sep_budget: 0,
	oct_budget: 0,
	nov_budget: 0,
	dec_budget: 0,
	currency_uuid: '',
	rate: 0,
	remarks: '',
};
