"title": "医院科室",
"url": "/api/departments",
"method": "GET",
"params": {

},
"testCase": [
    {
        "name": "default",
        "params": {

        },
        "response": {
            "organization": [
                {
                    "organizationId": 1,
                    "organizationName": "优护家中关村分院",
                    "department": [
                        {
                            "departmentId": 10,
                            "departmentName": "The Department Name"
                        }
                    ]
               }
             ],
             "result": {
                "success": true
             }
        }
    }
]