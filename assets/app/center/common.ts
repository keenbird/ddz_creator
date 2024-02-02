
/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/


import $protobuf from "protobufjs/minimal.js";

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.client_proto = (function() {

    /**
     * Namespace client_proto.
     * @exports client_proto
     * @namespace
     */
    var client_proto = {};

    /**
     * LOGIN_SUB_MSG_ID enum.
     * @name client_proto.LOGIN_SUB_MSG_ID
     * @enum {number}
     * @property {number} LSMI_LOGIN_NULL=0 LSMI_LOGIN_NULL value
     * @property {number} LSMI_LOGIN_REQ=1 LSMI_LOGIN_REQ value
     * @property {number} LSMI_LOGIN_RESP=2 LSMI_LOGIN_RESP value
     * @property {number} LSMI_LOGIN_ATTR_NTF=3 LSMI_LOGIN_ATTR_NTF value
     * @property {number} LSMI_LOGIN_OFFSITE_PUSH=4 LSMI_LOGIN_OFFSITE_PUSH value
     */
    client_proto.LOGIN_SUB_MSG_ID = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "LSMI_LOGIN_NULL"] = 0;
        values[valuesById[1] = "LSMI_LOGIN_REQ"] = 1;
        values[valuesById[2] = "LSMI_LOGIN_RESP"] = 2;
        values[valuesById[3] = "LSMI_LOGIN_ATTR_NTF"] = 3;
        values[valuesById[4] = "LSMI_LOGIN_OFFSITE_PUSH"] = 4;
        return values;
    })();

    /**
     * LOGIN_TYPE_DEF enum.
     * @name client_proto.LOGIN_TYPE_DEF
     * @enum {number}
     * @property {number} LTD_NULL=0 LTD_NULL value
     * @property {number} LTD_TOKEN=1 LTD_TOKEN value
     * @property {number} LTD_PASSWORD=2 LTD_PASSWORD value
     * @property {number} LTD_CODE=3 LTD_CODE value
     */
    client_proto.LOGIN_TYPE_DEF = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "LTD_NULL"] = 0;
        values[valuesById[1] = "LTD_TOKEN"] = 1;
        values[valuesById[2] = "LTD_PASSWORD"] = 2;
        values[valuesById[3] = "LTD_CODE"] = 3;
        return values;
    })();

    client_proto.LoginReq = (function() {

        /**
         * Properties of a LoginReq.
         * @memberof client_proto
         * @interface ILoginReq
         * @property {number|null} [loginType] LoginReq loginType
         * @property {string|null} [loginToken] LoginReq loginToken
         * @property {string|null} [loginAccount] LoginReq loginAccount
         * @property {string|null} [loginPassword] LoginReq loginPassword
         * @property {string|null} [version] LoginReq version
         * @property {string|null} [gameVersion] LoginReq gameVersion
         * @property {string|null} [channel] LoginReq channel
         * @property {string|null} [packageName] LoginReq packageName
         * @property {string|null} [deviceId] LoginReq deviceId
         * @property {number|null} [versionInt] LoginReq versionInt
         */

        /**
         * Constructs a new LoginReq.
         * @memberof client_proto
         * @classdesc Represents a LoginReq.
         * @implements ILoginReq
         * @constructor
         * @param {client_proto.ILoginReq=} [properties] Properties to set
         */
        function LoginReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginReq loginType.
         * @member {number} loginType
         * @memberof client_proto.LoginReq
         * @instance
         */
        LoginReq.prototype.loginType = 0;

        /**
         * LoginReq loginToken.
         * @member {string} loginToken
         * @memberof client_proto.LoginReq
         * @instance
         */
        LoginReq.prototype.loginToken = "";

        /**
         * LoginReq loginAccount.
         * @member {string} loginAccount
         * @memberof client_proto.LoginReq
         * @instance
         */
        LoginReq.prototype.loginAccount = "";

        /**
         * LoginReq loginPassword.
         * @member {string} loginPassword
         * @memberof client_proto.LoginReq
         * @instance
         */
        LoginReq.prototype.loginPassword = "";

        /**
         * LoginReq version.
         * @member {string} version
         * @memberof client_proto.LoginReq
         * @instance
         */
        LoginReq.prototype.version = "";

        /**
         * LoginReq gameVersion.
         * @member {string} gameVersion
         * @memberof client_proto.LoginReq
         * @instance
         */
        LoginReq.prototype.gameVersion = "";

        /**
         * LoginReq channel.
         * @member {string} channel
         * @memberof client_proto.LoginReq
         * @instance
         */
        LoginReq.prototype.channel = "";

        /**
         * LoginReq packageName.
         * @member {string} packageName
         * @memberof client_proto.LoginReq
         * @instance
         */
        LoginReq.prototype.packageName = "";

        /**
         * LoginReq deviceId.
         * @member {string} deviceId
         * @memberof client_proto.LoginReq
         * @instance
         */
        LoginReq.prototype.deviceId = "";

        /**
         * LoginReq versionInt.
         * @member {number} versionInt
         * @memberof client_proto.LoginReq
         * @instance
         */
        LoginReq.prototype.versionInt = 0;

        /**
         * Creates a new LoginReq instance using the specified properties.
         * @function create
         * @memberof client_proto.LoginReq
         * @static
         * @param {client_proto.ILoginReq=} [properties] Properties to set
         * @returns {client_proto.LoginReq} LoginReq instance
         */
        LoginReq.create = function create(properties) {
            return new LoginReq(properties);
        };

        /**
         * Encodes the specified LoginReq message. Does not implicitly {@link client_proto.LoginReq.verify|verify} messages.
         * @function encode
         * @memberof client_proto.LoginReq
         * @static
         * @param {client_proto.ILoginReq} message LoginReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.loginType != null && Object.hasOwnProperty.call(message, "loginType"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.loginType);
            if (message.loginToken != null && Object.hasOwnProperty.call(message, "loginToken"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.loginToken);
            if (message.loginAccount != null && Object.hasOwnProperty.call(message, "loginAccount"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.loginAccount);
            if (message.loginPassword != null && Object.hasOwnProperty.call(message, "loginPassword"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.loginPassword);
            if (message.version != null && Object.hasOwnProperty.call(message, "version"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.version);
            if (message.gameVersion != null && Object.hasOwnProperty.call(message, "gameVersion"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.gameVersion);
            if (message.channel != null && Object.hasOwnProperty.call(message, "channel"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.channel);
            if (message.packageName != null && Object.hasOwnProperty.call(message, "packageName"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.packageName);
            if (message.deviceId != null && Object.hasOwnProperty.call(message, "deviceId"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.deviceId);
            if (message.versionInt != null && Object.hasOwnProperty.call(message, "versionInt"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.versionInt);
            return writer;
        };

        /**
         * Encodes the specified LoginReq message, length delimited. Does not implicitly {@link client_proto.LoginReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.LoginReq
         * @static
         * @param {client_proto.ILoginReq} message LoginReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoginReq message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.LoginReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.LoginReq} LoginReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.LoginReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.loginType = reader.int32();
                        break;
                    }
                case 2: {
                        message.loginToken = reader.string();
                        break;
                    }
                case 3: {
                        message.loginAccount = reader.string();
                        break;
                    }
                case 4: {
                        message.loginPassword = reader.string();
                        break;
                    }
                case 5: {
                        message.version = reader.string();
                        break;
                    }
                case 6: {
                        message.gameVersion = reader.string();
                        break;
                    }
                case 7: {
                        message.channel = reader.string();
                        break;
                    }
                case 8: {
                        message.packageName = reader.string();
                        break;
                    }
                case 9: {
                        message.deviceId = reader.string();
                        break;
                    }
                case 10: {
                        message.versionInt = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LoginReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.LoginReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.LoginReq} LoginReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LoginReq message.
         * @function verify
         * @memberof client_proto.LoginReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoginReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.loginType != null && message.hasOwnProperty("loginType"))
                if (!$util.isInteger(message.loginType))
                    return "loginType: integer expected";
            if (message.loginToken != null && message.hasOwnProperty("loginToken"))
                if (!$util.isString(message.loginToken))
                    return "loginToken: string expected";
            if (message.loginAccount != null && message.hasOwnProperty("loginAccount"))
                if (!$util.isString(message.loginAccount))
                    return "loginAccount: string expected";
            if (message.loginPassword != null && message.hasOwnProperty("loginPassword"))
                if (!$util.isString(message.loginPassword))
                    return "loginPassword: string expected";
            if (message.version != null && message.hasOwnProperty("version"))
                if (!$util.isString(message.version))
                    return "version: string expected";
            if (message.gameVersion != null && message.hasOwnProperty("gameVersion"))
                if (!$util.isString(message.gameVersion))
                    return "gameVersion: string expected";
            if (message.channel != null && message.hasOwnProperty("channel"))
                if (!$util.isString(message.channel))
                    return "channel: string expected";
            if (message.packageName != null && message.hasOwnProperty("packageName"))
                if (!$util.isString(message.packageName))
                    return "packageName: string expected";
            if (message.deviceId != null && message.hasOwnProperty("deviceId"))
                if (!$util.isString(message.deviceId))
                    return "deviceId: string expected";
            if (message.versionInt != null && message.hasOwnProperty("versionInt"))
                if (!$util.isInteger(message.versionInt))
                    return "versionInt: integer expected";
            return null;
        };

        /**
         * Creates a LoginReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.LoginReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.LoginReq} LoginReq
         */
        LoginReq.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.LoginReq)
                return object;
            var message = new $root.client_proto.LoginReq();
            if (object.loginType != null)
                message.loginType = object.loginType | 0;
            if (object.loginToken != null)
                message.loginToken = String(object.loginToken);
            if (object.loginAccount != null)
                message.loginAccount = String(object.loginAccount);
            if (object.loginPassword != null)
                message.loginPassword = String(object.loginPassword);
            if (object.version != null)
                message.version = String(object.version);
            if (object.gameVersion != null)
                message.gameVersion = String(object.gameVersion);
            if (object.channel != null)
                message.channel = String(object.channel);
            if (object.packageName != null)
                message.packageName = String(object.packageName);
            if (object.deviceId != null)
                message.deviceId = String(object.deviceId);
            if (object.versionInt != null)
                message.versionInt = object.versionInt | 0;
            return message;
        };

        /**
         * Creates a plain object from a LoginReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.LoginReq
         * @static
         * @param {client_proto.LoginReq} message LoginReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoginReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.loginType = 0;
                object.loginToken = "";
                object.loginAccount = "";
                object.loginPassword = "";
                object.version = "";
                object.gameVersion = "";
                object.channel = "";
                object.packageName = "";
                object.deviceId = "";
                object.versionInt = 0;
            }
            if (message.loginType != null && message.hasOwnProperty("loginType"))
                object.loginType = message.loginType;
            if (message.loginToken != null && message.hasOwnProperty("loginToken"))
                object.loginToken = message.loginToken;
            if (message.loginAccount != null && message.hasOwnProperty("loginAccount"))
                object.loginAccount = message.loginAccount;
            if (message.loginPassword != null && message.hasOwnProperty("loginPassword"))
                object.loginPassword = message.loginPassword;
            if (message.version != null && message.hasOwnProperty("version"))
                object.version = message.version;
            if (message.gameVersion != null && message.hasOwnProperty("gameVersion"))
                object.gameVersion = message.gameVersion;
            if (message.channel != null && message.hasOwnProperty("channel"))
                object.channel = message.channel;
            if (message.packageName != null && message.hasOwnProperty("packageName"))
                object.packageName = message.packageName;
            if (message.deviceId != null && message.hasOwnProperty("deviceId"))
                object.deviceId = message.deviceId;
            if (message.versionInt != null && message.hasOwnProperty("versionInt"))
                object.versionInt = message.versionInt;
            return object;
        };

        /**
         * Converts this LoginReq to JSON.
         * @function toJSON
         * @memberof client_proto.LoginReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoginReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for LoginReq
         * @function getTypeUrl
         * @memberof client_proto.LoginReq
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LoginReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.LoginReq";
        };

        return LoginReq;
    })();

    client_proto.LoginResp = (function() {

        /**
         * Properties of a LoginResp.
         * @memberof client_proto
         * @interface ILoginResp
         * @property {number|null} [result] LoginResp result
         * @property {number|Long|null} [userId] LoginResp userId
         */

        /**
         * Constructs a new LoginResp.
         * @memberof client_proto
         * @classdesc Represents a LoginResp.
         * @implements ILoginResp
         * @constructor
         * @param {client_proto.ILoginResp=} [properties] Properties to set
         */
        function LoginResp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginResp result.
         * @member {number} result
         * @memberof client_proto.LoginResp
         * @instance
         */
        LoginResp.prototype.result = 0;

        /**
         * LoginResp userId.
         * @member {number|Long} userId
         * @memberof client_proto.LoginResp
         * @instance
         */
        LoginResp.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new LoginResp instance using the specified properties.
         * @function create
         * @memberof client_proto.LoginResp
         * @static
         * @param {client_proto.ILoginResp=} [properties] Properties to set
         * @returns {client_proto.LoginResp} LoginResp instance
         */
        LoginResp.create = function create(properties) {
            return new LoginResp(properties);
        };

        /**
         * Encodes the specified LoginResp message. Does not implicitly {@link client_proto.LoginResp.verify|verify} messages.
         * @function encode
         * @memberof client_proto.LoginResp
         * @static
         * @param {client_proto.ILoginResp} message LoginResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.result != null && Object.hasOwnProperty.call(message, "result"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.result);
            if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.userId);
            return writer;
        };

        /**
         * Encodes the specified LoginResp message, length delimited. Does not implicitly {@link client_proto.LoginResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.LoginResp
         * @static
         * @param {client_proto.ILoginResp} message LoginResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoginResp message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.LoginResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.LoginResp} LoginResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.LoginResp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.result = reader.int32();
                        break;
                    }
                case 2: {
                        message.userId = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LoginResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.LoginResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.LoginResp} LoginResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LoginResp message.
         * @function verify
         * @memberof client_proto.LoginResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoginResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.result != null && message.hasOwnProperty("result"))
                if (!$util.isInteger(message.result))
                    return "result: integer expected";
            if (message.userId != null && message.hasOwnProperty("userId"))
                if (!$util.isInteger(message.userId) && !(message.userId && $util.isInteger(message.userId.low) && $util.isInteger(message.userId.high)))
                    return "userId: integer|Long expected";
            return null;
        };

        /**
         * Creates a LoginResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.LoginResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.LoginResp} LoginResp
         */
        LoginResp.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.LoginResp)
                return object;
            var message = new $root.client_proto.LoginResp();
            if (object.result != null)
                message.result = object.result | 0;
            if (object.userId != null)
                if ($util.Long)
                    (message.userId = $util.Long.fromValue(object.userId)).unsigned = false;
                else if (typeof object.userId === "string")
                    message.userId = parseInt(object.userId, 10);
                else if (typeof object.userId === "number")
                    message.userId = object.userId;
                else if (typeof object.userId === "object")
                    message.userId = new $util.LongBits(object.userId.low >>> 0, object.userId.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a LoginResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.LoginResp
         * @static
         * @param {client_proto.LoginResp} message LoginResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoginResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.result = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userId = options.longs === String ? "0" : 0;
            }
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = message.result;
            if (message.userId != null && message.hasOwnProperty("userId"))
                if (typeof message.userId === "number")
                    object.userId = options.longs === String ? String(message.userId) : message.userId;
                else
                    object.userId = options.longs === String ? $util.Long.prototype.toString.call(message.userId) : options.longs === Number ? new $util.LongBits(message.userId.low >>> 0, message.userId.high >>> 0).toNumber() : message.userId;
            return object;
        };

        /**
         * Converts this LoginResp to JSON.
         * @function toJSON
         * @memberof client_proto.LoginResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoginResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for LoginResp
         * @function getTypeUrl
         * @memberof client_proto.LoginResp
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LoginResp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.LoginResp";
        };

        return LoginResp;
    })();

    client_proto.LoginAttrNtf = (function() {

        /**
         * Properties of a LoginAttrNtf.
         * @memberof client_proto
         * @interface ILoginAttrNtf
         * @property {number|Long|null} [userId] LoginAttrNtf userId
         * @property {string|null} [nickname] LoginAttrNtf nickname
         * @property {string|null} [sex] LoginAttrNtf sex
         * @property {number|null} [imgType] LoginAttrNtf imgType
         * @property {number|null} [imgId] LoginAttrNtf imgId
         * @property {string|null} [imgUrl] LoginAttrNtf imgUrl
         * @property {string|null} [channel] LoginAttrNtf channel
         * @property {string|null} [phone] LoginAttrNtf phone
         * @property {number|Long|null} [diamond] LoginAttrNtf diamond
         * @property {number|Long|null} [goldbean] LoginAttrNtf goldbean
         */

        /**
         * Constructs a new LoginAttrNtf.
         * @memberof client_proto
         * @classdesc Represents a LoginAttrNtf.
         * @implements ILoginAttrNtf
         * @constructor
         * @param {client_proto.ILoginAttrNtf=} [properties] Properties to set
         */
        function LoginAttrNtf(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginAttrNtf userId.
         * @member {number|Long} userId
         * @memberof client_proto.LoginAttrNtf
         * @instance
         */
        LoginAttrNtf.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * LoginAttrNtf nickname.
         * @member {string} nickname
         * @memberof client_proto.LoginAttrNtf
         * @instance
         */
        LoginAttrNtf.prototype.nickname = "";

        /**
         * LoginAttrNtf sex.
         * @member {string} sex
         * @memberof client_proto.LoginAttrNtf
         * @instance
         */
        LoginAttrNtf.prototype.sex = "";

        /**
         * LoginAttrNtf imgType.
         * @member {number} imgType
         * @memberof client_proto.LoginAttrNtf
         * @instance
         */
        LoginAttrNtf.prototype.imgType = 0;

        /**
         * LoginAttrNtf imgId.
         * @member {number} imgId
         * @memberof client_proto.LoginAttrNtf
         * @instance
         */
        LoginAttrNtf.prototype.imgId = 0;

        /**
         * LoginAttrNtf imgUrl.
         * @member {string} imgUrl
         * @memberof client_proto.LoginAttrNtf
         * @instance
         */
        LoginAttrNtf.prototype.imgUrl = "";

        /**
         * LoginAttrNtf channel.
         * @member {string} channel
         * @memberof client_proto.LoginAttrNtf
         * @instance
         */
        LoginAttrNtf.prototype.channel = "";

        /**
         * LoginAttrNtf phone.
         * @member {string} phone
         * @memberof client_proto.LoginAttrNtf
         * @instance
         */
        LoginAttrNtf.prototype.phone = "";

        /**
         * LoginAttrNtf diamond.
         * @member {number|Long} diamond
         * @memberof client_proto.LoginAttrNtf
         * @instance
         */
        LoginAttrNtf.prototype.diamond = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * LoginAttrNtf goldbean.
         * @member {number|Long} goldbean
         * @memberof client_proto.LoginAttrNtf
         * @instance
         */
        LoginAttrNtf.prototype.goldbean = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new LoginAttrNtf instance using the specified properties.
         * @function create
         * @memberof client_proto.LoginAttrNtf
         * @static
         * @param {client_proto.ILoginAttrNtf=} [properties] Properties to set
         * @returns {client_proto.LoginAttrNtf} LoginAttrNtf instance
         */
        LoginAttrNtf.create = function create(properties) {
            return new LoginAttrNtf(properties);
        };

        /**
         * Encodes the specified LoginAttrNtf message. Does not implicitly {@link client_proto.LoginAttrNtf.verify|verify} messages.
         * @function encode
         * @memberof client_proto.LoginAttrNtf
         * @static
         * @param {client_proto.ILoginAttrNtf} message LoginAttrNtf message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginAttrNtf.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.userId);
            if (message.nickname != null && Object.hasOwnProperty.call(message, "nickname"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.nickname);
            if (message.sex != null && Object.hasOwnProperty.call(message, "sex"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.sex);
            if (message.imgType != null && Object.hasOwnProperty.call(message, "imgType"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.imgType);
            if (message.imgId != null && Object.hasOwnProperty.call(message, "imgId"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.imgId);
            if (message.imgUrl != null && Object.hasOwnProperty.call(message, "imgUrl"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.imgUrl);
            if (message.channel != null && Object.hasOwnProperty.call(message, "channel"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.channel);
            if (message.phone != null && Object.hasOwnProperty.call(message, "phone"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.phone);
            if (message.diamond != null && Object.hasOwnProperty.call(message, "diamond"))
                writer.uint32(/* id 10, wireType 0 =*/80).int64(message.diamond);
            if (message.goldbean != null && Object.hasOwnProperty.call(message, "goldbean"))
                writer.uint32(/* id 11, wireType 0 =*/88).int64(message.goldbean);
            return writer;
        };

        /**
         * Encodes the specified LoginAttrNtf message, length delimited. Does not implicitly {@link client_proto.LoginAttrNtf.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.LoginAttrNtf
         * @static
         * @param {client_proto.ILoginAttrNtf} message LoginAttrNtf message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginAttrNtf.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoginAttrNtf message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.LoginAttrNtf
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.LoginAttrNtf} LoginAttrNtf
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginAttrNtf.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.LoginAttrNtf();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.userId = reader.int64();
                        break;
                    }
                case 2: {
                        message.nickname = reader.string();
                        break;
                    }
                case 3: {
                        message.sex = reader.string();
                        break;
                    }
                case 4: {
                        message.imgType = reader.int32();
                        break;
                    }
                case 5: {
                        message.imgId = reader.int32();
                        break;
                    }
                case 6: {
                        message.imgUrl = reader.string();
                        break;
                    }
                case 8: {
                        message.channel = reader.string();
                        break;
                    }
                case 9: {
                        message.phone = reader.string();
                        break;
                    }
                case 10: {
                        message.diamond = reader.int64();
                        break;
                    }
                case 11: {
                        message.goldbean = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LoginAttrNtf message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.LoginAttrNtf
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.LoginAttrNtf} LoginAttrNtf
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginAttrNtf.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LoginAttrNtf message.
         * @function verify
         * @memberof client_proto.LoginAttrNtf
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoginAttrNtf.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.userId != null && message.hasOwnProperty("userId"))
                if (!$util.isInteger(message.userId) && !(message.userId && $util.isInteger(message.userId.low) && $util.isInteger(message.userId.high)))
                    return "userId: integer|Long expected";
            if (message.nickname != null && message.hasOwnProperty("nickname"))
                if (!$util.isString(message.nickname))
                    return "nickname: string expected";
            if (message.sex != null && message.hasOwnProperty("sex"))
                if (!$util.isString(message.sex))
                    return "sex: string expected";
            if (message.imgType != null && message.hasOwnProperty("imgType"))
                if (!$util.isInteger(message.imgType))
                    return "imgType: integer expected";
            if (message.imgId != null && message.hasOwnProperty("imgId"))
                if (!$util.isInteger(message.imgId))
                    return "imgId: integer expected";
            if (message.imgUrl != null && message.hasOwnProperty("imgUrl"))
                if (!$util.isString(message.imgUrl))
                    return "imgUrl: string expected";
            if (message.channel != null && message.hasOwnProperty("channel"))
                if (!$util.isString(message.channel))
                    return "channel: string expected";
            if (message.phone != null && message.hasOwnProperty("phone"))
                if (!$util.isString(message.phone))
                    return "phone: string expected";
            if (message.diamond != null && message.hasOwnProperty("diamond"))
                if (!$util.isInteger(message.diamond) && !(message.diamond && $util.isInteger(message.diamond.low) && $util.isInteger(message.diamond.high)))
                    return "diamond: integer|Long expected";
            if (message.goldbean != null && message.hasOwnProperty("goldbean"))
                if (!$util.isInteger(message.goldbean) && !(message.goldbean && $util.isInteger(message.goldbean.low) && $util.isInteger(message.goldbean.high)))
                    return "goldbean: integer|Long expected";
            return null;
        };

        /**
         * Creates a LoginAttrNtf message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.LoginAttrNtf
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.LoginAttrNtf} LoginAttrNtf
         */
        LoginAttrNtf.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.LoginAttrNtf)
                return object;
            var message = new $root.client_proto.LoginAttrNtf();
            if (object.userId != null)
                if ($util.Long)
                    (message.userId = $util.Long.fromValue(object.userId)).unsigned = false;
                else if (typeof object.userId === "string")
                    message.userId = parseInt(object.userId, 10);
                else if (typeof object.userId === "number")
                    message.userId = object.userId;
                else if (typeof object.userId === "object")
                    message.userId = new $util.LongBits(object.userId.low >>> 0, object.userId.high >>> 0).toNumber();
            if (object.nickname != null)
                message.nickname = String(object.nickname);
            if (object.sex != null)
                message.sex = String(object.sex);
            if (object.imgType != null)
                message.imgType = object.imgType | 0;
            if (object.imgId != null)
                message.imgId = object.imgId | 0;
            if (object.imgUrl != null)
                message.imgUrl = String(object.imgUrl);
            if (object.channel != null)
                message.channel = String(object.channel);
            if (object.phone != null)
                message.phone = String(object.phone);
            if (object.diamond != null)
                if ($util.Long)
                    (message.diamond = $util.Long.fromValue(object.diamond)).unsigned = false;
                else if (typeof object.diamond === "string")
                    message.diamond = parseInt(object.diamond, 10);
                else if (typeof object.diamond === "number")
                    message.diamond = object.diamond;
                else if (typeof object.diamond === "object")
                    message.diamond = new $util.LongBits(object.diamond.low >>> 0, object.diamond.high >>> 0).toNumber();
            if (object.goldbean != null)
                if ($util.Long)
                    (message.goldbean = $util.Long.fromValue(object.goldbean)).unsigned = false;
                else if (typeof object.goldbean === "string")
                    message.goldbean = parseInt(object.goldbean, 10);
                else if (typeof object.goldbean === "number")
                    message.goldbean = object.goldbean;
                else if (typeof object.goldbean === "object")
                    message.goldbean = new $util.LongBits(object.goldbean.low >>> 0, object.goldbean.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a LoginAttrNtf message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.LoginAttrNtf
         * @static
         * @param {client_proto.LoginAttrNtf} message LoginAttrNtf
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoginAttrNtf.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userId = options.longs === String ? "0" : 0;
                object.nickname = "";
                object.sex = "";
                object.imgType = 0;
                object.imgId = 0;
                object.imgUrl = "";
                object.channel = "";
                object.phone = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.diamond = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.diamond = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.goldbean = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.goldbean = options.longs === String ? "0" : 0;
            }
            if (message.userId != null && message.hasOwnProperty("userId"))
                if (typeof message.userId === "number")
                    object.userId = options.longs === String ? String(message.userId) : message.userId;
                else
                    object.userId = options.longs === String ? $util.Long.prototype.toString.call(message.userId) : options.longs === Number ? new $util.LongBits(message.userId.low >>> 0, message.userId.high >>> 0).toNumber() : message.userId;
            if (message.nickname != null && message.hasOwnProperty("nickname"))
                object.nickname = message.nickname;
            if (message.sex != null && message.hasOwnProperty("sex"))
                object.sex = message.sex;
            if (message.imgType != null && message.hasOwnProperty("imgType"))
                object.imgType = message.imgType;
            if (message.imgId != null && message.hasOwnProperty("imgId"))
                object.imgId = message.imgId;
            if (message.imgUrl != null && message.hasOwnProperty("imgUrl"))
                object.imgUrl = message.imgUrl;
            if (message.channel != null && message.hasOwnProperty("channel"))
                object.channel = message.channel;
            if (message.phone != null && message.hasOwnProperty("phone"))
                object.phone = message.phone;
            if (message.diamond != null && message.hasOwnProperty("diamond"))
                if (typeof message.diamond === "number")
                    object.diamond = options.longs === String ? String(message.diamond) : message.diamond;
                else
                    object.diamond = options.longs === String ? $util.Long.prototype.toString.call(message.diamond) : options.longs === Number ? new $util.LongBits(message.diamond.low >>> 0, message.diamond.high >>> 0).toNumber() : message.diamond;
            if (message.goldbean != null && message.hasOwnProperty("goldbean"))
                if (typeof message.goldbean === "number")
                    object.goldbean = options.longs === String ? String(message.goldbean) : message.goldbean;
                else
                    object.goldbean = options.longs === String ? $util.Long.prototype.toString.call(message.goldbean) : options.longs === Number ? new $util.LongBits(message.goldbean.low >>> 0, message.goldbean.high >>> 0).toNumber() : message.goldbean;
            return object;
        };

        /**
         * Converts this LoginAttrNtf to JSON.
         * @function toJSON
         * @memberof client_proto.LoginAttrNtf
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoginAttrNtf.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for LoginAttrNtf
         * @function getTypeUrl
         * @memberof client_proto.LoginAttrNtf
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LoginAttrNtf.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.LoginAttrNtf";
        };

        return LoginAttrNtf;
    })();

    client_proto.LoginOffsitePush = (function() {

        /**
         * Properties of a LoginOffsitePush.
         * @memberof client_proto
         * @interface ILoginOffsitePush
         * @property {string|null} [loginIp] LoginOffsitePush loginIp
         * @property {number|Long|null} [loginTime] LoginOffsitePush loginTime
         */

        /**
         * Constructs a new LoginOffsitePush.
         * @memberof client_proto
         * @classdesc Represents a LoginOffsitePush.
         * @implements ILoginOffsitePush
         * @constructor
         * @param {client_proto.ILoginOffsitePush=} [properties] Properties to set
         */
        function LoginOffsitePush(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginOffsitePush loginIp.
         * @member {string} loginIp
         * @memberof client_proto.LoginOffsitePush
         * @instance
         */
        LoginOffsitePush.prototype.loginIp = "";

        /**
         * LoginOffsitePush loginTime.
         * @member {number|Long} loginTime
         * @memberof client_proto.LoginOffsitePush
         * @instance
         */
        LoginOffsitePush.prototype.loginTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new LoginOffsitePush instance using the specified properties.
         * @function create
         * @memberof client_proto.LoginOffsitePush
         * @static
         * @param {client_proto.ILoginOffsitePush=} [properties] Properties to set
         * @returns {client_proto.LoginOffsitePush} LoginOffsitePush instance
         */
        LoginOffsitePush.create = function create(properties) {
            return new LoginOffsitePush(properties);
        };

        /**
         * Encodes the specified LoginOffsitePush message. Does not implicitly {@link client_proto.LoginOffsitePush.verify|verify} messages.
         * @function encode
         * @memberof client_proto.LoginOffsitePush
         * @static
         * @param {client_proto.ILoginOffsitePush} message LoginOffsitePush message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginOffsitePush.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.loginIp != null && Object.hasOwnProperty.call(message, "loginIp"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.loginIp);
            if (message.loginTime != null && Object.hasOwnProperty.call(message, "loginTime"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.loginTime);
            return writer;
        };

        /**
         * Encodes the specified LoginOffsitePush message, length delimited. Does not implicitly {@link client_proto.LoginOffsitePush.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.LoginOffsitePush
         * @static
         * @param {client_proto.ILoginOffsitePush} message LoginOffsitePush message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginOffsitePush.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoginOffsitePush message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.LoginOffsitePush
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.LoginOffsitePush} LoginOffsitePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginOffsitePush.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.LoginOffsitePush();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.loginIp = reader.string();
                        break;
                    }
                case 2: {
                        message.loginTime = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LoginOffsitePush message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.LoginOffsitePush
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.LoginOffsitePush} LoginOffsitePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginOffsitePush.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LoginOffsitePush message.
         * @function verify
         * @memberof client_proto.LoginOffsitePush
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoginOffsitePush.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.loginIp != null && message.hasOwnProperty("loginIp"))
                if (!$util.isString(message.loginIp))
                    return "loginIp: string expected";
            if (message.loginTime != null && message.hasOwnProperty("loginTime"))
                if (!$util.isInteger(message.loginTime) && !(message.loginTime && $util.isInteger(message.loginTime.low) && $util.isInteger(message.loginTime.high)))
                    return "loginTime: integer|Long expected";
            return null;
        };

        /**
         * Creates a LoginOffsitePush message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.LoginOffsitePush
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.LoginOffsitePush} LoginOffsitePush
         */
        LoginOffsitePush.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.LoginOffsitePush)
                return object;
            var message = new $root.client_proto.LoginOffsitePush();
            if (object.loginIp != null)
                message.loginIp = String(object.loginIp);
            if (object.loginTime != null)
                if ($util.Long)
                    (message.loginTime = $util.Long.fromValue(object.loginTime)).unsigned = false;
                else if (typeof object.loginTime === "string")
                    message.loginTime = parseInt(object.loginTime, 10);
                else if (typeof object.loginTime === "number")
                    message.loginTime = object.loginTime;
                else if (typeof object.loginTime === "object")
                    message.loginTime = new $util.LongBits(object.loginTime.low >>> 0, object.loginTime.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a LoginOffsitePush message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.LoginOffsitePush
         * @static
         * @param {client_proto.LoginOffsitePush} message LoginOffsitePush
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoginOffsitePush.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.loginIp = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.loginTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.loginTime = options.longs === String ? "0" : 0;
            }
            if (message.loginIp != null && message.hasOwnProperty("loginIp"))
                object.loginIp = message.loginIp;
            if (message.loginTime != null && message.hasOwnProperty("loginTime"))
                if (typeof message.loginTime === "number")
                    object.loginTime = options.longs === String ? String(message.loginTime) : message.loginTime;
                else
                    object.loginTime = options.longs === String ? $util.Long.prototype.toString.call(message.loginTime) : options.longs === Number ? new $util.LongBits(message.loginTime.low >>> 0, message.loginTime.high >>> 0).toNumber() : message.loginTime;
            return object;
        };

        /**
         * Converts this LoginOffsitePush to JSON.
         * @function toJSON
         * @memberof client_proto.LoginOffsitePush
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoginOffsitePush.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for LoginOffsitePush
         * @function getTypeUrl
         * @memberof client_proto.LoginOffsitePush
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LoginOffsitePush.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.LoginOffsitePush";
        };

        return LoginOffsitePush;
    })();

    /**
     * HEARTBEAT_SUB_MSG_ID enum.
     * @name client_proto.HEARTBEAT_SUB_MSG_ID
     * @enum {number}
     * @property {number} HSMI_HEARTBEAT_NULL=0 HSMI_HEARTBEAT_NULL value
     * @property {number} HSMI_HEARTBEAT_REQ=1 HSMI_HEARTBEAT_REQ value
     * @property {number} HSMI_HEARTBEAT_RESP=2 HSMI_HEARTBEAT_RESP value
     */
    client_proto.HEARTBEAT_SUB_MSG_ID = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "HSMI_HEARTBEAT_NULL"] = 0;
        values[valuesById[1] = "HSMI_HEARTBEAT_REQ"] = 1;
        values[valuesById[2] = "HSMI_HEARTBEAT_RESP"] = 2;
        return values;
    })();

    client_proto.HeartbeatReq = (function() {

        /**
         * Properties of a HeartbeatReq.
         * @memberof client_proto
         * @interface IHeartbeatReq
         * @property {number|Long|null} [timestamp] HeartbeatReq timestamp
         */

        /**
         * Constructs a new HeartbeatReq.
         * @memberof client_proto
         * @classdesc Represents a HeartbeatReq.
         * @implements IHeartbeatReq
         * @constructor
         * @param {client_proto.IHeartbeatReq=} [properties] Properties to set
         */
        function HeartbeatReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HeartbeatReq timestamp.
         * @member {number|Long} timestamp
         * @memberof client_proto.HeartbeatReq
         * @instance
         */
        HeartbeatReq.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new HeartbeatReq instance using the specified properties.
         * @function create
         * @memberof client_proto.HeartbeatReq
         * @static
         * @param {client_proto.IHeartbeatReq=} [properties] Properties to set
         * @returns {client_proto.HeartbeatReq} HeartbeatReq instance
         */
        HeartbeatReq.create = function create(properties) {
            return new HeartbeatReq(properties);
        };

        /**
         * Encodes the specified HeartbeatReq message. Does not implicitly {@link client_proto.HeartbeatReq.verify|verify} messages.
         * @function encode
         * @memberof client_proto.HeartbeatReq
         * @static
         * @param {client_proto.IHeartbeatReq} message HeartbeatReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HeartbeatReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.timestamp);
            return writer;
        };

        /**
         * Encodes the specified HeartbeatReq message, length delimited. Does not implicitly {@link client_proto.HeartbeatReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.HeartbeatReq
         * @static
         * @param {client_proto.IHeartbeatReq} message HeartbeatReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HeartbeatReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HeartbeatReq message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.HeartbeatReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.HeartbeatReq} HeartbeatReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HeartbeatReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.HeartbeatReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.timestamp = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HeartbeatReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.HeartbeatReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.HeartbeatReq} HeartbeatReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HeartbeatReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HeartbeatReq message.
         * @function verify
         * @memberof client_proto.HeartbeatReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HeartbeatReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            return null;
        };

        /**
         * Creates a HeartbeatReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.HeartbeatReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.HeartbeatReq} HeartbeatReq
         */
        HeartbeatReq.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.HeartbeatReq)
                return object;
            var message = new $root.client_proto.HeartbeatReq();
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a HeartbeatReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.HeartbeatReq
         * @static
         * @param {client_proto.HeartbeatReq} message HeartbeatReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HeartbeatReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            return object;
        };

        /**
         * Converts this HeartbeatReq to JSON.
         * @function toJSON
         * @memberof client_proto.HeartbeatReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HeartbeatReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for HeartbeatReq
         * @function getTypeUrl
         * @memberof client_proto.HeartbeatReq
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        HeartbeatReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.HeartbeatReq";
        };

        return HeartbeatReq;
    })();

    client_proto.HeartbeatResp = (function() {

        /**
         * Properties of a HeartbeatResp.
         * @memberof client_proto
         * @interface IHeartbeatResp
         * @property {number|Long|null} [timestamp] HeartbeatResp timestamp
         * @property {number|Long|null} [svrTimestamp] HeartbeatResp svrTimestamp
         */

        /**
         * Constructs a new HeartbeatResp.
         * @memberof client_proto
         * @classdesc Represents a HeartbeatResp.
         * @implements IHeartbeatResp
         * @constructor
         * @param {client_proto.IHeartbeatResp=} [properties] Properties to set
         */
        function HeartbeatResp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HeartbeatResp timestamp.
         * @member {number|Long} timestamp
         * @memberof client_proto.HeartbeatResp
         * @instance
         */
        HeartbeatResp.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * HeartbeatResp svrTimestamp.
         * @member {number|Long} svrTimestamp
         * @memberof client_proto.HeartbeatResp
         * @instance
         */
        HeartbeatResp.prototype.svrTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new HeartbeatResp instance using the specified properties.
         * @function create
         * @memberof client_proto.HeartbeatResp
         * @static
         * @param {client_proto.IHeartbeatResp=} [properties] Properties to set
         * @returns {client_proto.HeartbeatResp} HeartbeatResp instance
         */
        HeartbeatResp.create = function create(properties) {
            return new HeartbeatResp(properties);
        };

        /**
         * Encodes the specified HeartbeatResp message. Does not implicitly {@link client_proto.HeartbeatResp.verify|verify} messages.
         * @function encode
         * @memberof client_proto.HeartbeatResp
         * @static
         * @param {client_proto.IHeartbeatResp} message HeartbeatResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HeartbeatResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.timestamp);
            if (message.svrTimestamp != null && Object.hasOwnProperty.call(message, "svrTimestamp"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.svrTimestamp);
            return writer;
        };

        /**
         * Encodes the specified HeartbeatResp message, length delimited. Does not implicitly {@link client_proto.HeartbeatResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.HeartbeatResp
         * @static
         * @param {client_proto.IHeartbeatResp} message HeartbeatResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HeartbeatResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HeartbeatResp message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.HeartbeatResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.HeartbeatResp} HeartbeatResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HeartbeatResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.HeartbeatResp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.timestamp = reader.int64();
                        break;
                    }
                case 2: {
                        message.svrTimestamp = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HeartbeatResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.HeartbeatResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.HeartbeatResp} HeartbeatResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HeartbeatResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HeartbeatResp message.
         * @function verify
         * @memberof client_proto.HeartbeatResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HeartbeatResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.svrTimestamp != null && message.hasOwnProperty("svrTimestamp"))
                if (!$util.isInteger(message.svrTimestamp) && !(message.svrTimestamp && $util.isInteger(message.svrTimestamp.low) && $util.isInteger(message.svrTimestamp.high)))
                    return "svrTimestamp: integer|Long expected";
            return null;
        };

        /**
         * Creates a HeartbeatResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.HeartbeatResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.HeartbeatResp} HeartbeatResp
         */
        HeartbeatResp.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.HeartbeatResp)
                return object;
            var message = new $root.client_proto.HeartbeatResp();
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.svrTimestamp != null)
                if ($util.Long)
                    (message.svrTimestamp = $util.Long.fromValue(object.svrTimestamp)).unsigned = false;
                else if (typeof object.svrTimestamp === "string")
                    message.svrTimestamp = parseInt(object.svrTimestamp, 10);
                else if (typeof object.svrTimestamp === "number")
                    message.svrTimestamp = object.svrTimestamp;
                else if (typeof object.svrTimestamp === "object")
                    message.svrTimestamp = new $util.LongBits(object.svrTimestamp.low >>> 0, object.svrTimestamp.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a HeartbeatResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.HeartbeatResp
         * @static
         * @param {client_proto.HeartbeatResp} message HeartbeatResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HeartbeatResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.svrTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.svrTimestamp = options.longs === String ? "0" : 0;
            }
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.svrTimestamp != null && message.hasOwnProperty("svrTimestamp"))
                if (typeof message.svrTimestamp === "number")
                    object.svrTimestamp = options.longs === String ? String(message.svrTimestamp) : message.svrTimestamp;
                else
                    object.svrTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.svrTimestamp) : options.longs === Number ? new $util.LongBits(message.svrTimestamp.low >>> 0, message.svrTimestamp.high >>> 0).toNumber() : message.svrTimestamp;
            return object;
        };

        /**
         * Converts this HeartbeatResp to JSON.
         * @function toJSON
         * @memberof client_proto.HeartbeatResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HeartbeatResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for HeartbeatResp
         * @function getTypeUrl
         * @memberof client_proto.HeartbeatResp
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        HeartbeatResp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.HeartbeatResp";
        };

        return HeartbeatResp;
    })();

    /**
     * GAME_COMMON_SUB_ID enum.
     * @name client_proto.GAME_COMMON_SUB_ID
     * @enum {number}
     * @property {number} GCSI_NULL=0 GCSI_NULL value
     * @property {number} GCSI_GAME_SCENE_PUSH=1 GCSI_GAME_SCENE_PUSH value
     * @property {number} GCSI_USER_ATTRI_CHANGE_PUSH=2 GCSI_USER_ATTRI_CHANGE_PUSH value
     */
    client_proto.GAME_COMMON_SUB_ID = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "GCSI_NULL"] = 0;
        values[valuesById[1] = "GCSI_GAME_SCENE_PUSH"] = 1;
        values[valuesById[2] = "GCSI_USER_ATTRI_CHANGE_PUSH"] = 2;
        return values;
    })();

    client_proto.CommonGamePlayerInfo = (function() {

        /**
         * Properties of a CommonGamePlayerInfo.
         * @memberof client_proto
         * @interface ICommonGamePlayerInfo
         * @property {number|null} [chairId] CommonGamePlayerInfo chairId
         * @property {number|Long|null} [userId] CommonGamePlayerInfo userId
         * @property {string|null} [nickname] CommonGamePlayerInfo nickname
         * @property {number|null} [faceType] CommonGamePlayerInfo faceType
         * @property {number|null} [faceId] CommonGamePlayerInfo faceId
         * @property {string|null} [faceUrl] CommonGamePlayerInfo faceUrl
         * @property {number|null} [sex] CommonGamePlayerInfo sex
         * @property {number|Long|null} [goldNum] CommonGamePlayerInfo goldNum
         * @property {number|Long|null} [diamondNum] CommonGamePlayerInfo diamondNum
         */

        /**
         * Constructs a new CommonGamePlayerInfo.
         * @memberof client_proto
         * @classdesc Represents a CommonGamePlayerInfo.
         * @implements ICommonGamePlayerInfo
         * @constructor
         * @param {client_proto.ICommonGamePlayerInfo=} [properties] Properties to set
         */
        function CommonGamePlayerInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CommonGamePlayerInfo chairId.
         * @member {number} chairId
         * @memberof client_proto.CommonGamePlayerInfo
         * @instance
         */
        CommonGamePlayerInfo.prototype.chairId = 0;

        /**
         * CommonGamePlayerInfo userId.
         * @member {number|Long} userId
         * @memberof client_proto.CommonGamePlayerInfo
         * @instance
         */
        CommonGamePlayerInfo.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * CommonGamePlayerInfo nickname.
         * @member {string} nickname
         * @memberof client_proto.CommonGamePlayerInfo
         * @instance
         */
        CommonGamePlayerInfo.prototype.nickname = "";

        /**
         * CommonGamePlayerInfo faceType.
         * @member {number} faceType
         * @memberof client_proto.CommonGamePlayerInfo
         * @instance
         */
        CommonGamePlayerInfo.prototype.faceType = 0;

        /**
         * CommonGamePlayerInfo faceId.
         * @member {number} faceId
         * @memberof client_proto.CommonGamePlayerInfo
         * @instance
         */
        CommonGamePlayerInfo.prototype.faceId = 0;

        /**
         * CommonGamePlayerInfo faceUrl.
         * @member {string} faceUrl
         * @memberof client_proto.CommonGamePlayerInfo
         * @instance
         */
        CommonGamePlayerInfo.prototype.faceUrl = "";

        /**
         * CommonGamePlayerInfo sex.
         * @member {number} sex
         * @memberof client_proto.CommonGamePlayerInfo
         * @instance
         */
        CommonGamePlayerInfo.prototype.sex = 0;

        /**
         * CommonGamePlayerInfo goldNum.
         * @member {number|Long} goldNum
         * @memberof client_proto.CommonGamePlayerInfo
         * @instance
         */
        CommonGamePlayerInfo.prototype.goldNum = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * CommonGamePlayerInfo diamondNum.
         * @member {number|Long} diamondNum
         * @memberof client_proto.CommonGamePlayerInfo
         * @instance
         */
        CommonGamePlayerInfo.prototype.diamondNum = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new CommonGamePlayerInfo instance using the specified properties.
         * @function create
         * @memberof client_proto.CommonGamePlayerInfo
         * @static
         * @param {client_proto.ICommonGamePlayerInfo=} [properties] Properties to set
         * @returns {client_proto.CommonGamePlayerInfo} CommonGamePlayerInfo instance
         */
        CommonGamePlayerInfo.create = function create(properties) {
            return new CommonGamePlayerInfo(properties);
        };

        /**
         * Encodes the specified CommonGamePlayerInfo message. Does not implicitly {@link client_proto.CommonGamePlayerInfo.verify|verify} messages.
         * @function encode
         * @memberof client_proto.CommonGamePlayerInfo
         * @static
         * @param {client_proto.ICommonGamePlayerInfo} message CommonGamePlayerInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommonGamePlayerInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.chairId != null && Object.hasOwnProperty.call(message, "chairId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.chairId);
            if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.userId);
            if (message.nickname != null && Object.hasOwnProperty.call(message, "nickname"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.nickname);
            if (message.faceType != null && Object.hasOwnProperty.call(message, "faceType"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.faceType);
            if (message.faceId != null && Object.hasOwnProperty.call(message, "faceId"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.faceId);
            if (message.faceUrl != null && Object.hasOwnProperty.call(message, "faceUrl"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.faceUrl);
            if (message.sex != null && Object.hasOwnProperty.call(message, "sex"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.sex);
            if (message.goldNum != null && Object.hasOwnProperty.call(message, "goldNum"))
                writer.uint32(/* id 8, wireType 0 =*/64).int64(message.goldNum);
            if (message.diamondNum != null && Object.hasOwnProperty.call(message, "diamondNum"))
                writer.uint32(/* id 9, wireType 0 =*/72).int64(message.diamondNum);
            return writer;
        };

        /**
         * Encodes the specified CommonGamePlayerInfo message, length delimited. Does not implicitly {@link client_proto.CommonGamePlayerInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.CommonGamePlayerInfo
         * @static
         * @param {client_proto.ICommonGamePlayerInfo} message CommonGamePlayerInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommonGamePlayerInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CommonGamePlayerInfo message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.CommonGamePlayerInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.CommonGamePlayerInfo} CommonGamePlayerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommonGamePlayerInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.CommonGamePlayerInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.chairId = reader.int32();
                        break;
                    }
                case 2: {
                        message.userId = reader.int64();
                        break;
                    }
                case 3: {
                        message.nickname = reader.string();
                        break;
                    }
                case 4: {
                        message.faceType = reader.int32();
                        break;
                    }
                case 5: {
                        message.faceId = reader.int32();
                        break;
                    }
                case 6: {
                        message.faceUrl = reader.string();
                        break;
                    }
                case 7: {
                        message.sex = reader.int32();
                        break;
                    }
                case 8: {
                        message.goldNum = reader.int64();
                        break;
                    }
                case 9: {
                        message.diamondNum = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CommonGamePlayerInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.CommonGamePlayerInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.CommonGamePlayerInfo} CommonGamePlayerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommonGamePlayerInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CommonGamePlayerInfo message.
         * @function verify
         * @memberof client_proto.CommonGamePlayerInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CommonGamePlayerInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.chairId != null && message.hasOwnProperty("chairId"))
                if (!$util.isInteger(message.chairId))
                    return "chairId: integer expected";
            if (message.userId != null && message.hasOwnProperty("userId"))
                if (!$util.isInteger(message.userId) && !(message.userId && $util.isInteger(message.userId.low) && $util.isInteger(message.userId.high)))
                    return "userId: integer|Long expected";
            if (message.nickname != null && message.hasOwnProperty("nickname"))
                if (!$util.isString(message.nickname))
                    return "nickname: string expected";
            if (message.faceType != null && message.hasOwnProperty("faceType"))
                if (!$util.isInteger(message.faceType))
                    return "faceType: integer expected";
            if (message.faceId != null && message.hasOwnProperty("faceId"))
                if (!$util.isInteger(message.faceId))
                    return "faceId: integer expected";
            if (message.faceUrl != null && message.hasOwnProperty("faceUrl"))
                if (!$util.isString(message.faceUrl))
                    return "faceUrl: string expected";
            if (message.sex != null && message.hasOwnProperty("sex"))
                if (!$util.isInteger(message.sex))
                    return "sex: integer expected";
            if (message.goldNum != null && message.hasOwnProperty("goldNum"))
                if (!$util.isInteger(message.goldNum) && !(message.goldNum && $util.isInteger(message.goldNum.low) && $util.isInteger(message.goldNum.high)))
                    return "goldNum: integer|Long expected";
            if (message.diamondNum != null && message.hasOwnProperty("diamondNum"))
                if (!$util.isInteger(message.diamondNum) && !(message.diamondNum && $util.isInteger(message.diamondNum.low) && $util.isInteger(message.diamondNum.high)))
                    return "diamondNum: integer|Long expected";
            return null;
        };

        /**
         * Creates a CommonGamePlayerInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.CommonGamePlayerInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.CommonGamePlayerInfo} CommonGamePlayerInfo
         */
        CommonGamePlayerInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.CommonGamePlayerInfo)
                return object;
            var message = new $root.client_proto.CommonGamePlayerInfo();
            if (object.chairId != null)
                message.chairId = object.chairId | 0;
            if (object.userId != null)
                if ($util.Long)
                    (message.userId = $util.Long.fromValue(object.userId)).unsigned = false;
                else if (typeof object.userId === "string")
                    message.userId = parseInt(object.userId, 10);
                else if (typeof object.userId === "number")
                    message.userId = object.userId;
                else if (typeof object.userId === "object")
                    message.userId = new $util.LongBits(object.userId.low >>> 0, object.userId.high >>> 0).toNumber();
            if (object.nickname != null)
                message.nickname = String(object.nickname);
            if (object.faceType != null)
                message.faceType = object.faceType | 0;
            if (object.faceId != null)
                message.faceId = object.faceId | 0;
            if (object.faceUrl != null)
                message.faceUrl = String(object.faceUrl);
            if (object.sex != null)
                message.sex = object.sex | 0;
            if (object.goldNum != null)
                if ($util.Long)
                    (message.goldNum = $util.Long.fromValue(object.goldNum)).unsigned = false;
                else if (typeof object.goldNum === "string")
                    message.goldNum = parseInt(object.goldNum, 10);
                else if (typeof object.goldNum === "number")
                    message.goldNum = object.goldNum;
                else if (typeof object.goldNum === "object")
                    message.goldNum = new $util.LongBits(object.goldNum.low >>> 0, object.goldNum.high >>> 0).toNumber();
            if (object.diamondNum != null)
                if ($util.Long)
                    (message.diamondNum = $util.Long.fromValue(object.diamondNum)).unsigned = false;
                else if (typeof object.diamondNum === "string")
                    message.diamondNum = parseInt(object.diamondNum, 10);
                else if (typeof object.diamondNum === "number")
                    message.diamondNum = object.diamondNum;
                else if (typeof object.diamondNum === "object")
                    message.diamondNum = new $util.LongBits(object.diamondNum.low >>> 0, object.diamondNum.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a CommonGamePlayerInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.CommonGamePlayerInfo
         * @static
         * @param {client_proto.CommonGamePlayerInfo} message CommonGamePlayerInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CommonGamePlayerInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.chairId = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.userId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.userId = options.longs === String ? "0" : 0;
                object.nickname = "";
                object.faceType = 0;
                object.faceId = 0;
                object.faceUrl = "";
                object.sex = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.goldNum = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.goldNum = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.diamondNum = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.diamondNum = options.longs === String ? "0" : 0;
            }
            if (message.chairId != null && message.hasOwnProperty("chairId"))
                object.chairId = message.chairId;
            if (message.userId != null && message.hasOwnProperty("userId"))
                if (typeof message.userId === "number")
                    object.userId = options.longs === String ? String(message.userId) : message.userId;
                else
                    object.userId = options.longs === String ? $util.Long.prototype.toString.call(message.userId) : options.longs === Number ? new $util.LongBits(message.userId.low >>> 0, message.userId.high >>> 0).toNumber() : message.userId;
            if (message.nickname != null && message.hasOwnProperty("nickname"))
                object.nickname = message.nickname;
            if (message.faceType != null && message.hasOwnProperty("faceType"))
                object.faceType = message.faceType;
            if (message.faceId != null && message.hasOwnProperty("faceId"))
                object.faceId = message.faceId;
            if (message.faceUrl != null && message.hasOwnProperty("faceUrl"))
                object.faceUrl = message.faceUrl;
            if (message.sex != null && message.hasOwnProperty("sex"))
                object.sex = message.sex;
            if (message.goldNum != null && message.hasOwnProperty("goldNum"))
                if (typeof message.goldNum === "number")
                    object.goldNum = options.longs === String ? String(message.goldNum) : message.goldNum;
                else
                    object.goldNum = options.longs === String ? $util.Long.prototype.toString.call(message.goldNum) : options.longs === Number ? new $util.LongBits(message.goldNum.low >>> 0, message.goldNum.high >>> 0).toNumber() : message.goldNum;
            if (message.diamondNum != null && message.hasOwnProperty("diamondNum"))
                if (typeof message.diamondNum === "number")
                    object.diamondNum = options.longs === String ? String(message.diamondNum) : message.diamondNum;
                else
                    object.diamondNum = options.longs === String ? $util.Long.prototype.toString.call(message.diamondNum) : options.longs === Number ? new $util.LongBits(message.diamondNum.low >>> 0, message.diamondNum.high >>> 0).toNumber() : message.diamondNum;
            return object;
        };

        /**
         * Converts this CommonGamePlayerInfo to JSON.
         * @function toJSON
         * @memberof client_proto.CommonGamePlayerInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CommonGamePlayerInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CommonGamePlayerInfo
         * @function getTypeUrl
         * @memberof client_proto.CommonGamePlayerInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CommonGamePlayerInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.CommonGamePlayerInfo";
        };

        return CommonGamePlayerInfo;
    })();

    client_proto.CommonGameScenePush = (function() {

        /**
         * Properties of a CommonGameScenePush.
         * @memberof client_proto
         * @interface ICommonGameScenePush
         * @property {number|null} [roomId] CommonGameScenePush roomId
         * @property {number|null} [tableId] CommonGameScenePush tableId
         * @property {string|null} [gameId] CommonGameScenePush gameId
         * @property {string|null} [roomName] CommonGameScenePush roomName
         * @property {number|null} [roomBase] CommonGameScenePush roomBase
         * @property {Array.<client_proto.ICommonGamePlayerInfo>|null} [useList] CommonGameScenePush useList
         */

        /**
         * Constructs a new CommonGameScenePush.
         * @memberof client_proto
         * @classdesc Represents a CommonGameScenePush.
         * @implements ICommonGameScenePush
         * @constructor
         * @param {client_proto.ICommonGameScenePush=} [properties] Properties to set
         */
        function CommonGameScenePush(properties) {
            this.useList = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CommonGameScenePush roomId.
         * @member {number} roomId
         * @memberof client_proto.CommonGameScenePush
         * @instance
         */
        CommonGameScenePush.prototype.roomId = 0;

        /**
         * CommonGameScenePush tableId.
         * @member {number} tableId
         * @memberof client_proto.CommonGameScenePush
         * @instance
         */
        CommonGameScenePush.prototype.tableId = 0;

        /**
         * CommonGameScenePush gameId.
         * @member {string} gameId
         * @memberof client_proto.CommonGameScenePush
         * @instance
         */
        CommonGameScenePush.prototype.gameId = "";

        /**
         * CommonGameScenePush roomName.
         * @member {string} roomName
         * @memberof client_proto.CommonGameScenePush
         * @instance
         */
        CommonGameScenePush.prototype.roomName = "";

        /**
         * CommonGameScenePush roomBase.
         * @member {number} roomBase
         * @memberof client_proto.CommonGameScenePush
         * @instance
         */
        CommonGameScenePush.prototype.roomBase = 0;

        /**
         * CommonGameScenePush useList.
         * @member {Array.<client_proto.ICommonGamePlayerInfo>} useList
         * @memberof client_proto.CommonGameScenePush
         * @instance
         */
        CommonGameScenePush.prototype.useList = $util.emptyArray;

        /**
         * Creates a new CommonGameScenePush instance using the specified properties.
         * @function create
         * @memberof client_proto.CommonGameScenePush
         * @static
         * @param {client_proto.ICommonGameScenePush=} [properties] Properties to set
         * @returns {client_proto.CommonGameScenePush} CommonGameScenePush instance
         */
        CommonGameScenePush.create = function create(properties) {
            return new CommonGameScenePush(properties);
        };

        /**
         * Encodes the specified CommonGameScenePush message. Does not implicitly {@link client_proto.CommonGameScenePush.verify|verify} messages.
         * @function encode
         * @memberof client_proto.CommonGameScenePush
         * @static
         * @param {client_proto.ICommonGameScenePush} message CommonGameScenePush message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommonGameScenePush.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.roomId);
            if (message.tableId != null && Object.hasOwnProperty.call(message, "tableId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.tableId);
            if (message.gameId != null && Object.hasOwnProperty.call(message, "gameId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.gameId);
            if (message.roomName != null && Object.hasOwnProperty.call(message, "roomName"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.roomName);
            if (message.roomBase != null && Object.hasOwnProperty.call(message, "roomBase"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.roomBase);
            if (message.useList != null && message.useList.length)
                for (var i = 0; i < message.useList.length; ++i)
                    $root.client_proto.CommonGamePlayerInfo.encode(message.useList[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CommonGameScenePush message, length delimited. Does not implicitly {@link client_proto.CommonGameScenePush.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.CommonGameScenePush
         * @static
         * @param {client_proto.ICommonGameScenePush} message CommonGameScenePush message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommonGameScenePush.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CommonGameScenePush message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.CommonGameScenePush
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.CommonGameScenePush} CommonGameScenePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommonGameScenePush.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.CommonGameScenePush();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.roomId = reader.int32();
                        break;
                    }
                case 2: {
                        message.tableId = reader.int32();
                        break;
                    }
                case 3: {
                        message.gameId = reader.string();
                        break;
                    }
                case 4: {
                        message.roomName = reader.string();
                        break;
                    }
                case 5: {
                        message.roomBase = reader.int32();
                        break;
                    }
                case 6: {
                        if (!(message.useList && message.useList.length))
                            message.useList = [];
                        message.useList.push($root.client_proto.CommonGamePlayerInfo.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CommonGameScenePush message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.CommonGameScenePush
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.CommonGameScenePush} CommonGameScenePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommonGameScenePush.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CommonGameScenePush message.
         * @function verify
         * @memberof client_proto.CommonGameScenePush
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CommonGameScenePush.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                if (!$util.isInteger(message.roomId))
                    return "roomId: integer expected";
            if (message.tableId != null && message.hasOwnProperty("tableId"))
                if (!$util.isInteger(message.tableId))
                    return "tableId: integer expected";
            if (message.gameId != null && message.hasOwnProperty("gameId"))
                if (!$util.isString(message.gameId))
                    return "gameId: string expected";
            if (message.roomName != null && message.hasOwnProperty("roomName"))
                if (!$util.isString(message.roomName))
                    return "roomName: string expected";
            if (message.roomBase != null && message.hasOwnProperty("roomBase"))
                if (!$util.isInteger(message.roomBase))
                    return "roomBase: integer expected";
            if (message.useList != null && message.hasOwnProperty("useList")) {
                if (!Array.isArray(message.useList))
                    return "useList: array expected";
                for (var i = 0; i < message.useList.length; ++i) {
                    var error = $root.client_proto.CommonGamePlayerInfo.verify(message.useList[i]);
                    if (error)
                        return "useList." + error;
                }
            }
            return null;
        };

        /**
         * Creates a CommonGameScenePush message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.CommonGameScenePush
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.CommonGameScenePush} CommonGameScenePush
         */
        CommonGameScenePush.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.CommonGameScenePush)
                return object;
            var message = new $root.client_proto.CommonGameScenePush();
            if (object.roomId != null)
                message.roomId = object.roomId | 0;
            if (object.tableId != null)
                message.tableId = object.tableId | 0;
            if (object.gameId != null)
                message.gameId = String(object.gameId);
            if (object.roomName != null)
                message.roomName = String(object.roomName);
            if (object.roomBase != null)
                message.roomBase = object.roomBase | 0;
            if (object.useList) {
                if (!Array.isArray(object.useList))
                    throw TypeError(".client_proto.CommonGameScenePush.useList: array expected");
                message.useList = [];
                for (var i = 0; i < object.useList.length; ++i) {
                    if (typeof object.useList[i] !== "object")
                        throw TypeError(".client_proto.CommonGameScenePush.useList: object expected");
                    message.useList[i] = $root.client_proto.CommonGamePlayerInfo.fromObject(object.useList[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a CommonGameScenePush message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.CommonGameScenePush
         * @static
         * @param {client_proto.CommonGameScenePush} message CommonGameScenePush
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CommonGameScenePush.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.useList = [];
            if (options.defaults) {
                object.roomId = 0;
                object.tableId = 0;
                object.gameId = "";
                object.roomName = "";
                object.roomBase = 0;
            }
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                object.roomId = message.roomId;
            if (message.tableId != null && message.hasOwnProperty("tableId"))
                object.tableId = message.tableId;
            if (message.gameId != null && message.hasOwnProperty("gameId"))
                object.gameId = message.gameId;
            if (message.roomName != null && message.hasOwnProperty("roomName"))
                object.roomName = message.roomName;
            if (message.roomBase != null && message.hasOwnProperty("roomBase"))
                object.roomBase = message.roomBase;
            if (message.useList && message.useList.length) {
                object.useList = [];
                for (var j = 0; j < message.useList.length; ++j)
                    object.useList[j] = $root.client_proto.CommonGamePlayerInfo.toObject(message.useList[j], options);
            }
            return object;
        };

        /**
         * Converts this CommonGameScenePush to JSON.
         * @function toJSON
         * @memberof client_proto.CommonGameScenePush
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CommonGameScenePush.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CommonGameScenePush
         * @function getTypeUrl
         * @memberof client_proto.CommonGameScenePush
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CommonGameScenePush.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.CommonGameScenePush";
        };

        return CommonGameScenePush;
    })();

    client_proto.GameUserAttriChangePush = (function() {

        /**
         * Properties of a GameUserAttriChangePush.
         * @memberof client_proto
         * @interface IGameUserAttriChangePush
         * @property {number|null} [chairId] GameUserAttriChangePush chairId
         * @property {Array.<client_proto.IUserAttriData>|null} [attriList] GameUserAttriChangePush attriList
         */

        /**
         * Constructs a new GameUserAttriChangePush.
         * @memberof client_proto
         * @classdesc Represents a GameUserAttriChangePush.
         * @implements IGameUserAttriChangePush
         * @constructor
         * @param {client_proto.IGameUserAttriChangePush=} [properties] Properties to set
         */
        function GameUserAttriChangePush(properties) {
            this.attriList = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GameUserAttriChangePush chairId.
         * @member {number} chairId
         * @memberof client_proto.GameUserAttriChangePush
         * @instance
         */
        GameUserAttriChangePush.prototype.chairId = 0;

        /**
         * GameUserAttriChangePush attriList.
         * @member {Array.<client_proto.IUserAttriData>} attriList
         * @memberof client_proto.GameUserAttriChangePush
         * @instance
         */
        GameUserAttriChangePush.prototype.attriList = $util.emptyArray;

        /**
         * Creates a new GameUserAttriChangePush instance using the specified properties.
         * @function create
         * @memberof client_proto.GameUserAttriChangePush
         * @static
         * @param {client_proto.IGameUserAttriChangePush=} [properties] Properties to set
         * @returns {client_proto.GameUserAttriChangePush} GameUserAttriChangePush instance
         */
        GameUserAttriChangePush.create = function create(properties) {
            return new GameUserAttriChangePush(properties);
        };

        /**
         * Encodes the specified GameUserAttriChangePush message. Does not implicitly {@link client_proto.GameUserAttriChangePush.verify|verify} messages.
         * @function encode
         * @memberof client_proto.GameUserAttriChangePush
         * @static
         * @param {client_proto.IGameUserAttriChangePush} message GameUserAttriChangePush message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameUserAttriChangePush.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.chairId != null && Object.hasOwnProperty.call(message, "chairId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.chairId);
            if (message.attriList != null && message.attriList.length)
                for (var i = 0; i < message.attriList.length; ++i)
                    $root.client_proto.UserAttriData.encode(message.attriList[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GameUserAttriChangePush message, length delimited. Does not implicitly {@link client_proto.GameUserAttriChangePush.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.GameUserAttriChangePush
         * @static
         * @param {client_proto.IGameUserAttriChangePush} message GameUserAttriChangePush message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameUserAttriChangePush.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameUserAttriChangePush message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.GameUserAttriChangePush
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.GameUserAttriChangePush} GameUserAttriChangePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameUserAttriChangePush.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.GameUserAttriChangePush();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.chairId = reader.int32();
                        break;
                    }
                case 2: {
                        if (!(message.attriList && message.attriList.length))
                            message.attriList = [];
                        message.attriList.push($root.client_proto.UserAttriData.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GameUserAttriChangePush message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.GameUserAttriChangePush
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.GameUserAttriChangePush} GameUserAttriChangePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameUserAttriChangePush.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameUserAttriChangePush message.
         * @function verify
         * @memberof client_proto.GameUserAttriChangePush
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameUserAttriChangePush.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.chairId != null && message.hasOwnProperty("chairId"))
                if (!$util.isInteger(message.chairId))
                    return "chairId: integer expected";
            if (message.attriList != null && message.hasOwnProperty("attriList")) {
                if (!Array.isArray(message.attriList))
                    return "attriList: array expected";
                for (var i = 0; i < message.attriList.length; ++i) {
                    var error = $root.client_proto.UserAttriData.verify(message.attriList[i]);
                    if (error)
                        return "attriList." + error;
                }
            }
            return null;
        };

        /**
         * Creates a GameUserAttriChangePush message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.GameUserAttriChangePush
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.GameUserAttriChangePush} GameUserAttriChangePush
         */
        GameUserAttriChangePush.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.GameUserAttriChangePush)
                return object;
            var message = new $root.client_proto.GameUserAttriChangePush();
            if (object.chairId != null)
                message.chairId = object.chairId | 0;
            if (object.attriList) {
                if (!Array.isArray(object.attriList))
                    throw TypeError(".client_proto.GameUserAttriChangePush.attriList: array expected");
                message.attriList = [];
                for (var i = 0; i < object.attriList.length; ++i) {
                    if (typeof object.attriList[i] !== "object")
                        throw TypeError(".client_proto.GameUserAttriChangePush.attriList: object expected");
                    message.attriList[i] = $root.client_proto.UserAttriData.fromObject(object.attriList[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a GameUserAttriChangePush message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.GameUserAttriChangePush
         * @static
         * @param {client_proto.GameUserAttriChangePush} message GameUserAttriChangePush
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameUserAttriChangePush.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.attriList = [];
            if (options.defaults)
                object.chairId = 0;
            if (message.chairId != null && message.hasOwnProperty("chairId"))
                object.chairId = message.chairId;
            if (message.attriList && message.attriList.length) {
                object.attriList = [];
                for (var j = 0; j < message.attriList.length; ++j)
                    object.attriList[j] = $root.client_proto.UserAttriData.toObject(message.attriList[j], options);
            }
            return object;
        };

        /**
         * Converts this GameUserAttriChangePush to JSON.
         * @function toJSON
         * @memberof client_proto.GameUserAttriChangePush
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameUserAttriChangePush.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GameUserAttriChangePush
         * @function getTypeUrl
         * @memberof client_proto.GameUserAttriChangePush
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GameUserAttriChangePush.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.GameUserAttriChangePush";
        };

        return GameUserAttriChangePush;
    })();

    /**
     * USER_ATTRI_TYPE enum.
     * @name client_proto.USER_ATTRI_TYPE
     * @enum {number}
     * @property {number} UAT_NULL=0 UAT_NULL value
     * @property {number} UAT_GOLD=1 UAT_GOLD value
     * @property {number} UAT_DIAMOND=2 UAT_DIAMOND value
     * @property {number} UAT_VIP_LEVEL=3 UAT_VIP_LEVEL value
     * @property {number} UAT_VIP_EXP=4 UAT_VIP_EXP value
     * @property {number} UAT_SEX=5 UAT_SEX value
     * @property {number} UAT_NICKNAME=6 UAT_NICKNAME value
     * @property {number} UAT_UID=7 UAT_UID value
     * @property {number} UAT_FACE_TYPE=8 UAT_FACE_TYPE value
     * @property {number} UAT_FACE_ID=9 UAT_FACE_ID value
     * @property {number} UAT_FACE_URL=10 UAT_FACE_URL value
     * @property {number} UAT_GAME_LEVEL=11 UAT_GAME_LEVEL value
     */
    client_proto.USER_ATTRI_TYPE = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UAT_NULL"] = 0;
        values[valuesById[1] = "UAT_GOLD"] = 1;
        values[valuesById[2] = "UAT_DIAMOND"] = 2;
        values[valuesById[3] = "UAT_VIP_LEVEL"] = 3;
        values[valuesById[4] = "UAT_VIP_EXP"] = 4;
        values[valuesById[5] = "UAT_SEX"] = 5;
        values[valuesById[6] = "UAT_NICKNAME"] = 6;
        values[valuesById[7] = "UAT_UID"] = 7;
        values[valuesById[8] = "UAT_FACE_TYPE"] = 8;
        values[valuesById[9] = "UAT_FACE_ID"] = 9;
        values[valuesById[10] = "UAT_FACE_URL"] = 10;
        values[valuesById[11] = "UAT_GAME_LEVEL"] = 11;
        return values;
    })();

    client_proto.UserAttriData = (function() {

        /**
         * Properties of a UserAttriData.
         * @memberof client_proto
         * @interface IUserAttriData
         * @property {number|null} [key] UserAttriData key
         * @property {number|null} [valueType] UserAttriData valueType
         * @property {string|null} [value] UserAttriData value
         */

        /**
         * Constructs a new UserAttriData.
         * @memberof client_proto
         * @classdesc Represents a UserAttriData.
         * @implements IUserAttriData
         * @constructor
         * @param {client_proto.IUserAttriData=} [properties] Properties to set
         */
        function UserAttriData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UserAttriData key.
         * @member {number} key
         * @memberof client_proto.UserAttriData
         * @instance
         */
        UserAttriData.prototype.key = 0;

        /**
         * UserAttriData valueType.
         * @member {number} valueType
         * @memberof client_proto.UserAttriData
         * @instance
         */
        UserAttriData.prototype.valueType = 0;

        /**
         * UserAttriData value.
         * @member {string} value
         * @memberof client_proto.UserAttriData
         * @instance
         */
        UserAttriData.prototype.value = "";

        /**
         * Creates a new UserAttriData instance using the specified properties.
         * @function create
         * @memberof client_proto.UserAttriData
         * @static
         * @param {client_proto.IUserAttriData=} [properties] Properties to set
         * @returns {client_proto.UserAttriData} UserAttriData instance
         */
        UserAttriData.create = function create(properties) {
            return new UserAttriData(properties);
        };

        /**
         * Encodes the specified UserAttriData message. Does not implicitly {@link client_proto.UserAttriData.verify|verify} messages.
         * @function encode
         * @memberof client_proto.UserAttriData
         * @static
         * @param {client_proto.IUserAttriData} message UserAttriData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserAttriData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.key);
            if (message.valueType != null && Object.hasOwnProperty.call(message, "valueType"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.valueType);
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.value);
            return writer;
        };

        /**
         * Encodes the specified UserAttriData message, length delimited. Does not implicitly {@link client_proto.UserAttriData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.UserAttriData
         * @static
         * @param {client_proto.IUserAttriData} message UserAttriData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserAttriData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a UserAttriData message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.UserAttriData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.UserAttriData} UserAttriData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserAttriData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.UserAttriData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.key = reader.int32();
                        break;
                    }
                case 2: {
                        message.valueType = reader.int32();
                        break;
                    }
                case 3: {
                        message.value = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a UserAttriData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.UserAttriData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.UserAttriData} UserAttriData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserAttriData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a UserAttriData message.
         * @function verify
         * @memberof client_proto.UserAttriData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UserAttriData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.key != null && message.hasOwnProperty("key"))
                if (!$util.isInteger(message.key))
                    return "key: integer expected";
            if (message.valueType != null && message.hasOwnProperty("valueType"))
                if (!$util.isInteger(message.valueType))
                    return "valueType: integer expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (!$util.isString(message.value))
                    return "value: string expected";
            return null;
        };

        /**
         * Creates a UserAttriData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.UserAttriData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.UserAttriData} UserAttriData
         */
        UserAttriData.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.UserAttriData)
                return object;
            var message = new $root.client_proto.UserAttriData();
            if (object.key != null)
                message.key = object.key | 0;
            if (object.valueType != null)
                message.valueType = object.valueType | 0;
            if (object.value != null)
                message.value = String(object.value);
            return message;
        };

        /**
         * Creates a plain object from a UserAttriData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.UserAttriData
         * @static
         * @param {client_proto.UserAttriData} message UserAttriData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UserAttriData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.key = 0;
                object.valueType = 0;
                object.value = "";
            }
            if (message.key != null && message.hasOwnProperty("key"))
                object.key = message.key;
            if (message.valueType != null && message.hasOwnProperty("valueType"))
                object.valueType = message.valueType;
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = message.value;
            return object;
        };

        /**
         * Converts this UserAttriData to JSON.
         * @function toJSON
         * @memberof client_proto.UserAttriData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UserAttriData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for UserAttriData
         * @function getTypeUrl
         * @memberof client_proto.UserAttriData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        UserAttriData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.UserAttriData";
        };

        return UserAttriData;
    })();

    /**
     * ROOM_LIST_SUB_MSG_ID enum.
     * @name client_proto.ROOM_LIST_SUB_MSG_ID
     * @enum {number}
     * @property {number} RLSMI_NULL=0 RLSMI_NULL value
     * @property {number} RLSMI_FIRST_LAYOUT_REQ=1 RLSMI_FIRST_LAYOUT_REQ value
     * @property {number} RLSMI_FIRST_LAYOUT_RESP=2 RLSMI_FIRST_LAYOUT_RESP value
     * @property {number} RLSMI_SECOND_LIST_REQ=3 RLSMI_SECOND_LIST_REQ value
     * @property {number} RLSMI_SECOND_LIST_RESP=4 RLSMI_SECOND_LIST_RESP value
     * @property {number} RLSMI_BEFORE_MATCH_REQ=5 RLSMI_BEFORE_MATCH_REQ value
     * @property {number} RLSMI_BEFORE_MATCH_RESP=6 RLSMI_BEFORE_MATCH_RESP value
     * @property {number} RLSMI_ENTER_MATCH_REQ=7 RLSMI_ENTER_MATCH_REQ value
     * @property {number} RLSMI_ENTER_MATCH_RESP=8 RLSMI_ENTER_MATCH_RESP value
     * @property {number} RLSMI_EXIT_MATCH_REQ=9 RLSMI_EXIT_MATCH_REQ value
     * @property {number} RLSMI_EXIT_MATCH_RESP=10 RLSMI_EXIT_MATCH_RESP value
     * @property {number} RLSMI_ENTER_ROOM_REQ=11 RLSMI_ENTER_ROOM_REQ value
     * @property {number} RLSMI_ENTER_ROOM_RESP=12 RLSMI_ENTER_ROOM_RESP value
     * @property {number} RLSMI_MATCH_INFO_PUSH=100 RLSMI_MATCH_INFO_PUSH value
     * @property {number} RLSMI_COMEBACK_INFO_PUSH=101 RLSMI_COMEBACK_INFO_PUSH value
     */
    client_proto.ROOM_LIST_SUB_MSG_ID = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "RLSMI_NULL"] = 0;
        values[valuesById[1] = "RLSMI_FIRST_LAYOUT_REQ"] = 1;
        values[valuesById[2] = "RLSMI_FIRST_LAYOUT_RESP"] = 2;
        values[valuesById[3] = "RLSMI_SECOND_LIST_REQ"] = 3;
        values[valuesById[4] = "RLSMI_SECOND_LIST_RESP"] = 4;
        values[valuesById[5] = "RLSMI_BEFORE_MATCH_REQ"] = 5;
        values[valuesById[6] = "RLSMI_BEFORE_MATCH_RESP"] = 6;
        values[valuesById[7] = "RLSMI_ENTER_MATCH_REQ"] = 7;
        values[valuesById[8] = "RLSMI_ENTER_MATCH_RESP"] = 8;
        values[valuesById[9] = "RLSMI_EXIT_MATCH_REQ"] = 9;
        values[valuesById[10] = "RLSMI_EXIT_MATCH_RESP"] = 10;
        values[valuesById[11] = "RLSMI_ENTER_ROOM_REQ"] = 11;
        values[valuesById[12] = "RLSMI_ENTER_ROOM_RESP"] = 12;
        values[valuesById[100] = "RLSMI_MATCH_INFO_PUSH"] = 100;
        values[valuesById[101] = "RLSMI_COMEBACK_INFO_PUSH"] = 101;
        return values;
    })();

    /**
     * GAME_TYPE enum.
     * @name client_proto.GAME_TYPE
     * @enum {number}
     * @property {number} GT_NULL=0 GT_NULL value
     * @property {number} GT_LANDLORD=1 GT_LANDLORD value
     * @property {number} GT_MAHJONG=2 GT_MAHJONG value
     */
    client_proto.GAME_TYPE = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "GT_NULL"] = 0;
        values[valuesById[1] = "GT_LANDLORD"] = 1;
        values[valuesById[2] = "GT_MAHJONG"] = 2;
        return values;
    })();

    /**
     * ROOM_TYPE enum.
     * @name client_proto.ROOM_TYPE
     * @enum {number}
     * @property {number} RT_NULL=0 RT_NULL value
     * @property {number} RT_CLASSICS=1 RT_CLASSICS value
     * @property {number} RT_CONTINUE_BOMB=2 RT_CONTINUE_BOMB value
     * @property {number} RT_MATCH=3 RT_MATCH value
     * @property {number} RT_FRIEND=4 RT_FRIEND value
     */
    client_proto.ROOM_TYPE = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "RT_NULL"] = 0;
        values[valuesById[1] = "RT_CLASSICS"] = 1;
        values[valuesById[2] = "RT_CONTINUE_BOMB"] = 2;
        values[valuesById[3] = "RT_MATCH"] = 3;
        values[valuesById[4] = "RT_FRIEND"] = 4;
        return values;
    })();

    /**
     * ROOM_LEVEL enum.
     * @name client_proto.ROOM_LEVEL
     * @enum {number}
     * @property {number} RL_NULL=0 RL_NULL value
     * @property {number} RL_BEGINNER=1 RL_BEGINNER value
     * @property {number} RL_INTERMEDIATE=2 RL_INTERMEDIATE value
     * @property {number} RL_ADVANCED=3 RL_ADVANCED value
     * @property {number} RL_MASTER=4 RL_MASTER value
     * @property {number} RL_GREAT_MASTER=5 RL_GREAT_MASTER value
     * @property {number} RL_YOUNG_KING=6 RL_YOUNG_KING value
     */
    client_proto.ROOM_LEVEL = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "RL_NULL"] = 0;
        values[valuesById[1] = "RL_BEGINNER"] = 1;
        values[valuesById[2] = "RL_INTERMEDIATE"] = 2;
        values[valuesById[3] = "RL_ADVANCED"] = 3;
        values[valuesById[4] = "RL_MASTER"] = 4;
        values[valuesById[5] = "RL_GREAT_MASTER"] = 5;
        values[valuesById[6] = "RL_YOUNG_KING"] = 6;
        return values;
    })();

    client_proto.SecondRoomListReq = (function() {

        /**
         * Properties of a SecondRoomListReq.
         * @memberof client_proto
         * @interface ISecondRoomListReq
         * @property {number|null} [gameType] SecondRoomListReq gameType
         */

        /**
         * Constructs a new SecondRoomListReq.
         * @memberof client_proto
         * @classdesc Represents a SecondRoomListReq.
         * @implements ISecondRoomListReq
         * @constructor
         * @param {client_proto.ISecondRoomListReq=} [properties] Properties to set
         */
        function SecondRoomListReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SecondRoomListReq gameType.
         * @member {number} gameType
         * @memberof client_proto.SecondRoomListReq
         * @instance
         */
        SecondRoomListReq.prototype.gameType = 0;

        /**
         * Creates a new SecondRoomListReq instance using the specified properties.
         * @function create
         * @memberof client_proto.SecondRoomListReq
         * @static
         * @param {client_proto.ISecondRoomListReq=} [properties] Properties to set
         * @returns {client_proto.SecondRoomListReq} SecondRoomListReq instance
         */
        SecondRoomListReq.create = function create(properties) {
            return new SecondRoomListReq(properties);
        };

        /**
         * Encodes the specified SecondRoomListReq message. Does not implicitly {@link client_proto.SecondRoomListReq.verify|verify} messages.
         * @function encode
         * @memberof client_proto.SecondRoomListReq
         * @static
         * @param {client_proto.ISecondRoomListReq} message SecondRoomListReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SecondRoomListReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.gameType != null && Object.hasOwnProperty.call(message, "gameType"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.gameType);
            return writer;
        };

        /**
         * Encodes the specified SecondRoomListReq message, length delimited. Does not implicitly {@link client_proto.SecondRoomListReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.SecondRoomListReq
         * @static
         * @param {client_proto.ISecondRoomListReq} message SecondRoomListReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SecondRoomListReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SecondRoomListReq message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.SecondRoomListReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.SecondRoomListReq} SecondRoomListReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SecondRoomListReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.SecondRoomListReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.gameType = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SecondRoomListReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.SecondRoomListReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.SecondRoomListReq} SecondRoomListReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SecondRoomListReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SecondRoomListReq message.
         * @function verify
         * @memberof client_proto.SecondRoomListReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SecondRoomListReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.gameType != null && message.hasOwnProperty("gameType"))
                if (!$util.isInteger(message.gameType))
                    return "gameType: integer expected";
            return null;
        };

        /**
         * Creates a SecondRoomListReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.SecondRoomListReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.SecondRoomListReq} SecondRoomListReq
         */
        SecondRoomListReq.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.SecondRoomListReq)
                return object;
            var message = new $root.client_proto.SecondRoomListReq();
            if (object.gameType != null)
                message.gameType = object.gameType | 0;
            return message;
        };

        /**
         * Creates a plain object from a SecondRoomListReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.SecondRoomListReq
         * @static
         * @param {client_proto.SecondRoomListReq} message SecondRoomListReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SecondRoomListReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.gameType = 0;
            if (message.gameType != null && message.hasOwnProperty("gameType"))
                object.gameType = message.gameType;
            return object;
        };

        /**
         * Converts this SecondRoomListReq to JSON.
         * @function toJSON
         * @memberof client_proto.SecondRoomListReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SecondRoomListReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SecondRoomListReq
         * @function getTypeUrl
         * @memberof client_proto.SecondRoomListReq
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SecondRoomListReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.SecondRoomListReq";
        };

        return SecondRoomListReq;
    })();

    client_proto.OneRoomInfo = (function() {

        /**
         * Properties of an OneRoomInfo.
         * @memberof client_proto
         * @interface IOneRoomInfo
         * @property {number|null} [roomId] OneRoomInfo roomId
         * @property {string|null} [roomName] OneRoomInfo roomName
         * @property {number|null} [roomLevel] OneRoomInfo roomLevel
         * @property {number|Long|null} [enterMin] OneRoomInfo enterMin
         * @property {number|Long|null} [enterMax] OneRoomInfo enterMax
         * @property {number|null} [baseScore] OneRoomInfo baseScore
         * @property {number|null} [playerNum] OneRoomInfo playerNum
         */

        /**
         * Constructs a new OneRoomInfo.
         * @memberof client_proto
         * @classdesc Represents an OneRoomInfo.
         * @implements IOneRoomInfo
         * @constructor
         * @param {client_proto.IOneRoomInfo=} [properties] Properties to set
         */
        function OneRoomInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * OneRoomInfo roomId.
         * @member {number} roomId
         * @memberof client_proto.OneRoomInfo
         * @instance
         */
        OneRoomInfo.prototype.roomId = 0;

        /**
         * OneRoomInfo roomName.
         * @member {string} roomName
         * @memberof client_proto.OneRoomInfo
         * @instance
         */
        OneRoomInfo.prototype.roomName = "";

        /**
         * OneRoomInfo roomLevel.
         * @member {number} roomLevel
         * @memberof client_proto.OneRoomInfo
         * @instance
         */
        OneRoomInfo.prototype.roomLevel = 0;

        /**
         * OneRoomInfo enterMin.
         * @member {number|Long} enterMin
         * @memberof client_proto.OneRoomInfo
         * @instance
         */
        OneRoomInfo.prototype.enterMin = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * OneRoomInfo enterMax.
         * @member {number|Long} enterMax
         * @memberof client_proto.OneRoomInfo
         * @instance
         */
        OneRoomInfo.prototype.enterMax = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * OneRoomInfo baseScore.
         * @member {number} baseScore
         * @memberof client_proto.OneRoomInfo
         * @instance
         */
        OneRoomInfo.prototype.baseScore = 0;

        /**
         * OneRoomInfo playerNum.
         * @member {number} playerNum
         * @memberof client_proto.OneRoomInfo
         * @instance
         */
        OneRoomInfo.prototype.playerNum = 0;

        /**
         * Creates a new OneRoomInfo instance using the specified properties.
         * @function create
         * @memberof client_proto.OneRoomInfo
         * @static
         * @param {client_proto.IOneRoomInfo=} [properties] Properties to set
         * @returns {client_proto.OneRoomInfo} OneRoomInfo instance
         */
        OneRoomInfo.create = function create(properties) {
            return new OneRoomInfo(properties);
        };

        /**
         * Encodes the specified OneRoomInfo message. Does not implicitly {@link client_proto.OneRoomInfo.verify|verify} messages.
         * @function encode
         * @memberof client_proto.OneRoomInfo
         * @static
         * @param {client_proto.IOneRoomInfo} message OneRoomInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OneRoomInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.roomId);
            if (message.roomName != null && Object.hasOwnProperty.call(message, "roomName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.roomName);
            if (message.roomLevel != null && Object.hasOwnProperty.call(message, "roomLevel"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.roomLevel);
            if (message.enterMin != null && Object.hasOwnProperty.call(message, "enterMin"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.enterMin);
            if (message.enterMax != null && Object.hasOwnProperty.call(message, "enterMax"))
                writer.uint32(/* id 5, wireType 0 =*/40).int64(message.enterMax);
            if (message.baseScore != null && Object.hasOwnProperty.call(message, "baseScore"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.baseScore);
            if (message.playerNum != null && Object.hasOwnProperty.call(message, "playerNum"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.playerNum);
            return writer;
        };

        /**
         * Encodes the specified OneRoomInfo message, length delimited. Does not implicitly {@link client_proto.OneRoomInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.OneRoomInfo
         * @static
         * @param {client_proto.IOneRoomInfo} message OneRoomInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OneRoomInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an OneRoomInfo message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.OneRoomInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.OneRoomInfo} OneRoomInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OneRoomInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.OneRoomInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.roomId = reader.int32();
                        break;
                    }
                case 2: {
                        message.roomName = reader.string();
                        break;
                    }
                case 3: {
                        message.roomLevel = reader.int32();
                        break;
                    }
                case 4: {
                        message.enterMin = reader.int64();
                        break;
                    }
                case 5: {
                        message.enterMax = reader.int64();
                        break;
                    }
                case 6: {
                        message.baseScore = reader.int32();
                        break;
                    }
                case 7: {
                        message.playerNum = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an OneRoomInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.OneRoomInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.OneRoomInfo} OneRoomInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OneRoomInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an OneRoomInfo message.
         * @function verify
         * @memberof client_proto.OneRoomInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        OneRoomInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                if (!$util.isInteger(message.roomId))
                    return "roomId: integer expected";
            if (message.roomName != null && message.hasOwnProperty("roomName"))
                if (!$util.isString(message.roomName))
                    return "roomName: string expected";
            if (message.roomLevel != null && message.hasOwnProperty("roomLevel"))
                if (!$util.isInteger(message.roomLevel))
                    return "roomLevel: integer expected";
            if (message.enterMin != null && message.hasOwnProperty("enterMin"))
                if (!$util.isInteger(message.enterMin) && !(message.enterMin && $util.isInteger(message.enterMin.low) && $util.isInteger(message.enterMin.high)))
                    return "enterMin: integer|Long expected";
            if (message.enterMax != null && message.hasOwnProperty("enterMax"))
                if (!$util.isInteger(message.enterMax) && !(message.enterMax && $util.isInteger(message.enterMax.low) && $util.isInteger(message.enterMax.high)))
                    return "enterMax: integer|Long expected";
            if (message.baseScore != null && message.hasOwnProperty("baseScore"))
                if (!$util.isInteger(message.baseScore))
                    return "baseScore: integer expected";
            if (message.playerNum != null && message.hasOwnProperty("playerNum"))
                if (!$util.isInteger(message.playerNum))
                    return "playerNum: integer expected";
            return null;
        };

        /**
         * Creates an OneRoomInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.OneRoomInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.OneRoomInfo} OneRoomInfo
         */
        OneRoomInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.OneRoomInfo)
                return object;
            var message = new $root.client_proto.OneRoomInfo();
            if (object.roomId != null)
                message.roomId = object.roomId | 0;
            if (object.roomName != null)
                message.roomName = String(object.roomName);
            if (object.roomLevel != null)
                message.roomLevel = object.roomLevel | 0;
            if (object.enterMin != null)
                if ($util.Long)
                    (message.enterMin = $util.Long.fromValue(object.enterMin)).unsigned = false;
                else if (typeof object.enterMin === "string")
                    message.enterMin = parseInt(object.enterMin, 10);
                else if (typeof object.enterMin === "number")
                    message.enterMin = object.enterMin;
                else if (typeof object.enterMin === "object")
                    message.enterMin = new $util.LongBits(object.enterMin.low >>> 0, object.enterMin.high >>> 0).toNumber();
            if (object.enterMax != null)
                if ($util.Long)
                    (message.enterMax = $util.Long.fromValue(object.enterMax)).unsigned = false;
                else if (typeof object.enterMax === "string")
                    message.enterMax = parseInt(object.enterMax, 10);
                else if (typeof object.enterMax === "number")
                    message.enterMax = object.enterMax;
                else if (typeof object.enterMax === "object")
                    message.enterMax = new $util.LongBits(object.enterMax.low >>> 0, object.enterMax.high >>> 0).toNumber();
            if (object.baseScore != null)
                message.baseScore = object.baseScore | 0;
            if (object.playerNum != null)
                message.playerNum = object.playerNum | 0;
            return message;
        };

        /**
         * Creates a plain object from an OneRoomInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.OneRoomInfo
         * @static
         * @param {client_proto.OneRoomInfo} message OneRoomInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        OneRoomInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.roomId = 0;
                object.roomName = "";
                object.roomLevel = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.enterMin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.enterMin = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.enterMax = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.enterMax = options.longs === String ? "0" : 0;
                object.baseScore = 0;
                object.playerNum = 0;
            }
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                object.roomId = message.roomId;
            if (message.roomName != null && message.hasOwnProperty("roomName"))
                object.roomName = message.roomName;
            if (message.roomLevel != null && message.hasOwnProperty("roomLevel"))
                object.roomLevel = message.roomLevel;
            if (message.enterMin != null && message.hasOwnProperty("enterMin"))
                if (typeof message.enterMin === "number")
                    object.enterMin = options.longs === String ? String(message.enterMin) : message.enterMin;
                else
                    object.enterMin = options.longs === String ? $util.Long.prototype.toString.call(message.enterMin) : options.longs === Number ? new $util.LongBits(message.enterMin.low >>> 0, message.enterMin.high >>> 0).toNumber() : message.enterMin;
            if (message.enterMax != null && message.hasOwnProperty("enterMax"))
                if (typeof message.enterMax === "number")
                    object.enterMax = options.longs === String ? String(message.enterMax) : message.enterMax;
                else
                    object.enterMax = options.longs === String ? $util.Long.prototype.toString.call(message.enterMax) : options.longs === Number ? new $util.LongBits(message.enterMax.low >>> 0, message.enterMax.high >>> 0).toNumber() : message.enterMax;
            if (message.baseScore != null && message.hasOwnProperty("baseScore"))
                object.baseScore = message.baseScore;
            if (message.playerNum != null && message.hasOwnProperty("playerNum"))
                object.playerNum = message.playerNum;
            return object;
        };

        /**
         * Converts this OneRoomInfo to JSON.
         * @function toJSON
         * @memberof client_proto.OneRoomInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OneRoomInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for OneRoomInfo
         * @function getTypeUrl
         * @memberof client_proto.OneRoomInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        OneRoomInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.OneRoomInfo";
        };

        return OneRoomInfo;
    })();

    client_proto.OneRoomTypeInfo = (function() {

        /**
         * Properties of an OneRoomTypeInfo.
         * @memberof client_proto
         * @interface IOneRoomTypeInfo
         * @property {number|null} [roomType] OneRoomTypeInfo roomType
         * @property {string|null} [typeName] OneRoomTypeInfo typeName
         * @property {Array.<client_proto.IOneRoomInfo>|null} [roomList] OneRoomTypeInfo roomList
         */

        /**
         * Constructs a new OneRoomTypeInfo.
         * @memberof client_proto
         * @classdesc Represents an OneRoomTypeInfo.
         * @implements IOneRoomTypeInfo
         * @constructor
         * @param {client_proto.IOneRoomTypeInfo=} [properties] Properties to set
         */
        function OneRoomTypeInfo(properties) {
            this.roomList = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * OneRoomTypeInfo roomType.
         * @member {number} roomType
         * @memberof client_proto.OneRoomTypeInfo
         * @instance
         */
        OneRoomTypeInfo.prototype.roomType = 0;

        /**
         * OneRoomTypeInfo typeName.
         * @member {string} typeName
         * @memberof client_proto.OneRoomTypeInfo
         * @instance
         */
        OneRoomTypeInfo.prototype.typeName = "";

        /**
         * OneRoomTypeInfo roomList.
         * @member {Array.<client_proto.IOneRoomInfo>} roomList
         * @memberof client_proto.OneRoomTypeInfo
         * @instance
         */
        OneRoomTypeInfo.prototype.roomList = $util.emptyArray;

        /**
         * Creates a new OneRoomTypeInfo instance using the specified properties.
         * @function create
         * @memberof client_proto.OneRoomTypeInfo
         * @static
         * @param {client_proto.IOneRoomTypeInfo=} [properties] Properties to set
         * @returns {client_proto.OneRoomTypeInfo} OneRoomTypeInfo instance
         */
        OneRoomTypeInfo.create = function create(properties) {
            return new OneRoomTypeInfo(properties);
        };

        /**
         * Encodes the specified OneRoomTypeInfo message. Does not implicitly {@link client_proto.OneRoomTypeInfo.verify|verify} messages.
         * @function encode
         * @memberof client_proto.OneRoomTypeInfo
         * @static
         * @param {client_proto.IOneRoomTypeInfo} message OneRoomTypeInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OneRoomTypeInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomType != null && Object.hasOwnProperty.call(message, "roomType"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.roomType);
            if (message.typeName != null && Object.hasOwnProperty.call(message, "typeName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.typeName);
            if (message.roomList != null && message.roomList.length)
                for (var i = 0; i < message.roomList.length; ++i)
                    $root.client_proto.OneRoomInfo.encode(message.roomList[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified OneRoomTypeInfo message, length delimited. Does not implicitly {@link client_proto.OneRoomTypeInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.OneRoomTypeInfo
         * @static
         * @param {client_proto.IOneRoomTypeInfo} message OneRoomTypeInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OneRoomTypeInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an OneRoomTypeInfo message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.OneRoomTypeInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.OneRoomTypeInfo} OneRoomTypeInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OneRoomTypeInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.OneRoomTypeInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.roomType = reader.int32();
                        break;
                    }
                case 2: {
                        message.typeName = reader.string();
                        break;
                    }
                case 3: {
                        if (!(message.roomList && message.roomList.length))
                            message.roomList = [];
                        message.roomList.push($root.client_proto.OneRoomInfo.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an OneRoomTypeInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.OneRoomTypeInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.OneRoomTypeInfo} OneRoomTypeInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OneRoomTypeInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an OneRoomTypeInfo message.
         * @function verify
         * @memberof client_proto.OneRoomTypeInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        OneRoomTypeInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomType != null && message.hasOwnProperty("roomType"))
                if (!$util.isInteger(message.roomType))
                    return "roomType: integer expected";
            if (message.typeName != null && message.hasOwnProperty("typeName"))
                if (!$util.isString(message.typeName))
                    return "typeName: string expected";
            if (message.roomList != null && message.hasOwnProperty("roomList")) {
                if (!Array.isArray(message.roomList))
                    return "roomList: array expected";
                for (var i = 0; i < message.roomList.length; ++i) {
                    var error = $root.client_proto.OneRoomInfo.verify(message.roomList[i]);
                    if (error)
                        return "roomList." + error;
                }
            }
            return null;
        };

        /**
         * Creates an OneRoomTypeInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.OneRoomTypeInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.OneRoomTypeInfo} OneRoomTypeInfo
         */
        OneRoomTypeInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.OneRoomTypeInfo)
                return object;
            var message = new $root.client_proto.OneRoomTypeInfo();
            if (object.roomType != null)
                message.roomType = object.roomType | 0;
            if (object.typeName != null)
                message.typeName = String(object.typeName);
            if (object.roomList) {
                if (!Array.isArray(object.roomList))
                    throw TypeError(".client_proto.OneRoomTypeInfo.roomList: array expected");
                message.roomList = [];
                for (var i = 0; i < object.roomList.length; ++i) {
                    if (typeof object.roomList[i] !== "object")
                        throw TypeError(".client_proto.OneRoomTypeInfo.roomList: object expected");
                    message.roomList[i] = $root.client_proto.OneRoomInfo.fromObject(object.roomList[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an OneRoomTypeInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.OneRoomTypeInfo
         * @static
         * @param {client_proto.OneRoomTypeInfo} message OneRoomTypeInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        OneRoomTypeInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.roomList = [];
            if (options.defaults) {
                object.roomType = 0;
                object.typeName = "";
            }
            if (message.roomType != null && message.hasOwnProperty("roomType"))
                object.roomType = message.roomType;
            if (message.typeName != null && message.hasOwnProperty("typeName"))
                object.typeName = message.typeName;
            if (message.roomList && message.roomList.length) {
                object.roomList = [];
                for (var j = 0; j < message.roomList.length; ++j)
                    object.roomList[j] = $root.client_proto.OneRoomInfo.toObject(message.roomList[j], options);
            }
            return object;
        };

        /**
         * Converts this OneRoomTypeInfo to JSON.
         * @function toJSON
         * @memberof client_proto.OneRoomTypeInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OneRoomTypeInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for OneRoomTypeInfo
         * @function getTypeUrl
         * @memberof client_proto.OneRoomTypeInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        OneRoomTypeInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.OneRoomTypeInfo";
        };

        return OneRoomTypeInfo;
    })();

    client_proto.SecondRoomListResp = (function() {

        /**
         * Properties of a SecondRoomListResp.
         * @memberof client_proto
         * @interface ISecondRoomListResp
         * @property {number|null} [gameType] SecondRoomListResp gameType
         * @property {number|null} [defaultRoomType] SecondRoomListResp defaultRoomType
         * @property {Array.<client_proto.IOneRoomTypeInfo>|null} [typeList] SecondRoomListResp typeList
         */

        /**
         * Constructs a new SecondRoomListResp.
         * @memberof client_proto
         * @classdesc Represents a SecondRoomListResp.
         * @implements ISecondRoomListResp
         * @constructor
         * @param {client_proto.ISecondRoomListResp=} [properties] Properties to set
         */
        function SecondRoomListResp(properties) {
            this.typeList = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SecondRoomListResp gameType.
         * @member {number} gameType
         * @memberof client_proto.SecondRoomListResp
         * @instance
         */
        SecondRoomListResp.prototype.gameType = 0;

        /**
         * SecondRoomListResp defaultRoomType.
         * @member {number} defaultRoomType
         * @memberof client_proto.SecondRoomListResp
         * @instance
         */
        SecondRoomListResp.prototype.defaultRoomType = 0;

        /**
         * SecondRoomListResp typeList.
         * @member {Array.<client_proto.IOneRoomTypeInfo>} typeList
         * @memberof client_proto.SecondRoomListResp
         * @instance
         */
        SecondRoomListResp.prototype.typeList = $util.emptyArray;

        /**
         * Creates a new SecondRoomListResp instance using the specified properties.
         * @function create
         * @memberof client_proto.SecondRoomListResp
         * @static
         * @param {client_proto.ISecondRoomListResp=} [properties] Properties to set
         * @returns {client_proto.SecondRoomListResp} SecondRoomListResp instance
         */
        SecondRoomListResp.create = function create(properties) {
            return new SecondRoomListResp(properties);
        };

        /**
         * Encodes the specified SecondRoomListResp message. Does not implicitly {@link client_proto.SecondRoomListResp.verify|verify} messages.
         * @function encode
         * @memberof client_proto.SecondRoomListResp
         * @static
         * @param {client_proto.ISecondRoomListResp} message SecondRoomListResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SecondRoomListResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.gameType != null && Object.hasOwnProperty.call(message, "gameType"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.gameType);
            if (message.defaultRoomType != null && Object.hasOwnProperty.call(message, "defaultRoomType"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.defaultRoomType);
            if (message.typeList != null && message.typeList.length)
                for (var i = 0; i < message.typeList.length; ++i)
                    $root.client_proto.OneRoomTypeInfo.encode(message.typeList[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SecondRoomListResp message, length delimited. Does not implicitly {@link client_proto.SecondRoomListResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.SecondRoomListResp
         * @static
         * @param {client_proto.ISecondRoomListResp} message SecondRoomListResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SecondRoomListResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SecondRoomListResp message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.SecondRoomListResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.SecondRoomListResp} SecondRoomListResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SecondRoomListResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.SecondRoomListResp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.gameType = reader.int32();
                        break;
                    }
                case 2: {
                        message.defaultRoomType = reader.int32();
                        break;
                    }
                case 3: {
                        if (!(message.typeList && message.typeList.length))
                            message.typeList = [];
                        message.typeList.push($root.client_proto.OneRoomTypeInfo.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SecondRoomListResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.SecondRoomListResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.SecondRoomListResp} SecondRoomListResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SecondRoomListResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SecondRoomListResp message.
         * @function verify
         * @memberof client_proto.SecondRoomListResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SecondRoomListResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.gameType != null && message.hasOwnProperty("gameType"))
                if (!$util.isInteger(message.gameType))
                    return "gameType: integer expected";
            if (message.defaultRoomType != null && message.hasOwnProperty("defaultRoomType"))
                if (!$util.isInteger(message.defaultRoomType))
                    return "defaultRoomType: integer expected";
            if (message.typeList != null && message.hasOwnProperty("typeList")) {
                if (!Array.isArray(message.typeList))
                    return "typeList: array expected";
                for (var i = 0; i < message.typeList.length; ++i) {
                    var error = $root.client_proto.OneRoomTypeInfo.verify(message.typeList[i]);
                    if (error)
                        return "typeList." + error;
                }
            }
            return null;
        };

        /**
         * Creates a SecondRoomListResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.SecondRoomListResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.SecondRoomListResp} SecondRoomListResp
         */
        SecondRoomListResp.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.SecondRoomListResp)
                return object;
            var message = new $root.client_proto.SecondRoomListResp();
            if (object.gameType != null)
                message.gameType = object.gameType | 0;
            if (object.defaultRoomType != null)
                message.defaultRoomType = object.defaultRoomType | 0;
            if (object.typeList) {
                if (!Array.isArray(object.typeList))
                    throw TypeError(".client_proto.SecondRoomListResp.typeList: array expected");
                message.typeList = [];
                for (var i = 0; i < object.typeList.length; ++i) {
                    if (typeof object.typeList[i] !== "object")
                        throw TypeError(".client_proto.SecondRoomListResp.typeList: object expected");
                    message.typeList[i] = $root.client_proto.OneRoomTypeInfo.fromObject(object.typeList[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a SecondRoomListResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.SecondRoomListResp
         * @static
         * @param {client_proto.SecondRoomListResp} message SecondRoomListResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SecondRoomListResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.typeList = [];
            if (options.defaults) {
                object.gameType = 0;
                object.defaultRoomType = 0;
            }
            if (message.gameType != null && message.hasOwnProperty("gameType"))
                object.gameType = message.gameType;
            if (message.defaultRoomType != null && message.hasOwnProperty("defaultRoomType"))
                object.defaultRoomType = message.defaultRoomType;
            if (message.typeList && message.typeList.length) {
                object.typeList = [];
                for (var j = 0; j < message.typeList.length; ++j)
                    object.typeList[j] = $root.client_proto.OneRoomTypeInfo.toObject(message.typeList[j], options);
            }
            return object;
        };

        /**
         * Converts this SecondRoomListResp to JSON.
         * @function toJSON
         * @memberof client_proto.SecondRoomListResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SecondRoomListResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SecondRoomListResp
         * @function getTypeUrl
         * @memberof client_proto.SecondRoomListResp
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SecondRoomListResp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.SecondRoomListResp";
        };

        return SecondRoomListResp;
    })();

    client_proto.BeforeMatchTableReq = (function() {

        /**
         * Properties of a BeforeMatchTableReq.
         * @memberof client_proto
         * @interface IBeforeMatchTableReq
         * @property {number|null} [roomId] BeforeMatchTableReq roomId
         */

        /**
         * Constructs a new BeforeMatchTableReq.
         * @memberof client_proto
         * @classdesc Represents a BeforeMatchTableReq.
         * @implements IBeforeMatchTableReq
         * @constructor
         * @param {client_proto.IBeforeMatchTableReq=} [properties] Properties to set
         */
        function BeforeMatchTableReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BeforeMatchTableReq roomId.
         * @member {number} roomId
         * @memberof client_proto.BeforeMatchTableReq
         * @instance
         */
        BeforeMatchTableReq.prototype.roomId = 0;

        /**
         * Creates a new BeforeMatchTableReq instance using the specified properties.
         * @function create
         * @memberof client_proto.BeforeMatchTableReq
         * @static
         * @param {client_proto.IBeforeMatchTableReq=} [properties] Properties to set
         * @returns {client_proto.BeforeMatchTableReq} BeforeMatchTableReq instance
         */
        BeforeMatchTableReq.create = function create(properties) {
            return new BeforeMatchTableReq(properties);
        };

        /**
         * Encodes the specified BeforeMatchTableReq message. Does not implicitly {@link client_proto.BeforeMatchTableReq.verify|verify} messages.
         * @function encode
         * @memberof client_proto.BeforeMatchTableReq
         * @static
         * @param {client_proto.IBeforeMatchTableReq} message BeforeMatchTableReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BeforeMatchTableReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.roomId);
            return writer;
        };

        /**
         * Encodes the specified BeforeMatchTableReq message, length delimited. Does not implicitly {@link client_proto.BeforeMatchTableReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.BeforeMatchTableReq
         * @static
         * @param {client_proto.IBeforeMatchTableReq} message BeforeMatchTableReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BeforeMatchTableReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BeforeMatchTableReq message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.BeforeMatchTableReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.BeforeMatchTableReq} BeforeMatchTableReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BeforeMatchTableReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.BeforeMatchTableReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.roomId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BeforeMatchTableReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.BeforeMatchTableReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.BeforeMatchTableReq} BeforeMatchTableReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BeforeMatchTableReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BeforeMatchTableReq message.
         * @function verify
         * @memberof client_proto.BeforeMatchTableReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BeforeMatchTableReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                if (!$util.isInteger(message.roomId))
                    return "roomId: integer expected";
            return null;
        };

        /**
         * Creates a BeforeMatchTableReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.BeforeMatchTableReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.BeforeMatchTableReq} BeforeMatchTableReq
         */
        BeforeMatchTableReq.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.BeforeMatchTableReq)
                return object;
            var message = new $root.client_proto.BeforeMatchTableReq();
            if (object.roomId != null)
                message.roomId = object.roomId | 0;
            return message;
        };

        /**
         * Creates a plain object from a BeforeMatchTableReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.BeforeMatchTableReq
         * @static
         * @param {client_proto.BeforeMatchTableReq} message BeforeMatchTableReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BeforeMatchTableReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.roomId = 0;
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                object.roomId = message.roomId;
            return object;
        };

        /**
         * Converts this BeforeMatchTableReq to JSON.
         * @function toJSON
         * @memberof client_proto.BeforeMatchTableReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BeforeMatchTableReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for BeforeMatchTableReq
         * @function getTypeUrl
         * @memberof client_proto.BeforeMatchTableReq
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        BeforeMatchTableReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.BeforeMatchTableReq";
        };

        return BeforeMatchTableReq;
    })();

    client_proto.BeforeMatchTableResp = (function() {

        /**
         * Properties of a BeforeMatchTableResp.
         * @memberof client_proto
         * @interface IBeforeMatchTableResp
         * @property {number|null} [roomId] BeforeMatchTableResp roomId
         * @property {number|null} [svrId] BeforeMatchTableResp svrId
         * @property {number|null} [result] BeforeMatchTableResp result
         * @property {number|null} [gameType] BeforeMatchTableResp gameType
         * @property {number|null} [roomType] BeforeMatchTableResp roomType
         */

        /**
         * Constructs a new BeforeMatchTableResp.
         * @memberof client_proto
         * @classdesc Represents a BeforeMatchTableResp.
         * @implements IBeforeMatchTableResp
         * @constructor
         * @param {client_proto.IBeforeMatchTableResp=} [properties] Properties to set
         */
        function BeforeMatchTableResp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BeforeMatchTableResp roomId.
         * @member {number} roomId
         * @memberof client_proto.BeforeMatchTableResp
         * @instance
         */
        BeforeMatchTableResp.prototype.roomId = 0;

        /**
         * BeforeMatchTableResp svrId.
         * @member {number} svrId
         * @memberof client_proto.BeforeMatchTableResp
         * @instance
         */
        BeforeMatchTableResp.prototype.svrId = 0;

        /**
         * BeforeMatchTableResp result.
         * @member {number} result
         * @memberof client_proto.BeforeMatchTableResp
         * @instance
         */
        BeforeMatchTableResp.prototype.result = 0;

        /**
         * BeforeMatchTableResp gameType.
         * @member {number} gameType
         * @memberof client_proto.BeforeMatchTableResp
         * @instance
         */
        BeforeMatchTableResp.prototype.gameType = 0;

        /**
         * BeforeMatchTableResp roomType.
         * @member {number} roomType
         * @memberof client_proto.BeforeMatchTableResp
         * @instance
         */
        BeforeMatchTableResp.prototype.roomType = 0;

        /**
         * Creates a new BeforeMatchTableResp instance using the specified properties.
         * @function create
         * @memberof client_proto.BeforeMatchTableResp
         * @static
         * @param {client_proto.IBeforeMatchTableResp=} [properties] Properties to set
         * @returns {client_proto.BeforeMatchTableResp} BeforeMatchTableResp instance
         */
        BeforeMatchTableResp.create = function create(properties) {
            return new BeforeMatchTableResp(properties);
        };

        /**
         * Encodes the specified BeforeMatchTableResp message. Does not implicitly {@link client_proto.BeforeMatchTableResp.verify|verify} messages.
         * @function encode
         * @memberof client_proto.BeforeMatchTableResp
         * @static
         * @param {client_proto.IBeforeMatchTableResp} message BeforeMatchTableResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BeforeMatchTableResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.roomId);
            if (message.svrId != null && Object.hasOwnProperty.call(message, "svrId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.svrId);
            if (message.result != null && Object.hasOwnProperty.call(message, "result"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.result);
            if (message.gameType != null && Object.hasOwnProperty.call(message, "gameType"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.gameType);
            if (message.roomType != null && Object.hasOwnProperty.call(message, "roomType"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.roomType);
            return writer;
        };

        /**
         * Encodes the specified BeforeMatchTableResp message, length delimited. Does not implicitly {@link client_proto.BeforeMatchTableResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.BeforeMatchTableResp
         * @static
         * @param {client_proto.IBeforeMatchTableResp} message BeforeMatchTableResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BeforeMatchTableResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BeforeMatchTableResp message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.BeforeMatchTableResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.BeforeMatchTableResp} BeforeMatchTableResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BeforeMatchTableResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.BeforeMatchTableResp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.roomId = reader.int32();
                        break;
                    }
                case 2: {
                        message.svrId = reader.int32();
                        break;
                    }
                case 3: {
                        message.result = reader.int32();
                        break;
                    }
                case 4: {
                        message.gameType = reader.int32();
                        break;
                    }
                case 5: {
                        message.roomType = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BeforeMatchTableResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.BeforeMatchTableResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.BeforeMatchTableResp} BeforeMatchTableResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BeforeMatchTableResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BeforeMatchTableResp message.
         * @function verify
         * @memberof client_proto.BeforeMatchTableResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BeforeMatchTableResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                if (!$util.isInteger(message.roomId))
                    return "roomId: integer expected";
            if (message.svrId != null && message.hasOwnProperty("svrId"))
                if (!$util.isInteger(message.svrId))
                    return "svrId: integer expected";
            if (message.result != null && message.hasOwnProperty("result"))
                if (!$util.isInteger(message.result))
                    return "result: integer expected";
            if (message.gameType != null && message.hasOwnProperty("gameType"))
                if (!$util.isInteger(message.gameType))
                    return "gameType: integer expected";
            if (message.roomType != null && message.hasOwnProperty("roomType"))
                if (!$util.isInteger(message.roomType))
                    return "roomType: integer expected";
            return null;
        };

        /**
         * Creates a BeforeMatchTableResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.BeforeMatchTableResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.BeforeMatchTableResp} BeforeMatchTableResp
         */
        BeforeMatchTableResp.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.BeforeMatchTableResp)
                return object;
            var message = new $root.client_proto.BeforeMatchTableResp();
            if (object.roomId != null)
                message.roomId = object.roomId | 0;
            if (object.svrId != null)
                message.svrId = object.svrId | 0;
            if (object.result != null)
                message.result = object.result | 0;
            if (object.gameType != null)
                message.gameType = object.gameType | 0;
            if (object.roomType != null)
                message.roomType = object.roomType | 0;
            return message;
        };

        /**
         * Creates a plain object from a BeforeMatchTableResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.BeforeMatchTableResp
         * @static
         * @param {client_proto.BeforeMatchTableResp} message BeforeMatchTableResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BeforeMatchTableResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.roomId = 0;
                object.svrId = 0;
                object.result = 0;
                object.gameType = 0;
                object.roomType = 0;
            }
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                object.roomId = message.roomId;
            if (message.svrId != null && message.hasOwnProperty("svrId"))
                object.svrId = message.svrId;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = message.result;
            if (message.gameType != null && message.hasOwnProperty("gameType"))
                object.gameType = message.gameType;
            if (message.roomType != null && message.hasOwnProperty("roomType"))
                object.roomType = message.roomType;
            return object;
        };

        /**
         * Converts this BeforeMatchTableResp to JSON.
         * @function toJSON
         * @memberof client_proto.BeforeMatchTableResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BeforeMatchTableResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for BeforeMatchTableResp
         * @function getTypeUrl
         * @memberof client_proto.BeforeMatchTableResp
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        BeforeMatchTableResp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.BeforeMatchTableResp";
        };

        return BeforeMatchTableResp;
    })();

    client_proto.EnterMatchTableReq = (function() {

        /**
         * Properties of an EnterMatchTableReq.
         * @memberof client_proto
         * @interface IEnterMatchTableReq
         * @property {number|null} [roomId] EnterMatchTableReq roomId
         */

        /**
         * Constructs a new EnterMatchTableReq.
         * @memberof client_proto
         * @classdesc Represents an EnterMatchTableReq.
         * @implements IEnterMatchTableReq
         * @constructor
         * @param {client_proto.IEnterMatchTableReq=} [properties] Properties to set
         */
        function EnterMatchTableReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EnterMatchTableReq roomId.
         * @member {number} roomId
         * @memberof client_proto.EnterMatchTableReq
         * @instance
         */
        EnterMatchTableReq.prototype.roomId = 0;

        /**
         * Creates a new EnterMatchTableReq instance using the specified properties.
         * @function create
         * @memberof client_proto.EnterMatchTableReq
         * @static
         * @param {client_proto.IEnterMatchTableReq=} [properties] Properties to set
         * @returns {client_proto.EnterMatchTableReq} EnterMatchTableReq instance
         */
        EnterMatchTableReq.create = function create(properties) {
            return new EnterMatchTableReq(properties);
        };

        /**
         * Encodes the specified EnterMatchTableReq message. Does not implicitly {@link client_proto.EnterMatchTableReq.verify|verify} messages.
         * @function encode
         * @memberof client_proto.EnterMatchTableReq
         * @static
         * @param {client_proto.IEnterMatchTableReq} message EnterMatchTableReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnterMatchTableReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.roomId);
            return writer;
        };

        /**
         * Encodes the specified EnterMatchTableReq message, length delimited. Does not implicitly {@link client_proto.EnterMatchTableReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.EnterMatchTableReq
         * @static
         * @param {client_proto.IEnterMatchTableReq} message EnterMatchTableReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnterMatchTableReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EnterMatchTableReq message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.EnterMatchTableReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.EnterMatchTableReq} EnterMatchTableReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnterMatchTableReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.EnterMatchTableReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.roomId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EnterMatchTableReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.EnterMatchTableReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.EnterMatchTableReq} EnterMatchTableReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnterMatchTableReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EnterMatchTableReq message.
         * @function verify
         * @memberof client_proto.EnterMatchTableReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EnterMatchTableReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                if (!$util.isInteger(message.roomId))
                    return "roomId: integer expected";
            return null;
        };

        /**
         * Creates an EnterMatchTableReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.EnterMatchTableReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.EnterMatchTableReq} EnterMatchTableReq
         */
        EnterMatchTableReq.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.EnterMatchTableReq)
                return object;
            var message = new $root.client_proto.EnterMatchTableReq();
            if (object.roomId != null)
                message.roomId = object.roomId | 0;
            return message;
        };

        /**
         * Creates a plain object from an EnterMatchTableReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.EnterMatchTableReq
         * @static
         * @param {client_proto.EnterMatchTableReq} message EnterMatchTableReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EnterMatchTableReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.roomId = 0;
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                object.roomId = message.roomId;
            return object;
        };

        /**
         * Converts this EnterMatchTableReq to JSON.
         * @function toJSON
         * @memberof client_proto.EnterMatchTableReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EnterMatchTableReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for EnterMatchTableReq
         * @function getTypeUrl
         * @memberof client_proto.EnterMatchTableReq
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EnterMatchTableReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.EnterMatchTableReq";
        };

        return EnterMatchTableReq;
    })();

    client_proto.EnterMatchTableResp = (function() {

        /**
         * Properties of an EnterMatchTableResp.
         * @memberof client_proto
         * @interface IEnterMatchTableResp
         * @property {number|null} [roomId] EnterMatchTableResp roomId
         * @property {number|null} [result] EnterMatchTableResp result
         * @property {number|null} [waitSec] EnterMatchTableResp waitSec
         * @property {string|null} [roomName] EnterMatchTableResp roomName
         * @property {number|null} [roomBase] EnterMatchTableResp roomBase
         */

        /**
         * Constructs a new EnterMatchTableResp.
         * @memberof client_proto
         * @classdesc Represents an EnterMatchTableResp.
         * @implements IEnterMatchTableResp
         * @constructor
         * @param {client_proto.IEnterMatchTableResp=} [properties] Properties to set
         */
        function EnterMatchTableResp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EnterMatchTableResp roomId.
         * @member {number} roomId
         * @memberof client_proto.EnterMatchTableResp
         * @instance
         */
        EnterMatchTableResp.prototype.roomId = 0;

        /**
         * EnterMatchTableResp result.
         * @member {number} result
         * @memberof client_proto.EnterMatchTableResp
         * @instance
         */
        EnterMatchTableResp.prototype.result = 0;

        /**
         * EnterMatchTableResp waitSec.
         * @member {number} waitSec
         * @memberof client_proto.EnterMatchTableResp
         * @instance
         */
        EnterMatchTableResp.prototype.waitSec = 0;

        /**
         * EnterMatchTableResp roomName.
         * @member {string} roomName
         * @memberof client_proto.EnterMatchTableResp
         * @instance
         */
        EnterMatchTableResp.prototype.roomName = "";

        /**
         * EnterMatchTableResp roomBase.
         * @member {number} roomBase
         * @memberof client_proto.EnterMatchTableResp
         * @instance
         */
        EnterMatchTableResp.prototype.roomBase = 0;

        /**
         * Creates a new EnterMatchTableResp instance using the specified properties.
         * @function create
         * @memberof client_proto.EnterMatchTableResp
         * @static
         * @param {client_proto.IEnterMatchTableResp=} [properties] Properties to set
         * @returns {client_proto.EnterMatchTableResp} EnterMatchTableResp instance
         */
        EnterMatchTableResp.create = function create(properties) {
            return new EnterMatchTableResp(properties);
        };

        /**
         * Encodes the specified EnterMatchTableResp message. Does not implicitly {@link client_proto.EnterMatchTableResp.verify|verify} messages.
         * @function encode
         * @memberof client_proto.EnterMatchTableResp
         * @static
         * @param {client_proto.IEnterMatchTableResp} message EnterMatchTableResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnterMatchTableResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.roomId);
            if (message.result != null && Object.hasOwnProperty.call(message, "result"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.result);
            if (message.waitSec != null && Object.hasOwnProperty.call(message, "waitSec"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.waitSec);
            if (message.roomName != null && Object.hasOwnProperty.call(message, "roomName"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.roomName);
            if (message.roomBase != null && Object.hasOwnProperty.call(message, "roomBase"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.roomBase);
            return writer;
        };

        /**
         * Encodes the specified EnterMatchTableResp message, length delimited. Does not implicitly {@link client_proto.EnterMatchTableResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.EnterMatchTableResp
         * @static
         * @param {client_proto.IEnterMatchTableResp} message EnterMatchTableResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnterMatchTableResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EnterMatchTableResp message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.EnterMatchTableResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.EnterMatchTableResp} EnterMatchTableResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnterMatchTableResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.EnterMatchTableResp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.roomId = reader.int32();
                        break;
                    }
                case 2: {
                        message.result = reader.int32();
                        break;
                    }
                case 3: {
                        message.waitSec = reader.int32();
                        break;
                    }
                case 4: {
                        message.roomName = reader.string();
                        break;
                    }
                case 5: {
                        message.roomBase = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EnterMatchTableResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.EnterMatchTableResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.EnterMatchTableResp} EnterMatchTableResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnterMatchTableResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EnterMatchTableResp message.
         * @function verify
         * @memberof client_proto.EnterMatchTableResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EnterMatchTableResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                if (!$util.isInteger(message.roomId))
                    return "roomId: integer expected";
            if (message.result != null && message.hasOwnProperty("result"))
                if (!$util.isInteger(message.result))
                    return "result: integer expected";
            if (message.waitSec != null && message.hasOwnProperty("waitSec"))
                if (!$util.isInteger(message.waitSec))
                    return "waitSec: integer expected";
            if (message.roomName != null && message.hasOwnProperty("roomName"))
                if (!$util.isString(message.roomName))
                    return "roomName: string expected";
            if (message.roomBase != null && message.hasOwnProperty("roomBase"))
                if (!$util.isInteger(message.roomBase))
                    return "roomBase: integer expected";
            return null;
        };

        /**
         * Creates an EnterMatchTableResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.EnterMatchTableResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.EnterMatchTableResp} EnterMatchTableResp
         */
        EnterMatchTableResp.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.EnterMatchTableResp)
                return object;
            var message = new $root.client_proto.EnterMatchTableResp();
            if (object.roomId != null)
                message.roomId = object.roomId | 0;
            if (object.result != null)
                message.result = object.result | 0;
            if (object.waitSec != null)
                message.waitSec = object.waitSec | 0;
            if (object.roomName != null)
                message.roomName = String(object.roomName);
            if (object.roomBase != null)
                message.roomBase = object.roomBase | 0;
            return message;
        };

        /**
         * Creates a plain object from an EnterMatchTableResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.EnterMatchTableResp
         * @static
         * @param {client_proto.EnterMatchTableResp} message EnterMatchTableResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EnterMatchTableResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.roomId = 0;
                object.result = 0;
                object.waitSec = 0;
                object.roomName = "";
                object.roomBase = 0;
            }
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                object.roomId = message.roomId;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = message.result;
            if (message.waitSec != null && message.hasOwnProperty("waitSec"))
                object.waitSec = message.waitSec;
            if (message.roomName != null && message.hasOwnProperty("roomName"))
                object.roomName = message.roomName;
            if (message.roomBase != null && message.hasOwnProperty("roomBase"))
                object.roomBase = message.roomBase;
            return object;
        };

        /**
         * Converts this EnterMatchTableResp to JSON.
         * @function toJSON
         * @memberof client_proto.EnterMatchTableResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EnterMatchTableResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for EnterMatchTableResp
         * @function getTypeUrl
         * @memberof client_proto.EnterMatchTableResp
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EnterMatchTableResp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.EnterMatchTableResp";
        };

        return EnterMatchTableResp;
    })();

    client_proto.MatchedTableInfoPush = (function() {

        /**
         * Properties of a MatchedTableInfoPush.
         * @memberof client_proto
         * @interface IMatchedTableInfoPush
         * @property {number|null} [roomId] MatchedTableInfoPush roomId
         * @property {number|null} [svrId] MatchedTableInfoPush svrId
         */

        /**
         * Constructs a new MatchedTableInfoPush.
         * @memberof client_proto
         * @classdesc Represents a MatchedTableInfoPush.
         * @implements IMatchedTableInfoPush
         * @constructor
         * @param {client_proto.IMatchedTableInfoPush=} [properties] Properties to set
         */
        function MatchedTableInfoPush(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MatchedTableInfoPush roomId.
         * @member {number} roomId
         * @memberof client_proto.MatchedTableInfoPush
         * @instance
         */
        MatchedTableInfoPush.prototype.roomId = 0;

        /**
         * MatchedTableInfoPush svrId.
         * @member {number} svrId
         * @memberof client_proto.MatchedTableInfoPush
         * @instance
         */
        MatchedTableInfoPush.prototype.svrId = 0;

        /**
         * Creates a new MatchedTableInfoPush instance using the specified properties.
         * @function create
         * @memberof client_proto.MatchedTableInfoPush
         * @static
         * @param {client_proto.IMatchedTableInfoPush=} [properties] Properties to set
         * @returns {client_proto.MatchedTableInfoPush} MatchedTableInfoPush instance
         */
        MatchedTableInfoPush.create = function create(properties) {
            return new MatchedTableInfoPush(properties);
        };

        /**
         * Encodes the specified MatchedTableInfoPush message. Does not implicitly {@link client_proto.MatchedTableInfoPush.verify|verify} messages.
         * @function encode
         * @memberof client_proto.MatchedTableInfoPush
         * @static
         * @param {client_proto.IMatchedTableInfoPush} message MatchedTableInfoPush message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MatchedTableInfoPush.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.roomId);
            if (message.svrId != null && Object.hasOwnProperty.call(message, "svrId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.svrId);
            return writer;
        };

        /**
         * Encodes the specified MatchedTableInfoPush message, length delimited. Does not implicitly {@link client_proto.MatchedTableInfoPush.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.MatchedTableInfoPush
         * @static
         * @param {client_proto.IMatchedTableInfoPush} message MatchedTableInfoPush message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MatchedTableInfoPush.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MatchedTableInfoPush message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.MatchedTableInfoPush
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.MatchedTableInfoPush} MatchedTableInfoPush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MatchedTableInfoPush.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.MatchedTableInfoPush();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.roomId = reader.int32();
                        break;
                    }
                case 2: {
                        message.svrId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MatchedTableInfoPush message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.MatchedTableInfoPush
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.MatchedTableInfoPush} MatchedTableInfoPush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MatchedTableInfoPush.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MatchedTableInfoPush message.
         * @function verify
         * @memberof client_proto.MatchedTableInfoPush
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MatchedTableInfoPush.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                if (!$util.isInteger(message.roomId))
                    return "roomId: integer expected";
            if (message.svrId != null && message.hasOwnProperty("svrId"))
                if (!$util.isInteger(message.svrId))
                    return "svrId: integer expected";
            return null;
        };

        /**
         * Creates a MatchedTableInfoPush message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.MatchedTableInfoPush
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.MatchedTableInfoPush} MatchedTableInfoPush
         */
        MatchedTableInfoPush.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.MatchedTableInfoPush)
                return object;
            var message = new $root.client_proto.MatchedTableInfoPush();
            if (object.roomId != null)
                message.roomId = object.roomId | 0;
            if (object.svrId != null)
                message.svrId = object.svrId | 0;
            return message;
        };

        /**
         * Creates a plain object from a MatchedTableInfoPush message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.MatchedTableInfoPush
         * @static
         * @param {client_proto.MatchedTableInfoPush} message MatchedTableInfoPush
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MatchedTableInfoPush.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.roomId = 0;
                object.svrId = 0;
            }
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                object.roomId = message.roomId;
            if (message.svrId != null && message.hasOwnProperty("svrId"))
                object.svrId = message.svrId;
            return object;
        };

        /**
         * Converts this MatchedTableInfoPush to JSON.
         * @function toJSON
         * @memberof client_proto.MatchedTableInfoPush
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MatchedTableInfoPush.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MatchedTableInfoPush
         * @function getTypeUrl
         * @memberof client_proto.MatchedTableInfoPush
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MatchedTableInfoPush.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.MatchedTableInfoPush";
        };

        return MatchedTableInfoPush;
    })();

    client_proto.ExitMatchTableReq = (function() {

        /**
         * Properties of an ExitMatchTableReq.
         * @memberof client_proto
         * @interface IExitMatchTableReq
         * @property {number|null} [roomId] ExitMatchTableReq roomId
         */

        /**
         * Constructs a new ExitMatchTableReq.
         * @memberof client_proto
         * @classdesc Represents an ExitMatchTableReq.
         * @implements IExitMatchTableReq
         * @constructor
         * @param {client_proto.IExitMatchTableReq=} [properties] Properties to set
         */
        function ExitMatchTableReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ExitMatchTableReq roomId.
         * @member {number} roomId
         * @memberof client_proto.ExitMatchTableReq
         * @instance
         */
        ExitMatchTableReq.prototype.roomId = 0;

        /**
         * Creates a new ExitMatchTableReq instance using the specified properties.
         * @function create
         * @memberof client_proto.ExitMatchTableReq
         * @static
         * @param {client_proto.IExitMatchTableReq=} [properties] Properties to set
         * @returns {client_proto.ExitMatchTableReq} ExitMatchTableReq instance
         */
        ExitMatchTableReq.create = function create(properties) {
            return new ExitMatchTableReq(properties);
        };

        /**
         * Encodes the specified ExitMatchTableReq message. Does not implicitly {@link client_proto.ExitMatchTableReq.verify|verify} messages.
         * @function encode
         * @memberof client_proto.ExitMatchTableReq
         * @static
         * @param {client_proto.IExitMatchTableReq} message ExitMatchTableReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExitMatchTableReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.roomId);
            return writer;
        };

        /**
         * Encodes the specified ExitMatchTableReq message, length delimited. Does not implicitly {@link client_proto.ExitMatchTableReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.ExitMatchTableReq
         * @static
         * @param {client_proto.IExitMatchTableReq} message ExitMatchTableReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExitMatchTableReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ExitMatchTableReq message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.ExitMatchTableReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.ExitMatchTableReq} ExitMatchTableReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExitMatchTableReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.ExitMatchTableReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.roomId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ExitMatchTableReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.ExitMatchTableReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.ExitMatchTableReq} ExitMatchTableReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExitMatchTableReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ExitMatchTableReq message.
         * @function verify
         * @memberof client_proto.ExitMatchTableReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ExitMatchTableReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                if (!$util.isInteger(message.roomId))
                    return "roomId: integer expected";
            return null;
        };

        /**
         * Creates an ExitMatchTableReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.ExitMatchTableReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.ExitMatchTableReq} ExitMatchTableReq
         */
        ExitMatchTableReq.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.ExitMatchTableReq)
                return object;
            var message = new $root.client_proto.ExitMatchTableReq();
            if (object.roomId != null)
                message.roomId = object.roomId | 0;
            return message;
        };

        /**
         * Creates a plain object from an ExitMatchTableReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.ExitMatchTableReq
         * @static
         * @param {client_proto.ExitMatchTableReq} message ExitMatchTableReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ExitMatchTableReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.roomId = 0;
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                object.roomId = message.roomId;
            return object;
        };

        /**
         * Converts this ExitMatchTableReq to JSON.
         * @function toJSON
         * @memberof client_proto.ExitMatchTableReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ExitMatchTableReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ExitMatchTableReq
         * @function getTypeUrl
         * @memberof client_proto.ExitMatchTableReq
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ExitMatchTableReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.ExitMatchTableReq";
        };

        return ExitMatchTableReq;
    })();

    client_proto.ExitMatchTableResp = (function() {

        /**
         * Properties of an ExitMatchTableResp.
         * @memberof client_proto
         * @interface IExitMatchTableResp
         * @property {number|null} [roomId] ExitMatchTableResp roomId
         * @property {number|null} [from] ExitMatchTableResp from
         * @property {number|null} [result] ExitMatchTableResp result
         */

        /**
         * Constructs a new ExitMatchTableResp.
         * @memberof client_proto
         * @classdesc Represents an ExitMatchTableResp.
         * @implements IExitMatchTableResp
         * @constructor
         * @param {client_proto.IExitMatchTableResp=} [properties] Properties to set
         */
        function ExitMatchTableResp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ExitMatchTableResp roomId.
         * @member {number} roomId
         * @memberof client_proto.ExitMatchTableResp
         * @instance
         */
        ExitMatchTableResp.prototype.roomId = 0;

        /**
         * ExitMatchTableResp from.
         * @member {number} from
         * @memberof client_proto.ExitMatchTableResp
         * @instance
         */
        ExitMatchTableResp.prototype.from = 0;

        /**
         * ExitMatchTableResp result.
         * @member {number} result
         * @memberof client_proto.ExitMatchTableResp
         * @instance
         */
        ExitMatchTableResp.prototype.result = 0;

        /**
         * Creates a new ExitMatchTableResp instance using the specified properties.
         * @function create
         * @memberof client_proto.ExitMatchTableResp
         * @static
         * @param {client_proto.IExitMatchTableResp=} [properties] Properties to set
         * @returns {client_proto.ExitMatchTableResp} ExitMatchTableResp instance
         */
        ExitMatchTableResp.create = function create(properties) {
            return new ExitMatchTableResp(properties);
        };

        /**
         * Encodes the specified ExitMatchTableResp message. Does not implicitly {@link client_proto.ExitMatchTableResp.verify|verify} messages.
         * @function encode
         * @memberof client_proto.ExitMatchTableResp
         * @static
         * @param {client_proto.IExitMatchTableResp} message ExitMatchTableResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExitMatchTableResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.roomId);
            if (message.from != null && Object.hasOwnProperty.call(message, "from"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.from);
            if (message.result != null && Object.hasOwnProperty.call(message, "result"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.result);
            return writer;
        };

        /**
         * Encodes the specified ExitMatchTableResp message, length delimited. Does not implicitly {@link client_proto.ExitMatchTableResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.ExitMatchTableResp
         * @static
         * @param {client_proto.IExitMatchTableResp} message ExitMatchTableResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExitMatchTableResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ExitMatchTableResp message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.ExitMatchTableResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.ExitMatchTableResp} ExitMatchTableResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExitMatchTableResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.ExitMatchTableResp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.roomId = reader.int32();
                        break;
                    }
                case 2: {
                        message.from = reader.int32();
                        break;
                    }
                case 3: {
                        message.result = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ExitMatchTableResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.ExitMatchTableResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.ExitMatchTableResp} ExitMatchTableResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExitMatchTableResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ExitMatchTableResp message.
         * @function verify
         * @memberof client_proto.ExitMatchTableResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ExitMatchTableResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                if (!$util.isInteger(message.roomId))
                    return "roomId: integer expected";
            if (message.from != null && message.hasOwnProperty("from"))
                if (!$util.isInteger(message.from))
                    return "from: integer expected";
            if (message.result != null && message.hasOwnProperty("result"))
                if (!$util.isInteger(message.result))
                    return "result: integer expected";
            return null;
        };

        /**
         * Creates an ExitMatchTableResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.ExitMatchTableResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.ExitMatchTableResp} ExitMatchTableResp
         */
        ExitMatchTableResp.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.ExitMatchTableResp)
                return object;
            var message = new $root.client_proto.ExitMatchTableResp();
            if (object.roomId != null)
                message.roomId = object.roomId | 0;
            if (object.from != null)
                message.from = object.from | 0;
            if (object.result != null)
                message.result = object.result | 0;
            return message;
        };

        /**
         * Creates a plain object from an ExitMatchTableResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.ExitMatchTableResp
         * @static
         * @param {client_proto.ExitMatchTableResp} message ExitMatchTableResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ExitMatchTableResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.roomId = 0;
                object.from = 0;
                object.result = 0;
            }
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                object.roomId = message.roomId;
            if (message.from != null && message.hasOwnProperty("from"))
                object.from = message.from;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = message.result;
            return object;
        };

        /**
         * Converts this ExitMatchTableResp to JSON.
         * @function toJSON
         * @memberof client_proto.ExitMatchTableResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ExitMatchTableResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ExitMatchTableResp
         * @function getTypeUrl
         * @memberof client_proto.ExitMatchTableResp
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ExitMatchTableResp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.ExitMatchTableResp";
        };

        return ExitMatchTableResp;
    })();

    client_proto.EnterRoomReq = (function() {

        /**
         * Properties of an EnterRoomReq.
         * @memberof client_proto
         * @interface IEnterRoomReq
         * @property {number|null} [roomId] EnterRoomReq roomId
         */

        /**
         * Constructs a new EnterRoomReq.
         * @memberof client_proto
         * @classdesc Represents an EnterRoomReq.
         * @implements IEnterRoomReq
         * @constructor
         * @param {client_proto.IEnterRoomReq=} [properties] Properties to set
         */
        function EnterRoomReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EnterRoomReq roomId.
         * @member {number} roomId
         * @memberof client_proto.EnterRoomReq
         * @instance
         */
        EnterRoomReq.prototype.roomId = 0;

        /**
         * Creates a new EnterRoomReq instance using the specified properties.
         * @function create
         * @memberof client_proto.EnterRoomReq
         * @static
         * @param {client_proto.IEnterRoomReq=} [properties] Properties to set
         * @returns {client_proto.EnterRoomReq} EnterRoomReq instance
         */
        EnterRoomReq.create = function create(properties) {
            return new EnterRoomReq(properties);
        };

        /**
         * Encodes the specified EnterRoomReq message. Does not implicitly {@link client_proto.EnterRoomReq.verify|verify} messages.
         * @function encode
         * @memberof client_proto.EnterRoomReq
         * @static
         * @param {client_proto.IEnterRoomReq} message EnterRoomReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnterRoomReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.roomId);
            return writer;
        };

        /**
         * Encodes the specified EnterRoomReq message, length delimited. Does not implicitly {@link client_proto.EnterRoomReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.EnterRoomReq
         * @static
         * @param {client_proto.IEnterRoomReq} message EnterRoomReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnterRoomReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EnterRoomReq message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.EnterRoomReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.EnterRoomReq} EnterRoomReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnterRoomReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.EnterRoomReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.roomId = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EnterRoomReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.EnterRoomReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.EnterRoomReq} EnterRoomReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnterRoomReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EnterRoomReq message.
         * @function verify
         * @memberof client_proto.EnterRoomReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EnterRoomReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                if (!$util.isInteger(message.roomId))
                    return "roomId: integer expected";
            return null;
        };

        /**
         * Creates an EnterRoomReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.EnterRoomReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.EnterRoomReq} EnterRoomReq
         */
        EnterRoomReq.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.EnterRoomReq)
                return object;
            var message = new $root.client_proto.EnterRoomReq();
            if (object.roomId != null)
                message.roomId = object.roomId | 0;
            return message;
        };

        /**
         * Creates a plain object from an EnterRoomReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.EnterRoomReq
         * @static
         * @param {client_proto.EnterRoomReq} message EnterRoomReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EnterRoomReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.roomId = 0;
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                object.roomId = message.roomId;
            return object;
        };

        /**
         * Converts this EnterRoomReq to JSON.
         * @function toJSON
         * @memberof client_proto.EnterRoomReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EnterRoomReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for EnterRoomReq
         * @function getTypeUrl
         * @memberof client_proto.EnterRoomReq
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EnterRoomReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.EnterRoomReq";
        };

        return EnterRoomReq;
    })();

    client_proto.EnterRoomResp = (function() {

        /**
         * Properties of an EnterRoomResp.
         * @memberof client_proto
         * @interface IEnterRoomResp
         * @property {number|null} [roomId] EnterRoomResp roomId
         * @property {number|null} [result] EnterRoomResp result
         */

        /**
         * Constructs a new EnterRoomResp.
         * @memberof client_proto
         * @classdesc Represents an EnterRoomResp.
         * @implements IEnterRoomResp
         * @constructor
         * @param {client_proto.IEnterRoomResp=} [properties] Properties to set
         */
        function EnterRoomResp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EnterRoomResp roomId.
         * @member {number} roomId
         * @memberof client_proto.EnterRoomResp
         * @instance
         */
        EnterRoomResp.prototype.roomId = 0;

        /**
         * EnterRoomResp result.
         * @member {number} result
         * @memberof client_proto.EnterRoomResp
         * @instance
         */
        EnterRoomResp.prototype.result = 0;

        /**
         * Creates a new EnterRoomResp instance using the specified properties.
         * @function create
         * @memberof client_proto.EnterRoomResp
         * @static
         * @param {client_proto.IEnterRoomResp=} [properties] Properties to set
         * @returns {client_proto.EnterRoomResp} EnterRoomResp instance
         */
        EnterRoomResp.create = function create(properties) {
            return new EnterRoomResp(properties);
        };

        /**
         * Encodes the specified EnterRoomResp message. Does not implicitly {@link client_proto.EnterRoomResp.verify|verify} messages.
         * @function encode
         * @memberof client_proto.EnterRoomResp
         * @static
         * @param {client_proto.IEnterRoomResp} message EnterRoomResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnterRoomResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.roomId);
            if (message.result != null && Object.hasOwnProperty.call(message, "result"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.result);
            return writer;
        };

        /**
         * Encodes the specified EnterRoomResp message, length delimited. Does not implicitly {@link client_proto.EnterRoomResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.EnterRoomResp
         * @static
         * @param {client_proto.IEnterRoomResp} message EnterRoomResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EnterRoomResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EnterRoomResp message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.EnterRoomResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.EnterRoomResp} EnterRoomResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnterRoomResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.EnterRoomResp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.roomId = reader.int32();
                        break;
                    }
                case 2: {
                        message.result = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EnterRoomResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.EnterRoomResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.EnterRoomResp} EnterRoomResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EnterRoomResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EnterRoomResp message.
         * @function verify
         * @memberof client_proto.EnterRoomResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EnterRoomResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                if (!$util.isInteger(message.roomId))
                    return "roomId: integer expected";
            if (message.result != null && message.hasOwnProperty("result"))
                if (!$util.isInteger(message.result))
                    return "result: integer expected";
            return null;
        };

        /**
         * Creates an EnterRoomResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.EnterRoomResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.EnterRoomResp} EnterRoomResp
         */
        EnterRoomResp.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.EnterRoomResp)
                return object;
            var message = new $root.client_proto.EnterRoomResp();
            if (object.roomId != null)
                message.roomId = object.roomId | 0;
            if (object.result != null)
                message.result = object.result | 0;
            return message;
        };

        /**
         * Creates a plain object from an EnterRoomResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.EnterRoomResp
         * @static
         * @param {client_proto.EnterRoomResp} message EnterRoomResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EnterRoomResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.roomId = 0;
                object.result = 0;
            }
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                object.roomId = message.roomId;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = message.result;
            return object;
        };

        /**
         * Converts this EnterRoomResp to JSON.
         * @function toJSON
         * @memberof client_proto.EnterRoomResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EnterRoomResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for EnterRoomResp
         * @function getTypeUrl
         * @memberof client_proto.EnterRoomResp
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EnterRoomResp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.EnterRoomResp";
        };

        return EnterRoomResp;
    })();

    client_proto.ComebackRoomInfoPush = (function() {

        /**
         * Properties of a ComebackRoomInfoPush.
         * @memberof client_proto
         * @interface IComebackRoomInfoPush
         * @property {number|null} [roomId] ComebackRoomInfoPush roomId
         * @property {number|null} [svrId] ComebackRoomInfoPush svrId
         * @property {number|null} [gameType] ComebackRoomInfoPush gameType
         * @property {number|null} [roomType] ComebackRoomInfoPush roomType
         */

        /**
         * Constructs a new ComebackRoomInfoPush.
         * @memberof client_proto
         * @classdesc Represents a ComebackRoomInfoPush.
         * @implements IComebackRoomInfoPush
         * @constructor
         * @param {client_proto.IComebackRoomInfoPush=} [properties] Properties to set
         */
        function ComebackRoomInfoPush(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ComebackRoomInfoPush roomId.
         * @member {number} roomId
         * @memberof client_proto.ComebackRoomInfoPush
         * @instance
         */
        ComebackRoomInfoPush.prototype.roomId = 0;

        /**
         * ComebackRoomInfoPush svrId.
         * @member {number} svrId
         * @memberof client_proto.ComebackRoomInfoPush
         * @instance
         */
        ComebackRoomInfoPush.prototype.svrId = 0;

        /**
         * ComebackRoomInfoPush gameType.
         * @member {number} gameType
         * @memberof client_proto.ComebackRoomInfoPush
         * @instance
         */
        ComebackRoomInfoPush.prototype.gameType = 0;

        /**
         * ComebackRoomInfoPush roomType.
         * @member {number} roomType
         * @memberof client_proto.ComebackRoomInfoPush
         * @instance
         */
        ComebackRoomInfoPush.prototype.roomType = 0;

        /**
         * Creates a new ComebackRoomInfoPush instance using the specified properties.
         * @function create
         * @memberof client_proto.ComebackRoomInfoPush
         * @static
         * @param {client_proto.IComebackRoomInfoPush=} [properties] Properties to set
         * @returns {client_proto.ComebackRoomInfoPush} ComebackRoomInfoPush instance
         */
        ComebackRoomInfoPush.create = function create(properties) {
            return new ComebackRoomInfoPush(properties);
        };

        /**
         * Encodes the specified ComebackRoomInfoPush message. Does not implicitly {@link client_proto.ComebackRoomInfoPush.verify|verify} messages.
         * @function encode
         * @memberof client_proto.ComebackRoomInfoPush
         * @static
         * @param {client_proto.IComebackRoomInfoPush} message ComebackRoomInfoPush message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ComebackRoomInfoPush.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.roomId);
            if (message.svrId != null && Object.hasOwnProperty.call(message, "svrId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.svrId);
            if (message.gameType != null && Object.hasOwnProperty.call(message, "gameType"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.gameType);
            if (message.roomType != null && Object.hasOwnProperty.call(message, "roomType"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.roomType);
            return writer;
        };

        /**
         * Encodes the specified ComebackRoomInfoPush message, length delimited. Does not implicitly {@link client_proto.ComebackRoomInfoPush.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.ComebackRoomInfoPush
         * @static
         * @param {client_proto.IComebackRoomInfoPush} message ComebackRoomInfoPush message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ComebackRoomInfoPush.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ComebackRoomInfoPush message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.ComebackRoomInfoPush
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.ComebackRoomInfoPush} ComebackRoomInfoPush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ComebackRoomInfoPush.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.ComebackRoomInfoPush();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.roomId = reader.int32();
                        break;
                    }
                case 2: {
                        message.svrId = reader.int32();
                        break;
                    }
                case 3: {
                        message.gameType = reader.int32();
                        break;
                    }
                case 4: {
                        message.roomType = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ComebackRoomInfoPush message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.ComebackRoomInfoPush
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.ComebackRoomInfoPush} ComebackRoomInfoPush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ComebackRoomInfoPush.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ComebackRoomInfoPush message.
         * @function verify
         * @memberof client_proto.ComebackRoomInfoPush
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ComebackRoomInfoPush.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                if (!$util.isInteger(message.roomId))
                    return "roomId: integer expected";
            if (message.svrId != null && message.hasOwnProperty("svrId"))
                if (!$util.isInteger(message.svrId))
                    return "svrId: integer expected";
            if (message.gameType != null && message.hasOwnProperty("gameType"))
                if (!$util.isInteger(message.gameType))
                    return "gameType: integer expected";
            if (message.roomType != null && message.hasOwnProperty("roomType"))
                if (!$util.isInteger(message.roomType))
                    return "roomType: integer expected";
            return null;
        };

        /**
         * Creates a ComebackRoomInfoPush message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.ComebackRoomInfoPush
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.ComebackRoomInfoPush} ComebackRoomInfoPush
         */
        ComebackRoomInfoPush.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.ComebackRoomInfoPush)
                return object;
            var message = new $root.client_proto.ComebackRoomInfoPush();
            if (object.roomId != null)
                message.roomId = object.roomId | 0;
            if (object.svrId != null)
                message.svrId = object.svrId | 0;
            if (object.gameType != null)
                message.gameType = object.gameType | 0;
            if (object.roomType != null)
                message.roomType = object.roomType | 0;
            return message;
        };

        /**
         * Creates a plain object from a ComebackRoomInfoPush message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.ComebackRoomInfoPush
         * @static
         * @param {client_proto.ComebackRoomInfoPush} message ComebackRoomInfoPush
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ComebackRoomInfoPush.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.roomId = 0;
                object.svrId = 0;
                object.gameType = 0;
                object.roomType = 0;
            }
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                object.roomId = message.roomId;
            if (message.svrId != null && message.hasOwnProperty("svrId"))
                object.svrId = message.svrId;
            if (message.gameType != null && message.hasOwnProperty("gameType"))
                object.gameType = message.gameType;
            if (message.roomType != null && message.hasOwnProperty("roomType"))
                object.roomType = message.roomType;
            return object;
        };

        /**
         * Converts this ComebackRoomInfoPush to JSON.
         * @function toJSON
         * @memberof client_proto.ComebackRoomInfoPush
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ComebackRoomInfoPush.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ComebackRoomInfoPush
         * @function getTypeUrl
         * @memberof client_proto.ComebackRoomInfoPush
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ComebackRoomInfoPush.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.ComebackRoomInfoPush";
        };

        return ComebackRoomInfoPush;
    })();

    /**
     * USER_INFO_SUB_MSG_ID enum.
     * @name client_proto.USER_INFO_SUB_MSG_ID
     * @enum {number}
     * @property {number} UISMI_NULL=0 UISMI_NULL value
     * @property {number} UISMI_USER_ATTRI_CHANGE_PUSH=1 UISMI_USER_ATTRI_CHANGE_PUSH value
     * @property {number} UISMI_USER_DATA_CHANGE_PUSH=2 UISMI_USER_DATA_CHANGE_PUSH value
     * @property {number} UISMI_USER_BAG_REQ=3 UISMI_USER_BAG_REQ value
     * @property {number} UISMI_USER_BAG_RESP=4 UISMI_USER_BAG_RESP value
     */
    client_proto.USER_INFO_SUB_MSG_ID = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UISMI_NULL"] = 0;
        values[valuesById[1] = "UISMI_USER_ATTRI_CHANGE_PUSH"] = 1;
        values[valuesById[2] = "UISMI_USER_DATA_CHANGE_PUSH"] = 2;
        values[valuesById[3] = "UISMI_USER_BAG_REQ"] = 3;
        values[valuesById[4] = "UISMI_USER_BAG_RESP"] = 4;
        return values;
    })();

    client_proto.UserAttriChangePush = (function() {

        /**
         * Properties of a UserAttriChangePush.
         * @memberof client_proto
         * @interface IUserAttriChangePush
         * @property {Array.<client_proto.IUserAttriData>|null} [attriList] UserAttriChangePush attriList
         */

        /**
         * Constructs a new UserAttriChangePush.
         * @memberof client_proto
         * @classdesc Represents a UserAttriChangePush.
         * @implements IUserAttriChangePush
         * @constructor
         * @param {client_proto.IUserAttriChangePush=} [properties] Properties to set
         */
        function UserAttriChangePush(properties) {
            this.attriList = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UserAttriChangePush attriList.
         * @member {Array.<client_proto.IUserAttriData>} attriList
         * @memberof client_proto.UserAttriChangePush
         * @instance
         */
        UserAttriChangePush.prototype.attriList = $util.emptyArray;

        /**
         * Creates a new UserAttriChangePush instance using the specified properties.
         * @function create
         * @memberof client_proto.UserAttriChangePush
         * @static
         * @param {client_proto.IUserAttriChangePush=} [properties] Properties to set
         * @returns {client_proto.UserAttriChangePush} UserAttriChangePush instance
         */
        UserAttriChangePush.create = function create(properties) {
            return new UserAttriChangePush(properties);
        };

        /**
         * Encodes the specified UserAttriChangePush message. Does not implicitly {@link client_proto.UserAttriChangePush.verify|verify} messages.
         * @function encode
         * @memberof client_proto.UserAttriChangePush
         * @static
         * @param {client_proto.IUserAttriChangePush} message UserAttriChangePush message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserAttriChangePush.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.attriList != null && message.attriList.length)
                for (var i = 0; i < message.attriList.length; ++i)
                    $root.client_proto.UserAttriData.encode(message.attriList[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified UserAttriChangePush message, length delimited. Does not implicitly {@link client_proto.UserAttriChangePush.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.UserAttriChangePush
         * @static
         * @param {client_proto.IUserAttriChangePush} message UserAttriChangePush message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserAttriChangePush.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a UserAttriChangePush message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.UserAttriChangePush
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.UserAttriChangePush} UserAttriChangePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserAttriChangePush.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.UserAttriChangePush();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.attriList && message.attriList.length))
                            message.attriList = [];
                        message.attriList.push($root.client_proto.UserAttriData.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a UserAttriChangePush message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.UserAttriChangePush
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.UserAttriChangePush} UserAttriChangePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserAttriChangePush.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a UserAttriChangePush message.
         * @function verify
         * @memberof client_proto.UserAttriChangePush
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UserAttriChangePush.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.attriList != null && message.hasOwnProperty("attriList")) {
                if (!Array.isArray(message.attriList))
                    return "attriList: array expected";
                for (var i = 0; i < message.attriList.length; ++i) {
                    var error = $root.client_proto.UserAttriData.verify(message.attriList[i]);
                    if (error)
                        return "attriList." + error;
                }
            }
            return null;
        };

        /**
         * Creates a UserAttriChangePush message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.UserAttriChangePush
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.UserAttriChangePush} UserAttriChangePush
         */
        UserAttriChangePush.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.UserAttriChangePush)
                return object;
            var message = new $root.client_proto.UserAttriChangePush();
            if (object.attriList) {
                if (!Array.isArray(object.attriList))
                    throw TypeError(".client_proto.UserAttriChangePush.attriList: array expected");
                message.attriList = [];
                for (var i = 0; i < object.attriList.length; ++i) {
                    if (typeof object.attriList[i] !== "object")
                        throw TypeError(".client_proto.UserAttriChangePush.attriList: object expected");
                    message.attriList[i] = $root.client_proto.UserAttriData.fromObject(object.attriList[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a UserAttriChangePush message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.UserAttriChangePush
         * @static
         * @param {client_proto.UserAttriChangePush} message UserAttriChangePush
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UserAttriChangePush.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.attriList = [];
            if (message.attriList && message.attriList.length) {
                object.attriList = [];
                for (var j = 0; j < message.attriList.length; ++j)
                    object.attriList[j] = $root.client_proto.UserAttriData.toObject(message.attriList[j], options);
            }
            return object;
        };

        /**
         * Converts this UserAttriChangePush to JSON.
         * @function toJSON
         * @memberof client_proto.UserAttriChangePush
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UserAttriChangePush.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for UserAttriChangePush
         * @function getTypeUrl
         * @memberof client_proto.UserAttriChangePush
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        UserAttriChangePush.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.UserAttriChangePush";
        };

        return UserAttriChangePush;
    })();

    client_proto.UserADataChangePush = (function() {

        /**
         * Properties of a UserADataChangePush.
         * @memberof client_proto
         * @interface IUserADataChangePush
         * @property {number|null} [todo] UserADataChangePush todo
         */

        /**
         * Constructs a new UserADataChangePush.
         * @memberof client_proto
         * @classdesc Represents a UserADataChangePush.
         * @implements IUserADataChangePush
         * @constructor
         * @param {client_proto.IUserADataChangePush=} [properties] Properties to set
         */
        function UserADataChangePush(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UserADataChangePush todo.
         * @member {number} todo
         * @memberof client_proto.UserADataChangePush
         * @instance
         */
        UserADataChangePush.prototype.todo = 0;

        /**
         * Creates a new UserADataChangePush instance using the specified properties.
         * @function create
         * @memberof client_proto.UserADataChangePush
         * @static
         * @param {client_proto.IUserADataChangePush=} [properties] Properties to set
         * @returns {client_proto.UserADataChangePush} UserADataChangePush instance
         */
        UserADataChangePush.create = function create(properties) {
            return new UserADataChangePush(properties);
        };

        /**
         * Encodes the specified UserADataChangePush message. Does not implicitly {@link client_proto.UserADataChangePush.verify|verify} messages.
         * @function encode
         * @memberof client_proto.UserADataChangePush
         * @static
         * @param {client_proto.IUserADataChangePush} message UserADataChangePush message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserADataChangePush.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.todo != null && Object.hasOwnProperty.call(message, "todo"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.todo);
            return writer;
        };

        /**
         * Encodes the specified UserADataChangePush message, length delimited. Does not implicitly {@link client_proto.UserADataChangePush.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.UserADataChangePush
         * @static
         * @param {client_proto.IUserADataChangePush} message UserADataChangePush message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserADataChangePush.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a UserADataChangePush message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.UserADataChangePush
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.UserADataChangePush} UserADataChangePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserADataChangePush.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.UserADataChangePush();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.todo = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a UserADataChangePush message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.UserADataChangePush
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.UserADataChangePush} UserADataChangePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserADataChangePush.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a UserADataChangePush message.
         * @function verify
         * @memberof client_proto.UserADataChangePush
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UserADataChangePush.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.todo != null && message.hasOwnProperty("todo"))
                if (!$util.isInteger(message.todo))
                    return "todo: integer expected";
            return null;
        };

        /**
         * Creates a UserADataChangePush message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.UserADataChangePush
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.UserADataChangePush} UserADataChangePush
         */
        UserADataChangePush.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.UserADataChangePush)
                return object;
            var message = new $root.client_proto.UserADataChangePush();
            if (object.todo != null)
                message.todo = object.todo | 0;
            return message;
        };

        /**
         * Creates a plain object from a UserADataChangePush message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.UserADataChangePush
         * @static
         * @param {client_proto.UserADataChangePush} message UserADataChangePush
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UserADataChangePush.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.todo = 0;
            if (message.todo != null && message.hasOwnProperty("todo"))
                object.todo = message.todo;
            return object;
        };

        /**
         * Converts this UserADataChangePush to JSON.
         * @function toJSON
         * @memberof client_proto.UserADataChangePush
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UserADataChangePush.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for UserADataChangePush
         * @function getTypeUrl
         * @memberof client_proto.UserADataChangePush
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        UserADataChangePush.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.UserADataChangePush";
        };

        return UserADataChangePush;
    })();

    client_proto.UserBagDataReq = (function() {

        /**
         * Properties of a UserBagDataReq.
         * @memberof client_proto
         * @interface IUserBagDataReq
         * @property {number|null} [passthrough] UserBagDataReq passthrough
         */

        /**
         * Constructs a new UserBagDataReq.
         * @memberof client_proto
         * @classdesc Represents a UserBagDataReq.
         * @implements IUserBagDataReq
         * @constructor
         * @param {client_proto.IUserBagDataReq=} [properties] Properties to set
         */
        function UserBagDataReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UserBagDataReq passthrough.
         * @member {number} passthrough
         * @memberof client_proto.UserBagDataReq
         * @instance
         */
        UserBagDataReq.prototype.passthrough = 0;

        /**
         * Creates a new UserBagDataReq instance using the specified properties.
         * @function create
         * @memberof client_proto.UserBagDataReq
         * @static
         * @param {client_proto.IUserBagDataReq=} [properties] Properties to set
         * @returns {client_proto.UserBagDataReq} UserBagDataReq instance
         */
        UserBagDataReq.create = function create(properties) {
            return new UserBagDataReq(properties);
        };

        /**
         * Encodes the specified UserBagDataReq message. Does not implicitly {@link client_proto.UserBagDataReq.verify|verify} messages.
         * @function encode
         * @memberof client_proto.UserBagDataReq
         * @static
         * @param {client_proto.IUserBagDataReq} message UserBagDataReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserBagDataReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.passthrough != null && Object.hasOwnProperty.call(message, "passthrough"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.passthrough);
            return writer;
        };

        /**
         * Encodes the specified UserBagDataReq message, length delimited. Does not implicitly {@link client_proto.UserBagDataReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.UserBagDataReq
         * @static
         * @param {client_proto.IUserBagDataReq} message UserBagDataReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserBagDataReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a UserBagDataReq message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.UserBagDataReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.UserBagDataReq} UserBagDataReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserBagDataReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.UserBagDataReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.passthrough = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a UserBagDataReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.UserBagDataReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.UserBagDataReq} UserBagDataReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserBagDataReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a UserBagDataReq message.
         * @function verify
         * @memberof client_proto.UserBagDataReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UserBagDataReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.passthrough != null && message.hasOwnProperty("passthrough"))
                if (!$util.isInteger(message.passthrough))
                    return "passthrough: integer expected";
            return null;
        };

        /**
         * Creates a UserBagDataReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.UserBagDataReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.UserBagDataReq} UserBagDataReq
         */
        UserBagDataReq.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.UserBagDataReq)
                return object;
            var message = new $root.client_proto.UserBagDataReq();
            if (object.passthrough != null)
                message.passthrough = object.passthrough | 0;
            return message;
        };

        /**
         * Creates a plain object from a UserBagDataReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.UserBagDataReq
         * @static
         * @param {client_proto.UserBagDataReq} message UserBagDataReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UserBagDataReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.passthrough = 0;
            if (message.passthrough != null && message.hasOwnProperty("passthrough"))
                object.passthrough = message.passthrough;
            return object;
        };

        /**
         * Converts this UserBagDataReq to JSON.
         * @function toJSON
         * @memberof client_proto.UserBagDataReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UserBagDataReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for UserBagDataReq
         * @function getTypeUrl
         * @memberof client_proto.UserBagDataReq
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        UserBagDataReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.UserBagDataReq";
        };

        return UserBagDataReq;
    })();

    client_proto.OneBagItemData = (function() {

        /**
         * Properties of an OneBagItemData.
         * @memberof client_proto
         * @interface IOneBagItemData
         * @property {number|null} [itemId] OneBagItemData itemId
         * @property {number|Long|null} [itemExpi] OneBagItemData itemExpi
         * @property {number|Long|null} [itemNum] OneBagItemData itemNum
         */

        /**
         * Constructs a new OneBagItemData.
         * @memberof client_proto
         * @classdesc Represents an OneBagItemData.
         * @implements IOneBagItemData
         * @constructor
         * @param {client_proto.IOneBagItemData=} [properties] Properties to set
         */
        function OneBagItemData(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * OneBagItemData itemId.
         * @member {number} itemId
         * @memberof client_proto.OneBagItemData
         * @instance
         */
        OneBagItemData.prototype.itemId = 0;

        /**
         * OneBagItemData itemExpi.
         * @member {number|Long} itemExpi
         * @memberof client_proto.OneBagItemData
         * @instance
         */
        OneBagItemData.prototype.itemExpi = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * OneBagItemData itemNum.
         * @member {number|Long} itemNum
         * @memberof client_proto.OneBagItemData
         * @instance
         */
        OneBagItemData.prototype.itemNum = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new OneBagItemData instance using the specified properties.
         * @function create
         * @memberof client_proto.OneBagItemData
         * @static
         * @param {client_proto.IOneBagItemData=} [properties] Properties to set
         * @returns {client_proto.OneBagItemData} OneBagItemData instance
         */
        OneBagItemData.create = function create(properties) {
            return new OneBagItemData(properties);
        };

        /**
         * Encodes the specified OneBagItemData message. Does not implicitly {@link client_proto.OneBagItemData.verify|verify} messages.
         * @function encode
         * @memberof client_proto.OneBagItemData
         * @static
         * @param {client_proto.IOneBagItemData} message OneBagItemData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OneBagItemData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.itemId);
            if (message.itemExpi != null && Object.hasOwnProperty.call(message, "itemExpi"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.itemExpi);
            if (message.itemNum != null && Object.hasOwnProperty.call(message, "itemNum"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.itemNum);
            return writer;
        };

        /**
         * Encodes the specified OneBagItemData message, length delimited. Does not implicitly {@link client_proto.OneBagItemData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.OneBagItemData
         * @static
         * @param {client_proto.IOneBagItemData} message OneBagItemData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OneBagItemData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an OneBagItemData message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.OneBagItemData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.OneBagItemData} OneBagItemData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OneBagItemData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.OneBagItemData();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.itemId = reader.int32();
                        break;
                    }
                case 2: {
                        message.itemExpi = reader.int64();
                        break;
                    }
                case 3: {
                        message.itemNum = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an OneBagItemData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.OneBagItemData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.OneBagItemData} OneBagItemData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OneBagItemData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an OneBagItemData message.
         * @function verify
         * @memberof client_proto.OneBagItemData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        OneBagItemData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.itemId != null && message.hasOwnProperty("itemId"))
                if (!$util.isInteger(message.itemId))
                    return "itemId: integer expected";
            if (message.itemExpi != null && message.hasOwnProperty("itemExpi"))
                if (!$util.isInteger(message.itemExpi) && !(message.itemExpi && $util.isInteger(message.itemExpi.low) && $util.isInteger(message.itemExpi.high)))
                    return "itemExpi: integer|Long expected";
            if (message.itemNum != null && message.hasOwnProperty("itemNum"))
                if (!$util.isInteger(message.itemNum) && !(message.itemNum && $util.isInteger(message.itemNum.low) && $util.isInteger(message.itemNum.high)))
                    return "itemNum: integer|Long expected";
            return null;
        };

        /**
         * Creates an OneBagItemData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.OneBagItemData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.OneBagItemData} OneBagItemData
         */
        OneBagItemData.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.OneBagItemData)
                return object;
            var message = new $root.client_proto.OneBagItemData();
            if (object.itemId != null)
                message.itemId = object.itemId | 0;
            if (object.itemExpi != null)
                if ($util.Long)
                    (message.itemExpi = $util.Long.fromValue(object.itemExpi)).unsigned = false;
                else if (typeof object.itemExpi === "string")
                    message.itemExpi = parseInt(object.itemExpi, 10);
                else if (typeof object.itemExpi === "number")
                    message.itemExpi = object.itemExpi;
                else if (typeof object.itemExpi === "object")
                    message.itemExpi = new $util.LongBits(object.itemExpi.low >>> 0, object.itemExpi.high >>> 0).toNumber();
            if (object.itemNum != null)
                if ($util.Long)
                    (message.itemNum = $util.Long.fromValue(object.itemNum)).unsigned = false;
                else if (typeof object.itemNum === "string")
                    message.itemNum = parseInt(object.itemNum, 10);
                else if (typeof object.itemNum === "number")
                    message.itemNum = object.itemNum;
                else if (typeof object.itemNum === "object")
                    message.itemNum = new $util.LongBits(object.itemNum.low >>> 0, object.itemNum.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from an OneBagItemData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.OneBagItemData
         * @static
         * @param {client_proto.OneBagItemData} message OneBagItemData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        OneBagItemData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.itemId = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.itemExpi = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.itemExpi = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.itemNum = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.itemNum = options.longs === String ? "0" : 0;
            }
            if (message.itemId != null && message.hasOwnProperty("itemId"))
                object.itemId = message.itemId;
            if (message.itemExpi != null && message.hasOwnProperty("itemExpi"))
                if (typeof message.itemExpi === "number")
                    object.itemExpi = options.longs === String ? String(message.itemExpi) : message.itemExpi;
                else
                    object.itemExpi = options.longs === String ? $util.Long.prototype.toString.call(message.itemExpi) : options.longs === Number ? new $util.LongBits(message.itemExpi.low >>> 0, message.itemExpi.high >>> 0).toNumber() : message.itemExpi;
            if (message.itemNum != null && message.hasOwnProperty("itemNum"))
                if (typeof message.itemNum === "number")
                    object.itemNum = options.longs === String ? String(message.itemNum) : message.itemNum;
                else
                    object.itemNum = options.longs === String ? $util.Long.prototype.toString.call(message.itemNum) : options.longs === Number ? new $util.LongBits(message.itemNum.low >>> 0, message.itemNum.high >>> 0).toNumber() : message.itemNum;
            return object;
        };

        /**
         * Converts this OneBagItemData to JSON.
         * @function toJSON
         * @memberof client_proto.OneBagItemData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OneBagItemData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for OneBagItemData
         * @function getTypeUrl
         * @memberof client_proto.OneBagItemData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        OneBagItemData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.OneBagItemData";
        };

        return OneBagItemData;
    })();

    client_proto.UserBagDataResp = (function() {

        /**
         * Properties of a UserBagDataResp.
         * @memberof client_proto
         * @interface IUserBagDataResp
         * @property {number|null} [src] UserBagDataResp src
         * @property {number|null} [passthrough] UserBagDataResp passthrough
         * @property {number|null} [type] UserBagDataResp type
         * @property {Array.<client_proto.IOneBagItemData>|null} [litemList] UserBagDataResp litemList
         */

        /**
         * Constructs a new UserBagDataResp.
         * @memberof client_proto
         * @classdesc Represents a UserBagDataResp.
         * @implements IUserBagDataResp
         * @constructor
         * @param {client_proto.IUserBagDataResp=} [properties] Properties to set
         */
        function UserBagDataResp(properties) {
            this.litemList = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UserBagDataResp src.
         * @member {number} src
         * @memberof client_proto.UserBagDataResp
         * @instance
         */
        UserBagDataResp.prototype.src = 0;

        /**
         * UserBagDataResp passthrough.
         * @member {number} passthrough
         * @memberof client_proto.UserBagDataResp
         * @instance
         */
        UserBagDataResp.prototype.passthrough = 0;

        /**
         * UserBagDataResp type.
         * @member {number} type
         * @memberof client_proto.UserBagDataResp
         * @instance
         */
        UserBagDataResp.prototype.type = 0;

        /**
         * UserBagDataResp litemList.
         * @member {Array.<client_proto.IOneBagItemData>} litemList
         * @memberof client_proto.UserBagDataResp
         * @instance
         */
        UserBagDataResp.prototype.litemList = $util.emptyArray;

        /**
         * Creates a new UserBagDataResp instance using the specified properties.
         * @function create
         * @memberof client_proto.UserBagDataResp
         * @static
         * @param {client_proto.IUserBagDataResp=} [properties] Properties to set
         * @returns {client_proto.UserBagDataResp} UserBagDataResp instance
         */
        UserBagDataResp.create = function create(properties) {
            return new UserBagDataResp(properties);
        };

        /**
         * Encodes the specified UserBagDataResp message. Does not implicitly {@link client_proto.UserBagDataResp.verify|verify} messages.
         * @function encode
         * @memberof client_proto.UserBagDataResp
         * @static
         * @param {client_proto.IUserBagDataResp} message UserBagDataResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserBagDataResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.src != null && Object.hasOwnProperty.call(message, "src"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.src);
            if (message.passthrough != null && Object.hasOwnProperty.call(message, "passthrough"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.passthrough);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.type);
            if (message.litemList != null && message.litemList.length)
                for (var i = 0; i < message.litemList.length; ++i)
                    $root.client_proto.OneBagItemData.encode(message.litemList[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified UserBagDataResp message, length delimited. Does not implicitly {@link client_proto.UserBagDataResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto.UserBagDataResp
         * @static
         * @param {client_proto.IUserBagDataResp} message UserBagDataResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserBagDataResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a UserBagDataResp message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto.UserBagDataResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto.UserBagDataResp} UserBagDataResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserBagDataResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto.UserBagDataResp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.src = reader.int32();
                        break;
                    }
                case 2: {
                        message.passthrough = reader.int32();
                        break;
                    }
                case 3: {
                        message.type = reader.int32();
                        break;
                    }
                case 4: {
                        if (!(message.litemList && message.litemList.length))
                            message.litemList = [];
                        message.litemList.push($root.client_proto.OneBagItemData.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a UserBagDataResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto.UserBagDataResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto.UserBagDataResp} UserBagDataResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserBagDataResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a UserBagDataResp message.
         * @function verify
         * @memberof client_proto.UserBagDataResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UserBagDataResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.src != null && message.hasOwnProperty("src"))
                if (!$util.isInteger(message.src))
                    return "src: integer expected";
            if (message.passthrough != null && message.hasOwnProperty("passthrough"))
                if (!$util.isInteger(message.passthrough))
                    return "passthrough: integer expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isInteger(message.type))
                    return "type: integer expected";
            if (message.litemList != null && message.hasOwnProperty("litemList")) {
                if (!Array.isArray(message.litemList))
                    return "litemList: array expected";
                for (var i = 0; i < message.litemList.length; ++i) {
                    var error = $root.client_proto.OneBagItemData.verify(message.litemList[i]);
                    if (error)
                        return "litemList." + error;
                }
            }
            return null;
        };

        /**
         * Creates a UserBagDataResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto.UserBagDataResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto.UserBagDataResp} UserBagDataResp
         */
        UserBagDataResp.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto.UserBagDataResp)
                return object;
            var message = new $root.client_proto.UserBagDataResp();
            if (object.src != null)
                message.src = object.src | 0;
            if (object.passthrough != null)
                message.passthrough = object.passthrough | 0;
            if (object.type != null)
                message.type = object.type | 0;
            if (object.litemList) {
                if (!Array.isArray(object.litemList))
                    throw TypeError(".client_proto.UserBagDataResp.litemList: array expected");
                message.litemList = [];
                for (var i = 0; i < object.litemList.length; ++i) {
                    if (typeof object.litemList[i] !== "object")
                        throw TypeError(".client_proto.UserBagDataResp.litemList: object expected");
                    message.litemList[i] = $root.client_proto.OneBagItemData.fromObject(object.litemList[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a UserBagDataResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto.UserBagDataResp
         * @static
         * @param {client_proto.UserBagDataResp} message UserBagDataResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UserBagDataResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.litemList = [];
            if (options.defaults) {
                object.src = 0;
                object.passthrough = 0;
                object.type = 0;
            }
            if (message.src != null && message.hasOwnProperty("src"))
                object.src = message.src;
            if (message.passthrough != null && message.hasOwnProperty("passthrough"))
                object.passthrough = message.passthrough;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.litemList && message.litemList.length) {
                object.litemList = [];
                for (var j = 0; j < message.litemList.length; ++j)
                    object.litemList[j] = $root.client_proto.OneBagItemData.toObject(message.litemList[j], options);
            }
            return object;
        };

        /**
         * Converts this UserBagDataResp to JSON.
         * @function toJSON
         * @memberof client_proto.UserBagDataResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UserBagDataResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for UserBagDataResp
         * @function getTypeUrl
         * @memberof client_proto.UserBagDataResp
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        UserBagDataResp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto.UserBagDataResp";
        };

        return UserBagDataResp;
    })();

    return client_proto;
})();

;

declare namespace proto {
// DO NOT EDIT! This is a generated file. Edit the JSDoc in src/*.js instead and run 'npm run build:types'.

/** Namespace client_proto. */
export namespace client_proto {

    /** LOGIN_SUB_MSG_ID enum. */
    enum LOGIN_SUB_MSG_ID {
        LSMI_LOGIN_NULL = 0,
        LSMI_LOGIN_REQ = 1,
        LSMI_LOGIN_RESP = 2,
        LSMI_LOGIN_ATTR_NTF = 3,
        LSMI_LOGIN_OFFSITE_PUSH = 4
    }

    /** LOGIN_TYPE_DEF enum. */
    enum LOGIN_TYPE_DEF {
        LTD_NULL = 0,
        LTD_TOKEN = 1,
        LTD_PASSWORD = 2,
        LTD_CODE = 3
    }

    /** Properties of a LoginReq. */
    interface ILoginReq {

        /** LoginReq loginType */
        loginType?: (number|null);

        /** LoginReq loginToken */
        loginToken?: (string|null);

        /** LoginReq loginAccount */
        loginAccount?: (string|null);

        /** LoginReq loginPassword */
        loginPassword?: (string|null);

        /** LoginReq version */
        version?: (string|null);

        /** LoginReq gameVersion */
        gameVersion?: (string|null);

        /** LoginReq channel */
        channel?: (string|null);

        /** LoginReq packageName */
        packageName?: (string|null);

        /** LoginReq deviceId */
        deviceId?: (string|null);

        /** LoginReq versionInt */
        versionInt?: (number|null);
    }

    /** Represents a LoginReq. */
    class LoginReq implements ILoginReq {

        /**
         * Constructs a new LoginReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.ILoginReq);

        /** LoginReq loginType. */
        public loginType: number;

        /** LoginReq loginToken. */
        public loginToken: string;

        /** LoginReq loginAccount. */
        public loginAccount: string;

        /** LoginReq loginPassword. */
        public loginPassword: string;

        /** LoginReq version. */
        public version: string;

        /** LoginReq gameVersion. */
        public gameVersion: string;

        /** LoginReq channel. */
        public channel: string;

        /** LoginReq packageName. */
        public packageName: string;

        /** LoginReq deviceId. */
        public deviceId: string;

        /** LoginReq versionInt. */
        public versionInt: number;

        /**
         * Creates a new LoginReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginReq instance
         */
        public static create(properties?: client_proto.ILoginReq): client_proto.LoginReq;

        /**
         * Encodes the specified LoginReq message. Does not implicitly {@link client_proto.LoginReq.verify|verify} messages.
         * @param message LoginReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.ILoginReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoginReq message, length delimited. Does not implicitly {@link client_proto.LoginReq.verify|verify} messages.
         * @param message LoginReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.ILoginReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoginReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.LoginReq;

        /**
         * Decodes a LoginReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoginReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.LoginReq;

        /**
         * Verifies a LoginReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoginReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoginReq
         */
        public static fromObject(object: { [k: string]: any }): client_proto.LoginReq;

        /**
         * Creates a plain object from a LoginReq message. Also converts values to other types if specified.
         * @param message LoginReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.LoginReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoginReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LoginReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LoginResp. */
    interface ILoginResp {

        /** LoginResp result */
        result?: (number|null);

        /** LoginResp userId */
        userId?: (number|Long|null);
    }

    /** Represents a LoginResp. */
    class LoginResp implements ILoginResp {

        /**
         * Constructs a new LoginResp.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.ILoginResp);

        /** LoginResp result. */
        public result: number;

        /** LoginResp userId. */
        public userId: (number|Long);

        /**
         * Creates a new LoginResp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginResp instance
         */
        public static create(properties?: client_proto.ILoginResp): client_proto.LoginResp;

        /**
         * Encodes the specified LoginResp message. Does not implicitly {@link client_proto.LoginResp.verify|verify} messages.
         * @param message LoginResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.ILoginResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoginResp message, length delimited. Does not implicitly {@link client_proto.LoginResp.verify|verify} messages.
         * @param message LoginResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.ILoginResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoginResp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.LoginResp;

        /**
         * Decodes a LoginResp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoginResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.LoginResp;

        /**
         * Verifies a LoginResp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoginResp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoginResp
         */
        public static fromObject(object: { [k: string]: any }): client_proto.LoginResp;

        /**
         * Creates a plain object from a LoginResp message. Also converts values to other types if specified.
         * @param message LoginResp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.LoginResp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoginResp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LoginResp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LoginAttrNtf. */
    interface ILoginAttrNtf {

        /** LoginAttrNtf userId */
        userId?: (number|Long|null);

        /** LoginAttrNtf nickname */
        nickname?: (string|null);

        /** LoginAttrNtf sex */
        sex?: (string|null);

        /** LoginAttrNtf imgType */
        imgType?: (number|null);

        /** LoginAttrNtf imgId */
        imgId?: (number|null);

        /** LoginAttrNtf imgUrl */
        imgUrl?: (string|null);

        /** LoginAttrNtf channel */
        channel?: (string|null);

        /** LoginAttrNtf phone */
        phone?: (string|null);

        /** LoginAttrNtf diamond */
        diamond?: (number|Long|null);

        /** LoginAttrNtf goldbean */
        goldbean?: (number|Long|null);
    }

    /** Represents a LoginAttrNtf. */
    class LoginAttrNtf implements ILoginAttrNtf {

        /**
         * Constructs a new LoginAttrNtf.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.ILoginAttrNtf);

        /** LoginAttrNtf userId. */
        public userId: (number|Long);

        /** LoginAttrNtf nickname. */
        public nickname: string;

        /** LoginAttrNtf sex. */
        public sex: string;

        /** LoginAttrNtf imgType. */
        public imgType: number;

        /** LoginAttrNtf imgId. */
        public imgId: number;

        /** LoginAttrNtf imgUrl. */
        public imgUrl: string;

        /** LoginAttrNtf channel. */
        public channel: string;

        /** LoginAttrNtf phone. */
        public phone: string;

        /** LoginAttrNtf diamond. */
        public diamond: (number|Long);

        /** LoginAttrNtf goldbean. */
        public goldbean: (number|Long);

        /**
         * Creates a new LoginAttrNtf instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginAttrNtf instance
         */
        public static create(properties?: client_proto.ILoginAttrNtf): client_proto.LoginAttrNtf;

        /**
         * Encodes the specified LoginAttrNtf message. Does not implicitly {@link client_proto.LoginAttrNtf.verify|verify} messages.
         * @param message LoginAttrNtf message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.ILoginAttrNtf, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoginAttrNtf message, length delimited. Does not implicitly {@link client_proto.LoginAttrNtf.verify|verify} messages.
         * @param message LoginAttrNtf message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.ILoginAttrNtf, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoginAttrNtf message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginAttrNtf
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.LoginAttrNtf;

        /**
         * Decodes a LoginAttrNtf message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoginAttrNtf
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.LoginAttrNtf;

        /**
         * Verifies a LoginAttrNtf message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoginAttrNtf message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoginAttrNtf
         */
        public static fromObject(object: { [k: string]: any }): client_proto.LoginAttrNtf;

        /**
         * Creates a plain object from a LoginAttrNtf message. Also converts values to other types if specified.
         * @param message LoginAttrNtf
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.LoginAttrNtf, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoginAttrNtf to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LoginAttrNtf
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LoginOffsitePush. */
    interface ILoginOffsitePush {

        /** LoginOffsitePush loginIp */
        loginIp?: (string|null);

        /** LoginOffsitePush loginTime */
        loginTime?: (number|Long|null);
    }

    /** Represents a LoginOffsitePush. */
    class LoginOffsitePush implements ILoginOffsitePush {

        /**
         * Constructs a new LoginOffsitePush.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.ILoginOffsitePush);

        /** LoginOffsitePush loginIp. */
        public loginIp: string;

        /** LoginOffsitePush loginTime. */
        public loginTime: (number|Long);

        /**
         * Creates a new LoginOffsitePush instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginOffsitePush instance
         */
        public static create(properties?: client_proto.ILoginOffsitePush): client_proto.LoginOffsitePush;

        /**
         * Encodes the specified LoginOffsitePush message. Does not implicitly {@link client_proto.LoginOffsitePush.verify|verify} messages.
         * @param message LoginOffsitePush message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.ILoginOffsitePush, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoginOffsitePush message, length delimited. Does not implicitly {@link client_proto.LoginOffsitePush.verify|verify} messages.
         * @param message LoginOffsitePush message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.ILoginOffsitePush, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoginOffsitePush message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginOffsitePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.LoginOffsitePush;

        /**
         * Decodes a LoginOffsitePush message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoginOffsitePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.LoginOffsitePush;

        /**
         * Verifies a LoginOffsitePush message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoginOffsitePush message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoginOffsitePush
         */
        public static fromObject(object: { [k: string]: any }): client_proto.LoginOffsitePush;

        /**
         * Creates a plain object from a LoginOffsitePush message. Also converts values to other types if specified.
         * @param message LoginOffsitePush
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.LoginOffsitePush, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoginOffsitePush to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LoginOffsitePush
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** HEARTBEAT_SUB_MSG_ID enum. */
    enum HEARTBEAT_SUB_MSG_ID {
        HSMI_HEARTBEAT_NULL = 0,
        HSMI_HEARTBEAT_REQ = 1,
        HSMI_HEARTBEAT_RESP = 2
    }

    /** Properties of a HeartbeatReq. */
    interface IHeartbeatReq {

        /** HeartbeatReq timestamp */
        timestamp?: (number|Long|null);
    }

    /** Represents a HeartbeatReq. */
    class HeartbeatReq implements IHeartbeatReq {

        /**
         * Constructs a new HeartbeatReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IHeartbeatReq);

        /** HeartbeatReq timestamp. */
        public timestamp: (number|Long);

        /**
         * Creates a new HeartbeatReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HeartbeatReq instance
         */
        public static create(properties?: client_proto.IHeartbeatReq): client_proto.HeartbeatReq;

        /**
         * Encodes the specified HeartbeatReq message. Does not implicitly {@link client_proto.HeartbeatReq.verify|verify} messages.
         * @param message HeartbeatReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IHeartbeatReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HeartbeatReq message, length delimited. Does not implicitly {@link client_proto.HeartbeatReq.verify|verify} messages.
         * @param message HeartbeatReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IHeartbeatReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HeartbeatReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HeartbeatReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.HeartbeatReq;

        /**
         * Decodes a HeartbeatReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HeartbeatReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.HeartbeatReq;

        /**
         * Verifies a HeartbeatReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HeartbeatReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HeartbeatReq
         */
        public static fromObject(object: { [k: string]: any }): client_proto.HeartbeatReq;

        /**
         * Creates a plain object from a HeartbeatReq message. Also converts values to other types if specified.
         * @param message HeartbeatReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.HeartbeatReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HeartbeatReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for HeartbeatReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a HeartbeatResp. */
    interface IHeartbeatResp {

        /** HeartbeatResp timestamp */
        timestamp?: (number|Long|null);

        /** HeartbeatResp svrTimestamp */
        svrTimestamp?: (number|Long|null);
    }

    /** Represents a HeartbeatResp. */
    class HeartbeatResp implements IHeartbeatResp {

        /**
         * Constructs a new HeartbeatResp.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IHeartbeatResp);

        /** HeartbeatResp timestamp. */
        public timestamp: (number|Long);

        /** HeartbeatResp svrTimestamp. */
        public svrTimestamp: (number|Long);

        /**
         * Creates a new HeartbeatResp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HeartbeatResp instance
         */
        public static create(properties?: client_proto.IHeartbeatResp): client_proto.HeartbeatResp;

        /**
         * Encodes the specified HeartbeatResp message. Does not implicitly {@link client_proto.HeartbeatResp.verify|verify} messages.
         * @param message HeartbeatResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IHeartbeatResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HeartbeatResp message, length delimited. Does not implicitly {@link client_proto.HeartbeatResp.verify|verify} messages.
         * @param message HeartbeatResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IHeartbeatResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HeartbeatResp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HeartbeatResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.HeartbeatResp;

        /**
         * Decodes a HeartbeatResp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HeartbeatResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.HeartbeatResp;

        /**
         * Verifies a HeartbeatResp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HeartbeatResp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HeartbeatResp
         */
        public static fromObject(object: { [k: string]: any }): client_proto.HeartbeatResp;

        /**
         * Creates a plain object from a HeartbeatResp message. Also converts values to other types if specified.
         * @param message HeartbeatResp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.HeartbeatResp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HeartbeatResp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for HeartbeatResp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** GAME_COMMON_SUB_ID enum. */
    enum GAME_COMMON_SUB_ID {
        GCSI_NULL = 0,
        GCSI_GAME_SCENE_PUSH = 1,
        GCSI_USER_ATTRI_CHANGE_PUSH = 2
    }

    /** Properties of a CommonGamePlayerInfo. */
    interface ICommonGamePlayerInfo {

        /** CommonGamePlayerInfo chairId */
        chairId?: (number|null);

        /** CommonGamePlayerInfo userId */
        userId?: (number|Long|null);

        /** CommonGamePlayerInfo nickname */
        nickname?: (string|null);

        /** CommonGamePlayerInfo faceType */
        faceType?: (number|null);

        /** CommonGamePlayerInfo faceId */
        faceId?: (number|null);

        /** CommonGamePlayerInfo faceUrl */
        faceUrl?: (string|null);

        /** CommonGamePlayerInfo sex */
        sex?: (number|null);

        /** CommonGamePlayerInfo goldNum */
        goldNum?: (number|Long|null);

        /** CommonGamePlayerInfo diamondNum */
        diamondNum?: (number|Long|null);
    }

    /** Represents a CommonGamePlayerInfo. */
    class CommonGamePlayerInfo implements ICommonGamePlayerInfo {

        /**
         * Constructs a new CommonGamePlayerInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.ICommonGamePlayerInfo);

        /** CommonGamePlayerInfo chairId. */
        public chairId: number;

        /** CommonGamePlayerInfo userId. */
        public userId: (number|Long);

        /** CommonGamePlayerInfo nickname. */
        public nickname: string;

        /** CommonGamePlayerInfo faceType. */
        public faceType: number;

        /** CommonGamePlayerInfo faceId. */
        public faceId: number;

        /** CommonGamePlayerInfo faceUrl. */
        public faceUrl: string;

        /** CommonGamePlayerInfo sex. */
        public sex: number;

        /** CommonGamePlayerInfo goldNum. */
        public goldNum: (number|Long);

        /** CommonGamePlayerInfo diamondNum. */
        public diamondNum: (number|Long);

        /**
         * Creates a new CommonGamePlayerInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CommonGamePlayerInfo instance
         */
        public static create(properties?: client_proto.ICommonGamePlayerInfo): client_proto.CommonGamePlayerInfo;

        /**
         * Encodes the specified CommonGamePlayerInfo message. Does not implicitly {@link client_proto.CommonGamePlayerInfo.verify|verify} messages.
         * @param message CommonGamePlayerInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.ICommonGamePlayerInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CommonGamePlayerInfo message, length delimited. Does not implicitly {@link client_proto.CommonGamePlayerInfo.verify|verify} messages.
         * @param message CommonGamePlayerInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.ICommonGamePlayerInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CommonGamePlayerInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CommonGamePlayerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.CommonGamePlayerInfo;

        /**
         * Decodes a CommonGamePlayerInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CommonGamePlayerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.CommonGamePlayerInfo;

        /**
         * Verifies a CommonGamePlayerInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CommonGamePlayerInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CommonGamePlayerInfo
         */
        public static fromObject(object: { [k: string]: any }): client_proto.CommonGamePlayerInfo;

        /**
         * Creates a plain object from a CommonGamePlayerInfo message. Also converts values to other types if specified.
         * @param message CommonGamePlayerInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.CommonGamePlayerInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CommonGamePlayerInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CommonGamePlayerInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CommonGameScenePush. */
    interface ICommonGameScenePush {

        /** CommonGameScenePush roomId */
        roomId?: (number|null);

        /** CommonGameScenePush tableId */
        tableId?: (number|null);

        /** CommonGameScenePush gameId */
        gameId?: (string|null);

        /** CommonGameScenePush roomName */
        roomName?: (string|null);

        /** CommonGameScenePush roomBase */
        roomBase?: (number|null);

        /** CommonGameScenePush useList */
        useList?: (client_proto.ICommonGamePlayerInfo[]|null);
    }

    /** Represents a CommonGameScenePush. */
    class CommonGameScenePush implements ICommonGameScenePush {

        /**
         * Constructs a new CommonGameScenePush.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.ICommonGameScenePush);

        /** CommonGameScenePush roomId. */
        public roomId: number;

        /** CommonGameScenePush tableId. */
        public tableId: number;

        /** CommonGameScenePush gameId. */
        public gameId: string;

        /** CommonGameScenePush roomName. */
        public roomName: string;

        /** CommonGameScenePush roomBase. */
        public roomBase: number;

        /** CommonGameScenePush useList. */
        public useList: client_proto.ICommonGamePlayerInfo[];

        /**
         * Creates a new CommonGameScenePush instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CommonGameScenePush instance
         */
        public static create(properties?: client_proto.ICommonGameScenePush): client_proto.CommonGameScenePush;

        /**
         * Encodes the specified CommonGameScenePush message. Does not implicitly {@link client_proto.CommonGameScenePush.verify|verify} messages.
         * @param message CommonGameScenePush message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.ICommonGameScenePush, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CommonGameScenePush message, length delimited. Does not implicitly {@link client_proto.CommonGameScenePush.verify|verify} messages.
         * @param message CommonGameScenePush message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.ICommonGameScenePush, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CommonGameScenePush message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CommonGameScenePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.CommonGameScenePush;

        /**
         * Decodes a CommonGameScenePush message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CommonGameScenePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.CommonGameScenePush;

        /**
         * Verifies a CommonGameScenePush message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CommonGameScenePush message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CommonGameScenePush
         */
        public static fromObject(object: { [k: string]: any }): client_proto.CommonGameScenePush;

        /**
         * Creates a plain object from a CommonGameScenePush message. Also converts values to other types if specified.
         * @param message CommonGameScenePush
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.CommonGameScenePush, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CommonGameScenePush to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CommonGameScenePush
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GameUserAttriChangePush. */
    interface IGameUserAttriChangePush {

        /** GameUserAttriChangePush chairId */
        chairId?: (number|null);

        /** GameUserAttriChangePush attriList */
        attriList?: (client_proto.IUserAttriData[]|null);
    }

    /** Represents a GameUserAttriChangePush. */
    class GameUserAttriChangePush implements IGameUserAttriChangePush {

        /**
         * Constructs a new GameUserAttriChangePush.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IGameUserAttriChangePush);

        /** GameUserAttriChangePush chairId. */
        public chairId: number;

        /** GameUserAttriChangePush attriList. */
        public attriList: client_proto.IUserAttriData[];

        /**
         * Creates a new GameUserAttriChangePush instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameUserAttriChangePush instance
         */
        public static create(properties?: client_proto.IGameUserAttriChangePush): client_proto.GameUserAttriChangePush;

        /**
         * Encodes the specified GameUserAttriChangePush message. Does not implicitly {@link client_proto.GameUserAttriChangePush.verify|verify} messages.
         * @param message GameUserAttriChangePush message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IGameUserAttriChangePush, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameUserAttriChangePush message, length delimited. Does not implicitly {@link client_proto.GameUserAttriChangePush.verify|verify} messages.
         * @param message GameUserAttriChangePush message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IGameUserAttriChangePush, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameUserAttriChangePush message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameUserAttriChangePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.GameUserAttriChangePush;

        /**
         * Decodes a GameUserAttriChangePush message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameUserAttriChangePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.GameUserAttriChangePush;

        /**
         * Verifies a GameUserAttriChangePush message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GameUserAttriChangePush message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameUserAttriChangePush
         */
        public static fromObject(object: { [k: string]: any }): client_proto.GameUserAttriChangePush;

        /**
         * Creates a plain object from a GameUserAttriChangePush message. Also converts values to other types if specified.
         * @param message GameUserAttriChangePush
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.GameUserAttriChangePush, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameUserAttriChangePush to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GameUserAttriChangePush
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** USER_ATTRI_TYPE enum. */
    enum USER_ATTRI_TYPE {
        UAT_NULL = 0,
        UAT_GOLD = 1,
        UAT_DIAMOND = 2,
        UAT_VIP_LEVEL = 3,
        UAT_VIP_EXP = 4,
        UAT_SEX = 5,
        UAT_NICKNAME = 6,
        UAT_UID = 7,
        UAT_FACE_TYPE = 8,
        UAT_FACE_ID = 9,
        UAT_FACE_URL = 10,
        UAT_GAME_LEVEL = 11
    }

    /** Properties of a UserAttriData. */
    interface IUserAttriData {

        /** UserAttriData key */
        key?: (number|null);

        /** UserAttriData valueType */
        valueType?: (number|null);

        /** UserAttriData value */
        value?: (string|null);
    }

    /** Represents a UserAttriData. */
    class UserAttriData implements IUserAttriData {

        /**
         * Constructs a new UserAttriData.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IUserAttriData);

        /** UserAttriData key. */
        public key: number;

        /** UserAttriData valueType. */
        public valueType: number;

        /** UserAttriData value. */
        public value: string;

        /**
         * Creates a new UserAttriData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserAttriData instance
         */
        public static create(properties?: client_proto.IUserAttriData): client_proto.UserAttriData;

        /**
         * Encodes the specified UserAttriData message. Does not implicitly {@link client_proto.UserAttriData.verify|verify} messages.
         * @param message UserAttriData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IUserAttriData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserAttriData message, length delimited. Does not implicitly {@link client_proto.UserAttriData.verify|verify} messages.
         * @param message UserAttriData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IUserAttriData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserAttriData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserAttriData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.UserAttriData;

        /**
         * Decodes a UserAttriData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserAttriData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.UserAttriData;

        /**
         * Verifies a UserAttriData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserAttriData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserAttriData
         */
        public static fromObject(object: { [k: string]: any }): client_proto.UserAttriData;

        /**
         * Creates a plain object from a UserAttriData message. Also converts values to other types if specified.
         * @param message UserAttriData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.UserAttriData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserAttriData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UserAttriData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** ROOM_LIST_SUB_MSG_ID enum. */
    enum ROOM_LIST_SUB_MSG_ID {
        RLSMI_NULL = 0,
        RLSMI_FIRST_LAYOUT_REQ = 1,
        RLSMI_FIRST_LAYOUT_RESP = 2,
        RLSMI_SECOND_LIST_REQ = 3,
        RLSMI_SECOND_LIST_RESP = 4,
        RLSMI_BEFORE_MATCH_REQ = 5,
        RLSMI_BEFORE_MATCH_RESP = 6,
        RLSMI_ENTER_MATCH_REQ = 7,
        RLSMI_ENTER_MATCH_RESP = 8,
        RLSMI_EXIT_MATCH_REQ = 9,
        RLSMI_EXIT_MATCH_RESP = 10,
        RLSMI_ENTER_ROOM_REQ = 11,
        RLSMI_ENTER_ROOM_RESP = 12,
        RLSMI_MATCH_INFO_PUSH = 100,
        RLSMI_COMEBACK_INFO_PUSH = 101
    }

    /** GAME_TYPE enum. */
    enum GAME_TYPE {
        GT_NULL = 0,
        GT_LANDLORD = 1,
        GT_MAHJONG = 2
    }

    /** ROOM_TYPE enum. */
    enum ROOM_TYPE {
        RT_NULL = 0,
        RT_CLASSICS = 1,
        RT_CONTINUE_BOMB = 2,
        RT_MATCH = 3,
        RT_FRIEND = 4
    }

    /** ROOM_LEVEL enum. */
    enum ROOM_LEVEL {
        RL_NULL = 0,
        RL_BEGINNER = 1,
        RL_INTERMEDIATE = 2,
        RL_ADVANCED = 3,
        RL_MASTER = 4,
        RL_GREAT_MASTER = 5,
        RL_YOUNG_KING = 6
    }

    /** Properties of a SecondRoomListReq. */
    interface ISecondRoomListReq {

        /** SecondRoomListReq gameType */
        gameType?: (number|null);
    }

    /** Represents a SecondRoomListReq. */
    class SecondRoomListReq implements ISecondRoomListReq {

        /**
         * Constructs a new SecondRoomListReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.ISecondRoomListReq);

        /** SecondRoomListReq gameType. */
        public gameType: number;

        /**
         * Creates a new SecondRoomListReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SecondRoomListReq instance
         */
        public static create(properties?: client_proto.ISecondRoomListReq): client_proto.SecondRoomListReq;

        /**
         * Encodes the specified SecondRoomListReq message. Does not implicitly {@link client_proto.SecondRoomListReq.verify|verify} messages.
         * @param message SecondRoomListReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.ISecondRoomListReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SecondRoomListReq message, length delimited. Does not implicitly {@link client_proto.SecondRoomListReq.verify|verify} messages.
         * @param message SecondRoomListReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.ISecondRoomListReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SecondRoomListReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SecondRoomListReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.SecondRoomListReq;

        /**
         * Decodes a SecondRoomListReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SecondRoomListReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.SecondRoomListReq;

        /**
         * Verifies a SecondRoomListReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SecondRoomListReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SecondRoomListReq
         */
        public static fromObject(object: { [k: string]: any }): client_proto.SecondRoomListReq;

        /**
         * Creates a plain object from a SecondRoomListReq message. Also converts values to other types if specified.
         * @param message SecondRoomListReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.SecondRoomListReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SecondRoomListReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SecondRoomListReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an OneRoomInfo. */
    interface IOneRoomInfo {

        /** OneRoomInfo roomId */
        roomId?: (number|null);

        /** OneRoomInfo roomName */
        roomName?: (string|null);

        /** OneRoomInfo roomLevel */
        roomLevel?: (number|null);

        /** OneRoomInfo enterMin */
        enterMin?: (number|Long|null);

        /** OneRoomInfo enterMax */
        enterMax?: (number|Long|null);

        /** OneRoomInfo baseScore */
        baseScore?: (number|null);

        /** OneRoomInfo playerNum */
        playerNum?: (number|null);
    }

    /** Represents an OneRoomInfo. */
    class OneRoomInfo implements IOneRoomInfo {

        /**
         * Constructs a new OneRoomInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IOneRoomInfo);

        /** OneRoomInfo roomId. */
        public roomId: number;

        /** OneRoomInfo roomName. */
        public roomName: string;

        /** OneRoomInfo roomLevel. */
        public roomLevel: number;

        /** OneRoomInfo enterMin. */
        public enterMin: (number|Long);

        /** OneRoomInfo enterMax. */
        public enterMax: (number|Long);

        /** OneRoomInfo baseScore. */
        public baseScore: number;

        /** OneRoomInfo playerNum. */
        public playerNum: number;

        /**
         * Creates a new OneRoomInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OneRoomInfo instance
         */
        public static create(properties?: client_proto.IOneRoomInfo): client_proto.OneRoomInfo;

        /**
         * Encodes the specified OneRoomInfo message. Does not implicitly {@link client_proto.OneRoomInfo.verify|verify} messages.
         * @param message OneRoomInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IOneRoomInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified OneRoomInfo message, length delimited. Does not implicitly {@link client_proto.OneRoomInfo.verify|verify} messages.
         * @param message OneRoomInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IOneRoomInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an OneRoomInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OneRoomInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.OneRoomInfo;

        /**
         * Decodes an OneRoomInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OneRoomInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.OneRoomInfo;

        /**
         * Verifies an OneRoomInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an OneRoomInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OneRoomInfo
         */
        public static fromObject(object: { [k: string]: any }): client_proto.OneRoomInfo;

        /**
         * Creates a plain object from an OneRoomInfo message. Also converts values to other types if specified.
         * @param message OneRoomInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.OneRoomInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this OneRoomInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for OneRoomInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an OneRoomTypeInfo. */
    interface IOneRoomTypeInfo {

        /** OneRoomTypeInfo roomType */
        roomType?: (number|null);

        /** OneRoomTypeInfo typeName */
        typeName?: (string|null);

        /** OneRoomTypeInfo roomList */
        roomList?: (client_proto.IOneRoomInfo[]|null);
    }

    /** Represents an OneRoomTypeInfo. */
    class OneRoomTypeInfo implements IOneRoomTypeInfo {

        /**
         * Constructs a new OneRoomTypeInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IOneRoomTypeInfo);

        /** OneRoomTypeInfo roomType. */
        public roomType: number;

        /** OneRoomTypeInfo typeName. */
        public typeName: string;

        /** OneRoomTypeInfo roomList. */
        public roomList: client_proto.IOneRoomInfo[];

        /**
         * Creates a new OneRoomTypeInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OneRoomTypeInfo instance
         */
        public static create(properties?: client_proto.IOneRoomTypeInfo): client_proto.OneRoomTypeInfo;

        /**
         * Encodes the specified OneRoomTypeInfo message. Does not implicitly {@link client_proto.OneRoomTypeInfo.verify|verify} messages.
         * @param message OneRoomTypeInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IOneRoomTypeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified OneRoomTypeInfo message, length delimited. Does not implicitly {@link client_proto.OneRoomTypeInfo.verify|verify} messages.
         * @param message OneRoomTypeInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IOneRoomTypeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an OneRoomTypeInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OneRoomTypeInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.OneRoomTypeInfo;

        /**
         * Decodes an OneRoomTypeInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OneRoomTypeInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.OneRoomTypeInfo;

        /**
         * Verifies an OneRoomTypeInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an OneRoomTypeInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OneRoomTypeInfo
         */
        public static fromObject(object: { [k: string]: any }): client_proto.OneRoomTypeInfo;

        /**
         * Creates a plain object from an OneRoomTypeInfo message. Also converts values to other types if specified.
         * @param message OneRoomTypeInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.OneRoomTypeInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this OneRoomTypeInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for OneRoomTypeInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SecondRoomListResp. */
    interface ISecondRoomListResp {

        /** SecondRoomListResp gameType */
        gameType?: (number|null);

        /** SecondRoomListResp defaultRoomType */
        defaultRoomType?: (number|null);

        /** SecondRoomListResp typeList */
        typeList?: (client_proto.IOneRoomTypeInfo[]|null);
    }

    /** Represents a SecondRoomListResp. */
    class SecondRoomListResp implements ISecondRoomListResp {

        /**
         * Constructs a new SecondRoomListResp.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.ISecondRoomListResp);

        /** SecondRoomListResp gameType. */
        public gameType: number;

        /** SecondRoomListResp defaultRoomType. */
        public defaultRoomType: number;

        /** SecondRoomListResp typeList. */
        public typeList: client_proto.IOneRoomTypeInfo[];

        /**
         * Creates a new SecondRoomListResp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SecondRoomListResp instance
         */
        public static create(properties?: client_proto.ISecondRoomListResp): client_proto.SecondRoomListResp;

        /**
         * Encodes the specified SecondRoomListResp message. Does not implicitly {@link client_proto.SecondRoomListResp.verify|verify} messages.
         * @param message SecondRoomListResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.ISecondRoomListResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SecondRoomListResp message, length delimited. Does not implicitly {@link client_proto.SecondRoomListResp.verify|verify} messages.
         * @param message SecondRoomListResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.ISecondRoomListResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SecondRoomListResp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SecondRoomListResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.SecondRoomListResp;

        /**
         * Decodes a SecondRoomListResp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SecondRoomListResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.SecondRoomListResp;

        /**
         * Verifies a SecondRoomListResp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SecondRoomListResp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SecondRoomListResp
         */
        public static fromObject(object: { [k: string]: any }): client_proto.SecondRoomListResp;

        /**
         * Creates a plain object from a SecondRoomListResp message. Also converts values to other types if specified.
         * @param message SecondRoomListResp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.SecondRoomListResp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SecondRoomListResp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SecondRoomListResp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a BeforeMatchTableReq. */
    interface IBeforeMatchTableReq {

        /** BeforeMatchTableReq roomId */
        roomId?: (number|null);
    }

    /** Represents a BeforeMatchTableReq. */
    class BeforeMatchTableReq implements IBeforeMatchTableReq {

        /**
         * Constructs a new BeforeMatchTableReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IBeforeMatchTableReq);

        /** BeforeMatchTableReq roomId. */
        public roomId: number;

        /**
         * Creates a new BeforeMatchTableReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BeforeMatchTableReq instance
         */
        public static create(properties?: client_proto.IBeforeMatchTableReq): client_proto.BeforeMatchTableReq;

        /**
         * Encodes the specified BeforeMatchTableReq message. Does not implicitly {@link client_proto.BeforeMatchTableReq.verify|verify} messages.
         * @param message BeforeMatchTableReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IBeforeMatchTableReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BeforeMatchTableReq message, length delimited. Does not implicitly {@link client_proto.BeforeMatchTableReq.verify|verify} messages.
         * @param message BeforeMatchTableReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IBeforeMatchTableReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BeforeMatchTableReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BeforeMatchTableReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.BeforeMatchTableReq;

        /**
         * Decodes a BeforeMatchTableReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BeforeMatchTableReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.BeforeMatchTableReq;

        /**
         * Verifies a BeforeMatchTableReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BeforeMatchTableReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BeforeMatchTableReq
         */
        public static fromObject(object: { [k: string]: any }): client_proto.BeforeMatchTableReq;

        /**
         * Creates a plain object from a BeforeMatchTableReq message. Also converts values to other types if specified.
         * @param message BeforeMatchTableReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.BeforeMatchTableReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BeforeMatchTableReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for BeforeMatchTableReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a BeforeMatchTableResp. */
    interface IBeforeMatchTableResp {

        /** BeforeMatchTableResp roomId */
        roomId?: (number|null);

        /** BeforeMatchTableResp svrId */
        svrId?: (number|null);

        /** BeforeMatchTableResp result */
        result?: (number|null);

        /** BeforeMatchTableResp gameType */
        gameType?: (number|null);

        /** BeforeMatchTableResp roomType */
        roomType?: (number|null);
    }

    /** Represents a BeforeMatchTableResp. */
    class BeforeMatchTableResp implements IBeforeMatchTableResp {

        /**
         * Constructs a new BeforeMatchTableResp.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IBeforeMatchTableResp);

        /** BeforeMatchTableResp roomId. */
        public roomId: number;

        /** BeforeMatchTableResp svrId. */
        public svrId: number;

        /** BeforeMatchTableResp result. */
        public result: number;

        /** BeforeMatchTableResp gameType. */
        public gameType: number;

        /** BeforeMatchTableResp roomType. */
        public roomType: number;

        /**
         * Creates a new BeforeMatchTableResp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BeforeMatchTableResp instance
         */
        public static create(properties?: client_proto.IBeforeMatchTableResp): client_proto.BeforeMatchTableResp;

        /**
         * Encodes the specified BeforeMatchTableResp message. Does not implicitly {@link client_proto.BeforeMatchTableResp.verify|verify} messages.
         * @param message BeforeMatchTableResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IBeforeMatchTableResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BeforeMatchTableResp message, length delimited. Does not implicitly {@link client_proto.BeforeMatchTableResp.verify|verify} messages.
         * @param message BeforeMatchTableResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IBeforeMatchTableResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BeforeMatchTableResp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BeforeMatchTableResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.BeforeMatchTableResp;

        /**
         * Decodes a BeforeMatchTableResp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BeforeMatchTableResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.BeforeMatchTableResp;

        /**
         * Verifies a BeforeMatchTableResp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BeforeMatchTableResp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BeforeMatchTableResp
         */
        public static fromObject(object: { [k: string]: any }): client_proto.BeforeMatchTableResp;

        /**
         * Creates a plain object from a BeforeMatchTableResp message. Also converts values to other types if specified.
         * @param message BeforeMatchTableResp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.BeforeMatchTableResp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BeforeMatchTableResp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for BeforeMatchTableResp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EnterMatchTableReq. */
    interface IEnterMatchTableReq {

        /** EnterMatchTableReq roomId */
        roomId?: (number|null);
    }

    /** Represents an EnterMatchTableReq. */
    class EnterMatchTableReq implements IEnterMatchTableReq {

        /**
         * Constructs a new EnterMatchTableReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IEnterMatchTableReq);

        /** EnterMatchTableReq roomId. */
        public roomId: number;

        /**
         * Creates a new EnterMatchTableReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EnterMatchTableReq instance
         */
        public static create(properties?: client_proto.IEnterMatchTableReq): client_proto.EnterMatchTableReq;

        /**
         * Encodes the specified EnterMatchTableReq message. Does not implicitly {@link client_proto.EnterMatchTableReq.verify|verify} messages.
         * @param message EnterMatchTableReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IEnterMatchTableReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EnterMatchTableReq message, length delimited. Does not implicitly {@link client_proto.EnterMatchTableReq.verify|verify} messages.
         * @param message EnterMatchTableReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IEnterMatchTableReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EnterMatchTableReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EnterMatchTableReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.EnterMatchTableReq;

        /**
         * Decodes an EnterMatchTableReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EnterMatchTableReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.EnterMatchTableReq;

        /**
         * Verifies an EnterMatchTableReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EnterMatchTableReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EnterMatchTableReq
         */
        public static fromObject(object: { [k: string]: any }): client_proto.EnterMatchTableReq;

        /**
         * Creates a plain object from an EnterMatchTableReq message. Also converts values to other types if specified.
         * @param message EnterMatchTableReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.EnterMatchTableReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EnterMatchTableReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for EnterMatchTableReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EnterMatchTableResp. */
    interface IEnterMatchTableResp {

        /** EnterMatchTableResp roomId */
        roomId?: (number|null);

        /** EnterMatchTableResp result */
        result?: (number|null);

        /** EnterMatchTableResp waitSec */
        waitSec?: (number|null);

        /** EnterMatchTableResp roomName */
        roomName?: (string|null);

        /** EnterMatchTableResp roomBase */
        roomBase?: (number|null);
    }

    /** Represents an EnterMatchTableResp. */
    class EnterMatchTableResp implements IEnterMatchTableResp {

        /**
         * Constructs a new EnterMatchTableResp.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IEnterMatchTableResp);

        /** EnterMatchTableResp roomId. */
        public roomId: number;

        /** EnterMatchTableResp result. */
        public result: number;

        /** EnterMatchTableResp waitSec. */
        public waitSec: number;

        /** EnterMatchTableResp roomName. */
        public roomName: string;

        /** EnterMatchTableResp roomBase. */
        public roomBase: number;

        /**
         * Creates a new EnterMatchTableResp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EnterMatchTableResp instance
         */
        public static create(properties?: client_proto.IEnterMatchTableResp): client_proto.EnterMatchTableResp;

        /**
         * Encodes the specified EnterMatchTableResp message. Does not implicitly {@link client_proto.EnterMatchTableResp.verify|verify} messages.
         * @param message EnterMatchTableResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IEnterMatchTableResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EnterMatchTableResp message, length delimited. Does not implicitly {@link client_proto.EnterMatchTableResp.verify|verify} messages.
         * @param message EnterMatchTableResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IEnterMatchTableResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EnterMatchTableResp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EnterMatchTableResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.EnterMatchTableResp;

        /**
         * Decodes an EnterMatchTableResp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EnterMatchTableResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.EnterMatchTableResp;

        /**
         * Verifies an EnterMatchTableResp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EnterMatchTableResp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EnterMatchTableResp
         */
        public static fromObject(object: { [k: string]: any }): client_proto.EnterMatchTableResp;

        /**
         * Creates a plain object from an EnterMatchTableResp message. Also converts values to other types if specified.
         * @param message EnterMatchTableResp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.EnterMatchTableResp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EnterMatchTableResp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for EnterMatchTableResp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a MatchedTableInfoPush. */
    interface IMatchedTableInfoPush {

        /** MatchedTableInfoPush roomId */
        roomId?: (number|null);

        /** MatchedTableInfoPush svrId */
        svrId?: (number|null);
    }

    /** Represents a MatchedTableInfoPush. */
    class MatchedTableInfoPush implements IMatchedTableInfoPush {

        /**
         * Constructs a new MatchedTableInfoPush.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IMatchedTableInfoPush);

        /** MatchedTableInfoPush roomId. */
        public roomId: number;

        /** MatchedTableInfoPush svrId. */
        public svrId: number;

        /**
         * Creates a new MatchedTableInfoPush instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MatchedTableInfoPush instance
         */
        public static create(properties?: client_proto.IMatchedTableInfoPush): client_proto.MatchedTableInfoPush;

        /**
         * Encodes the specified MatchedTableInfoPush message. Does not implicitly {@link client_proto.MatchedTableInfoPush.verify|verify} messages.
         * @param message MatchedTableInfoPush message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IMatchedTableInfoPush, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MatchedTableInfoPush message, length delimited. Does not implicitly {@link client_proto.MatchedTableInfoPush.verify|verify} messages.
         * @param message MatchedTableInfoPush message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IMatchedTableInfoPush, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MatchedTableInfoPush message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MatchedTableInfoPush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.MatchedTableInfoPush;

        /**
         * Decodes a MatchedTableInfoPush message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MatchedTableInfoPush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.MatchedTableInfoPush;

        /**
         * Verifies a MatchedTableInfoPush message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MatchedTableInfoPush message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MatchedTableInfoPush
         */
        public static fromObject(object: { [k: string]: any }): client_proto.MatchedTableInfoPush;

        /**
         * Creates a plain object from a MatchedTableInfoPush message. Also converts values to other types if specified.
         * @param message MatchedTableInfoPush
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.MatchedTableInfoPush, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MatchedTableInfoPush to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for MatchedTableInfoPush
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ExitMatchTableReq. */
    interface IExitMatchTableReq {

        /** ExitMatchTableReq roomId */
        roomId?: (number|null);
    }

    /** Represents an ExitMatchTableReq. */
    class ExitMatchTableReq implements IExitMatchTableReq {

        /**
         * Constructs a new ExitMatchTableReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IExitMatchTableReq);

        /** ExitMatchTableReq roomId. */
        public roomId: number;

        /**
         * Creates a new ExitMatchTableReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ExitMatchTableReq instance
         */
        public static create(properties?: client_proto.IExitMatchTableReq): client_proto.ExitMatchTableReq;

        /**
         * Encodes the specified ExitMatchTableReq message. Does not implicitly {@link client_proto.ExitMatchTableReq.verify|verify} messages.
         * @param message ExitMatchTableReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IExitMatchTableReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ExitMatchTableReq message, length delimited. Does not implicitly {@link client_proto.ExitMatchTableReq.verify|verify} messages.
         * @param message ExitMatchTableReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IExitMatchTableReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ExitMatchTableReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ExitMatchTableReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.ExitMatchTableReq;

        /**
         * Decodes an ExitMatchTableReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ExitMatchTableReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.ExitMatchTableReq;

        /**
         * Verifies an ExitMatchTableReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ExitMatchTableReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ExitMatchTableReq
         */
        public static fromObject(object: { [k: string]: any }): client_proto.ExitMatchTableReq;

        /**
         * Creates a plain object from an ExitMatchTableReq message. Also converts values to other types if specified.
         * @param message ExitMatchTableReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.ExitMatchTableReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ExitMatchTableReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ExitMatchTableReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ExitMatchTableResp. */
    interface IExitMatchTableResp {

        /** ExitMatchTableResp roomId */
        roomId?: (number|null);

        /** ExitMatchTableResp from */
        from?: (number|null);

        /** ExitMatchTableResp result */
        result?: (number|null);
    }

    /** Represents an ExitMatchTableResp. */
    class ExitMatchTableResp implements IExitMatchTableResp {

        /**
         * Constructs a new ExitMatchTableResp.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IExitMatchTableResp);

        /** ExitMatchTableResp roomId. */
        public roomId: number;

        /** ExitMatchTableResp from. */
        public from: number;

        /** ExitMatchTableResp result. */
        public result: number;

        /**
         * Creates a new ExitMatchTableResp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ExitMatchTableResp instance
         */
        public static create(properties?: client_proto.IExitMatchTableResp): client_proto.ExitMatchTableResp;

        /**
         * Encodes the specified ExitMatchTableResp message. Does not implicitly {@link client_proto.ExitMatchTableResp.verify|verify} messages.
         * @param message ExitMatchTableResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IExitMatchTableResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ExitMatchTableResp message, length delimited. Does not implicitly {@link client_proto.ExitMatchTableResp.verify|verify} messages.
         * @param message ExitMatchTableResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IExitMatchTableResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ExitMatchTableResp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ExitMatchTableResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.ExitMatchTableResp;

        /**
         * Decodes an ExitMatchTableResp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ExitMatchTableResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.ExitMatchTableResp;

        /**
         * Verifies an ExitMatchTableResp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ExitMatchTableResp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ExitMatchTableResp
         */
        public static fromObject(object: { [k: string]: any }): client_proto.ExitMatchTableResp;

        /**
         * Creates a plain object from an ExitMatchTableResp message. Also converts values to other types if specified.
         * @param message ExitMatchTableResp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.ExitMatchTableResp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ExitMatchTableResp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ExitMatchTableResp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EnterRoomReq. */
    interface IEnterRoomReq {

        /** EnterRoomReq roomId */
        roomId?: (number|null);
    }

    /** Represents an EnterRoomReq. */
    class EnterRoomReq implements IEnterRoomReq {

        /**
         * Constructs a new EnterRoomReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IEnterRoomReq);

        /** EnterRoomReq roomId. */
        public roomId: number;

        /**
         * Creates a new EnterRoomReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EnterRoomReq instance
         */
        public static create(properties?: client_proto.IEnterRoomReq): client_proto.EnterRoomReq;

        /**
         * Encodes the specified EnterRoomReq message. Does not implicitly {@link client_proto.EnterRoomReq.verify|verify} messages.
         * @param message EnterRoomReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IEnterRoomReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EnterRoomReq message, length delimited. Does not implicitly {@link client_proto.EnterRoomReq.verify|verify} messages.
         * @param message EnterRoomReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IEnterRoomReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EnterRoomReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EnterRoomReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.EnterRoomReq;

        /**
         * Decodes an EnterRoomReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EnterRoomReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.EnterRoomReq;

        /**
         * Verifies an EnterRoomReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EnterRoomReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EnterRoomReq
         */
        public static fromObject(object: { [k: string]: any }): client_proto.EnterRoomReq;

        /**
         * Creates a plain object from an EnterRoomReq message. Also converts values to other types if specified.
         * @param message EnterRoomReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.EnterRoomReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EnterRoomReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for EnterRoomReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EnterRoomResp. */
    interface IEnterRoomResp {

        /** EnterRoomResp roomId */
        roomId?: (number|null);

        /** EnterRoomResp result */
        result?: (number|null);
    }

    /** Represents an EnterRoomResp. */
    class EnterRoomResp implements IEnterRoomResp {

        /**
         * Constructs a new EnterRoomResp.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IEnterRoomResp);

        /** EnterRoomResp roomId. */
        public roomId: number;

        /** EnterRoomResp result. */
        public result: number;

        /**
         * Creates a new EnterRoomResp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EnterRoomResp instance
         */
        public static create(properties?: client_proto.IEnterRoomResp): client_proto.EnterRoomResp;

        /**
         * Encodes the specified EnterRoomResp message. Does not implicitly {@link client_proto.EnterRoomResp.verify|verify} messages.
         * @param message EnterRoomResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IEnterRoomResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EnterRoomResp message, length delimited. Does not implicitly {@link client_proto.EnterRoomResp.verify|verify} messages.
         * @param message EnterRoomResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IEnterRoomResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EnterRoomResp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EnterRoomResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.EnterRoomResp;

        /**
         * Decodes an EnterRoomResp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EnterRoomResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.EnterRoomResp;

        /**
         * Verifies an EnterRoomResp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EnterRoomResp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EnterRoomResp
         */
        public static fromObject(object: { [k: string]: any }): client_proto.EnterRoomResp;

        /**
         * Creates a plain object from an EnterRoomResp message. Also converts values to other types if specified.
         * @param message EnterRoomResp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.EnterRoomResp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EnterRoomResp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for EnterRoomResp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ComebackRoomInfoPush. */
    interface IComebackRoomInfoPush {

        /** ComebackRoomInfoPush roomId */
        roomId?: (number|null);

        /** ComebackRoomInfoPush svrId */
        svrId?: (number|null);

        /** ComebackRoomInfoPush gameType */
        gameType?: (number|null);

        /** ComebackRoomInfoPush roomType */
        roomType?: (number|null);
    }

    /** Represents a ComebackRoomInfoPush. */
    class ComebackRoomInfoPush implements IComebackRoomInfoPush {

        /**
         * Constructs a new ComebackRoomInfoPush.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IComebackRoomInfoPush);

        /** ComebackRoomInfoPush roomId. */
        public roomId: number;

        /** ComebackRoomInfoPush svrId. */
        public svrId: number;

        /** ComebackRoomInfoPush gameType. */
        public gameType: number;

        /** ComebackRoomInfoPush roomType. */
        public roomType: number;

        /**
         * Creates a new ComebackRoomInfoPush instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ComebackRoomInfoPush instance
         */
        public static create(properties?: client_proto.IComebackRoomInfoPush): client_proto.ComebackRoomInfoPush;

        /**
         * Encodes the specified ComebackRoomInfoPush message. Does not implicitly {@link client_proto.ComebackRoomInfoPush.verify|verify} messages.
         * @param message ComebackRoomInfoPush message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IComebackRoomInfoPush, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ComebackRoomInfoPush message, length delimited. Does not implicitly {@link client_proto.ComebackRoomInfoPush.verify|verify} messages.
         * @param message ComebackRoomInfoPush message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IComebackRoomInfoPush, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ComebackRoomInfoPush message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ComebackRoomInfoPush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.ComebackRoomInfoPush;

        /**
         * Decodes a ComebackRoomInfoPush message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ComebackRoomInfoPush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.ComebackRoomInfoPush;

        /**
         * Verifies a ComebackRoomInfoPush message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ComebackRoomInfoPush message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ComebackRoomInfoPush
         */
        public static fromObject(object: { [k: string]: any }): client_proto.ComebackRoomInfoPush;

        /**
         * Creates a plain object from a ComebackRoomInfoPush message. Also converts values to other types if specified.
         * @param message ComebackRoomInfoPush
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.ComebackRoomInfoPush, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ComebackRoomInfoPush to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ComebackRoomInfoPush
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** USER_INFO_SUB_MSG_ID enum. */
    enum USER_INFO_SUB_MSG_ID {
        UISMI_NULL = 0,
        UISMI_USER_ATTRI_CHANGE_PUSH = 1,
        UISMI_USER_DATA_CHANGE_PUSH = 2,
        UISMI_USER_BAG_REQ = 3,
        UISMI_USER_BAG_RESP = 4
    }

    /** Properties of a UserAttriChangePush. */
    interface IUserAttriChangePush {

        /** UserAttriChangePush attriList */
        attriList?: (client_proto.IUserAttriData[]|null);
    }

    /** Represents a UserAttriChangePush. */
    class UserAttriChangePush implements IUserAttriChangePush {

        /**
         * Constructs a new UserAttriChangePush.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IUserAttriChangePush);

        /** UserAttriChangePush attriList. */
        public attriList: client_proto.IUserAttriData[];

        /**
         * Creates a new UserAttriChangePush instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserAttriChangePush instance
         */
        public static create(properties?: client_proto.IUserAttriChangePush): client_proto.UserAttriChangePush;

        /**
         * Encodes the specified UserAttriChangePush message. Does not implicitly {@link client_proto.UserAttriChangePush.verify|verify} messages.
         * @param message UserAttriChangePush message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IUserAttriChangePush, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserAttriChangePush message, length delimited. Does not implicitly {@link client_proto.UserAttriChangePush.verify|verify} messages.
         * @param message UserAttriChangePush message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IUserAttriChangePush, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserAttriChangePush message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserAttriChangePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.UserAttriChangePush;

        /**
         * Decodes a UserAttriChangePush message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserAttriChangePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.UserAttriChangePush;

        /**
         * Verifies a UserAttriChangePush message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserAttriChangePush message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserAttriChangePush
         */
        public static fromObject(object: { [k: string]: any }): client_proto.UserAttriChangePush;

        /**
         * Creates a plain object from a UserAttriChangePush message. Also converts values to other types if specified.
         * @param message UserAttriChangePush
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.UserAttriChangePush, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserAttriChangePush to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UserAttriChangePush
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a UserADataChangePush. */
    interface IUserADataChangePush {

        /** UserADataChangePush todo */
        todo?: (number|null);
    }

    /** Represents a UserADataChangePush. */
    class UserADataChangePush implements IUserADataChangePush {

        /**
         * Constructs a new UserADataChangePush.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IUserADataChangePush);

        /** UserADataChangePush todo. */
        public todo: number;

        /**
         * Creates a new UserADataChangePush instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserADataChangePush instance
         */
        public static create(properties?: client_proto.IUserADataChangePush): client_proto.UserADataChangePush;

        /**
         * Encodes the specified UserADataChangePush message. Does not implicitly {@link client_proto.UserADataChangePush.verify|verify} messages.
         * @param message UserADataChangePush message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IUserADataChangePush, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserADataChangePush message, length delimited. Does not implicitly {@link client_proto.UserADataChangePush.verify|verify} messages.
         * @param message UserADataChangePush message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IUserADataChangePush, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserADataChangePush message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserADataChangePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.UserADataChangePush;

        /**
         * Decodes a UserADataChangePush message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserADataChangePush
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.UserADataChangePush;

        /**
         * Verifies a UserADataChangePush message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserADataChangePush message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserADataChangePush
         */
        public static fromObject(object: { [k: string]: any }): client_proto.UserADataChangePush;

        /**
         * Creates a plain object from a UserADataChangePush message. Also converts values to other types if specified.
         * @param message UserADataChangePush
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.UserADataChangePush, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserADataChangePush to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UserADataChangePush
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a UserBagDataReq. */
    interface IUserBagDataReq {

        /** UserBagDataReq passthrough */
        passthrough?: (number|null);
    }

    /** Represents a UserBagDataReq. */
    class UserBagDataReq implements IUserBagDataReq {

        /**
         * Constructs a new UserBagDataReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IUserBagDataReq);

        /** UserBagDataReq passthrough. */
        public passthrough: number;

        /**
         * Creates a new UserBagDataReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserBagDataReq instance
         */
        public static create(properties?: client_proto.IUserBagDataReq): client_proto.UserBagDataReq;

        /**
         * Encodes the specified UserBagDataReq message. Does not implicitly {@link client_proto.UserBagDataReq.verify|verify} messages.
         * @param message UserBagDataReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IUserBagDataReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserBagDataReq message, length delimited. Does not implicitly {@link client_proto.UserBagDataReq.verify|verify} messages.
         * @param message UserBagDataReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IUserBagDataReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserBagDataReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserBagDataReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.UserBagDataReq;

        /**
         * Decodes a UserBagDataReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserBagDataReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.UserBagDataReq;

        /**
         * Verifies a UserBagDataReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserBagDataReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserBagDataReq
         */
        public static fromObject(object: { [k: string]: any }): client_proto.UserBagDataReq;

        /**
         * Creates a plain object from a UserBagDataReq message. Also converts values to other types if specified.
         * @param message UserBagDataReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.UserBagDataReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserBagDataReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UserBagDataReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an OneBagItemData. */
    interface IOneBagItemData {

        /** OneBagItemData itemId */
        itemId?: (number|null);

        /** OneBagItemData itemExpi */
        itemExpi?: (number|Long|null);

        /** OneBagItemData itemNum */
        itemNum?: (number|Long|null);
    }

    /** Represents an OneBagItemData. */
    class OneBagItemData implements IOneBagItemData {

        /**
         * Constructs a new OneBagItemData.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IOneBagItemData);

        /** OneBagItemData itemId. */
        public itemId: number;

        /** OneBagItemData itemExpi. */
        public itemExpi: (number|Long);

        /** OneBagItemData itemNum. */
        public itemNum: (number|Long);

        /**
         * Creates a new OneBagItemData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OneBagItemData instance
         */
        public static create(properties?: client_proto.IOneBagItemData): client_proto.OneBagItemData;

        /**
         * Encodes the specified OneBagItemData message. Does not implicitly {@link client_proto.OneBagItemData.verify|verify} messages.
         * @param message OneBagItemData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IOneBagItemData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified OneBagItemData message, length delimited. Does not implicitly {@link client_proto.OneBagItemData.verify|verify} messages.
         * @param message OneBagItemData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IOneBagItemData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an OneBagItemData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OneBagItemData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.OneBagItemData;

        /**
         * Decodes an OneBagItemData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OneBagItemData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.OneBagItemData;

        /**
         * Verifies an OneBagItemData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an OneBagItemData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OneBagItemData
         */
        public static fromObject(object: { [k: string]: any }): client_proto.OneBagItemData;

        /**
         * Creates a plain object from an OneBagItemData message. Also converts values to other types if specified.
         * @param message OneBagItemData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.OneBagItemData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this OneBagItemData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for OneBagItemData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a UserBagDataResp. */
    interface IUserBagDataResp {

        /** UserBagDataResp src */
        src?: (number|null);

        /** UserBagDataResp passthrough */
        passthrough?: (number|null);

        /** UserBagDataResp type */
        type?: (number|null);

        /** UserBagDataResp litemList */
        litemList?: (client_proto.IOneBagItemData[]|null);
    }

    /** Represents a UserBagDataResp. */
    class UserBagDataResp implements IUserBagDataResp {

        /**
         * Constructs a new UserBagDataResp.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto.IUserBagDataResp);

        /** UserBagDataResp src. */
        public src: number;

        /** UserBagDataResp passthrough. */
        public passthrough: number;

        /** UserBagDataResp type. */
        public type: number;

        /** UserBagDataResp litemList. */
        public litemList: client_proto.IOneBagItemData[];

        /**
         * Creates a new UserBagDataResp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserBagDataResp instance
         */
        public static create(properties?: client_proto.IUserBagDataResp): client_proto.UserBagDataResp;

        /**
         * Encodes the specified UserBagDataResp message. Does not implicitly {@link client_proto.UserBagDataResp.verify|verify} messages.
         * @param message UserBagDataResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto.IUserBagDataResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserBagDataResp message, length delimited. Does not implicitly {@link client_proto.UserBagDataResp.verify|verify} messages.
         * @param message UserBagDataResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto.IUserBagDataResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserBagDataResp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserBagDataResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto.UserBagDataResp;

        /**
         * Decodes a UserBagDataResp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserBagDataResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto.UserBagDataResp;

        /**
         * Verifies a UserBagDataResp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserBagDataResp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserBagDataResp
         */
        public static fromObject(object: { [k: string]: any }): client_proto.UserBagDataResp;

        /**
         * Creates a plain object from a UserBagDataResp message. Also converts values to other types if specified.
         * @param message UserBagDataResp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto.UserBagDataResp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserBagDataResp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UserBagDataResp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}

}
var proto = $root;
export default proto;
