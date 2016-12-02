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
                "result": {
                    "success": true
                }
            }
        },
        {
            "name": "testCase1",
            "params": {

            },
            "response": {
                "result": {
                    "success": false,
                    "displayMsg": "error"
                }
            }
        }
    ]
}