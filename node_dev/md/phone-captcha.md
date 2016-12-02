{
    "title": "验证码",
    "url": "/api/nurses/signup/phone-captcha",
    "params": {
        "phone": "string",
        "name": 1
    },
    "testCase": {
        "default": {
            "response": {
                "result": {
                    "success": true
                }
            }
        },
        "test1": {
            "response": {
                "result": {
                    "success": false,
                    "displayMsg": "error"
                }
            }
        }
    }
}