{
    "title": "用户信息",
    "url": "/api/nurses/{id}/info",
    "params": {
        "name": "ss"
    },
    "testCase": {
       <非法所得分>
        "default": {
            "response": {
                "basic": {
                    "id": 7,
                    "name": "new nurse name...",
                    "avatarUrl": "http://yhjstatic.com",
                    "phone": "111",
                    "authorizedName": "未认证",
                    "authorizedStatus": 0,
                    "organizationId": 1,
                    "organizationName": "优护家中关村分院",
                    "departmentId": 1,
                    "departmentName": "神经病科",
                    "professionalTitle": "new title",
                    "identifier": "N-7"
                  },
                  <fff>
                  "occupation": {
                    "IDNumber": "6239493483",
                    "certs": "{x}",
                    "photocopy": "{}"
                  },
                  "result": {
                    "success": true
                  }
            }
        },
        "test": {
            "response": {
                "result": {
                    "success": false,
                    "displayMsg": "error"
                }
            }
        }
    }
}
