const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');

// @route   POST    api/users
// @desc    Register a user
// @access  Public
router.post(
    '/',
    // 驗證使用者的註冊資料
    [
        check('name', 'name is required').not().isEmpty(),
        check('email', 'please include a valid email').isEmail(),
        check('password', 'please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    async (req, res) => {
        // 如果數據不符合要求，將錯誤訊息返回前端
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // 數據符合要求
        const { name, email, password } = req.body;

        try {
            // 確認email是不是已經註冊過了
            let user = await User.findOne({ email });
            if (user) res.status(400).json({ msg: 'user already exists' });

            user = new User({
                name,
                email,
                password,
            });

            // 將密碼加密
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            // 保存到數據庫
            await user.save();

            // 註冊後產生一組token並返回給前端
            const payload = {
                user: {
                    id: user.id,
                },
            };

            // jwtSecret 來自 /config/default.json裡面的自定變量
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                {
                    //過期時間，以秒為單位，從創建時間開始加，正式生產的時候可以設定3600秒
                    expiresIn: 36000,
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ msg: 'server error' });
        }
    }
);

module.exports = router;
