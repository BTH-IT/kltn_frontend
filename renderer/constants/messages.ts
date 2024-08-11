export const getMessage = (string: string, char?: number | string) => {
  const replacedStr = string.replace('${0}', String(char));
  return replacedStr;
};

export const MESSAGES = {
  CREATE_SUCCESS: 'Thêm ${0} mới thành công',
  EDIT_SUCCESS: 'Chỉnh sửa ${0} thành công',
  DELETE_SUCCESS: 'Xoá ${0} thành công',
  BLOCK_CUSTOMER: 'Đã ngừng hoạt động khách hàng này',
  UNBLOCK_CUSTOMER: 'Đã bật hoạt động khách hàng này',
  ALLOWED_IMAGE: 'Cho phép PNG hoặc JPEG. Kích thước tối đa ${0}',
  UPDATE_PASSWORD_SUCCESS: 'Đổi mật khẩu mới thành công',
  PAYMENT_SUCCESS: 'Thanh toán thành công',
};
