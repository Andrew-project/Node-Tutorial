{
    "title": "验证码",
    "url": "/api/nurses/signup/phone-captcha",
    "params": {
        "phone": "string",
        "name": 1
    },
    "testCase": [
        {
            "name": "default",
            "params": {

            },
            "response": {
                "POST": {
                    "result": {
                        "success": true
                    }
                }
            }
        },
        {
            "name": "testCase1",
            "params": {

            },
            "response": {
                "POST": {
                    "result": {
                        "success": false,
                        "displayMsg": "error"
                    }
                }
            }
        }
    ]
}