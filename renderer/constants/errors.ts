export const getMessageError = (error: string, char: number | string) => {
  const replacedStr = error.replace('${0}', String(char));
  return replacedStr;
};

export const ERROR_MESSAGES = {
  INTERNAL_ERROR: 'Internal server error',
  UNAUTHENTICATED: 'Unauthenticated',
  UNAUTHORIZED: 'Không có quyền truy cập',
  NOT_FOUND: 'Not found',
  INVALID_CREDENTIAL: 'Username or password is not correct',
  EMAIL_ALREADY_TAKEN: 'This email is already taken',
  EMAIL_NOT_FOUND: 'This email is not found',
  ACCOUNT_NOT_VERIFY: 'Your account has not yet been verified',
  INVALID_TOKEN: 'This token is not valid',
  PHONE_NUMBER: 'Vui lòng nhập số điện thoại',
  BLOCKED_ACCOUNT:
    'Tài khoản của bạn đã bị khoá. Vui lòng liên hệ Spa để được trợ giúp.',
  EMAIL_INVALID: 'Địa chỉ email không đúng',
  PASSWORD_MATCH: 'Mật khẩu không trùng khớp',
  DOCUMENT_REQUIRED: 'Vui lòng thêm tài liệu',
  BUDGET_FEE_MIN: 'Ngân sách phải lớn hơn hoặc bằng 1',
  FOUNDED_YEAR: 'Vui lòng nhập ngày thành lập công ty',
  ABOUT_THE_SYSTEM_MIN:
    'Vui lòng cho chúng tôi biết về hệ thống bạn muốn phát triển và các sáng kiến bạn muốn thực hiện.',
  ABOUT_THE_PURPOSE:
    'Xin vui lòng cho chúng tôi biết về mục đích phát triển và hướng đi của dự án.',
  EBOOK_CATEGORY_MAX: 'Danh mục chỉ được chọn tối đa là 3',
  EBOOK_CATEGORY_REQUIRED: 'Vui lòng nhập danh mục',
  DESCRIPTION_REQUIRED: 'Vui lòng nhập mô tả',
  TITLE_REQUIRED: 'Vui lòng nhập tiêu đề',
  IMAGE_REQUIRED: 'Vui lòng thêm ảnh',
  FEE_CAPITAL_REQUIRED: 'Vui lòng nhập thủ đô',
  FEE_AREA_REQUIRED: 'Vui lòng nhập khu vực của bạn.',
  CONTENT_REQUIRED: 'Vui lòng nhập nội dung',
  NAME_SERVICE_REQUIRED: 'Vui lòng nhập tên dịch vụ',
  CATEGORY_REQUIRED: 'Vui lòng chọn danh mục',
  COST_REQUIRED: 'Vui lòng nhập giá vốn',
  PRICE_REQUIRED: 'Vui lòng nhập giá bán',
  CATEGORY_NAME_REQUIRED: 'Vui lòng nhập tên danh mục',
  CATEGORY_BG_REQUIRED: 'Vui lòng nhập màu nền',
  AGREE_POLICY: 'Vui lòng đồng ý với chính sách',
  END_TIME_REQUIRED: 'Vui lòng nhập giờ kết thúc',
  START_TIME_REQUIRED: 'Vui lòng nhập giờ bắt đầu',
  POSITION_REQUIRED: 'Vui lòng chọn vị trí',
  MAXIMUM_CHARACTER: 'Tối đa ${0} kí tự',
  MINIMUM_CHARACTER: 'Tối thiểu ${0} kí tự',
  REQUIRED: 'Vui lòng nhập ${0}',
  REQUIRED_CHOOSE: 'Vui lòng chọn ${0}',
  FILE_SIZE: 'Vui lòng chọn ảnh bé hơn ${0}MB',
  NOT_VALID: '${0} không hợp lệ',
  IMAGE_TYPE: 'Vui lòng chọn ảnh có định dạng ${0}',
  NOT_RIGHT: '${0} không đúng',
  NOT_VALID_ACCOUNT: 'Tài khoản hoặc mật khẩu không đúng',
  ONLY_NUMBER: 'Vui lòng nhập số',
  ORDER_NOT_EMPTY_CUSTOMER_NAME: 'Vui lòng nhập tên',
  ORDER_NOT_EMPTY_PHONE_NUMBER: 'Vui lòng nhập số điện thoại',
  ORDER_INVALID_PHONE: 'Số điện thoại không hợp lệ',
  ORDER_LESS_THAN_8_DIGIT: 'Không đúng, bé hơn 8 ký tự	',
  ORDER_GREATER_THAN_15_DIGIT: 'Không đúng, lớn hơn 8 ký tự	',
  ORDER_ONLY_NUMBER: 'Hãy nhập kí tự số',
  ORDER_PERCENT_RANGE_VALUE: 'Hãy nhập trong giá trị %',
  MUST_BE_NUMBER: 'Vui lòng nhập số',
  ORDER_CUSTOMER_GIVEN_REQUIRED: 'Vui lòng nhập số tiền thu từ khách',
  FILE_REQUIRED: 'Vui lòng tải hình lên',
  MAX_FILE_SIZE: 'Vui lòng chọn hình ảnh dưới 5MB',
  NOT_EXIST: '${0} không tồn tại',
  DISTANCE_NUMBER: 'Khoảng cách phải lớn hơn hoặc bằng 1',
  PAYMENT_FAILED: 'Thanh toán không thành công',
  INVALID_PAID_PRICE_WITH_GIVEN_PRICE:
    'Tiền thu từ khách không thể bé hơn tiền thanh toán',
  INVALID_PAID_PRICE_WITH_TOTAL_PRICE:
    'Tiền thanh toán khách không thể lớn hơn tổng tiền',
  INVALID_NAME: 'Tên không hợp lệ',
  UN_AUTHORIZE:
    'Tài khoản chưa được phân quyền, vui lòng liên hệ nhà quản trị để biết thêm thông tin',
};

export const SUCCESS_MESSAGES = {
  ORDER_SUCCESS: 'Đã đặt hàng thành công',
};

export const ORDER_ERROR_MESSAGE = {
  NOT_EMPTY_CUSTOMER_NAME: 'Vui lòng nhập tên',
  NOT_EMPTY_PHONE_NUMBER: 'Vui lòng nhập số điện thoại',
  LESS_THAN_8_DIGIT: 'Không đúng, bé hơn 8 ký tự	',
  GREATER_THAN_15_DIGIT: 'Không đúng, lớn hơn 8 ký tự	',
  ONLY_NUMBER: 'Hãy nhập kí tự số',
  PERCENT_RANGE_VALUE: 'Hãy nhập trong giá trị %',
};
