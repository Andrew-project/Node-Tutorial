"title": "用户信息",
"url": "/api/nurses/{id}/info",
"method": "GET",
"params": {
    "name": "ss"
},
"testCase": [
   <这是第一个注释>
    {
        "name": "default",
        "params": {

        },
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
              <这是第二个注释>
              "occupation": {
                "IDNumber": "6239493483",
                "certs": "{x}",
                "photocopy": "{}"
              },
              "result": {
                "success": true
              }
        }
    }
]

