
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
     */
    client_proto.LOGIN_SUB_MSG_ID = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "LSMI_LOGIN_NULL"] = 0;
        values[valuesById[1] = "LSMI_LOGIN_REQ"] = 1;
        values[valuesById[2] = "LSMI_LOGIN_RESP"] = 2;
        values[valuesById[3] = "LSMI_LOGIN_ATTR_NTF"] = 3;
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
        LSMI_LOGIN_ATTR_NTF = 3
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
}

}
var proto = $root;
export default proto;
