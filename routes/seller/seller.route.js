const seller_route = require('express').Router();
const sellerModel = require('../../models/seller.model');
const multer = require('multer')
let diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        // Định nghĩa nơi file upload sẽ được lưu lại
        callback(null, "uploads");
    },
    filename: (req, file, callback) => {
        // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
        // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
        let math = ["image/png", "image/jpeg"];
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
            return callback(errorMess, null);
        }
        // Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
        let filename = `${Date.now()}-trungquandev-${file.originalname}`;
        callback(null, filename);
    }
});
let uploadFile = multer({
    storage: diskStorage
}).single("file");

//Home page
seller_route.get('/', (req, res) => {
    res.render('seller/dashboard', {
        layout: 'seller'
    });
})
seller_route.get('/product', (req, res) => {
    res.render('seller/product', {
        layout: 'seller'
    });
})
seller_route.get('/profile', (req, res) => {
    res.render('seller/profile', {
        layout: 'seller'
    });
})
seller_route.get('/end', (req, res) => {
    res.render('seller/product-ended', {
        layout: 'seller'
    });
})
seller_route.get('/add', (req, res) => {
    res.render('seller/product-add', {
        layout: 'seller'
    });
})
seller_route.get('/edit', (req, res) => {
    res.render('seller/product-edit-description', {
        layout: 'seller'
    });
})
seller_route.get('/remaining', (req, res) => {
    res.render('seller/product-remaining', {
        layout: 'seller'
    });
})
seller_route.post('/add', (res, req) => {
    uploadFile(req, res, (error) => {
        // Nếu có lỗi thì trả về lỗi cho client.
        // Ví dụ như upload một file không phải file ảnh theo như cấu hình của mình bên trên
        if (error) {
            return res.send(`Error when trying to upload: ${error}`);
        }
        // Không có lỗi thì lại render cái file ảnh về cho client.
        // Đồng thời file đã được lưu vào thư mục uploads
        console.log(path.join(`${__dirname}/uploads/${req.file.filename}`));
        res.sendFile(path.join(`${__dirname}/uploads/${req.file.filename}`));

    });
})
module.exports = seller_route;