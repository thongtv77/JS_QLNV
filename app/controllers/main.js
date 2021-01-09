//Instance
var staff = new staffServices();
// var validation = new Validation();
// Function getDOM.
function getELE(id) {
    return document.getElementById(id);
}
GetListStaff();
// Function---GetListStaff
function GetListStaff() {
    var promise = staff.getListStaffServices();
    promise.then(function (result) {
        // Nếu thành công.
        // result chứa nhiều thuộc tính nên cần gọi đến data để lấy dữ liệu từ BE.
        console.log(result.data);
        showTable(result.data);
    })
        .catch(function (error) {
            //Nếu thất bại.
            console.log(error);
        });
}
// Function showTable__1
function showTable(mangDS) {
    var tbody = getELE("tableDanhSach");
    var content = "";
    mangDS.map(function (item) {
        content += `
            <tr>
                <td>${item.taiKhoan}</td>
                <td>${item.hoTen}</td> 
                <td>${item.email}</td>
                <td>${item.ngayLam}</td>    
                <td>${item.chucVu}</td>
                <td>${item.tongLuong}</td> 
                <td>${item.loaiNV}</td>     
                <td>
                    <button class="btn btn-danger" onclick="deleteStaff('${item.id}')">DELETE</button>
                    <button class="btn btn-info" onclick="editStaff('${item.id}')" data-toggle="modal" data-target="#myModal">EDIT</button>
                </td>             
            </tr>
        `;
    });
    tbody.innerHTML = content;
}
getELE("btnThemNV").addEventListener("click", function () {
    addStaff();
});
function addStaff() {
    var taiKhoan = getELE("tknv").value;
    var hoTen = getELE("name").value;
    var email = getELE("email").value;
    var matKhau = getELE("password").value;
    var ngayLam = getELE("datepicker").value;
    var luongCB = getELE("luongCB").value;
    var chucVu = getELE("chucvu").value;
    var gioLam = getELE("gioLam").value;
    var nhanVien = new staff(taiKhoan, hoTen, matKhau, email, ngayLam, luongCB, chucVu, gioLam)
    console.log(nhanVien);
    staff.AddStaffServices(nhanVien)
        .then(function (result) {
            console.log(result);
            //Nếu thêm thành công thì load lại danh sách người dùng.
            GetListStaff();
            getELE("btnDong").click();
        })
        .catch(function (error) {
            console.log(error);
        })

    var iSValid = true;
    // Check account__No Empty__CheckLength
    iSValid &= validation.checkEmpty(taiKhoan, getELE("spanMaSV"), "Mã nhân viên không được để trống!") && validation.checkAccountNumber(taiKhoan, getELE("spanMaSV"), "Mã nhân viên không được trùng!", dssv.mangSV);

    // Ten NV không được để trống và tên phải là chữ
    iSValid &= validation.checkEmpty(hoTen, getELE("tbTKNV"), "Tên NV không được để trống!") && validation.checkLetters(hoTen, getELE("tbTKNV"), "Tên NV không hợp lệ");

    //Email phải đúng format
    iSValid &= validation.checkEmpty(email, getELE("spanEmail"), "Email không được để trống!") && validation.checkEmail(email, getELE("spanEmail"), "Email không hợp lệ!");

    //check mật khẩu: không được để trống và có độ dài 6-10 ký tự và đúng format của mật khẩu(có ít nhất 1 chữ , 1 số, 1 ký tự đặc biệt)
    iSValid &= validation.checkEmpty(matKhau, getELE("spanPass"), "Password không được để trống!") && validation.checkLength(matKhau, getELE("spanPass"), "Password có độ dài từ 6-10 ký tự!", 6, 10) && validation.checkFormartPass(matKhau, getELE("spanPass"), "Password không hợp lệ");

    //check ngày làm: kiểm tra có đúng theo format yyyy/dd/mm
    iSValid &= validation.checkDate(ngayLam, getELE("spanDate"), "Ngày sinh không hợp lệ!");

    //check CHỨC VỤ:phải lựa chọn các option khác cái đầu tiên.
    iSValid &= validation.checkDropdown(getELE("chucvu"), getELE("tbChucVu"), "Hãy chọn đúng chức vụ nhé!");

    //check điểm:không được để tróng và phải là kiểu số (interger, float) không có số âm.
    iSValid &= validation.checkEmpty(toan, getELE("spanToan"), "Điểm Toán không được để trống!") && validation.checkScore(toan, getELE("spanToan", "Điểm toán không hợp lệ"));

    // iSValid = true;
    if (iSValid) {
        //Thể hiện của lớp đối tượng 
        var nhanVien = new staff(taiKhoan, hoTen, matKhau, email, ngayLam, luongCB, chucVu, gioLam);
        nhanVien.tinhDTB(nhanVien.diemToan, sv.diemLy, sv.diemHoa)

        return nhanVien;
    } else {
        return false;
    }


}
//Function Delete Staff__1.1
function deleteStaff(id) {
    staff.DeleteStaffServices(id)
        .then(function (result) {
            //Nếu xóa thành công thì load lại danh sách người dùng.
            GetListStaff();
        })
        .catch(function (error) {
            console.log(error);
        })
}
//Function Edit Staff__1.2
function editStaff(id) {
    staff.GetDetailServices(id)
        .then(function (result) {
            console.log(result.data);
            getELE("tknv").value = result.data.taiKhoan;
            getELE("name").value = result.data.hoTen;
            getELE("password").value = result.data.matKhau;
            getELE("email").value = result.data.email;
            getELE("datepicker").value = result.data.ngayLam;
            getELE("luongCB").value = result.data.luongCB;
            getELE("chucvu").value = result.data.chucVu;
            getELE("gioLam").value = result.data.gioLam;
        })
        .catch(function (error) {
            console.log(error);
        })
}
//Function Update thông tin nhân Viên.
function updateNhanVien(id) {
    var taiKhoan = getELE("tknv").value;
    var hoTen = getELE("name").value;
    var email = getELE("email").value;
    var matKhau = getELE("password").value;
    var ngayLam = getELE("datepicker").value;
    var luongCB = getELE("luongCB").value;
    var chucVu = getELE("chucvu").value;
    var gioLam = getELE("gioLam").value;
    var nhanVien = new staff(taiKhoan, hoTen, matKhau, email, ngayLam, luongCB, chucVu, gioLam);
    console.log(nhanVien);

    staff.UpdateInfroServices(nhanVien, id)
        .then(function (result) {
            GetListStaff();
            getELE("btnDong").click();
            getELE("#formND").reset();
        })
        .catch(function (error) {
            console.log(error);
        })
}