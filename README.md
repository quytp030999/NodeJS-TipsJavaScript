## 1 - Giao thức giao tiếp
Giao thức giao tiếp giữa API và người dùng luôn sử dụng giao thức HTTPs

## 2 - Tên miền
* https://api.example.com
OR
* https://example.org/api/

## 3 - Phiên bản
https://api.example.com/v1
https://api.example.com/v2

[https://docs.github.com/en/rest/overview/media-types#request-specific-version]

## 4 - Điểm cuối ( Endpoint ): Kết thúc bằng danh từ
* https://api.example.com/v1/zoos
* https://api.example.com/v1/animals
* https://api.example.com/v1/employees

## 5 - OPTIONS HTTP
* GET ( SELECT ): Lấy tài nguyên ( một hoặc nhiều mục ) từ máy chủ
* CREATE ( CREATE ): Tạo một tài nguyên mới trên máy chủ
* PUT ( UPDATE ): Cập nhật tài nguyên trên máy chủ ( máy khách cung cấp tài nguyên đầy đủ sau khi thay đổi )
* PATCH ( UPDATE ): Cập nhật tài nguyên trên máy chủ ( máy chủ cung cấp các thuộc tính đã thay đổi )
* DELETE ( DELETE ): Xóa tài nguyên khỏi máy chủ

AND

* HEAD: lấy siêu dữ liệu của tài nguyên

## 6 - Filtering
?limit=10: Chỉ định số lượng bản ghi được trả về
?offset=10: Chỉ định vị trí bắt đầu của bản ghi được trả về
?page=2&per_page=100: Chỉ định số trang và số lượng bản ghi trên mỗi trang
?sortby=name&order=asc: Chỉ định thuộc tính nào để sắp xếp các kết quả trả về và thư tự sắp xếp

## 7 - Return status
200: Máy chủ trả về thành công dữ liệu do người dùng yêu cầu
201: CREATE- [POST / PUT / PATCH]: Người dùng đã tạo hoặc sửa đổi dữ liệu thành công.
202: Được chấp nhận. Cho biết một yêu cầu đã vào hàng đợi nền ( tác vụ không đồng bộ )
204: Không có nội dung - [DELETE]: Người dùng đã xóa thành công dữ liệu
400: Yêu cầu không hợp lệ - [POST / PUT PATCH]: Có lỗi trong yêu cầu người dùng
401: Unauthorized - [*]: Người dùng không có quyền sử dụng
403: Forbidden - [*]: Người dùng được ủy quyền - Nhưng quyền bị cấm
404: NOT FOUND - [*]: Yêu cầu người dùng gửi là một bản ghi không tồn tại
406: [GET] - Không có định dạng do người dùng yêu cầu
410: [GET]: Tài nguyên do người dùng yêu cầu đã bị xóa vĩnh viễn
422: [POST / PUT / PATCH]: Không thể xử lý khi tạo một đối tượng
500: LỖI NỘI MÁY CHỦ

## 8 - Xử lý lỗi
{
    error: "Invalid API Key"
}

## 9 - Return
GET / collection: Trả về mảng đối tượng
GET / collection / resource: Trả về một đối tượng
POST / collection: Trả về đối tượng tài nguyên mới được tạo
PUT / collection / resource: Trả về tài nguyên hoàn chỉnh
PATCH / collection / resource: Trả về tài nguyên hoàn chỉnh
DELETE / collection / resource: Trả về tài nguyên trống

## 10 - Docs
https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm
https://en.wikipedia.org/wiki/Roy_Fielding

## 11 - HATEOAS

## 12 - Route
* "/abc" <=>  /abc
* /ab?cd <=>  /acd or /bcd
* /ab+cd <=> anythings
* /a/ <=> regExp
* /.*flt$/ <=> RegExp anything with fly