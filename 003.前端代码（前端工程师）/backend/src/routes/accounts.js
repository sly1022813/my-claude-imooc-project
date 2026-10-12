/**
 * 账户和设置路由
 */
const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/AccountController');
const { verifyToken } = require('../middlewares/auth');
const { asyncHandler } = require('../middlewares/errorHandler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 配置文件上传
const uploadDir = path.join(__dirname, '../../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user.id}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('只支持 JPG、PNG、GIF、WebP 格式的图片'));
    }
  }
});

// 所有路由需要认证
router.use(verifyToken);

// 用户信息
router.get('/profile', asyncHandler(AccountController.getProfile));
router.put('/profile', asyncHandler(AccountController.updateProfile));
router.put('/password', asyncHandler(AccountController.changePassword));
router.post('/avatar', upload.single('avatar'), asyncHandler(AccountController.uploadAvatar));

// 账户管理
router.get('/', asyncHandler(AccountController.getAccounts));
router.post('/', asyncHandler(AccountController.createAccount));
router.put('/:id', asyncHandler(AccountController.updateAccount));
router.delete('/:id', asyncHandler(AccountController.deleteAccount));

module.exports = router;
