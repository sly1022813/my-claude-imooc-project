/**
 * 认证路由验证规则
 */
const { body, query } = require('express-validator');

// 登录验证规则
const loginRules = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('用户名不能为空')
    .isLength({ min: 3, max: 20 })
    .withMessage('用户名长度为3-20个字符')
    .matches(/^[a-zA-Z][a-zA-Z0-9_]*$/)
    .withMessage('用户名需为字母开头，可包含字母、数字和下划线'),

  body('password')
    .notEmpty()
    .withMessage('密码不能为空')
    .isLength({ min: 6, max: 20 })
    .withMessage('密码长度为6-20个字符')
];

// 注册验证规则
const registerRules = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('用户名不能为空')
    .isLength({ min: 3, max: 20 })
    .withMessage('用户名长度为3-20个字符')
    .matches(/^[a-zA-Z][a-zA-Z0-9_]*$/)
    .withMessage('用户名需为字母开头，可包含字母、数字和下划线'),

  body('password')
    .notEmpty()
    .withMessage('密码不能为空')
    .isLength({ min: 6, max: 20 })
    .withMessage('密码长度为6-20个字符')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .withMessage('密码需包含大小写字母和数字'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('确认密码不能为空')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('两次输入的密码不一致');
      }
      return true;
    }),

  body('userType')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('用户类型需为1-3之间的整数'),

  body('nickname')
    .optional()
    .isLength({ max: 100 })
    .withMessage('昵称最多100个字符'),

  body('phone')
    .optional()
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('手机号格式不正确')
];

// 修改密码验证规则
const changePasswordRules = [
  body('oldPassword')
    .notEmpty()
    .withMessage('原密码不能为空'),

  body('newPassword')
    .notEmpty()
    .withMessage('新密码不能为空')
    .isLength({ min: 6, max: 20 })
    .withMessage('新密码长度为6-20个字符')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .withMessage('新密码需包含大小写字母和数字'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('确认密码不能为空')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('两次输入的新密码不一致');
      }
      return true;
    })
];

// 检查用户名验证规则
const checkUsernameRules = [
  query('username')
    .trim()
    .notEmpty()
    .withMessage('用户名不能为空')
    .isLength({ min: 3, max: 20 })
    .withMessage('用户名长度为3-20个字符')
];

module.exports = {
  loginRules,
  registerRules,
  changePasswordRules,
  checkUsernameRules
};
