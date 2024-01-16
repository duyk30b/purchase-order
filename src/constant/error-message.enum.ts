export enum ErrorMessageEnum {
  // ================= General error message ===============================
  NOT_FOUND = 'Dữ liệu không tìm thấy',
  INTERNAL_SERVER_ERROR = 'Lỗi máy chủ',
  UNAUTHORIZED = 'Không được ủy quyền',
  FORBIDDEN = 'Quyền truy cập bị từ chối',
  BAD_REQUEST = 'Yêu cầu không hợp lệ',
  SUCCESS = 'Thành công',
  NOT_ACCEPTABLE = 'Không có quyền truy cập',

  // ================= END General error message ===============================

  // ================= Ware error message ===============================
  WAREHOUSE_NOT_FOUND = 'Dữ liệu Kho không tồn tại',
  WAREHOUSE_TYPE_NOT_FOUND = 'Dữ liệu Kiểu Kho không tồn tại',
  COMPANY_NOT_FOUND = 'Dữ liệu Công Ty không tồn tại',
  FACTORY_NOT_FOUND = 'Dữ liệu Nhà Máy không tồn tại',
  CODE_IS_ALREADY_EXISTS = 'Dữ liệu Mã đã tồn tại',
  CODE_ALREADY_EXISTS = 'Dữ liệu Mã đã tồn tại',
  NAME_ALREADY_EXISTS = 'Dữ liệu Tên đã tồn tại',
  INVALID_QUANTITY = 'Số lượng không hợp lệ',
  UPDATE_FAILED = 'Sửa không thành công',
  CAN_NOT_DELETE = 'Bản ghi này không thể xóa',
  CAN_NOT_UPDATE = 'Bản ghi này không thể sửa',
  //

  // ================= Inventory error message ===============================
  CAN_NOT_DELETE_INVENTORY = 'Dữ liệu hàng tồn kho không thể xóa',
  CAN_NOT_UPDATE_QUANTITY = 'Dữ liệu số lượng hàng tồn kho không thể sửa',
  INVENOTRY_IS_EXIST = 'Dữ liệu hàng tồn kho đã tồn tại',
  //

  // ================= Sale error message ===============================
  ORDER_ITEM_NOT_FOUND = 'Không thể tìm thấy dữ liệu sản phẩm trong đơn hàng',
  ORDER_ITEM_QUANTITY_TOO_LARGE = 'Số lượng sản phẩm quá lớn',
  ORDER_NOT_ENOUGH_ITEM_IN_STOCK = 'Không có đủ mặt hàng trong kho',
  CODE_EXIST = 'Dữ liệu Mã đã tồn tại',
  INVALID_DATE_RANGE = 'Phạm vi ngày không hợp lệ',
  //

  // ================= Transfer error message ===============================
  CAN_NOT_UPDATE_TRANSFER = 'Không thể cập nhật chuyển khoản',
  MUST_NOT_SAME_FACROTY = 'Phải không cùng một nhà máy',
  MUST_SAME_FACROTY = 'Phải cùng một nhà máy',
  //
  MIMETYPE_FILE = 'Định dạng file không hợp lệ',
}
