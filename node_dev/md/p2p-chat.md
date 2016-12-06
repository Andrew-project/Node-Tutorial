"title": "和用户聊天",
"url": "/api/nurses/msg/im/{fromId}/to-user/{toId}",
"method": "GET",
"params": {

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
          "fromAccount": {
            "personId": 1,
            "personType": 0,
            "identifier": "N-1",
            "signature": "eJxFkFKQ82gmH3Fzy8yUlX4",
            "nickname": "nurse",
            "avatarUrl": "http://images.clipartof.com/thumbnails/76727-Brunette-Caucasian-Avatar-Nurse-Woman-Over-Red.jpg"
          },
          "toAccount": {
            "personId": 2,
            "personType": 0,
            "identifier": "N-2",
            "signature": "eJxFkM8-ALbcFcO",
            "nickname": "nurse",
            "avatarUrl": "http://images.clipartof.com/thumbnails/76727-Brunette-Caucasian-Avatar-Nurse-Woman-Over-Red.jpg"
          }
    }
  }
]