/**
 * Created by dongsj on 16/7/15.
 * 腾讯IM
 *
 ********************************************************************
 *
 *
 */
var selSess = {};
// var myChatInfo = {id: '', sig: ''};
// var targetChatInfo = {id: '', sig: ''};
// var imChatType = 'C2C';
// var imChatType='C2C';
var targetArray = [];
var eleArray = [];
app.factory('$$txIM', function ($$log, $$toast, $http, $$requestUrl, $$tabbar, $$title, $$env, $timeout) {
    var sdkAppID = 1400013584;
    var accountType = 6943;
    // var sdkAppID = 1400013758;
    // var accountType = 7033;
    var isAccessFormalEnv = true;//是否访问正式环境
    var isLogOn = false;//是否开启sdk在控制台打印日志
    var userHead = './img/title.png';//默认头像;
    var loginInfo = {};
    var splitAlpha = '!-!Alpha!-!';
    var splitBeta = '!-!Beta!-!';
    var splitGamma = '!-!Gamma!-!';
    var lastMsgTime = 0;
    var msgKey = '';
    var txSelf = '';
    return {
        login: function (listeners, loginSuccessCallback, loginErrorCallback) {
            if ($$env.getEnvirement() < 1) {
                return false;
            }
            txSelf = this;
            function login() {
                selSess = {};
                listeners = listeners || {};
                loginSuccessCallback = loginSuccessCallback || function (resp) {
                    };
                loginErrorCallback = loginErrorCallback || function (err) {
                    };
                var loginOptions = {
                    'isAccessFormalEnv': isAccessFormalEnv,//是否访问正式环境，默认访问正式，选填
                    'isLogOn': isLogOn//是否开启控制台打印日志,默认开启，选填
                };
                loginInfo = {
                    'sdkAppID': sdkAppID, //用户所属应用id,必填
                    'accountType': accountType, //用户所属应用帐号类型，必填
                    'identifier': myChatInfo.id, //当前用户ID,必须是否字符串类型，必填
                    // 'identifierNick': null, //当前用户昵称，选填
                    'userSig': myChatInfo.sig, //当前用户身份凭证，必须是字符串类型，必填
                    'headurl': myChatInfo.userHead || userHead//当前用户默认头像，选填
                };
                var loginListeners = {
                    onConnNotify: function (resp) {
                        $$log.debug('$$txIM.onConnNotify');
                        $$log.info(resp);
                        var info;
                        switch (resp.ErrorCode) {
                            case webim.CONNECTION_STATUS.ON:
                                webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
                                break;
                            case webim.CONNECTION_STATUS.OFF:
                                info = '连接已断开，无法收到新消息，请检查下你的网络是否正常: ' + resp.ErrorInfo;
                                // alert(info);
                                webim.Log.warn(info);
                                break;
                            case webim.CONNECTION_STATUS.RECONNECT:
                                info = '连接状态恢复正常: ' + resp.ErrorInfo;
                                // alert(info);
                                webim.Log.warn(info);
                                break;
                            default:
                                webim.Log.error('未知连接状态: =' + resp.ErrorInfo);
                                break;
                        }
                        if (listeners.onConnNotify) {
                            listeners.onConnNotify(resp);
                        }
                    },
                    onMsgNotify: function (resp) {
                        $$log.debug('$$txIM.onMsgNotify');
                        $$log.info(resp);
                        if (listeners.onMsgNotify) {
                            listeners.onMsgNotify(resp);
                        }
                    }
                };
                $$log.debug('$$txIM.login');
                function loginFunction() {
                    webim.login(
                        loginInfo, loginListeners, loginOptions,
                        function (resp) {
                            $$log.debug('$$txIM.login.success');
                            $$log.info(resp);
                            // txSelf.sendIMArray();
                            loginSuccessCallback(resp);
                        },
                        function (err) {
                            $$log.error('$$txIM.login.error');
                            $$log.error(err);
                            loginErrorCallback(err);
                            $timeout(function () {
                                login();
                            }, 2000);
                        }
                    );
                }

                webim.logout(function () {
                    loginFunction();
                }, function (e) {
                    txSelf.login(listeners, loginSuccessCallback, loginErrorCallback);
                });
            }

            if (localStorage['getMyChatInfo'] && (+(new Date()) - (+(JSON.parse(localStorage['getMyChatInfo']).time))) < 60 * 60 * 1000) {
                myChatInfo = JSON.parse(localStorage['getMyChatInfo']).date;
            }
            if (myChatInfo !== undefined && myChatInfo != {} && myChatInfo.id != '' && myChatInfo.id != undefined) {
                login();
            }
            else {
                $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl('getMyChatInfo'),
                    params: {}
                }).success(function (response) {
                    $$log.debug('getMyChatInfo');
                    $$log.info(response);
                    myChatInfo = {
                        id: response.identifier,
                        sig: response.signature,
                        userHead: response.avatarUrl,
                        nickName: response.nickname
                    };
                    if (myChatInfo.id != undefined && myChatInfo.id != '') {
                        localStorage.myChatId = myChatInfo.id;
                        localStorage['getMyChatInfo'] = JSON.stringify({
                            time: +(new Date()),
                            date: myChatInfo
                        });
                        login();
                    } else {
                        history.go(-1);
                    }
                    // login(listeners, loginSuccessCallback, loginErrorCallback);
                }).error(function (e) {
                    // login(listeners, loginSuccessCallback, loginErrorCallback);
                    login();
                });
            }
        },
        loadList: function () {
            var chatList = localStorage.chatList !== undefined ? JSON.parse(localStorage.chatList) : [];
            for (var i = 0; i < chatList.length; i++) {
                var lastMsg = this.loadLastMsg(chatList[i].chatId);
                if (lastMsg.type != 'empty' && chatList[i].lastMsg.fullTime <= lastMsg.fullTime) {
                    chatList[i].lastMsg = lastMsg;
                }
            }
            return chatList;
        },
        checkIMArray: function () {
            if (localStorage.imSendArray) {
                return JSON.parse(localStorage.imSendArray);
            } else {
                localStorage.imSendArray = JSON.stringify([]);
                return [];
            }
        },
        pushIMArray: function (ele, targetId) {
            var arr = this.checkIMArray();
            arr.push(targetId + splitAlpha + JSON.stringify(ele));
            localStorage.imSendArray = JSON.stringify(arr);
        },
        // popIMArray: function (ele, targetId) {
        //     var arr = this.checkIMArray();
        //     var index = arr.indexOf(targetId + splitAlpha + JSON.stringify(ele));
        //     $$log.debug('popIMArray');
        //     $$log.info(arr);
        //     $$log.info(targetId + splitAlpha + JSON.stringify(ele));
        //     if (index > -1) {
        //         arr.remove(index);
        //     }
        //     localStorage.imSendArray = JSON.stringify(arr);
        // },
        sendIMArray: function (successCallback, errorCallback) {
            var arr = this.checkIMArray();
            var self = this;
            var msg = [];
            var count = 0;
            var countArray = [];
            var resps = [];
            for (var i = 0; i < arr.length; i++) {
                msg = arr[i].split(splitAlpha);
                (function (index, targetId) {
                    self.sendElementMsg(JSON.parse(msg[1]), msg[0], function (resp) {
                        // self.popIMArray(JSON.parse(msg[1]), msg[0]);
                        // if (self.checkIMArray().length == 0 && successCallback) {
                        //     successCallback();
                        // }
                        // (function (index) {
                        //     popImArrayByIndex(index);
                        // })(i);
                        resps.push(resp);
                        txSelf.saveLastMsgWithId(txSelf.createMsgEle(resp, false), targetId);
                        count++;
                        countArray.push(index);
                        if (count >= arr.length) {
                            var errArray = [];
                            // while (countArray.length > 0) {
                            //     arr.remove(countArray[0]);
                            //     countArray.unshift();
                            // }
                            for (var i = 0; i < arr.length; i++) {
                                if (countArray.indexOf(i) < 0) {
                                    errArray.push(arr[i]);
                                }
                            }
                            localStorage.imSendArray = JSON.stringify(errArray);
                            if (errArray.length > 0) {
                                $$log.error('sendIMArray error');
                                $$log.info(errArray);
                            } else {
                                $$log.debug('sendIMArray success');
                            }
                            if (successCallback && errArray.length === 0) {
                                successCallback(resps);
                            } else if (errorCallback && errArray.length > 0) {
                                errorCallback();
                            }
                        }
                    });
                })(i, msg[0]);
            }
        },
        initImArrayAndSend: function (targetArray, eleArray, notSend) {
            for (var i = 0; i < targetArray.length; i++) {
                for (var j = 0; j < eleArray.length; j++) {
                    this.pushIMArray(eleArray[j], targetArray[i]);
                }
            }
            if (notSend == true) {
            } else {
                this.sendIMArray();
            }
        },
        sendElementMsg: function (ele, targetId, successCallback, clearCallback, errorCallback) {
            var splitAlpha = '!-!Alpha!-!';
            var splitBeta = '!-!Beta!-!';
            var splitGamma = '!-!Gamma!-!';
            // ele = {
            //     type: 'type',
            //     id:'1',
            //     name: 'name',
            //     desc: 'descdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdesc',
            //     img: 'img'
            // };
            var msg = ele.type + splitBeta + (ele.id || '') + splitGamma + (ele.name || '') + splitGamma + (ele.desc || '') + splitGamma + (ele.img || '');
            this.sendTextMsg(msg, targetId, successCallback, clearCallback, errorCallback);
        },
        sendTextMsg: function (msg, targetId, successCallback, clearCallback, errorCallback) {
            $$log.debug('$$txIM.sendTextMsg');
            $$log.info(msg);
            if (msg.length < 1) {
                clearCallback();
                return false;
            }
            var maxLen, msgLen, errInfo;
            msgLen = webim.Tool.getStrBytes(msg);
            maxLen = (targetId.indexOf('@') < 0 ? webim.MSG_MAX_LENGTH.C2C : webim.MSG_MAX_LENGTH.GROUP);
            errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
            if (msgLen > maxLen) {
                // $$toast.show(errInfo);
                return false;
            }
            if (!selSess[targetId]) {
                selSess[targetId] = new webim.Session((targetId.indexOf('@') < 0 ? webim.SESSION_TYPE.C2C : webim.SESSION_TYPE.GROUP), targetId, targetId, loginInfo.headurl, Math.round(new Date().getTime() / 1000));
            }
            var isSend = true;//是否为自己发送
            var seq = -1;//消息序列，-1表示sdk自动生成，用于去重
            var random = Math.round(Math.random() * 4294967296);//消息随机数，用于去重
            var msgTime = Math.round(new Date().getTime() / 1000);//消息时间戳
            var subType = 0;
            // if (imChatType == 'C2C') {
            //     subType = webim.C2C_MSG_SUB_TYPE.COMMON;
            // } else {
            //     //webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
            //     //webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
            //     //webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
            //     //webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
            //     subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
            // }
            // $$log.debug('!!!!!!');
            // $$log.info(subType);
            var msgToSend = new webim.Msg(selSess[targetId], isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);
            // console.log(loginInfo);
            //textObj
            var finalMsg = (((msg.indexOf(splitBeta)) >= 0 ? msg : ('text' + splitBeta + msg)) + splitAlpha + myChatInfo.userHead + splitAlpha + myChatInfo.nickName);
            var text_obj = new webim.Msg.Elem.Text(finalMsg);
            msgToSend.addText(text_obj);
            webim.sendMsg(msgToSend, function (resp) {
                $$log.debug("$$txIM.sendMsg.success");
                $$log.info(resp);
                if (successCallback) {
                    successCallback(msgToSend);
                }
                if (clearCallback) {
                    clearCallback(msgToSend);
                }
            }, function (err) {
                $$log.error("$$txIM.sendMsg.err");
                $$log.error(err);
                // $$toast.show(err.ErrorInfo);
                if (clearCallback) {
                    clearCallback(msgToSend);
                }
                if (errorCallback) {
                    errorCallback(err);
                }
            });
        },
        getGroupInfo: function (group_id, cbOK, cbErr) {
            var options = {
                'GroupIdList': [
                    group_id
                ],
                'GroupBaseInfoFilter': [
                    'Type',
                    'Name',
                    'Introduction',
                    'Notification',
                    'FaceUrl',
                    'CreateTime',
                    'Owner_Account',
                    'LastInfoTime',
                    'LastMsgTime',
                    'NextMsgSeq',
                    'MemberNum',
                    'MaxMemberNum',
                    'ApplyJoinOption'
                ],
                'MemberInfoFilter': [
                    'Account',
                    'Role',
                    'JoinTime',
                    'LastSendMsgTime',
                    'ShutUpUntil'
                ]
            };
            webim.getGroupInfo(
                options,
                function (resp) {
                    $$log.debug('$$txIM.getGroupInfo');
                    $$log.info(resp);
                    if (cbOK) {
                        cbOK(resp);
                    }
                },
                function (err) {
                    alert(err.ErrorInfo);
                }
            );
        },
        setRead: function (targetId) {
            if (!selSess[targetId]) {
                selSess[targetId] = new webim.Session((targetId.indexOf('@') < 0 ? webim.SESSION_TYPE.C2C : webim.SESSION_TYPE.GROUP), targetId, targetId, loginInfo.headurl, Math.round(new Date().getTime() / 1000));
            }
            webim.setAutoRead(selSess[targetId], true, true);
        },
        getHistoryMsgs: function (successCallback, errorCallback) {
            if (localStorage.targetChatId.indexOf('@') < 0) {
                $$log.debug('getC2CHistoryMsgs');
                var historyOption = {
                    'Peer_Account': localStorage.targetChatId, //好友帐号
                    'MaxCnt': 15, //拉取消息条数
                    'LastMsgTime': lastMsgTime, //最近的消息时间，即从这个时间点向前拉取历史消息
                    'MsgKey': msgKey
                };
                webim.getC2CHistoryMsgs(
                    historyOption,
                    function (resp) {
                        $$log.debug('$$txIM.getC2CHistoryMsgs.success');
                        $$log.info(resp);
                        lastMsgTime[localStorage.targetChatId] = resp.LastMsgTime;
                        msgKey[localStorage.targetChatId] = resp.MsgKey;
                        successCallback(resp.MsgList);
                    }, function (err) {
                        $$log.error('$$txIM.getC2CHistoryMsgs.error');
                        $$log.error(err);
                        if (errorCallback) {
                            errorCallback(err);
                        }
                    }
                );
            } else {
                $$log.debug('getGroupHistoryMsgs');
                this.getGroupInfo(localStorage.targetChatId, function (resp) {
                    //拉取最新的群历史消息
                    var opts = {
                        'GroupId': localStorage.targetChatId,
                        'ReqMsgSeq': resp.GroupInfo[0].NextMsgSeq - 1 > 0 ? resp.GroupInfo[0].NextMsgSeq - 1 : 0,
                        'ReqMsgNumber': 80
                    };
                    $$title.setTitle(resp.GroupInfo[0].Name + '(' + resp.GroupInfo[0].MemberNum + ')');

                    webim.syncGroupMsgs(
                        opts,
                        function (resp) {
                            $$log.debug('$$txIM.getGroupHistoryMsgs.success');
                            $$log.debug(resp);
                            successCallback(resp);
                        },
                        function (err) {
                            alert(err.ErrorInfo);
                            $$log.error('$$txIM.getGroupHistoryMsgs.error');
                            $$log.error(err);
                            if (errorCallback) {
                                errorCallback(err);
                            }
                        }
                    );
                });
            }
        },
        // getOneHistoryMsgsById: function (id,type,successCallback, errorCallback) {
        //     if (type == 'C2C') {
        //         var historyOption = {
        //             'Peer_Account': id, //好友帐号
        //             'MaxCnt': 1, //拉取消息条数
        //             'LastMsgTime': lastMsgTime, //最近的消息时间，即从这个时间点向前拉取历史消息
        //             'MsgKey': msgKey
        //         };
        //         webim.getC2CHistoryMsgs(
        //             historyOption,
        //             function (resp) {
        //                 $$log.debug('$$txIM.getC2CHistoryMsgs.success');
        //                 $$log.info(resp);
        //                 lastMsgTime[localStorage.targetChatId] = resp.LastMsgTime;
        //                 msgKey[localStorage.targetChatId] = resp.MsgKey;
        //                 successCallback(resp.MsgList);
        //             }, function (err) {
        //                 $$log.error('$$txIM.getC2CHistoryMsgs.error');
        //                 $$log.error(err);
        //                 if (errorCallback) {
        //                     errorCallback(err);
        //                 }
        //             }
        //         );
        //     } else {
        //         this.getGroupInfo(localStorage.targetChatId, function (resp) {
        //             //拉取最新的群历史消息
        //
        //             var options = {
        //                 'GroupId': id,
        //                 'ReqMsgSeq': resp.GroupInfo[0].NextMsgSeq>0?resp.GroupInfo[0].NextMsgSeq - 1:1,
        //                 'ReqMsgNumber': 1
        //             };
        //             webim.syncGroupMsgs(
        //                 options,
        //                 function (resp) {
        //                     $$log.debug('$$txIM.getGroupHistoryMsgs.success');
        //                     $$log.debug(resp);
        //                     successCallback(resp);
        //                 },
        //                 function (err) {
        //                     alert(err.ErrorInfo);
        //                     $$log.error('$$txIM.getC2CHistoryMsgs.error');
        //                     $$log.error(err);
        //                     if (errorCallback) {
        //                         errorCallback(err);
        //                     }
        //                 }
        //             );
        //         });
        //     }
        // },
        syncC2CMsgs: function (cbOK) {
            $$log.debug('$$txIM.syncMsg!');
            webim.syncMsgs(function (resp) {
                $$log.debug('$$txIM.syncMsg');
                $$log.info(resp);
                if (cbOK) {
                    cbOK(resp);
                }
            });
        },
        syncGROUPLastMsgs: function (groupIds, cbOK) {
            this.getGroupInfo(groupIds, function (resp) {
                var opts = {
                    'GroupId': groupIds,
                    'ReqMsgSeq': resp.GroupInfo[0].NextMsgSeq - 1 > 0 ? resp.GroupInfo[0].NextMsgSeq - 1 : 0,
                    'ReqMsgNumber': 1
                };
                webim.syncGroupMsgs(opts, function (resp) {
                    $$log.debug('$$txIM.syncGROUPMsgs.success');
                    $$log.info(resp);
                    if (cbOK) {
                        cbOK(resp);
                    }
                });
            });
        },
        saveLastMsg: function (msgEle) {
            $$log.debug('$$txIM.saveLastMsg');
            $$log.info(JSON.stringify(msgEle));
            localStorage[myChatInfo.id + ':lastChatMsg:' + localStorage.targetChatId] = JSON.stringify(msgEle);
        },
        saveLastMsgWithId: function (msgEle, targetId) {
            $$log.debug('$$txIM.saveLastMsgWithId');
            $$log.info(JSON.stringify(msgEle));
            localStorage[myChatInfo.id + ':lastChatMsg:' + targetId] = JSON.stringify(msgEle);
        },
        loadLastMsg: function (targetUserId) {
            return JSON.parse(localStorage[localStorage.myChatId + ':lastChatMsg:' + targetUserId] || '{"type": "empty","newMsg":false}');
        },
        markReadLastMsg: function (targetUserId) {
            var msgEle = this.loadLastMsg(targetUserId);
            msgEle.newMsg = false;
            this.saveLastMsg(msgEle);
        },
        createMsgEle: function (respMsgEle, readed) {
            var newMsgEle = {};
            if (!respMsgEle.elems || respMsgEle.elems.length === 0) {
                return false;
            }
            // $$log.debug('$$txIM.createMsgEle');
            // $$log.info(respMsgEle);
            // $$log.info(respMsgEle.elems[0].content.text);
            // $$log.info(respMsgEle.elems[0].content.text.indexOf(splitAlpha));
            // $$log.info(respMsgEle.elems[0].content.text.indexOf(splitBeta));
            if (respMsgEle.elems[0].content.text === undefined || respMsgEle.elems[0].content.text.indexOf(splitAlpha) < 0 || respMsgEle.elems[0].content.text.indexOf(splitBeta) < 0) {
                return false;
            }
            this.updateLastMsgTime(respMsgEle.time);
            if (respMsgEle.elems[0].content.text.split(splitAlpha)[0].split(splitBeta)[0] == 'text') {
                newMsgEle = {
                    type: respMsgEle.elems[0].content.text.split(splitAlpha)[0].split(splitBeta)[0] || 'text',
                    msg: respMsgEle.elems[0].content.text.split(splitAlpha)[0].split(splitBeta)[1] || respMsgEle.elems[0].content.text.split(splitAlpha)[0] || ' ',
                    fromAccount: respMsgEle.fromAccount,
                    fromNickName: respMsgEle.elems[0].content.text.split(splitAlpha)[2] || respMsgEle.fromAccountNick || respMsgEle.fromNickName,
                    userHead: respMsgEle.elems[0].content.text.split(splitAlpha)[1] || ' ',
                    time: new Date(respMsgEle.time * 1000).format("MM-dd hh:mm:ss"),
                    fullTime: respMsgEle.time,
                    sessId: respMsgEle.sess._impl.id,
                    sessName: respMsgEle.sess._impl.name,
                    newMsg: readed !== false,
                    unread: respMsgEle.sess._impl.unread
                };
                $$log.debug('$$txIM.createMsgEle.typeText');
            } else {
                newMsgEle = {
                    type: respMsgEle.elems[0].content.text.split(splitAlpha)[0].split(splitBeta)[0],
                    msg: respMsgEle.elems[0].content.text.split(splitAlpha)[0].split(splitBeta)[1].split(splitGamma) || [],
                    fromAccount: respMsgEle.fromAccount,
                    fromNickName: respMsgEle.elems[0].content.text.split(splitAlpha)[2] || respMsgEle.fromNickName || respMsgEle.fromAccountNick,
                    userHead: respMsgEle.elems[0].content.text.split(splitAlpha)[1] || ' ',
                    time: new Date(respMsgEle.time * 1000).format("MM-dd hh:mm:ss"),
                    fullTime: respMsgEle.time,
                    sessId: respMsgEle.sess._impl.id,
                    sessName: respMsgEle.sess._impl.name,
                    newMsg: readed !== false,
                    unread: respMsgEle.sess._impl.unread
                };
                $$log.debug('$$txIM.createMsgEle.typeOther');
            }
            $$log.info(newMsgEle);
            return newMsgEle;
        },
        updateLastMsgTime: function (msgTime) {
            if (!lastMsgTime) {
                return;
            }
            lastMsgTime = (msgTime < lastMsgTime ? msgTime : lastMsgTime);
        },
        updateGroupInfo: function (groupId, name, cbOK, cbErr) {
            if (webim.Tool.getStrBytes(name) > 30) {
                $$toast.show('群组名称最长10个汉字');
                return false;
            } else if (name.trim().length == 0) {
                $$toast.show('群组名称不能为空');
                return false;
            } else {
                var options = {
                    'GroupId': groupId,
                    'Name': name
                };
                webim.modifyGroupBaseInfo(
                    options,
                    function (resp) {
                        $$log.debug('$$txIM.updateGroupInfo.success');
                        $$log.info(resp);
                        if (cbOK) {
                            cbOK(resp);
                        }
                    },
                    function (err) {
                        $$log.error('$$txIM.updateGroupInfo.error');
                        $$log.info(err);
                        if (cbErr) {
                            cbErr(err);
                        }
                    }
                );
            }
        },
        syncC2CMsg: function (cbOK) {
            if (cbOK) {
                cbOK();
            }
        },
        getAllGroup: function (cbOK, cbErr) {
            var options = {
                'Member_Account': loginInfo.identifier,
                'Limit': 9999,
                'Offset': 0,
                'GroupBaseInfoFilter': [
                    'Type',
                    'Name',
                    'Introduction',
                    'Notification',
                    'FaceUrl',
                    'CreateTime',
                    'Owner_Account',
                    'LastInfoTime',
                    'LastMsgTime',
                    'NextMsgSeq',
                    'MemberNum',
                    'MaxMemberNum',
                    'ApplyJoinOption'
                ],
                'SelfInfoFilter': [
                    'Role',
                    'JoinTime',
                    'MsgFlag',
                    'UnreadMsgNum'
                ]
            };
            webim.getJoinedGroupListHigh(
                options,
                function (resp) {
                    $$log.debug('$$txIM.getAllGroup.success');
                    $$log.info(resp);
                    if (cbOK) {
                        cbOK(resp);
                    }
                },
                function (err) {
                    $$log.error('$$txIM.getAllGroup.error');
                    $$log.info(err);
                    if (cbErr) {
                        cbErr();
                    }
                }
            );
        },
        getC2CInfo: function (userArray, cbOK, cbErr) {
            var tag_list = [
                "Tag_Profile_IM_Nick",//昵称
                "Tag_Profile_IM_Gender",//性别
                "Tag_Profile_IM_AllowType",//加好友方式
                "Tag_Profile_IM_Image"//头像
            ];
            var options = {
                'To_Account': userArray,
                'LastStandardSequence': 0,
                'TagList': tag_list
            };
            webim.getProfilePortrait(
                options,
                function (resp) {
                    $$log.debug('$$txIM.getC2CInfo.success');
                    $$log.info(resp);
                    if (cbOK) {
                        cbOK(resp);
                    }
                },
                function (err) {
                    $$log.error('$$txIM.getC2CInfo.error');
                    $$log.info(err);
                    if (cbErr) {
                        cbErr(err);
                    }
                }
            );
        },
        getAllFriend: function (cbOK, cbErr) {
            var options = {
                'From_Account': myChatInfo.id,
                'TimeStamp': 0,
                'StartIndex': 0,
                'GetCount': 9999,
                'LastStandardSequence': 0,
                "TagList": [
                    "Tag_Profile_IM_Nick",
                    "Tag_SNS_IM_Remark"
                ]
            };
            webim.getAllFriend(
                options,
                function (resp) {
                    $$log.debug('$$txIM.getAllFriend.success');
                    $$log.info(resp);
                    if (cbOK) {
                        cbOK(resp);
                    }
                },
                function (err) {
                    $$log.error('$$txIM.getAllFriend.error');
                    $$log.info(err);
                    if (cbErr) {
                        cbErr();
                    }
                }
            );
        }
    };
});