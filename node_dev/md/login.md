"title": "登录返回数据",
"url": "/api/nurses/signup/phone",
"method": "POST",
"params": {
    "phone": "string",
    "captcha": "1111"
},
"testCase": [
  {
    "name": "default",
    "params": {

    },
    "response": {
        "result": {
            "success": true
        },
        "token": "A_very_long_string_token_with_128_bit",
        "personType": "nurse",
        "newly": true,
        "nurse": {
          "nurseId": 1,
          "name": "巫梓菱",
          "avatarUrl": "http://www.youhujia.com/img/home_icon.png",
          "phone": "18614041815",
          "certificationName": "未认证",
          "certificationStatus": 0,
          "organizationId": 2343,
          "organizationName": "解放军309医院",
          "departmentId": 2323,
          "departmentName": "脊柱外科",
          "professionalTitle": "护师"
       }
    }
  }
]