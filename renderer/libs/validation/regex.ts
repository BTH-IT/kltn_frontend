/* eslint-disable no-useless-escape */
export const downloadFormRegex = {
  regexEmail:
    /^([\w.-]+)@(\[(\d{1,3}\.){3}|(?!gmail|yahoo)(([a-zA-Z\d-]+\.)+))([a-zA-Z]{2,4}|\d{1,3})(\]?)$/,
  phoneNumber:
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/,
};

export const REGEX = {
  CREDIT_CARD: /^([0-9]{12,17})$/,
  PASSWORD: /^([A-Za-z0-9]{6,16})$/,
  SPECIAL_CHARACTER: / [!"`'#%&,:;<>=@{}~«\$\(\)\*\+\/\\\?\[\]\^\|]+/g,
  SPECIAL_CHARACTER_EXCEPT_COMMA:
    /[!"`'#%&:;<>=@{}~«\$\(\)\*\+\/\\\?\[\]\^\|]+/g,
  KATAKANA: /^[ァ-ン]+$/,
  KANJI: /^[一-龥]+$/,
  KANJI_ROMAJI: /^[a-zA-Z一-龥]+$/,
  ONLY_NUMBER: /^[0-9]*$/,
  NON_DIGIT: /\D+/g,
  PHONE: /^(090|080|070|060)\d{8}$/,
  TELEPHONE: /^(\s*|\d{10})$/,
  FAX: /^$|^[0-9](-|\d){1,18}[0-9]$/,
  WHITESPACE: /^(\S)*$/,
  HAFTSIZE: /^[a-zA-Z0-9!"`'#%&,:;<>=@{}~«\$\(\)\*\+\/\\\?\[\]\^\|]+$/,
  NO_NUMBER_SPECIAL: /^[a-zAぁ-んァ-ン一-龥]+$/,
  IMAGE_TYPE: /^image\/\w*/i,
  PDF_TYPE: /^application\/pdf$/i,
  VIDEO_TYPE: /^video\/\w*/i,
  POSTAL_CODE: /^$|^\d{7}$/,
  NOSTARTWHITESPACE: /^(\s|\S)*[^\s][^]*$/,
  TIME_RANGE: /^([0-1][0-9]|2[0-3]):[0-5][0-9]~([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
  TIME: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
  DATE_JAPAN: /^(\d{2,4})\/(\d{1,2})\/(\d{1,2})$/g,
  EMAIL:
    /^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  PHONE_NUMBER: /^\d{8,15}$/,
  PERCENT_VALUE: /^(?:100|[1-9]\d|\d)$/,
  CHARACTER: /([a-z])([A-Z])/g,
  PRICE_FORMAT: /\d{1,3}(?=(\d{3})+(?!\d))/g,
  NAME_CUSTOMER: /^[A-Za-z\s]+$/,
  ACCEPT_VIET_NO_SPC_CHAR: /^[a-zA-ZÀ-ỹ]+(?:\s[a-zA-ZÀ-ỹ]+)*$/g,
  CURRENCY: /\B(?=(\d{3})+(?!\d))/g,
};
