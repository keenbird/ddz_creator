
/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/


import $protobuf from "protobufjs/minimal.js";

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.client_proto_ddz = (function() {

    /**
     * Namespace client_proto_ddz.
     * @exports client_proto_ddz
     * @namespace
     */
    var client_proto_ddz = {};

    client_proto_ddz.RepeatedInt32 = (function() {

        /**
         * Properties of a RepeatedInt32.
         * @memberof client_proto_ddz
         * @interface IRepeatedInt32
         * @property {Array.<number>|null} [data] RepeatedInt32 data
         */

        /**
         * Constructs a new RepeatedInt32.
         * @memberof client_proto_ddz
         * @classdesc Represents a RepeatedInt32.
         * @implements IRepeatedInt32
         * @constructor
         * @param {client_proto_ddz.IRepeatedInt32=} [properties] Properties to set
         */
        function RepeatedInt32(properties) {
            this.data = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RepeatedInt32 data.
         * @member {Array.<number>} data
         * @memberof client_proto_ddz.RepeatedInt32
         * @instance
         */
        RepeatedInt32.prototype.data = $util.emptyArray;

        /**
         * Creates a new RepeatedInt32 instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.RepeatedInt32
         * @static
         * @param {client_proto_ddz.IRepeatedInt32=} [properties] Properties to set
         * @returns {client_proto_ddz.RepeatedInt32} RepeatedInt32 instance
         */
        RepeatedInt32.create = function create(properties) {
            return new RepeatedInt32(properties);
        };

        /**
         * Encodes the specified RepeatedInt32 message. Does not implicitly {@link client_proto_ddz.RepeatedInt32.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.RepeatedInt32
         * @static
         * @param {client_proto_ddz.IRepeatedInt32} message RepeatedInt32 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RepeatedInt32.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.data != null && message.data.length) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork();
                for (var i = 0; i < message.data.length; ++i)
                    writer.int32(message.data[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified RepeatedInt32 message, length delimited. Does not implicitly {@link client_proto_ddz.RepeatedInt32.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.RepeatedInt32
         * @static
         * @param {client_proto_ddz.IRepeatedInt32} message RepeatedInt32 message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RepeatedInt32.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RepeatedInt32 message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.RepeatedInt32
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.RepeatedInt32} RepeatedInt32
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RepeatedInt32.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.RepeatedInt32();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.data && message.data.length))
                            message.data = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.data.push(reader.int32());
                        } else
                            message.data.push(reader.int32());
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
         * Decodes a RepeatedInt32 message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.RepeatedInt32
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.RepeatedInt32} RepeatedInt32
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RepeatedInt32.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RepeatedInt32 message.
         * @function verify
         * @memberof client_proto_ddz.RepeatedInt32
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RepeatedInt32.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                if (!Array.isArray(message.data))
                    return "data: array expected";
                for (var i = 0; i < message.data.length; ++i)
                    if (!$util.isInteger(message.data[i]))
                        return "data: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a RepeatedInt32 message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.RepeatedInt32
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.RepeatedInt32} RepeatedInt32
         */
        RepeatedInt32.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.RepeatedInt32)
                return object;
            var message = new $root.client_proto_ddz.RepeatedInt32();
            if (object.data) {
                if (!Array.isArray(object.data))
                    throw TypeError(".client_proto_ddz.RepeatedInt32.data: array expected");
                message.data = [];
                for (var i = 0; i < object.data.length; ++i)
                    message.data[i] = object.data[i] | 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a RepeatedInt32 message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.RepeatedInt32
         * @static
         * @param {client_proto_ddz.RepeatedInt32} message RepeatedInt32
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RepeatedInt32.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.data = [];
            if (message.data && message.data.length) {
                object.data = [];
                for (var j = 0; j < message.data.length; ++j)
                    object.data[j] = message.data[j];
            }
            return object;
        };

        /**
         * Converts this RepeatedInt32 to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.RepeatedInt32
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RepeatedInt32.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for RepeatedInt32
         * @function getTypeUrl
         * @memberof client_proto_ddz.RepeatedInt32
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        RepeatedInt32.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.RepeatedInt32";
        };

        return RepeatedInt32;
    })();

    /**
     * DDZ_TIPS enum.
     * @name client_proto_ddz.DDZ_TIPS
     * @enum {number}
     * @property {number} DDZ_TIPS_NULL=0 DDZ_TIPS_NULL value
     * @property {number} DDZ_TIPS_START=1 DDZ_TIPS_START value
     * @property {number} DDZ_TIPS_SHOW_START=2 DDZ_TIPS_SHOW_START value
     * @property {number} DDZ_TIPS_CALL_START=3 DDZ_TIPS_CALL_START value
     * @property {number} DDZ_TIPS_RESTART=4 DDZ_TIPS_RESTART value
     * @property {number} DDZ_TIPS_DOUBLE_START=5 DDZ_TIPS_DOUBLE_START value
     * @property {number} DDZ_TIPS_OUT_START=6 DDZ_TIPS_OUT_START value
     */
    client_proto_ddz.DDZ_TIPS = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "DDZ_TIPS_NULL"] = 0;
        values[valuesById[1] = "DDZ_TIPS_START"] = 1;
        values[valuesById[2] = "DDZ_TIPS_SHOW_START"] = 2;
        values[valuesById[3] = "DDZ_TIPS_CALL_START"] = 3;
        values[valuesById[4] = "DDZ_TIPS_RESTART"] = 4;
        values[valuesById[5] = "DDZ_TIPS_DOUBLE_START"] = 5;
        values[valuesById[6] = "DDZ_TIPS_OUT_START"] = 6;
        return values;
    })();

    /**
     * DDZ_CALL_STATUS enum.
     * @name client_proto_ddz.DDZ_CALL_STATUS
     * @enum {number}
     * @property {number} DDZ_CALL_STATUS_NULL=0 DDZ_CALL_STATUS_NULL value
     * @property {number} DDZ_CALL_STATUS_NO_CALL=1 DDZ_CALL_STATUS_NO_CALL value
     * @property {number} DDZ_CALL_STATUS_CALL=2 DDZ_CALL_STATUS_CALL value
     * @property {number} DDZ_CALL_STATUS_NO_ROB=3 DDZ_CALL_STATUS_NO_ROB value
     * @property {number} DDZ_CALL_STATUS_ROB_1=4 DDZ_CALL_STATUS_ROB_1 value
     * @property {number} DDZ_CALL_STATUS_ROB_2=5 DDZ_CALL_STATUS_ROB_2 value
     * @property {number} DDZ_CALL_STATUS_ROB_3=6 DDZ_CALL_STATUS_ROB_3 value
     */
    client_proto_ddz.DDZ_CALL_STATUS = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "DDZ_CALL_STATUS_NULL"] = 0;
        values[valuesById[1] = "DDZ_CALL_STATUS_NO_CALL"] = 1;
        values[valuesById[2] = "DDZ_CALL_STATUS_CALL"] = 2;
        values[valuesById[3] = "DDZ_CALL_STATUS_NO_ROB"] = 3;
        values[valuesById[4] = "DDZ_CALL_STATUS_ROB_1"] = 4;
        values[valuesById[5] = "DDZ_CALL_STATUS_ROB_2"] = 5;
        values[valuesById[6] = "DDZ_CALL_STATUS_ROB_3"] = 6;
        return values;
    })();

    /**
     * DDZ_SUB_S_MSG_ID enum.
     * @name client_proto_ddz.DDZ_SUB_S_MSG_ID
     * @enum {number}
     * @property {number} DDZ_S_MSG_NULL=0 DDZ_S_MSG_NULL value
     * @property {number} DDZ_S_MSG_USER_ENTER=1 DDZ_S_MSG_USER_ENTER value
     * @property {number} DDZ_S_MSG_TIPS=2 DDZ_S_MSG_TIPS value
     * @property {number} DDZ_S_MSG_SEND_CARD=3 DDZ_S_MSG_SEND_CARD value
     * @property {number} DDZ_S_MSG_SHOW_CARD=4 DDZ_S_MSG_SHOW_CARD value
     * @property {number} DDZ_S_MSG_CALL_POINT=5 DDZ_S_MSG_CALL_POINT value
     * @property {number} DDZ_S_MSG_CALL_END=6 DDZ_S_MSG_CALL_END value
     * @property {number} DDZ_S_MSG_DOUBLE=7 DDZ_S_MSG_DOUBLE value
     * @property {number} DDZ_S_MSG_OUT_CARD=8 DDZ_S_MSG_OUT_CARD value
     * @property {number} DDZ_S_MSG_PASS_CARD=9 DDZ_S_MSG_PASS_CARD value
     * @property {number} DDZ_S_MSG_USE_MEMORY=10 DDZ_S_MSG_USE_MEMORY value
     * @property {number} DDZ_S_MSG_TRUSTEESHIP=11 DDZ_S_MSG_TRUSTEESHIP value
     * @property {number} DDZ_S_MSG_RECONNECT=12 DDZ_S_MSG_RECONNECT value
     * @property {number} DDZ_S_MSG_GAMEEND=13 DDZ_S_MSG_GAMEEND value
     */
    client_proto_ddz.DDZ_SUB_S_MSG_ID = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "DDZ_S_MSG_NULL"] = 0;
        values[valuesById[1] = "DDZ_S_MSG_USER_ENTER"] = 1;
        values[valuesById[2] = "DDZ_S_MSG_TIPS"] = 2;
        values[valuesById[3] = "DDZ_S_MSG_SEND_CARD"] = 3;
        values[valuesById[4] = "DDZ_S_MSG_SHOW_CARD"] = 4;
        values[valuesById[5] = "DDZ_S_MSG_CALL_POINT"] = 5;
        values[valuesById[6] = "DDZ_S_MSG_CALL_END"] = 6;
        values[valuesById[7] = "DDZ_S_MSG_DOUBLE"] = 7;
        values[valuesById[8] = "DDZ_S_MSG_OUT_CARD"] = 8;
        values[valuesById[9] = "DDZ_S_MSG_PASS_CARD"] = 9;
        values[valuesById[10] = "DDZ_S_MSG_USE_MEMORY"] = 10;
        values[valuesById[11] = "DDZ_S_MSG_TRUSTEESHIP"] = 11;
        values[valuesById[12] = "DDZ_S_MSG_RECONNECT"] = 12;
        values[valuesById[13] = "DDZ_S_MSG_GAMEEND"] = 13;
        return values;
    })();

    client_proto_ddz.DDZInfo = (function() {

        /**
         * Properties of a DDZInfo.
         * @memberof client_proto_ddz
         * @interface IDDZInfo
         * @property {number|Long|null} [score] DDZInfo score
         * @property {number|null} [maxTimes] DDZInfo maxTimes
         * @property {number|null} [trusteeshipRound] DDZInfo trusteeshipRound
         * @property {number|null} [showtimes] DDZInfo showtimes
         * @property {number|null} [doubletimes] DDZInfo doubletimes
         * @property {number|null} [superdoubletimes] DDZInfo superdoubletimes
         * @property {number|Long|null} [superdoubleDiamond] DDZInfo superdoubleDiamond
         * @property {number|null} [calltimes] DDZInfo calltimes
         */

        /**
         * Constructs a new DDZInfo.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZInfo.
         * @implements IDDZInfo
         * @constructor
         * @param {client_proto_ddz.IDDZInfo=} [properties] Properties to set
         */
        function DDZInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZInfo score.
         * @member {number|Long} score
         * @memberof client_proto_ddz.DDZInfo
         * @instance
         */
        DDZInfo.prototype.score = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * DDZInfo maxTimes.
         * @member {number} maxTimes
         * @memberof client_proto_ddz.DDZInfo
         * @instance
         */
        DDZInfo.prototype.maxTimes = 0;

        /**
         * DDZInfo trusteeshipRound.
         * @member {number} trusteeshipRound
         * @memberof client_proto_ddz.DDZInfo
         * @instance
         */
        DDZInfo.prototype.trusteeshipRound = 0;

        /**
         * DDZInfo showtimes.
         * @member {number} showtimes
         * @memberof client_proto_ddz.DDZInfo
         * @instance
         */
        DDZInfo.prototype.showtimes = 0;

        /**
         * DDZInfo doubletimes.
         * @member {number} doubletimes
         * @memberof client_proto_ddz.DDZInfo
         * @instance
         */
        DDZInfo.prototype.doubletimes = 0;

        /**
         * DDZInfo superdoubletimes.
         * @member {number} superdoubletimes
         * @memberof client_proto_ddz.DDZInfo
         * @instance
         */
        DDZInfo.prototype.superdoubletimes = 0;

        /**
         * DDZInfo superdoubleDiamond.
         * @member {number|Long} superdoubleDiamond
         * @memberof client_proto_ddz.DDZInfo
         * @instance
         */
        DDZInfo.prototype.superdoubleDiamond = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * DDZInfo calltimes.
         * @member {number} calltimes
         * @memberof client_proto_ddz.DDZInfo
         * @instance
         */
        DDZInfo.prototype.calltimes = 0;

        /**
         * Creates a new DDZInfo instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZInfo
         * @static
         * @param {client_proto_ddz.IDDZInfo=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZInfo} DDZInfo instance
         */
        DDZInfo.create = function create(properties) {
            return new DDZInfo(properties);
        };

        /**
         * Encodes the specified DDZInfo message. Does not implicitly {@link client_proto_ddz.DDZInfo.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZInfo
         * @static
         * @param {client_proto_ddz.IDDZInfo} message DDZInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.score != null && Object.hasOwnProperty.call(message, "score"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.score);
            if (message.maxTimes != null && Object.hasOwnProperty.call(message, "maxTimes"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.maxTimes);
            if (message.trusteeshipRound != null && Object.hasOwnProperty.call(message, "trusteeshipRound"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.trusteeshipRound);
            if (message.showtimes != null && Object.hasOwnProperty.call(message, "showtimes"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.showtimes);
            if (message.doubletimes != null && Object.hasOwnProperty.call(message, "doubletimes"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.doubletimes);
            if (message.superdoubletimes != null && Object.hasOwnProperty.call(message, "superdoubletimes"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.superdoubletimes);
            if (message.superdoubleDiamond != null && Object.hasOwnProperty.call(message, "superdoubleDiamond"))
                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.superdoubleDiamond);
            if (message.calltimes != null && Object.hasOwnProperty.call(message, "calltimes"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.calltimes);
            return writer;
        };

        /**
         * Encodes the specified DDZInfo message, length delimited. Does not implicitly {@link client_proto_ddz.DDZInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZInfo
         * @static
         * @param {client_proto_ddz.IDDZInfo} message DDZInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZInfo message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZInfo} DDZInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.score = reader.int64();
                        break;
                    }
                case 2: {
                        message.maxTimes = reader.int32();
                        break;
                    }
                case 3: {
                        message.trusteeshipRound = reader.int32();
                        break;
                    }
                case 4: {
                        message.showtimes = reader.int32();
                        break;
                    }
                case 5: {
                        message.doubletimes = reader.int32();
                        break;
                    }
                case 6: {
                        message.superdoubletimes = reader.int32();
                        break;
                    }
                case 7: {
                        message.superdoubleDiamond = reader.int64();
                        break;
                    }
                case 8: {
                        message.calltimes = reader.int32();
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
         * Decodes a DDZInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZInfo} DDZInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZInfo message.
         * @function verify
         * @memberof client_proto_ddz.DDZInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.score != null && message.hasOwnProperty("score"))
                if (!$util.isInteger(message.score) && !(message.score && $util.isInteger(message.score.low) && $util.isInteger(message.score.high)))
                    return "score: integer|Long expected";
            if (message.maxTimes != null && message.hasOwnProperty("maxTimes"))
                if (!$util.isInteger(message.maxTimes))
                    return "maxTimes: integer expected";
            if (message.trusteeshipRound != null && message.hasOwnProperty("trusteeshipRound"))
                if (!$util.isInteger(message.trusteeshipRound))
                    return "trusteeshipRound: integer expected";
            if (message.showtimes != null && message.hasOwnProperty("showtimes"))
                if (!$util.isInteger(message.showtimes))
                    return "showtimes: integer expected";
            if (message.doubletimes != null && message.hasOwnProperty("doubletimes"))
                if (!$util.isInteger(message.doubletimes))
                    return "doubletimes: integer expected";
            if (message.superdoubletimes != null && message.hasOwnProperty("superdoubletimes"))
                if (!$util.isInteger(message.superdoubletimes))
                    return "superdoubletimes: integer expected";
            if (message.superdoubleDiamond != null && message.hasOwnProperty("superdoubleDiamond"))
                if (!$util.isInteger(message.superdoubleDiamond) && !(message.superdoubleDiamond && $util.isInteger(message.superdoubleDiamond.low) && $util.isInteger(message.superdoubleDiamond.high)))
                    return "superdoubleDiamond: integer|Long expected";
            if (message.calltimes != null && message.hasOwnProperty("calltimes"))
                if (!$util.isInteger(message.calltimes))
                    return "calltimes: integer expected";
            return null;
        };

        /**
         * Creates a DDZInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZInfo} DDZInfo
         */
        DDZInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZInfo)
                return object;
            var message = new $root.client_proto_ddz.DDZInfo();
            if (object.score != null)
                if ($util.Long)
                    (message.score = $util.Long.fromValue(object.score)).unsigned = false;
                else if (typeof object.score === "string")
                    message.score = parseInt(object.score, 10);
                else if (typeof object.score === "number")
                    message.score = object.score;
                else if (typeof object.score === "object")
                    message.score = new $util.LongBits(object.score.low >>> 0, object.score.high >>> 0).toNumber();
            if (object.maxTimes != null)
                message.maxTimes = object.maxTimes | 0;
            if (object.trusteeshipRound != null)
                message.trusteeshipRound = object.trusteeshipRound | 0;
            if (object.showtimes != null)
                message.showtimes = object.showtimes | 0;
            if (object.doubletimes != null)
                message.doubletimes = object.doubletimes | 0;
            if (object.superdoubletimes != null)
                message.superdoubletimes = object.superdoubletimes | 0;
            if (object.superdoubleDiamond != null)
                if ($util.Long)
                    (message.superdoubleDiamond = $util.Long.fromValue(object.superdoubleDiamond)).unsigned = false;
                else if (typeof object.superdoubleDiamond === "string")
                    message.superdoubleDiamond = parseInt(object.superdoubleDiamond, 10);
                else if (typeof object.superdoubleDiamond === "number")
                    message.superdoubleDiamond = object.superdoubleDiamond;
                else if (typeof object.superdoubleDiamond === "object")
                    message.superdoubleDiamond = new $util.LongBits(object.superdoubleDiamond.low >>> 0, object.superdoubleDiamond.high >>> 0).toNumber();
            if (object.calltimes != null)
                message.calltimes = object.calltimes | 0;
            return message;
        };

        /**
         * Creates a plain object from a DDZInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZInfo
         * @static
         * @param {client_proto_ddz.DDZInfo} message DDZInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.score = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.score = options.longs === String ? "0" : 0;
                object.maxTimes = 0;
                object.trusteeshipRound = 0;
                object.showtimes = 0;
                object.doubletimes = 0;
                object.superdoubletimes = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.superdoubleDiamond = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.superdoubleDiamond = options.longs === String ? "0" : 0;
                object.calltimes = 0;
            }
            if (message.score != null && message.hasOwnProperty("score"))
                if (typeof message.score === "number")
                    object.score = options.longs === String ? String(message.score) : message.score;
                else
                    object.score = options.longs === String ? $util.Long.prototype.toString.call(message.score) : options.longs === Number ? new $util.LongBits(message.score.low >>> 0, message.score.high >>> 0).toNumber() : message.score;
            if (message.maxTimes != null && message.hasOwnProperty("maxTimes"))
                object.maxTimes = message.maxTimes;
            if (message.trusteeshipRound != null && message.hasOwnProperty("trusteeshipRound"))
                object.trusteeshipRound = message.trusteeshipRound;
            if (message.showtimes != null && message.hasOwnProperty("showtimes"))
                object.showtimes = message.showtimes;
            if (message.doubletimes != null && message.hasOwnProperty("doubletimes"))
                object.doubletimes = message.doubletimes;
            if (message.superdoubletimes != null && message.hasOwnProperty("superdoubletimes"))
                object.superdoubletimes = message.superdoubletimes;
            if (message.superdoubleDiamond != null && message.hasOwnProperty("superdoubleDiamond"))
                if (typeof message.superdoubleDiamond === "number")
                    object.superdoubleDiamond = options.longs === String ? String(message.superdoubleDiamond) : message.superdoubleDiamond;
                else
                    object.superdoubleDiamond = options.longs === String ? $util.Long.prototype.toString.call(message.superdoubleDiamond) : options.longs === Number ? new $util.LongBits(message.superdoubleDiamond.low >>> 0, message.superdoubleDiamond.high >>> 0).toNumber() : message.superdoubleDiamond;
            if (message.calltimes != null && message.hasOwnProperty("calltimes"))
                object.calltimes = message.calltimes;
            return object;
        };

        /**
         * Converts this DDZInfo to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZInfo
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZInfo";
        };

        return DDZInfo;
    })();

    client_proto_ddz.DDZ_S_UserEnter = (function() {

        /**
         * Properties of a DDZ_S_UserEnter.
         * @memberof client_proto_ddz
         * @interface IDDZ_S_UserEnter
         * @property {client_proto_ddz.IDDZInfo|null} [gameInfo] DDZ_S_UserEnter gameInfo
         */

        /**
         * Constructs a new DDZ_S_UserEnter.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_S_UserEnter.
         * @implements IDDZ_S_UserEnter
         * @constructor
         * @param {client_proto_ddz.IDDZ_S_UserEnter=} [properties] Properties to set
         */
        function DDZ_S_UserEnter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_S_UserEnter gameInfo.
         * @member {client_proto_ddz.IDDZInfo|null|undefined} gameInfo
         * @memberof client_proto_ddz.DDZ_S_UserEnter
         * @instance
         */
        DDZ_S_UserEnter.prototype.gameInfo = null;

        /**
         * Creates a new DDZ_S_UserEnter instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_S_UserEnter
         * @static
         * @param {client_proto_ddz.IDDZ_S_UserEnter=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_S_UserEnter} DDZ_S_UserEnter instance
         */
        DDZ_S_UserEnter.create = function create(properties) {
            return new DDZ_S_UserEnter(properties);
        };

        /**
         * Encodes the specified DDZ_S_UserEnter message. Does not implicitly {@link client_proto_ddz.DDZ_S_UserEnter.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_S_UserEnter
         * @static
         * @param {client_proto_ddz.IDDZ_S_UserEnter} message DDZ_S_UserEnter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_UserEnter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.gameInfo != null && Object.hasOwnProperty.call(message, "gameInfo"))
                $root.client_proto_ddz.DDZInfo.encode(message.gameInfo, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified DDZ_S_UserEnter message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_UserEnter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_S_UserEnter
         * @static
         * @param {client_proto_ddz.IDDZ_S_UserEnter} message DDZ_S_UserEnter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_UserEnter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_S_UserEnter message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_S_UserEnter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_S_UserEnter} DDZ_S_UserEnter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_UserEnter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_S_UserEnter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.gameInfo = $root.client_proto_ddz.DDZInfo.decode(reader, reader.uint32());
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
         * Decodes a DDZ_S_UserEnter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_S_UserEnter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_S_UserEnter} DDZ_S_UserEnter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_UserEnter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_S_UserEnter message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_S_UserEnter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_S_UserEnter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.gameInfo != null && message.hasOwnProperty("gameInfo")) {
                var error = $root.client_proto_ddz.DDZInfo.verify(message.gameInfo);
                if (error)
                    return "gameInfo." + error;
            }
            return null;
        };

        /**
         * Creates a DDZ_S_UserEnter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_S_UserEnter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_S_UserEnter} DDZ_S_UserEnter
         */
        DDZ_S_UserEnter.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_S_UserEnter)
                return object;
            var message = new $root.client_proto_ddz.DDZ_S_UserEnter();
            if (object.gameInfo != null) {
                if (typeof object.gameInfo !== "object")
                    throw TypeError(".client_proto_ddz.DDZ_S_UserEnter.gameInfo: object expected");
                message.gameInfo = $root.client_proto_ddz.DDZInfo.fromObject(object.gameInfo);
            }
            return message;
        };

        /**
         * Creates a plain object from a DDZ_S_UserEnter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_S_UserEnter
         * @static
         * @param {client_proto_ddz.DDZ_S_UserEnter} message DDZ_S_UserEnter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_S_UserEnter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.gameInfo = null;
            if (message.gameInfo != null && message.hasOwnProperty("gameInfo"))
                object.gameInfo = $root.client_proto_ddz.DDZInfo.toObject(message.gameInfo, options);
            return object;
        };

        /**
         * Converts this DDZ_S_UserEnter to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_S_UserEnter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_S_UserEnter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_S_UserEnter
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_S_UserEnter
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_S_UserEnter.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_S_UserEnter";
        };

        return DDZ_S_UserEnter;
    })();

    client_proto_ddz.DDZ_S_Tips = (function() {

        /**
         * Properties of a DDZ_S_Tips.
         * @memberof client_proto_ddz
         * @interface IDDZ_S_Tips
         * @property {number|null} [type] DDZ_S_Tips type
         * @property {number|null} [countdown] DDZ_S_Tips countdown
         * @property {number|null} [curchair] DDZ_S_Tips curchair
         * @property {boolean|null} [bFirst] DDZ_S_Tips bFirst
         */

        /**
         * Constructs a new DDZ_S_Tips.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_S_Tips.
         * @implements IDDZ_S_Tips
         * @constructor
         * @param {client_proto_ddz.IDDZ_S_Tips=} [properties] Properties to set
         */
        function DDZ_S_Tips(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_S_Tips type.
         * @member {number} type
         * @memberof client_proto_ddz.DDZ_S_Tips
         * @instance
         */
        DDZ_S_Tips.prototype.type = 0;

        /**
         * DDZ_S_Tips countdown.
         * @member {number} countdown
         * @memberof client_proto_ddz.DDZ_S_Tips
         * @instance
         */
        DDZ_S_Tips.prototype.countdown = 0;

        /**
         * DDZ_S_Tips curchair.
         * @member {number} curchair
         * @memberof client_proto_ddz.DDZ_S_Tips
         * @instance
         */
        DDZ_S_Tips.prototype.curchair = 0;

        /**
         * DDZ_S_Tips bFirst.
         * @member {boolean} bFirst
         * @memberof client_proto_ddz.DDZ_S_Tips
         * @instance
         */
        DDZ_S_Tips.prototype.bFirst = false;

        /**
         * Creates a new DDZ_S_Tips instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_S_Tips
         * @static
         * @param {client_proto_ddz.IDDZ_S_Tips=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_S_Tips} DDZ_S_Tips instance
         */
        DDZ_S_Tips.create = function create(properties) {
            return new DDZ_S_Tips(properties);
        };

        /**
         * Encodes the specified DDZ_S_Tips message. Does not implicitly {@link client_proto_ddz.DDZ_S_Tips.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_S_Tips
         * @static
         * @param {client_proto_ddz.IDDZ_S_Tips} message DDZ_S_Tips message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_Tips.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.countdown != null && Object.hasOwnProperty.call(message, "countdown"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.countdown);
            if (message.curchair != null && Object.hasOwnProperty.call(message, "curchair"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.curchair);
            if (message.bFirst != null && Object.hasOwnProperty.call(message, "bFirst"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.bFirst);
            return writer;
        };

        /**
         * Encodes the specified DDZ_S_Tips message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_Tips.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_S_Tips
         * @static
         * @param {client_proto_ddz.IDDZ_S_Tips} message DDZ_S_Tips message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_Tips.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_S_Tips message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_S_Tips
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_S_Tips} DDZ_S_Tips
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_Tips.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_S_Tips();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.type = reader.int32();
                        break;
                    }
                case 2: {
                        message.countdown = reader.int32();
                        break;
                    }
                case 3: {
                        message.curchair = reader.int32();
                        break;
                    }
                case 4: {
                        message.bFirst = reader.bool();
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
         * Decodes a DDZ_S_Tips message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_S_Tips
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_S_Tips} DDZ_S_Tips
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_Tips.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_S_Tips message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_S_Tips
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_S_Tips.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isInteger(message.type))
                    return "type: integer expected";
            if (message.countdown != null && message.hasOwnProperty("countdown"))
                if (!$util.isInteger(message.countdown))
                    return "countdown: integer expected";
            if (message.curchair != null && message.hasOwnProperty("curchair"))
                if (!$util.isInteger(message.curchair))
                    return "curchair: integer expected";
            if (message.bFirst != null && message.hasOwnProperty("bFirst"))
                if (typeof message.bFirst !== "boolean")
                    return "bFirst: boolean expected";
            return null;
        };

        /**
         * Creates a DDZ_S_Tips message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_S_Tips
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_S_Tips} DDZ_S_Tips
         */
        DDZ_S_Tips.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_S_Tips)
                return object;
            var message = new $root.client_proto_ddz.DDZ_S_Tips();
            if (object.type != null)
                message.type = object.type | 0;
            if (object.countdown != null)
                message.countdown = object.countdown | 0;
            if (object.curchair != null)
                message.curchair = object.curchair | 0;
            if (object.bFirst != null)
                message.bFirst = Boolean(object.bFirst);
            return message;
        };

        /**
         * Creates a plain object from a DDZ_S_Tips message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_S_Tips
         * @static
         * @param {client_proto_ddz.DDZ_S_Tips} message DDZ_S_Tips
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_S_Tips.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.type = 0;
                object.countdown = 0;
                object.curchair = 0;
                object.bFirst = false;
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.countdown != null && message.hasOwnProperty("countdown"))
                object.countdown = message.countdown;
            if (message.curchair != null && message.hasOwnProperty("curchair"))
                object.curchair = message.curchair;
            if (message.bFirst != null && message.hasOwnProperty("bFirst"))
                object.bFirst = message.bFirst;
            return object;
        };

        /**
         * Converts this DDZ_S_Tips to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_S_Tips
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_S_Tips.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_S_Tips
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_S_Tips
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_S_Tips.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_S_Tips";
        };

        return DDZ_S_Tips;
    })();

    client_proto_ddz.DDZ_S_SendCard = (function() {

        /**
         * Properties of a DDZ_S_SendCard.
         * @memberof client_proto_ddz
         * @interface IDDZ_S_SendCard
         * @property {Array.<number>|null} [sendcards] DDZ_S_SendCard sendcards
         */

        /**
         * Constructs a new DDZ_S_SendCard.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_S_SendCard.
         * @implements IDDZ_S_SendCard
         * @constructor
         * @param {client_proto_ddz.IDDZ_S_SendCard=} [properties] Properties to set
         */
        function DDZ_S_SendCard(properties) {
            this.sendcards = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_S_SendCard sendcards.
         * @member {Array.<number>} sendcards
         * @memberof client_proto_ddz.DDZ_S_SendCard
         * @instance
         */
        DDZ_S_SendCard.prototype.sendcards = $util.emptyArray;

        /**
         * Creates a new DDZ_S_SendCard instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_S_SendCard
         * @static
         * @param {client_proto_ddz.IDDZ_S_SendCard=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_S_SendCard} DDZ_S_SendCard instance
         */
        DDZ_S_SendCard.create = function create(properties) {
            return new DDZ_S_SendCard(properties);
        };

        /**
         * Encodes the specified DDZ_S_SendCard message. Does not implicitly {@link client_proto_ddz.DDZ_S_SendCard.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_S_SendCard
         * @static
         * @param {client_proto_ddz.IDDZ_S_SendCard} message DDZ_S_SendCard message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_SendCard.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sendcards != null && message.sendcards.length) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork();
                for (var i = 0; i < message.sendcards.length; ++i)
                    writer.int32(message.sendcards[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified DDZ_S_SendCard message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_SendCard.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_S_SendCard
         * @static
         * @param {client_proto_ddz.IDDZ_S_SendCard} message DDZ_S_SendCard message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_SendCard.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_S_SendCard message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_S_SendCard
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_S_SendCard} DDZ_S_SendCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_SendCard.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_S_SendCard();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.sendcards && message.sendcards.length))
                            message.sendcards = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.sendcards.push(reader.int32());
                        } else
                            message.sendcards.push(reader.int32());
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
         * Decodes a DDZ_S_SendCard message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_S_SendCard
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_S_SendCard} DDZ_S_SendCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_SendCard.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_S_SendCard message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_S_SendCard
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_S_SendCard.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sendcards != null && message.hasOwnProperty("sendcards")) {
                if (!Array.isArray(message.sendcards))
                    return "sendcards: array expected";
                for (var i = 0; i < message.sendcards.length; ++i)
                    if (!$util.isInteger(message.sendcards[i]))
                        return "sendcards: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a DDZ_S_SendCard message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_S_SendCard
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_S_SendCard} DDZ_S_SendCard
         */
        DDZ_S_SendCard.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_S_SendCard)
                return object;
            var message = new $root.client_proto_ddz.DDZ_S_SendCard();
            if (object.sendcards) {
                if (!Array.isArray(object.sendcards))
                    throw TypeError(".client_proto_ddz.DDZ_S_SendCard.sendcards: array expected");
                message.sendcards = [];
                for (var i = 0; i < object.sendcards.length; ++i)
                    message.sendcards[i] = object.sendcards[i] | 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a DDZ_S_SendCard message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_S_SendCard
         * @static
         * @param {client_proto_ddz.DDZ_S_SendCard} message DDZ_S_SendCard
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_S_SendCard.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.sendcards = [];
            if (message.sendcards && message.sendcards.length) {
                object.sendcards = [];
                for (var j = 0; j < message.sendcards.length; ++j)
                    object.sendcards[j] = message.sendcards[j];
            }
            return object;
        };

        /**
         * Converts this DDZ_S_SendCard to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_S_SendCard
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_S_SendCard.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_S_SendCard
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_S_SendCard
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_S_SendCard.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_S_SendCard";
        };

        return DDZ_S_SendCard;
    })();

    client_proto_ddz.DDZ_S_ShowCard = (function() {

        /**
         * Properties of a DDZ_S_ShowCard.
         * @memberof client_proto_ddz
         * @interface IDDZ_S_ShowCard
         * @property {number|null} [showchair] DDZ_S_ShowCard showchair
         * @property {Array.<number>|null} [showcards] DDZ_S_ShowCard showcards
         * @property {number|null} [toptimes] DDZ_S_ShowCard toptimes
         */

        /**
         * Constructs a new DDZ_S_ShowCard.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_S_ShowCard.
         * @implements IDDZ_S_ShowCard
         * @constructor
         * @param {client_proto_ddz.IDDZ_S_ShowCard=} [properties] Properties to set
         */
        function DDZ_S_ShowCard(properties) {
            this.showcards = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_S_ShowCard showchair.
         * @member {number} showchair
         * @memberof client_proto_ddz.DDZ_S_ShowCard
         * @instance
         */
        DDZ_S_ShowCard.prototype.showchair = 0;

        /**
         * DDZ_S_ShowCard showcards.
         * @member {Array.<number>} showcards
         * @memberof client_proto_ddz.DDZ_S_ShowCard
         * @instance
         */
        DDZ_S_ShowCard.prototype.showcards = $util.emptyArray;

        /**
         * DDZ_S_ShowCard toptimes.
         * @member {number} toptimes
         * @memberof client_proto_ddz.DDZ_S_ShowCard
         * @instance
         */
        DDZ_S_ShowCard.prototype.toptimes = 0;

        /**
         * Creates a new DDZ_S_ShowCard instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_S_ShowCard
         * @static
         * @param {client_proto_ddz.IDDZ_S_ShowCard=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_S_ShowCard} DDZ_S_ShowCard instance
         */
        DDZ_S_ShowCard.create = function create(properties) {
            return new DDZ_S_ShowCard(properties);
        };

        /**
         * Encodes the specified DDZ_S_ShowCard message. Does not implicitly {@link client_proto_ddz.DDZ_S_ShowCard.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_S_ShowCard
         * @static
         * @param {client_proto_ddz.IDDZ_S_ShowCard} message DDZ_S_ShowCard message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_ShowCard.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.showchair != null && Object.hasOwnProperty.call(message, "showchair"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.showchair);
            if (message.showcards != null && message.showcards.length) {
                writer.uint32(/* id 2, wireType 2 =*/18).fork();
                for (var i = 0; i < message.showcards.length; ++i)
                    writer.int32(message.showcards[i]);
                writer.ldelim();
            }
            if (message.toptimes != null && Object.hasOwnProperty.call(message, "toptimes"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.toptimes);
            return writer;
        };

        /**
         * Encodes the specified DDZ_S_ShowCard message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_ShowCard.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_S_ShowCard
         * @static
         * @param {client_proto_ddz.IDDZ_S_ShowCard} message DDZ_S_ShowCard message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_ShowCard.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_S_ShowCard message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_S_ShowCard
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_S_ShowCard} DDZ_S_ShowCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_ShowCard.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_S_ShowCard();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.showchair = reader.int32();
                        break;
                    }
                case 2: {
                        if (!(message.showcards && message.showcards.length))
                            message.showcards = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.showcards.push(reader.int32());
                        } else
                            message.showcards.push(reader.int32());
                        break;
                    }
                case 3: {
                        message.toptimes = reader.int32();
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
         * Decodes a DDZ_S_ShowCard message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_S_ShowCard
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_S_ShowCard} DDZ_S_ShowCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_ShowCard.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_S_ShowCard message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_S_ShowCard
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_S_ShowCard.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.showchair != null && message.hasOwnProperty("showchair"))
                if (!$util.isInteger(message.showchair))
                    return "showchair: integer expected";
            if (message.showcards != null && message.hasOwnProperty("showcards")) {
                if (!Array.isArray(message.showcards))
                    return "showcards: array expected";
                for (var i = 0; i < message.showcards.length; ++i)
                    if (!$util.isInteger(message.showcards[i]))
                        return "showcards: integer[] expected";
            }
            if (message.toptimes != null && message.hasOwnProperty("toptimes"))
                if (!$util.isInteger(message.toptimes))
                    return "toptimes: integer expected";
            return null;
        };

        /**
         * Creates a DDZ_S_ShowCard message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_S_ShowCard
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_S_ShowCard} DDZ_S_ShowCard
         */
        DDZ_S_ShowCard.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_S_ShowCard)
                return object;
            var message = new $root.client_proto_ddz.DDZ_S_ShowCard();
            if (object.showchair != null)
                message.showchair = object.showchair | 0;
            if (object.showcards) {
                if (!Array.isArray(object.showcards))
                    throw TypeError(".client_proto_ddz.DDZ_S_ShowCard.showcards: array expected");
                message.showcards = [];
                for (var i = 0; i < object.showcards.length; ++i)
                    message.showcards[i] = object.showcards[i] | 0;
            }
            if (object.toptimes != null)
                message.toptimes = object.toptimes | 0;
            return message;
        };

        /**
         * Creates a plain object from a DDZ_S_ShowCard message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_S_ShowCard
         * @static
         * @param {client_proto_ddz.DDZ_S_ShowCard} message DDZ_S_ShowCard
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_S_ShowCard.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.showcards = [];
            if (options.defaults) {
                object.showchair = 0;
                object.toptimes = 0;
            }
            if (message.showchair != null && message.hasOwnProperty("showchair"))
                object.showchair = message.showchair;
            if (message.showcards && message.showcards.length) {
                object.showcards = [];
                for (var j = 0; j < message.showcards.length; ++j)
                    object.showcards[j] = message.showcards[j];
            }
            if (message.toptimes != null && message.hasOwnProperty("toptimes"))
                object.toptimes = message.toptimes;
            return object;
        };

        /**
         * Converts this DDZ_S_ShowCard to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_S_ShowCard
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_S_ShowCard.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_S_ShowCard
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_S_ShowCard
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_S_ShowCard.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_S_ShowCard";
        };

        return DDZ_S_ShowCard;
    })();

    client_proto_ddz.DDZ_S_CallPoint = (function() {

        /**
         * Properties of a DDZ_S_CallPoint.
         * @memberof client_proto_ddz
         * @interface IDDZ_S_CallPoint
         * @property {number|null} [callchair] DDZ_S_CallPoint callchair
         * @property {number|null} [callcode] DDZ_S_CallPoint callcode
         * @property {number|null} [toppoint] DDZ_S_CallPoint toppoint
         * @property {number|null} [toptimes] DDZ_S_CallPoint toptimes
         */

        /**
         * Constructs a new DDZ_S_CallPoint.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_S_CallPoint.
         * @implements IDDZ_S_CallPoint
         * @constructor
         * @param {client_proto_ddz.IDDZ_S_CallPoint=} [properties] Properties to set
         */
        function DDZ_S_CallPoint(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_S_CallPoint callchair.
         * @member {number} callchair
         * @memberof client_proto_ddz.DDZ_S_CallPoint
         * @instance
         */
        DDZ_S_CallPoint.prototype.callchair = 0;

        /**
         * DDZ_S_CallPoint callcode.
         * @member {number} callcode
         * @memberof client_proto_ddz.DDZ_S_CallPoint
         * @instance
         */
        DDZ_S_CallPoint.prototype.callcode = 0;

        /**
         * DDZ_S_CallPoint toppoint.
         * @member {number} toppoint
         * @memberof client_proto_ddz.DDZ_S_CallPoint
         * @instance
         */
        DDZ_S_CallPoint.prototype.toppoint = 0;

        /**
         * DDZ_S_CallPoint toptimes.
         * @member {number} toptimes
         * @memberof client_proto_ddz.DDZ_S_CallPoint
         * @instance
         */
        DDZ_S_CallPoint.prototype.toptimes = 0;

        /**
         * Creates a new DDZ_S_CallPoint instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_S_CallPoint
         * @static
         * @param {client_proto_ddz.IDDZ_S_CallPoint=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_S_CallPoint} DDZ_S_CallPoint instance
         */
        DDZ_S_CallPoint.create = function create(properties) {
            return new DDZ_S_CallPoint(properties);
        };

        /**
         * Encodes the specified DDZ_S_CallPoint message. Does not implicitly {@link client_proto_ddz.DDZ_S_CallPoint.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_S_CallPoint
         * @static
         * @param {client_proto_ddz.IDDZ_S_CallPoint} message DDZ_S_CallPoint message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_CallPoint.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.callchair != null && Object.hasOwnProperty.call(message, "callchair"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.callchair);
            if (message.callcode != null && Object.hasOwnProperty.call(message, "callcode"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.callcode);
            if (message.toppoint != null && Object.hasOwnProperty.call(message, "toppoint"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.toppoint);
            if (message.toptimes != null && Object.hasOwnProperty.call(message, "toptimes"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.toptimes);
            return writer;
        };

        /**
         * Encodes the specified DDZ_S_CallPoint message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_CallPoint.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_S_CallPoint
         * @static
         * @param {client_proto_ddz.IDDZ_S_CallPoint} message DDZ_S_CallPoint message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_CallPoint.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_S_CallPoint message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_S_CallPoint
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_S_CallPoint} DDZ_S_CallPoint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_CallPoint.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_S_CallPoint();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.callchair = reader.int32();
                        break;
                    }
                case 2: {
                        message.callcode = reader.int32();
                        break;
                    }
                case 3: {
                        message.toppoint = reader.int32();
                        break;
                    }
                case 4: {
                        message.toptimes = reader.int32();
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
         * Decodes a DDZ_S_CallPoint message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_S_CallPoint
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_S_CallPoint} DDZ_S_CallPoint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_CallPoint.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_S_CallPoint message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_S_CallPoint
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_S_CallPoint.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.callchair != null && message.hasOwnProperty("callchair"))
                if (!$util.isInteger(message.callchair))
                    return "callchair: integer expected";
            if (message.callcode != null && message.hasOwnProperty("callcode"))
                if (!$util.isInteger(message.callcode))
                    return "callcode: integer expected";
            if (message.toppoint != null && message.hasOwnProperty("toppoint"))
                if (!$util.isInteger(message.toppoint))
                    return "toppoint: integer expected";
            if (message.toptimes != null && message.hasOwnProperty("toptimes"))
                if (!$util.isInteger(message.toptimes))
                    return "toptimes: integer expected";
            return null;
        };

        /**
         * Creates a DDZ_S_CallPoint message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_S_CallPoint
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_S_CallPoint} DDZ_S_CallPoint
         */
        DDZ_S_CallPoint.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_S_CallPoint)
                return object;
            var message = new $root.client_proto_ddz.DDZ_S_CallPoint();
            if (object.callchair != null)
                message.callchair = object.callchair | 0;
            if (object.callcode != null)
                message.callcode = object.callcode | 0;
            if (object.toppoint != null)
                message.toppoint = object.toppoint | 0;
            if (object.toptimes != null)
                message.toptimes = object.toptimes | 0;
            return message;
        };

        /**
         * Creates a plain object from a DDZ_S_CallPoint message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_S_CallPoint
         * @static
         * @param {client_proto_ddz.DDZ_S_CallPoint} message DDZ_S_CallPoint
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_S_CallPoint.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.callchair = 0;
                object.callcode = 0;
                object.toppoint = 0;
                object.toptimes = 0;
            }
            if (message.callchair != null && message.hasOwnProperty("callchair"))
                object.callchair = message.callchair;
            if (message.callcode != null && message.hasOwnProperty("callcode"))
                object.callcode = message.callcode;
            if (message.toppoint != null && message.hasOwnProperty("toppoint"))
                object.toppoint = message.toppoint;
            if (message.toptimes != null && message.hasOwnProperty("toptimes"))
                object.toptimes = message.toptimes;
            return object;
        };

        /**
         * Converts this DDZ_S_CallPoint to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_S_CallPoint
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_S_CallPoint.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_S_CallPoint
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_S_CallPoint
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_S_CallPoint.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_S_CallPoint";
        };

        return DDZ_S_CallPoint;
    })();

    client_proto_ddz.DDZ_S_CallEnd = (function() {

        /**
         * Properties of a DDZ_S_CallEnd.
         * @memberof client_proto_ddz
         * @interface IDDZ_S_CallEnd
         * @property {number|null} [bankerchair] DDZ_S_CallEnd bankerchair
         * @property {Array.<number>|null} [backcards] DDZ_S_CallEnd backcards
         * @property {number|null} [backtimes] DDZ_S_CallEnd backtimes
         */

        /**
         * Constructs a new DDZ_S_CallEnd.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_S_CallEnd.
         * @implements IDDZ_S_CallEnd
         * @constructor
         * @param {client_proto_ddz.IDDZ_S_CallEnd=} [properties] Properties to set
         */
        function DDZ_S_CallEnd(properties) {
            this.backcards = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_S_CallEnd bankerchair.
         * @member {number} bankerchair
         * @memberof client_proto_ddz.DDZ_S_CallEnd
         * @instance
         */
        DDZ_S_CallEnd.prototype.bankerchair = 0;

        /**
         * DDZ_S_CallEnd backcards.
         * @member {Array.<number>} backcards
         * @memberof client_proto_ddz.DDZ_S_CallEnd
         * @instance
         */
        DDZ_S_CallEnd.prototype.backcards = $util.emptyArray;

        /**
         * DDZ_S_CallEnd backtimes.
         * @member {number} backtimes
         * @memberof client_proto_ddz.DDZ_S_CallEnd
         * @instance
         */
        DDZ_S_CallEnd.prototype.backtimes = 0;

        /**
         * Creates a new DDZ_S_CallEnd instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_S_CallEnd
         * @static
         * @param {client_proto_ddz.IDDZ_S_CallEnd=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_S_CallEnd} DDZ_S_CallEnd instance
         */
        DDZ_S_CallEnd.create = function create(properties) {
            return new DDZ_S_CallEnd(properties);
        };

        /**
         * Encodes the specified DDZ_S_CallEnd message. Does not implicitly {@link client_proto_ddz.DDZ_S_CallEnd.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_S_CallEnd
         * @static
         * @param {client_proto_ddz.IDDZ_S_CallEnd} message DDZ_S_CallEnd message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_CallEnd.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.bankerchair != null && Object.hasOwnProperty.call(message, "bankerchair"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.bankerchair);
            if (message.backcards != null && message.backcards.length) {
                writer.uint32(/* id 2, wireType 2 =*/18).fork();
                for (var i = 0; i < message.backcards.length; ++i)
                    writer.int32(message.backcards[i]);
                writer.ldelim();
            }
            if (message.backtimes != null && Object.hasOwnProperty.call(message, "backtimes"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.backtimes);
            return writer;
        };

        /**
         * Encodes the specified DDZ_S_CallEnd message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_CallEnd.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_S_CallEnd
         * @static
         * @param {client_proto_ddz.IDDZ_S_CallEnd} message DDZ_S_CallEnd message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_CallEnd.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_S_CallEnd message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_S_CallEnd
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_S_CallEnd} DDZ_S_CallEnd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_CallEnd.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_S_CallEnd();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.bankerchair = reader.int32();
                        break;
                    }
                case 2: {
                        if (!(message.backcards && message.backcards.length))
                            message.backcards = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.backcards.push(reader.int32());
                        } else
                            message.backcards.push(reader.int32());
                        break;
                    }
                case 3: {
                        message.backtimes = reader.int32();
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
         * Decodes a DDZ_S_CallEnd message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_S_CallEnd
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_S_CallEnd} DDZ_S_CallEnd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_CallEnd.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_S_CallEnd message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_S_CallEnd
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_S_CallEnd.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.bankerchair != null && message.hasOwnProperty("bankerchair"))
                if (!$util.isInteger(message.bankerchair))
                    return "bankerchair: integer expected";
            if (message.backcards != null && message.hasOwnProperty("backcards")) {
                if (!Array.isArray(message.backcards))
                    return "backcards: array expected";
                for (var i = 0; i < message.backcards.length; ++i)
                    if (!$util.isInteger(message.backcards[i]))
                        return "backcards: integer[] expected";
            }
            if (message.backtimes != null && message.hasOwnProperty("backtimes"))
                if (!$util.isInteger(message.backtimes))
                    return "backtimes: integer expected";
            return null;
        };

        /**
         * Creates a DDZ_S_CallEnd message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_S_CallEnd
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_S_CallEnd} DDZ_S_CallEnd
         */
        DDZ_S_CallEnd.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_S_CallEnd)
                return object;
            var message = new $root.client_proto_ddz.DDZ_S_CallEnd();
            if (object.bankerchair != null)
                message.bankerchair = object.bankerchair | 0;
            if (object.backcards) {
                if (!Array.isArray(object.backcards))
                    throw TypeError(".client_proto_ddz.DDZ_S_CallEnd.backcards: array expected");
                message.backcards = [];
                for (var i = 0; i < object.backcards.length; ++i)
                    message.backcards[i] = object.backcards[i] | 0;
            }
            if (object.backtimes != null)
                message.backtimes = object.backtimes | 0;
            return message;
        };

        /**
         * Creates a plain object from a DDZ_S_CallEnd message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_S_CallEnd
         * @static
         * @param {client_proto_ddz.DDZ_S_CallEnd} message DDZ_S_CallEnd
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_S_CallEnd.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.backcards = [];
            if (options.defaults) {
                object.bankerchair = 0;
                object.backtimes = 0;
            }
            if (message.bankerchair != null && message.hasOwnProperty("bankerchair"))
                object.bankerchair = message.bankerchair;
            if (message.backcards && message.backcards.length) {
                object.backcards = [];
                for (var j = 0; j < message.backcards.length; ++j)
                    object.backcards[j] = message.backcards[j];
            }
            if (message.backtimes != null && message.hasOwnProperty("backtimes"))
                object.backtimes = message.backtimes;
            return object;
        };

        /**
         * Converts this DDZ_S_CallEnd to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_S_CallEnd
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_S_CallEnd.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_S_CallEnd
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_S_CallEnd
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_S_CallEnd.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_S_CallEnd";
        };

        return DDZ_S_CallEnd;
    })();

    client_proto_ddz.DDZ_S_Double = (function() {

        /**
         * Properties of a DDZ_S_Double.
         * @memberof client_proto_ddz
         * @interface IDDZ_S_Double
         * @property {number|null} [opechair] DDZ_S_Double opechair
         * @property {number|null} [opetimes] DDZ_S_Double opetimes
         * @property {number|null} [toptimes] DDZ_S_Double toptimes
         */

        /**
         * Constructs a new DDZ_S_Double.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_S_Double.
         * @implements IDDZ_S_Double
         * @constructor
         * @param {client_proto_ddz.IDDZ_S_Double=} [properties] Properties to set
         */
        function DDZ_S_Double(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_S_Double opechair.
         * @member {number} opechair
         * @memberof client_proto_ddz.DDZ_S_Double
         * @instance
         */
        DDZ_S_Double.prototype.opechair = 0;

        /**
         * DDZ_S_Double opetimes.
         * @member {number} opetimes
         * @memberof client_proto_ddz.DDZ_S_Double
         * @instance
         */
        DDZ_S_Double.prototype.opetimes = 0;

        /**
         * DDZ_S_Double toptimes.
         * @member {number} toptimes
         * @memberof client_proto_ddz.DDZ_S_Double
         * @instance
         */
        DDZ_S_Double.prototype.toptimes = 0;

        /**
         * Creates a new DDZ_S_Double instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_S_Double
         * @static
         * @param {client_proto_ddz.IDDZ_S_Double=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_S_Double} DDZ_S_Double instance
         */
        DDZ_S_Double.create = function create(properties) {
            return new DDZ_S_Double(properties);
        };

        /**
         * Encodes the specified DDZ_S_Double message. Does not implicitly {@link client_proto_ddz.DDZ_S_Double.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_S_Double
         * @static
         * @param {client_proto_ddz.IDDZ_S_Double} message DDZ_S_Double message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_Double.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.opechair != null && Object.hasOwnProperty.call(message, "opechair"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.opechair);
            if (message.opetimes != null && Object.hasOwnProperty.call(message, "opetimes"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.opetimes);
            if (message.toptimes != null && Object.hasOwnProperty.call(message, "toptimes"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.toptimes);
            return writer;
        };

        /**
         * Encodes the specified DDZ_S_Double message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_Double.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_S_Double
         * @static
         * @param {client_proto_ddz.IDDZ_S_Double} message DDZ_S_Double message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_Double.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_S_Double message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_S_Double
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_S_Double} DDZ_S_Double
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_Double.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_S_Double();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.opechair = reader.int32();
                        break;
                    }
                case 2: {
                        message.opetimes = reader.int32();
                        break;
                    }
                case 3: {
                        message.toptimes = reader.int32();
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
         * Decodes a DDZ_S_Double message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_S_Double
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_S_Double} DDZ_S_Double
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_Double.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_S_Double message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_S_Double
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_S_Double.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.opechair != null && message.hasOwnProperty("opechair"))
                if (!$util.isInteger(message.opechair))
                    return "opechair: integer expected";
            if (message.opetimes != null && message.hasOwnProperty("opetimes"))
                if (!$util.isInteger(message.opetimes))
                    return "opetimes: integer expected";
            if (message.toptimes != null && message.hasOwnProperty("toptimes"))
                if (!$util.isInteger(message.toptimes))
                    return "toptimes: integer expected";
            return null;
        };

        /**
         * Creates a DDZ_S_Double message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_S_Double
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_S_Double} DDZ_S_Double
         */
        DDZ_S_Double.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_S_Double)
                return object;
            var message = new $root.client_proto_ddz.DDZ_S_Double();
            if (object.opechair != null)
                message.opechair = object.opechair | 0;
            if (object.opetimes != null)
                message.opetimes = object.opetimes | 0;
            if (object.toptimes != null)
                message.toptimes = object.toptimes | 0;
            return message;
        };

        /**
         * Creates a plain object from a DDZ_S_Double message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_S_Double
         * @static
         * @param {client_proto_ddz.DDZ_S_Double} message DDZ_S_Double
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_S_Double.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.opechair = 0;
                object.opetimes = 0;
                object.toptimes = 0;
            }
            if (message.opechair != null && message.hasOwnProperty("opechair"))
                object.opechair = message.opechair;
            if (message.opetimes != null && message.hasOwnProperty("opetimes"))
                object.opetimes = message.opetimes;
            if (message.toptimes != null && message.hasOwnProperty("toptimes"))
                object.toptimes = message.toptimes;
            return object;
        };

        /**
         * Converts this DDZ_S_Double to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_S_Double
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_S_Double.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_S_Double
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_S_Double
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_S_Double.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_S_Double";
        };

        return DDZ_S_Double;
    })();

    client_proto_ddz.DDZ_S_OutCard = (function() {

        /**
         * Properties of a DDZ_S_OutCard.
         * @memberof client_proto_ddz
         * @interface IDDZ_S_OutCard
         * @property {number|null} [outchair] DDZ_S_OutCard outchair
         * @property {Array.<number>|null} [outcards] DDZ_S_OutCard outcards
         * @property {number|null} [cardtype] DDZ_S_OutCard cardtype
         * @property {number|null} [toptimes] DDZ_S_OutCard toptimes
         */

        /**
         * Constructs a new DDZ_S_OutCard.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_S_OutCard.
         * @implements IDDZ_S_OutCard
         * @constructor
         * @param {client_proto_ddz.IDDZ_S_OutCard=} [properties] Properties to set
         */
        function DDZ_S_OutCard(properties) {
            this.outcards = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_S_OutCard outchair.
         * @member {number} outchair
         * @memberof client_proto_ddz.DDZ_S_OutCard
         * @instance
         */
        DDZ_S_OutCard.prototype.outchair = 0;

        /**
         * DDZ_S_OutCard outcards.
         * @member {Array.<number>} outcards
         * @memberof client_proto_ddz.DDZ_S_OutCard
         * @instance
         */
        DDZ_S_OutCard.prototype.outcards = $util.emptyArray;

        /**
         * DDZ_S_OutCard cardtype.
         * @member {number} cardtype
         * @memberof client_proto_ddz.DDZ_S_OutCard
         * @instance
         */
        DDZ_S_OutCard.prototype.cardtype = 0;

        /**
         * DDZ_S_OutCard toptimes.
         * @member {number} toptimes
         * @memberof client_proto_ddz.DDZ_S_OutCard
         * @instance
         */
        DDZ_S_OutCard.prototype.toptimes = 0;

        /**
         * Creates a new DDZ_S_OutCard instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_S_OutCard
         * @static
         * @param {client_proto_ddz.IDDZ_S_OutCard=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_S_OutCard} DDZ_S_OutCard instance
         */
        DDZ_S_OutCard.create = function create(properties) {
            return new DDZ_S_OutCard(properties);
        };

        /**
         * Encodes the specified DDZ_S_OutCard message. Does not implicitly {@link client_proto_ddz.DDZ_S_OutCard.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_S_OutCard
         * @static
         * @param {client_proto_ddz.IDDZ_S_OutCard} message DDZ_S_OutCard message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_OutCard.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.outchair != null && Object.hasOwnProperty.call(message, "outchair"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.outchair);
            if (message.outcards != null && message.outcards.length) {
                writer.uint32(/* id 2, wireType 2 =*/18).fork();
                for (var i = 0; i < message.outcards.length; ++i)
                    writer.int32(message.outcards[i]);
                writer.ldelim();
            }
            if (message.cardtype != null && Object.hasOwnProperty.call(message, "cardtype"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.cardtype);
            if (message.toptimes != null && Object.hasOwnProperty.call(message, "toptimes"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.toptimes);
            return writer;
        };

        /**
         * Encodes the specified DDZ_S_OutCard message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_OutCard.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_S_OutCard
         * @static
         * @param {client_proto_ddz.IDDZ_S_OutCard} message DDZ_S_OutCard message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_OutCard.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_S_OutCard message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_S_OutCard
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_S_OutCard} DDZ_S_OutCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_OutCard.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_S_OutCard();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.outchair = reader.int32();
                        break;
                    }
                case 2: {
                        if (!(message.outcards && message.outcards.length))
                            message.outcards = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.outcards.push(reader.int32());
                        } else
                            message.outcards.push(reader.int32());
                        break;
                    }
                case 3: {
                        message.cardtype = reader.int32();
                        break;
                    }
                case 4: {
                        message.toptimes = reader.int32();
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
         * Decodes a DDZ_S_OutCard message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_S_OutCard
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_S_OutCard} DDZ_S_OutCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_OutCard.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_S_OutCard message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_S_OutCard
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_S_OutCard.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.outchair != null && message.hasOwnProperty("outchair"))
                if (!$util.isInteger(message.outchair))
                    return "outchair: integer expected";
            if (message.outcards != null && message.hasOwnProperty("outcards")) {
                if (!Array.isArray(message.outcards))
                    return "outcards: array expected";
                for (var i = 0; i < message.outcards.length; ++i)
                    if (!$util.isInteger(message.outcards[i]))
                        return "outcards: integer[] expected";
            }
            if (message.cardtype != null && message.hasOwnProperty("cardtype"))
                if (!$util.isInteger(message.cardtype))
                    return "cardtype: integer expected";
            if (message.toptimes != null && message.hasOwnProperty("toptimes"))
                if (!$util.isInteger(message.toptimes))
                    return "toptimes: integer expected";
            return null;
        };

        /**
         * Creates a DDZ_S_OutCard message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_S_OutCard
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_S_OutCard} DDZ_S_OutCard
         */
        DDZ_S_OutCard.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_S_OutCard)
                return object;
            var message = new $root.client_proto_ddz.DDZ_S_OutCard();
            if (object.outchair != null)
                message.outchair = object.outchair | 0;
            if (object.outcards) {
                if (!Array.isArray(object.outcards))
                    throw TypeError(".client_proto_ddz.DDZ_S_OutCard.outcards: array expected");
                message.outcards = [];
                for (var i = 0; i < object.outcards.length; ++i)
                    message.outcards[i] = object.outcards[i] | 0;
            }
            if (object.cardtype != null)
                message.cardtype = object.cardtype | 0;
            if (object.toptimes != null)
                message.toptimes = object.toptimes | 0;
            return message;
        };

        /**
         * Creates a plain object from a DDZ_S_OutCard message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_S_OutCard
         * @static
         * @param {client_proto_ddz.DDZ_S_OutCard} message DDZ_S_OutCard
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_S_OutCard.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.outcards = [];
            if (options.defaults) {
                object.outchair = 0;
                object.cardtype = 0;
                object.toptimes = 0;
            }
            if (message.outchair != null && message.hasOwnProperty("outchair"))
                object.outchair = message.outchair;
            if (message.outcards && message.outcards.length) {
                object.outcards = [];
                for (var j = 0; j < message.outcards.length; ++j)
                    object.outcards[j] = message.outcards[j];
            }
            if (message.cardtype != null && message.hasOwnProperty("cardtype"))
                object.cardtype = message.cardtype;
            if (message.toptimes != null && message.hasOwnProperty("toptimes"))
                object.toptimes = message.toptimes;
            return object;
        };

        /**
         * Converts this DDZ_S_OutCard to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_S_OutCard
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_S_OutCard.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_S_OutCard
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_S_OutCard
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_S_OutCard.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_S_OutCard";
        };

        return DDZ_S_OutCard;
    })();

    client_proto_ddz.DDZ_S_PassCard = (function() {

        /**
         * Properties of a DDZ_S_PassCard.
         * @memberof client_proto_ddz
         * @interface IDDZ_S_PassCard
         * @property {number|null} [passchair] DDZ_S_PassCard passchair
         */

        /**
         * Constructs a new DDZ_S_PassCard.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_S_PassCard.
         * @implements IDDZ_S_PassCard
         * @constructor
         * @param {client_proto_ddz.IDDZ_S_PassCard=} [properties] Properties to set
         */
        function DDZ_S_PassCard(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_S_PassCard passchair.
         * @member {number} passchair
         * @memberof client_proto_ddz.DDZ_S_PassCard
         * @instance
         */
        DDZ_S_PassCard.prototype.passchair = 0;

        /**
         * Creates a new DDZ_S_PassCard instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_S_PassCard
         * @static
         * @param {client_proto_ddz.IDDZ_S_PassCard=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_S_PassCard} DDZ_S_PassCard instance
         */
        DDZ_S_PassCard.create = function create(properties) {
            return new DDZ_S_PassCard(properties);
        };

        /**
         * Encodes the specified DDZ_S_PassCard message. Does not implicitly {@link client_proto_ddz.DDZ_S_PassCard.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_S_PassCard
         * @static
         * @param {client_proto_ddz.IDDZ_S_PassCard} message DDZ_S_PassCard message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_PassCard.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.passchair != null && Object.hasOwnProperty.call(message, "passchair"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.passchair);
            return writer;
        };

        /**
         * Encodes the specified DDZ_S_PassCard message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_PassCard.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_S_PassCard
         * @static
         * @param {client_proto_ddz.IDDZ_S_PassCard} message DDZ_S_PassCard message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_PassCard.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_S_PassCard message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_S_PassCard
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_S_PassCard} DDZ_S_PassCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_PassCard.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_S_PassCard();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.passchair = reader.int32();
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
         * Decodes a DDZ_S_PassCard message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_S_PassCard
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_S_PassCard} DDZ_S_PassCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_PassCard.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_S_PassCard message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_S_PassCard
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_S_PassCard.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.passchair != null && message.hasOwnProperty("passchair"))
                if (!$util.isInteger(message.passchair))
                    return "passchair: integer expected";
            return null;
        };

        /**
         * Creates a DDZ_S_PassCard message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_S_PassCard
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_S_PassCard} DDZ_S_PassCard
         */
        DDZ_S_PassCard.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_S_PassCard)
                return object;
            var message = new $root.client_proto_ddz.DDZ_S_PassCard();
            if (object.passchair != null)
                message.passchair = object.passchair | 0;
            return message;
        };

        /**
         * Creates a plain object from a DDZ_S_PassCard message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_S_PassCard
         * @static
         * @param {client_proto_ddz.DDZ_S_PassCard} message DDZ_S_PassCard
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_S_PassCard.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.passchair = 0;
            if (message.passchair != null && message.hasOwnProperty("passchair"))
                object.passchair = message.passchair;
            return object;
        };

        /**
         * Converts this DDZ_S_PassCard to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_S_PassCard
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_S_PassCard.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_S_PassCard
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_S_PassCard
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_S_PassCard.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_S_PassCard";
        };

        return DDZ_S_PassCard;
    })();

    client_proto_ddz.DDZ_S_UseMemory = (function() {

        /**
         * Properties of a DDZ_S_UseMemory.
         * @memberof client_proto_ddz
         * @interface IDDZ_S_UseMemory
         * @property {Array.<number>|null} [recordindex] DDZ_S_UseMemory recordindex
         */

        /**
         * Constructs a new DDZ_S_UseMemory.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_S_UseMemory.
         * @implements IDDZ_S_UseMemory
         * @constructor
         * @param {client_proto_ddz.IDDZ_S_UseMemory=} [properties] Properties to set
         */
        function DDZ_S_UseMemory(properties) {
            this.recordindex = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_S_UseMemory recordindex.
         * @member {Array.<number>} recordindex
         * @memberof client_proto_ddz.DDZ_S_UseMemory
         * @instance
         */
        DDZ_S_UseMemory.prototype.recordindex = $util.emptyArray;

        /**
         * Creates a new DDZ_S_UseMemory instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_S_UseMemory
         * @static
         * @param {client_proto_ddz.IDDZ_S_UseMemory=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_S_UseMemory} DDZ_S_UseMemory instance
         */
        DDZ_S_UseMemory.create = function create(properties) {
            return new DDZ_S_UseMemory(properties);
        };

        /**
         * Encodes the specified DDZ_S_UseMemory message. Does not implicitly {@link client_proto_ddz.DDZ_S_UseMemory.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_S_UseMemory
         * @static
         * @param {client_proto_ddz.IDDZ_S_UseMemory} message DDZ_S_UseMemory message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_UseMemory.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.recordindex != null && message.recordindex.length) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork();
                for (var i = 0; i < message.recordindex.length; ++i)
                    writer.int32(message.recordindex[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified DDZ_S_UseMemory message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_UseMemory.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_S_UseMemory
         * @static
         * @param {client_proto_ddz.IDDZ_S_UseMemory} message DDZ_S_UseMemory message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_UseMemory.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_S_UseMemory message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_S_UseMemory
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_S_UseMemory} DDZ_S_UseMemory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_UseMemory.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_S_UseMemory();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.recordindex && message.recordindex.length))
                            message.recordindex = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.recordindex.push(reader.int32());
                        } else
                            message.recordindex.push(reader.int32());
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
         * Decodes a DDZ_S_UseMemory message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_S_UseMemory
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_S_UseMemory} DDZ_S_UseMemory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_UseMemory.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_S_UseMemory message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_S_UseMemory
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_S_UseMemory.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.recordindex != null && message.hasOwnProperty("recordindex")) {
                if (!Array.isArray(message.recordindex))
                    return "recordindex: array expected";
                for (var i = 0; i < message.recordindex.length; ++i)
                    if (!$util.isInteger(message.recordindex[i]))
                        return "recordindex: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a DDZ_S_UseMemory message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_S_UseMemory
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_S_UseMemory} DDZ_S_UseMemory
         */
        DDZ_S_UseMemory.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_S_UseMemory)
                return object;
            var message = new $root.client_proto_ddz.DDZ_S_UseMemory();
            if (object.recordindex) {
                if (!Array.isArray(object.recordindex))
                    throw TypeError(".client_proto_ddz.DDZ_S_UseMemory.recordindex: array expected");
                message.recordindex = [];
                for (var i = 0; i < object.recordindex.length; ++i)
                    message.recordindex[i] = object.recordindex[i] | 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a DDZ_S_UseMemory message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_S_UseMemory
         * @static
         * @param {client_proto_ddz.DDZ_S_UseMemory} message DDZ_S_UseMemory
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_S_UseMemory.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.recordindex = [];
            if (message.recordindex && message.recordindex.length) {
                object.recordindex = [];
                for (var j = 0; j < message.recordindex.length; ++j)
                    object.recordindex[j] = message.recordindex[j];
            }
            return object;
        };

        /**
         * Converts this DDZ_S_UseMemory to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_S_UseMemory
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_S_UseMemory.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_S_UseMemory
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_S_UseMemory
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_S_UseMemory.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_S_UseMemory";
        };

        return DDZ_S_UseMemory;
    })();

    client_proto_ddz.DDZ_S_Trusteeship = (function() {

        /**
         * Properties of a DDZ_S_Trusteeship.
         * @memberof client_proto_ddz
         * @interface IDDZ_S_Trusteeship
         * @property {number|null} [chair] DDZ_S_Trusteeship chair
         * @property {boolean|null} [trusteeship] DDZ_S_Trusteeship trusteeship
         */

        /**
         * Constructs a new DDZ_S_Trusteeship.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_S_Trusteeship.
         * @implements IDDZ_S_Trusteeship
         * @constructor
         * @param {client_proto_ddz.IDDZ_S_Trusteeship=} [properties] Properties to set
         */
        function DDZ_S_Trusteeship(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_S_Trusteeship chair.
         * @member {number} chair
         * @memberof client_proto_ddz.DDZ_S_Trusteeship
         * @instance
         */
        DDZ_S_Trusteeship.prototype.chair = 0;

        /**
         * DDZ_S_Trusteeship trusteeship.
         * @member {boolean} trusteeship
         * @memberof client_proto_ddz.DDZ_S_Trusteeship
         * @instance
         */
        DDZ_S_Trusteeship.prototype.trusteeship = false;

        /**
         * Creates a new DDZ_S_Trusteeship instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_S_Trusteeship
         * @static
         * @param {client_proto_ddz.IDDZ_S_Trusteeship=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_S_Trusteeship} DDZ_S_Trusteeship instance
         */
        DDZ_S_Trusteeship.create = function create(properties) {
            return new DDZ_S_Trusteeship(properties);
        };

        /**
         * Encodes the specified DDZ_S_Trusteeship message. Does not implicitly {@link client_proto_ddz.DDZ_S_Trusteeship.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_S_Trusteeship
         * @static
         * @param {client_proto_ddz.IDDZ_S_Trusteeship} message DDZ_S_Trusteeship message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_Trusteeship.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.chair != null && Object.hasOwnProperty.call(message, "chair"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.chair);
            if (message.trusteeship != null && Object.hasOwnProperty.call(message, "trusteeship"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.trusteeship);
            return writer;
        };

        /**
         * Encodes the specified DDZ_S_Trusteeship message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_Trusteeship.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_S_Trusteeship
         * @static
         * @param {client_proto_ddz.IDDZ_S_Trusteeship} message DDZ_S_Trusteeship message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_Trusteeship.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_S_Trusteeship message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_S_Trusteeship
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_S_Trusteeship} DDZ_S_Trusteeship
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_Trusteeship.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_S_Trusteeship();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.chair = reader.int32();
                        break;
                    }
                case 2: {
                        message.trusteeship = reader.bool();
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
         * Decodes a DDZ_S_Trusteeship message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_S_Trusteeship
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_S_Trusteeship} DDZ_S_Trusteeship
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_Trusteeship.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_S_Trusteeship message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_S_Trusteeship
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_S_Trusteeship.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.chair != null && message.hasOwnProperty("chair"))
                if (!$util.isInteger(message.chair))
                    return "chair: integer expected";
            if (message.trusteeship != null && message.hasOwnProperty("trusteeship"))
                if (typeof message.trusteeship !== "boolean")
                    return "trusteeship: boolean expected";
            return null;
        };

        /**
         * Creates a DDZ_S_Trusteeship message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_S_Trusteeship
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_S_Trusteeship} DDZ_S_Trusteeship
         */
        DDZ_S_Trusteeship.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_S_Trusteeship)
                return object;
            var message = new $root.client_proto_ddz.DDZ_S_Trusteeship();
            if (object.chair != null)
                message.chair = object.chair | 0;
            if (object.trusteeship != null)
                message.trusteeship = Boolean(object.trusteeship);
            return message;
        };

        /**
         * Creates a plain object from a DDZ_S_Trusteeship message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_S_Trusteeship
         * @static
         * @param {client_proto_ddz.DDZ_S_Trusteeship} message DDZ_S_Trusteeship
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_S_Trusteeship.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.chair = 0;
                object.trusteeship = false;
            }
            if (message.chair != null && message.hasOwnProperty("chair"))
                object.chair = message.chair;
            if (message.trusteeship != null && message.hasOwnProperty("trusteeship"))
                object.trusteeship = message.trusteeship;
            return object;
        };

        /**
         * Converts this DDZ_S_Trusteeship to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_S_Trusteeship
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_S_Trusteeship.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_S_Trusteeship
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_S_Trusteeship
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_S_Trusteeship.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_S_Trusteeship";
        };

        return DDZ_S_Trusteeship;
    })();

    client_proto_ddz.DDZSettle = (function() {

        /**
         * Properties of a DDZSettle.
         * @memberof client_proto_ddz
         * @interface IDDZSettle
         * @property {Array.<number>|null} [toptimes] DDZSettle toptimes
         * @property {Array.<number|Long>|null} [golds] DDZSettle golds
         * @property {Array.<boolean>|null} [broke] DDZSettle broke
         * @property {Array.<boolean>|null} [toplimit] DDZSettle toplimit
         * @property {Array.<boolean>|null} [baopei] DDZSettle baopei
         * @property {Array.<number>|null} [doubletimes] DDZSettle doubletimes
         * @property {number|null} [flag] DDZSettle flag
         */

        /**
         * Constructs a new DDZSettle.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZSettle.
         * @implements IDDZSettle
         * @constructor
         * @param {client_proto_ddz.IDDZSettle=} [properties] Properties to set
         */
        function DDZSettle(properties) {
            this.toptimes = [];
            this.golds = [];
            this.broke = [];
            this.toplimit = [];
            this.baopei = [];
            this.doubletimes = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZSettle toptimes.
         * @member {Array.<number>} toptimes
         * @memberof client_proto_ddz.DDZSettle
         * @instance
         */
        DDZSettle.prototype.toptimes = $util.emptyArray;

        /**
         * DDZSettle golds.
         * @member {Array.<number|Long>} golds
         * @memberof client_proto_ddz.DDZSettle
         * @instance
         */
        DDZSettle.prototype.golds = $util.emptyArray;

        /**
         * DDZSettle broke.
         * @member {Array.<boolean>} broke
         * @memberof client_proto_ddz.DDZSettle
         * @instance
         */
        DDZSettle.prototype.broke = $util.emptyArray;

        /**
         * DDZSettle toplimit.
         * @member {Array.<boolean>} toplimit
         * @memberof client_proto_ddz.DDZSettle
         * @instance
         */
        DDZSettle.prototype.toplimit = $util.emptyArray;

        /**
         * DDZSettle baopei.
         * @member {Array.<boolean>} baopei
         * @memberof client_proto_ddz.DDZSettle
         * @instance
         */
        DDZSettle.prototype.baopei = $util.emptyArray;

        /**
         * DDZSettle doubletimes.
         * @member {Array.<number>} doubletimes
         * @memberof client_proto_ddz.DDZSettle
         * @instance
         */
        DDZSettle.prototype.doubletimes = $util.emptyArray;

        /**
         * DDZSettle flag.
         * @member {number} flag
         * @memberof client_proto_ddz.DDZSettle
         * @instance
         */
        DDZSettle.prototype.flag = 0;

        /**
         * Creates a new DDZSettle instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZSettle
         * @static
         * @param {client_proto_ddz.IDDZSettle=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZSettle} DDZSettle instance
         */
        DDZSettle.create = function create(properties) {
            return new DDZSettle(properties);
        };

        /**
         * Encodes the specified DDZSettle message. Does not implicitly {@link client_proto_ddz.DDZSettle.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZSettle
         * @static
         * @param {client_proto_ddz.IDDZSettle} message DDZSettle message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZSettle.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.toptimes != null && message.toptimes.length) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork();
                for (var i = 0; i < message.toptimes.length; ++i)
                    writer.int32(message.toptimes[i]);
                writer.ldelim();
            }
            if (message.golds != null && message.golds.length) {
                writer.uint32(/* id 2, wireType 2 =*/18).fork();
                for (var i = 0; i < message.golds.length; ++i)
                    writer.int64(message.golds[i]);
                writer.ldelim();
            }
            if (message.broke != null && message.broke.length) {
                writer.uint32(/* id 3, wireType 2 =*/26).fork();
                for (var i = 0; i < message.broke.length; ++i)
                    writer.bool(message.broke[i]);
                writer.ldelim();
            }
            if (message.toplimit != null && message.toplimit.length) {
                writer.uint32(/* id 4, wireType 2 =*/34).fork();
                for (var i = 0; i < message.toplimit.length; ++i)
                    writer.bool(message.toplimit[i]);
                writer.ldelim();
            }
            if (message.baopei != null && message.baopei.length) {
                writer.uint32(/* id 5, wireType 2 =*/42).fork();
                for (var i = 0; i < message.baopei.length; ++i)
                    writer.bool(message.baopei[i]);
                writer.ldelim();
            }
            if (message.doubletimes != null && message.doubletimes.length) {
                writer.uint32(/* id 6, wireType 2 =*/50).fork();
                for (var i = 0; i < message.doubletimes.length; ++i)
                    writer.int32(message.doubletimes[i]);
                writer.ldelim();
            }
            if (message.flag != null && Object.hasOwnProperty.call(message, "flag"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.flag);
            return writer;
        };

        /**
         * Encodes the specified DDZSettle message, length delimited. Does not implicitly {@link client_proto_ddz.DDZSettle.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZSettle
         * @static
         * @param {client_proto_ddz.IDDZSettle} message DDZSettle message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZSettle.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZSettle message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZSettle
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZSettle} DDZSettle
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZSettle.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZSettle();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.toptimes && message.toptimes.length))
                            message.toptimes = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.toptimes.push(reader.int32());
                        } else
                            message.toptimes.push(reader.int32());
                        break;
                    }
                case 2: {
                        if (!(message.golds && message.golds.length))
                            message.golds = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.golds.push(reader.int64());
                        } else
                            message.golds.push(reader.int64());
                        break;
                    }
                case 3: {
                        if (!(message.broke && message.broke.length))
                            message.broke = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.broke.push(reader.bool());
                        } else
                            message.broke.push(reader.bool());
                        break;
                    }
                case 4: {
                        if (!(message.toplimit && message.toplimit.length))
                            message.toplimit = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.toplimit.push(reader.bool());
                        } else
                            message.toplimit.push(reader.bool());
                        break;
                    }
                case 5: {
                        if (!(message.baopei && message.baopei.length))
                            message.baopei = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.baopei.push(reader.bool());
                        } else
                            message.baopei.push(reader.bool());
                        break;
                    }
                case 6: {
                        if (!(message.doubletimes && message.doubletimes.length))
                            message.doubletimes = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.doubletimes.push(reader.int32());
                        } else
                            message.doubletimes.push(reader.int32());
                        break;
                    }
                case 7: {
                        message.flag = reader.int32();
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
         * Decodes a DDZSettle message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZSettle
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZSettle} DDZSettle
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZSettle.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZSettle message.
         * @function verify
         * @memberof client_proto_ddz.DDZSettle
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZSettle.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.toptimes != null && message.hasOwnProperty("toptimes")) {
                if (!Array.isArray(message.toptimes))
                    return "toptimes: array expected";
                for (var i = 0; i < message.toptimes.length; ++i)
                    if (!$util.isInteger(message.toptimes[i]))
                        return "toptimes: integer[] expected";
            }
            if (message.golds != null && message.hasOwnProperty("golds")) {
                if (!Array.isArray(message.golds))
                    return "golds: array expected";
                for (var i = 0; i < message.golds.length; ++i)
                    if (!$util.isInteger(message.golds[i]) && !(message.golds[i] && $util.isInteger(message.golds[i].low) && $util.isInteger(message.golds[i].high)))
                        return "golds: integer|Long[] expected";
            }
            if (message.broke != null && message.hasOwnProperty("broke")) {
                if (!Array.isArray(message.broke))
                    return "broke: array expected";
                for (var i = 0; i < message.broke.length; ++i)
                    if (typeof message.broke[i] !== "boolean")
                        return "broke: boolean[] expected";
            }
            if (message.toplimit != null && message.hasOwnProperty("toplimit")) {
                if (!Array.isArray(message.toplimit))
                    return "toplimit: array expected";
                for (var i = 0; i < message.toplimit.length; ++i)
                    if (typeof message.toplimit[i] !== "boolean")
                        return "toplimit: boolean[] expected";
            }
            if (message.baopei != null && message.hasOwnProperty("baopei")) {
                if (!Array.isArray(message.baopei))
                    return "baopei: array expected";
                for (var i = 0; i < message.baopei.length; ++i)
                    if (typeof message.baopei[i] !== "boolean")
                        return "baopei: boolean[] expected";
            }
            if (message.doubletimes != null && message.hasOwnProperty("doubletimes")) {
                if (!Array.isArray(message.doubletimes))
                    return "doubletimes: array expected";
                for (var i = 0; i < message.doubletimes.length; ++i)
                    if (!$util.isInteger(message.doubletimes[i]))
                        return "doubletimes: integer[] expected";
            }
            if (message.flag != null && message.hasOwnProperty("flag"))
                if (!$util.isInteger(message.flag))
                    return "flag: integer expected";
            return null;
        };

        /**
         * Creates a DDZSettle message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZSettle
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZSettle} DDZSettle
         */
        DDZSettle.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZSettle)
                return object;
            var message = new $root.client_proto_ddz.DDZSettle();
            if (object.toptimes) {
                if (!Array.isArray(object.toptimes))
                    throw TypeError(".client_proto_ddz.DDZSettle.toptimes: array expected");
                message.toptimes = [];
                for (var i = 0; i < object.toptimes.length; ++i)
                    message.toptimes[i] = object.toptimes[i] | 0;
            }
            if (object.golds) {
                if (!Array.isArray(object.golds))
                    throw TypeError(".client_proto_ddz.DDZSettle.golds: array expected");
                message.golds = [];
                for (var i = 0; i < object.golds.length; ++i)
                    if ($util.Long)
                        (message.golds[i] = $util.Long.fromValue(object.golds[i])).unsigned = false;
                    else if (typeof object.golds[i] === "string")
                        message.golds[i] = parseInt(object.golds[i], 10);
                    else if (typeof object.golds[i] === "number")
                        message.golds[i] = object.golds[i];
                    else if (typeof object.golds[i] === "object")
                        message.golds[i] = new $util.LongBits(object.golds[i].low >>> 0, object.golds[i].high >>> 0).toNumber();
            }
            if (object.broke) {
                if (!Array.isArray(object.broke))
                    throw TypeError(".client_proto_ddz.DDZSettle.broke: array expected");
                message.broke = [];
                for (var i = 0; i < object.broke.length; ++i)
                    message.broke[i] = Boolean(object.broke[i]);
            }
            if (object.toplimit) {
                if (!Array.isArray(object.toplimit))
                    throw TypeError(".client_proto_ddz.DDZSettle.toplimit: array expected");
                message.toplimit = [];
                for (var i = 0; i < object.toplimit.length; ++i)
                    message.toplimit[i] = Boolean(object.toplimit[i]);
            }
            if (object.baopei) {
                if (!Array.isArray(object.baopei))
                    throw TypeError(".client_proto_ddz.DDZSettle.baopei: array expected");
                message.baopei = [];
                for (var i = 0; i < object.baopei.length; ++i)
                    message.baopei[i] = Boolean(object.baopei[i]);
            }
            if (object.doubletimes) {
                if (!Array.isArray(object.doubletimes))
                    throw TypeError(".client_proto_ddz.DDZSettle.doubletimes: array expected");
                message.doubletimes = [];
                for (var i = 0; i < object.doubletimes.length; ++i)
                    message.doubletimes[i] = object.doubletimes[i] | 0;
            }
            if (object.flag != null)
                message.flag = object.flag | 0;
            return message;
        };

        /**
         * Creates a plain object from a DDZSettle message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZSettle
         * @static
         * @param {client_proto_ddz.DDZSettle} message DDZSettle
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZSettle.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.toptimes = [];
                object.golds = [];
                object.broke = [];
                object.toplimit = [];
                object.baopei = [];
                object.doubletimes = [];
            }
            if (options.defaults)
                object.flag = 0;
            if (message.toptimes && message.toptimes.length) {
                object.toptimes = [];
                for (var j = 0; j < message.toptimes.length; ++j)
                    object.toptimes[j] = message.toptimes[j];
            }
            if (message.golds && message.golds.length) {
                object.golds = [];
                for (var j = 0; j < message.golds.length; ++j)
                    if (typeof message.golds[j] === "number")
                        object.golds[j] = options.longs === String ? String(message.golds[j]) : message.golds[j];
                    else
                        object.golds[j] = options.longs === String ? $util.Long.prototype.toString.call(message.golds[j]) : options.longs === Number ? new $util.LongBits(message.golds[j].low >>> 0, message.golds[j].high >>> 0).toNumber() : message.golds[j];
            }
            if (message.broke && message.broke.length) {
                object.broke = [];
                for (var j = 0; j < message.broke.length; ++j)
                    object.broke[j] = message.broke[j];
            }
            if (message.toplimit && message.toplimit.length) {
                object.toplimit = [];
                for (var j = 0; j < message.toplimit.length; ++j)
                    object.toplimit[j] = message.toplimit[j];
            }
            if (message.baopei && message.baopei.length) {
                object.baopei = [];
                for (var j = 0; j < message.baopei.length; ++j)
                    object.baopei[j] = message.baopei[j];
            }
            if (message.doubletimes && message.doubletimes.length) {
                object.doubletimes = [];
                for (var j = 0; j < message.doubletimes.length; ++j)
                    object.doubletimes[j] = message.doubletimes[j];
            }
            if (message.flag != null && message.hasOwnProperty("flag"))
                object.flag = message.flag;
            return object;
        };

        /**
         * Converts this DDZSettle to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZSettle
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZSettle.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZSettle
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZSettle
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZSettle.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZSettle";
        };

        return DDZSettle;
    })();

    client_proto_ddz.DDZ_S_Reconnect = (function() {

        /**
         * Properties of a DDZ_S_Reconnect.
         * @memberof client_proto_ddz
         * @interface IDDZ_S_Reconnect
         * @property {client_proto_ddz.IDDZInfo|null} [gameInfo] DDZ_S_Reconnect gameInfo
         * @property {number|null} [gamestate] DDZ_S_Reconnect gamestate
         * @property {number|null} [toptimes] DDZ_S_Reconnect toptimes
         * @property {number|null} [bankerchair] DDZ_S_Reconnect bankerchair
         * @property {number|null} [curchair] DDZ_S_Reconnect curchair
         * @property {Array.<client_proto_ddz.IRepeatedInt32>|null} [handcards] DDZ_S_Reconnect handcards
         * @property {Array.<number>|null} [backcards] DDZ_S_Reconnect backcards
         * @property {number|null} [backtimes] DDZ_S_Reconnect backtimes
         * @property {Array.<boolean>|null} [btrusteeship] DDZ_S_Reconnect btrusteeship
         * @property {number|null} [usememory] DDZ_S_Reconnect usememory
         * @property {Array.<number>|null} [recordindex] DDZ_S_Reconnect recordindex
         * @property {number|null} [countdown] DDZ_S_Reconnect countdown
         * @property {Array.<boolean>|null} [bshow] DDZ_S_Reconnect bshow
         * @property {Array.<number>|null} [historycall] DDZ_S_Reconnect historycall
         * @property {Array.<number>|null} [historychair] DDZ_S_Reconnect historychair
         * @property {number|null} [toppoint] DDZ_S_Reconnect toppoint
         * @property {Array.<boolean>|null} [bdouble] DDZ_S_Reconnect bdouble
         * @property {Array.<number>|null} [doubletimes] DDZ_S_Reconnect doubletimes
         * @property {number|null} [turnwinner] DDZ_S_Reconnect turnwinner
         * @property {Array.<client_proto_ddz.IRepeatedInt32>|null} [turncards] DDZ_S_Reconnect turncards
         * @property {Array.<boolean>|null} [passornull] DDZ_S_Reconnect passornull
         * @property {client_proto_ddz.IDDZSettle|null} [settleinfo] DDZ_S_Reconnect settleinfo
         */

        /**
         * Constructs a new DDZ_S_Reconnect.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_S_Reconnect.
         * @implements IDDZ_S_Reconnect
         * @constructor
         * @param {client_proto_ddz.IDDZ_S_Reconnect=} [properties] Properties to set
         */
        function DDZ_S_Reconnect(properties) {
            this.handcards = [];
            this.backcards = [];
            this.btrusteeship = [];
            this.recordindex = [];
            this.bshow = [];
            this.historycall = [];
            this.historychair = [];
            this.bdouble = [];
            this.doubletimes = [];
            this.turncards = [];
            this.passornull = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_S_Reconnect gameInfo.
         * @member {client_proto_ddz.IDDZInfo|null|undefined} gameInfo
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.gameInfo = null;

        /**
         * DDZ_S_Reconnect gamestate.
         * @member {number} gamestate
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.gamestate = 0;

        /**
         * DDZ_S_Reconnect toptimes.
         * @member {number} toptimes
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.toptimes = 0;

        /**
         * DDZ_S_Reconnect bankerchair.
         * @member {number} bankerchair
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.bankerchair = 0;

        /**
         * DDZ_S_Reconnect curchair.
         * @member {number} curchair
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.curchair = 0;

        /**
         * DDZ_S_Reconnect handcards.
         * @member {Array.<client_proto_ddz.IRepeatedInt32>} handcards
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.handcards = $util.emptyArray;

        /**
         * DDZ_S_Reconnect backcards.
         * @member {Array.<number>} backcards
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.backcards = $util.emptyArray;

        /**
         * DDZ_S_Reconnect backtimes.
         * @member {number} backtimes
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.backtimes = 0;

        /**
         * DDZ_S_Reconnect btrusteeship.
         * @member {Array.<boolean>} btrusteeship
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.btrusteeship = $util.emptyArray;

        /**
         * DDZ_S_Reconnect usememory.
         * @member {number} usememory
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.usememory = 0;

        /**
         * DDZ_S_Reconnect recordindex.
         * @member {Array.<number>} recordindex
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.recordindex = $util.emptyArray;

        /**
         * DDZ_S_Reconnect countdown.
         * @member {number} countdown
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.countdown = 0;

        /**
         * DDZ_S_Reconnect bshow.
         * @member {Array.<boolean>} bshow
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.bshow = $util.emptyArray;

        /**
         * DDZ_S_Reconnect historycall.
         * @member {Array.<number>} historycall
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.historycall = $util.emptyArray;

        /**
         * DDZ_S_Reconnect historychair.
         * @member {Array.<number>} historychair
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.historychair = $util.emptyArray;

        /**
         * DDZ_S_Reconnect toppoint.
         * @member {number} toppoint
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.toppoint = 0;

        /**
         * DDZ_S_Reconnect bdouble.
         * @member {Array.<boolean>} bdouble
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.bdouble = $util.emptyArray;

        /**
         * DDZ_S_Reconnect doubletimes.
         * @member {Array.<number>} doubletimes
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.doubletimes = $util.emptyArray;

        /**
         * DDZ_S_Reconnect turnwinner.
         * @member {number} turnwinner
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.turnwinner = 0;

        /**
         * DDZ_S_Reconnect turncards.
         * @member {Array.<client_proto_ddz.IRepeatedInt32>} turncards
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.turncards = $util.emptyArray;

        /**
         * DDZ_S_Reconnect passornull.
         * @member {Array.<boolean>} passornull
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.passornull = $util.emptyArray;

        /**
         * DDZ_S_Reconnect settleinfo.
         * @member {client_proto_ddz.IDDZSettle|null|undefined} settleinfo
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         */
        DDZ_S_Reconnect.prototype.settleinfo = null;

        /**
         * Creates a new DDZ_S_Reconnect instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @static
         * @param {client_proto_ddz.IDDZ_S_Reconnect=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_S_Reconnect} DDZ_S_Reconnect instance
         */
        DDZ_S_Reconnect.create = function create(properties) {
            return new DDZ_S_Reconnect(properties);
        };

        /**
         * Encodes the specified DDZ_S_Reconnect message. Does not implicitly {@link client_proto_ddz.DDZ_S_Reconnect.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @static
         * @param {client_proto_ddz.IDDZ_S_Reconnect} message DDZ_S_Reconnect message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_Reconnect.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.gameInfo != null && Object.hasOwnProperty.call(message, "gameInfo"))
                $root.client_proto_ddz.DDZInfo.encode(message.gameInfo, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.gamestate != null && Object.hasOwnProperty.call(message, "gamestate"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.gamestate);
            if (message.toptimes != null && Object.hasOwnProperty.call(message, "toptimes"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.toptimes);
            if (message.bankerchair != null && Object.hasOwnProperty.call(message, "bankerchair"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.bankerchair);
            if (message.curchair != null && Object.hasOwnProperty.call(message, "curchair"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.curchair);
            if (message.handcards != null && message.handcards.length)
                for (var i = 0; i < message.handcards.length; ++i)
                    $root.client_proto_ddz.RepeatedInt32.encode(message.handcards[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.backcards != null && message.backcards.length) {
                writer.uint32(/* id 7, wireType 2 =*/58).fork();
                for (var i = 0; i < message.backcards.length; ++i)
                    writer.int32(message.backcards[i]);
                writer.ldelim();
            }
            if (message.backtimes != null && Object.hasOwnProperty.call(message, "backtimes"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.backtimes);
            if (message.btrusteeship != null && message.btrusteeship.length) {
                writer.uint32(/* id 9, wireType 2 =*/74).fork();
                for (var i = 0; i < message.btrusteeship.length; ++i)
                    writer.bool(message.btrusteeship[i]);
                writer.ldelim();
            }
            if (message.usememory != null && Object.hasOwnProperty.call(message, "usememory"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.usememory);
            if (message.recordindex != null && message.recordindex.length) {
                writer.uint32(/* id 11, wireType 2 =*/90).fork();
                for (var i = 0; i < message.recordindex.length; ++i)
                    writer.int32(message.recordindex[i]);
                writer.ldelim();
            }
            if (message.countdown != null && Object.hasOwnProperty.call(message, "countdown"))
                writer.uint32(/* id 12, wireType 0 =*/96).int32(message.countdown);
            if (message.bshow != null && message.bshow.length) {
                writer.uint32(/* id 13, wireType 2 =*/106).fork();
                for (var i = 0; i < message.bshow.length; ++i)
                    writer.bool(message.bshow[i]);
                writer.ldelim();
            }
            if (message.historycall != null && message.historycall.length) {
                writer.uint32(/* id 14, wireType 2 =*/114).fork();
                for (var i = 0; i < message.historycall.length; ++i)
                    writer.int32(message.historycall[i]);
                writer.ldelim();
            }
            if (message.historychair != null && message.historychair.length) {
                writer.uint32(/* id 15, wireType 2 =*/122).fork();
                for (var i = 0; i < message.historychair.length; ++i)
                    writer.int32(message.historychair[i]);
                writer.ldelim();
            }
            if (message.toppoint != null && Object.hasOwnProperty.call(message, "toppoint"))
                writer.uint32(/* id 16, wireType 0 =*/128).int32(message.toppoint);
            if (message.bdouble != null && message.bdouble.length) {
                writer.uint32(/* id 17, wireType 2 =*/138).fork();
                for (var i = 0; i < message.bdouble.length; ++i)
                    writer.bool(message.bdouble[i]);
                writer.ldelim();
            }
            if (message.doubletimes != null && message.doubletimes.length) {
                writer.uint32(/* id 18, wireType 2 =*/146).fork();
                for (var i = 0; i < message.doubletimes.length; ++i)
                    writer.int32(message.doubletimes[i]);
                writer.ldelim();
            }
            if (message.turnwinner != null && Object.hasOwnProperty.call(message, "turnwinner"))
                writer.uint32(/* id 19, wireType 0 =*/152).int32(message.turnwinner);
            if (message.turncards != null && message.turncards.length)
                for (var i = 0; i < message.turncards.length; ++i)
                    $root.client_proto_ddz.RepeatedInt32.encode(message.turncards[i], writer.uint32(/* id 20, wireType 2 =*/162).fork()).ldelim();
            if (message.passornull != null && message.passornull.length) {
                writer.uint32(/* id 21, wireType 2 =*/170).fork();
                for (var i = 0; i < message.passornull.length; ++i)
                    writer.bool(message.passornull[i]);
                writer.ldelim();
            }
            if (message.settleinfo != null && Object.hasOwnProperty.call(message, "settleinfo"))
                $root.client_proto_ddz.DDZSettle.encode(message.settleinfo, writer.uint32(/* id 22, wireType 2 =*/178).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified DDZ_S_Reconnect message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_Reconnect.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @static
         * @param {client_proto_ddz.IDDZ_S_Reconnect} message DDZ_S_Reconnect message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_Reconnect.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_S_Reconnect message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_S_Reconnect} DDZ_S_Reconnect
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_Reconnect.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_S_Reconnect();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.gameInfo = $root.client_proto_ddz.DDZInfo.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.gamestate = reader.int32();
                        break;
                    }
                case 3: {
                        message.toptimes = reader.int32();
                        break;
                    }
                case 4: {
                        message.bankerchair = reader.int32();
                        break;
                    }
                case 5: {
                        message.curchair = reader.int32();
                        break;
                    }
                case 6: {
                        if (!(message.handcards && message.handcards.length))
                            message.handcards = [];
                        message.handcards.push($root.client_proto_ddz.RepeatedInt32.decode(reader, reader.uint32()));
                        break;
                    }
                case 7: {
                        if (!(message.backcards && message.backcards.length))
                            message.backcards = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.backcards.push(reader.int32());
                        } else
                            message.backcards.push(reader.int32());
                        break;
                    }
                case 8: {
                        message.backtimes = reader.int32();
                        break;
                    }
                case 9: {
                        if (!(message.btrusteeship && message.btrusteeship.length))
                            message.btrusteeship = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.btrusteeship.push(reader.bool());
                        } else
                            message.btrusteeship.push(reader.bool());
                        break;
                    }
                case 10: {
                        message.usememory = reader.int32();
                        break;
                    }
                case 11: {
                        if (!(message.recordindex && message.recordindex.length))
                            message.recordindex = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.recordindex.push(reader.int32());
                        } else
                            message.recordindex.push(reader.int32());
                        break;
                    }
                case 12: {
                        message.countdown = reader.int32();
                        break;
                    }
                case 13: {
                        if (!(message.bshow && message.bshow.length))
                            message.bshow = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.bshow.push(reader.bool());
                        } else
                            message.bshow.push(reader.bool());
                        break;
                    }
                case 14: {
                        if (!(message.historycall && message.historycall.length))
                            message.historycall = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.historycall.push(reader.int32());
                        } else
                            message.historycall.push(reader.int32());
                        break;
                    }
                case 15: {
                        if (!(message.historychair && message.historychair.length))
                            message.historychair = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.historychair.push(reader.int32());
                        } else
                            message.historychair.push(reader.int32());
                        break;
                    }
                case 16: {
                        message.toppoint = reader.int32();
                        break;
                    }
                case 17: {
                        if (!(message.bdouble && message.bdouble.length))
                            message.bdouble = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.bdouble.push(reader.bool());
                        } else
                            message.bdouble.push(reader.bool());
                        break;
                    }
                case 18: {
                        if (!(message.doubletimes && message.doubletimes.length))
                            message.doubletimes = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.doubletimes.push(reader.int32());
                        } else
                            message.doubletimes.push(reader.int32());
                        break;
                    }
                case 19: {
                        message.turnwinner = reader.int32();
                        break;
                    }
                case 20: {
                        if (!(message.turncards && message.turncards.length))
                            message.turncards = [];
                        message.turncards.push($root.client_proto_ddz.RepeatedInt32.decode(reader, reader.uint32()));
                        break;
                    }
                case 21: {
                        if (!(message.passornull && message.passornull.length))
                            message.passornull = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.passornull.push(reader.bool());
                        } else
                            message.passornull.push(reader.bool());
                        break;
                    }
                case 22: {
                        message.settleinfo = $root.client_proto_ddz.DDZSettle.decode(reader, reader.uint32());
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
         * Decodes a DDZ_S_Reconnect message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_S_Reconnect} DDZ_S_Reconnect
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_Reconnect.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_S_Reconnect message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_S_Reconnect.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.gameInfo != null && message.hasOwnProperty("gameInfo")) {
                var error = $root.client_proto_ddz.DDZInfo.verify(message.gameInfo);
                if (error)
                    return "gameInfo." + error;
            }
            if (message.gamestate != null && message.hasOwnProperty("gamestate"))
                if (!$util.isInteger(message.gamestate))
                    return "gamestate: integer expected";
            if (message.toptimes != null && message.hasOwnProperty("toptimes"))
                if (!$util.isInteger(message.toptimes))
                    return "toptimes: integer expected";
            if (message.bankerchair != null && message.hasOwnProperty("bankerchair"))
                if (!$util.isInteger(message.bankerchair))
                    return "bankerchair: integer expected";
            if (message.curchair != null && message.hasOwnProperty("curchair"))
                if (!$util.isInteger(message.curchair))
                    return "curchair: integer expected";
            if (message.handcards != null && message.hasOwnProperty("handcards")) {
                if (!Array.isArray(message.handcards))
                    return "handcards: array expected";
                for (var i = 0; i < message.handcards.length; ++i) {
                    var error = $root.client_proto_ddz.RepeatedInt32.verify(message.handcards[i]);
                    if (error)
                        return "handcards." + error;
                }
            }
            if (message.backcards != null && message.hasOwnProperty("backcards")) {
                if (!Array.isArray(message.backcards))
                    return "backcards: array expected";
                for (var i = 0; i < message.backcards.length; ++i)
                    if (!$util.isInteger(message.backcards[i]))
                        return "backcards: integer[] expected";
            }
            if (message.backtimes != null && message.hasOwnProperty("backtimes"))
                if (!$util.isInteger(message.backtimes))
                    return "backtimes: integer expected";
            if (message.btrusteeship != null && message.hasOwnProperty("btrusteeship")) {
                if (!Array.isArray(message.btrusteeship))
                    return "btrusteeship: array expected";
                for (var i = 0; i < message.btrusteeship.length; ++i)
                    if (typeof message.btrusteeship[i] !== "boolean")
                        return "btrusteeship: boolean[] expected";
            }
            if (message.usememory != null && message.hasOwnProperty("usememory"))
                if (!$util.isInteger(message.usememory))
                    return "usememory: integer expected";
            if (message.recordindex != null && message.hasOwnProperty("recordindex")) {
                if (!Array.isArray(message.recordindex))
                    return "recordindex: array expected";
                for (var i = 0; i < message.recordindex.length; ++i)
                    if (!$util.isInteger(message.recordindex[i]))
                        return "recordindex: integer[] expected";
            }
            if (message.countdown != null && message.hasOwnProperty("countdown"))
                if (!$util.isInteger(message.countdown))
                    return "countdown: integer expected";
            if (message.bshow != null && message.hasOwnProperty("bshow")) {
                if (!Array.isArray(message.bshow))
                    return "bshow: array expected";
                for (var i = 0; i < message.bshow.length; ++i)
                    if (typeof message.bshow[i] !== "boolean")
                        return "bshow: boolean[] expected";
            }
            if (message.historycall != null && message.hasOwnProperty("historycall")) {
                if (!Array.isArray(message.historycall))
                    return "historycall: array expected";
                for (var i = 0; i < message.historycall.length; ++i)
                    if (!$util.isInteger(message.historycall[i]))
                        return "historycall: integer[] expected";
            }
            if (message.historychair != null && message.hasOwnProperty("historychair")) {
                if (!Array.isArray(message.historychair))
                    return "historychair: array expected";
                for (var i = 0; i < message.historychair.length; ++i)
                    if (!$util.isInteger(message.historychair[i]))
                        return "historychair: integer[] expected";
            }
            if (message.toppoint != null && message.hasOwnProperty("toppoint"))
                if (!$util.isInteger(message.toppoint))
                    return "toppoint: integer expected";
            if (message.bdouble != null && message.hasOwnProperty("bdouble")) {
                if (!Array.isArray(message.bdouble))
                    return "bdouble: array expected";
                for (var i = 0; i < message.bdouble.length; ++i)
                    if (typeof message.bdouble[i] !== "boolean")
                        return "bdouble: boolean[] expected";
            }
            if (message.doubletimes != null && message.hasOwnProperty("doubletimes")) {
                if (!Array.isArray(message.doubletimes))
                    return "doubletimes: array expected";
                for (var i = 0; i < message.doubletimes.length; ++i)
                    if (!$util.isInteger(message.doubletimes[i]))
                        return "doubletimes: integer[] expected";
            }
            if (message.turnwinner != null && message.hasOwnProperty("turnwinner"))
                if (!$util.isInteger(message.turnwinner))
                    return "turnwinner: integer expected";
            if (message.turncards != null && message.hasOwnProperty("turncards")) {
                if (!Array.isArray(message.turncards))
                    return "turncards: array expected";
                for (var i = 0; i < message.turncards.length; ++i) {
                    var error = $root.client_proto_ddz.RepeatedInt32.verify(message.turncards[i]);
                    if (error)
                        return "turncards." + error;
                }
            }
            if (message.passornull != null && message.hasOwnProperty("passornull")) {
                if (!Array.isArray(message.passornull))
                    return "passornull: array expected";
                for (var i = 0; i < message.passornull.length; ++i)
                    if (typeof message.passornull[i] !== "boolean")
                        return "passornull: boolean[] expected";
            }
            if (message.settleinfo != null && message.hasOwnProperty("settleinfo")) {
                var error = $root.client_proto_ddz.DDZSettle.verify(message.settleinfo);
                if (error)
                    return "settleinfo." + error;
            }
            return null;
        };

        /**
         * Creates a DDZ_S_Reconnect message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_S_Reconnect} DDZ_S_Reconnect
         */
        DDZ_S_Reconnect.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_S_Reconnect)
                return object;
            var message = new $root.client_proto_ddz.DDZ_S_Reconnect();
            if (object.gameInfo != null) {
                if (typeof object.gameInfo !== "object")
                    throw TypeError(".client_proto_ddz.DDZ_S_Reconnect.gameInfo: object expected");
                message.gameInfo = $root.client_proto_ddz.DDZInfo.fromObject(object.gameInfo);
            }
            if (object.gamestate != null)
                message.gamestate = object.gamestate | 0;
            if (object.toptimes != null)
                message.toptimes = object.toptimes | 0;
            if (object.bankerchair != null)
                message.bankerchair = object.bankerchair | 0;
            if (object.curchair != null)
                message.curchair = object.curchair | 0;
            if (object.handcards) {
                if (!Array.isArray(object.handcards))
                    throw TypeError(".client_proto_ddz.DDZ_S_Reconnect.handcards: array expected");
                message.handcards = [];
                for (var i = 0; i < object.handcards.length; ++i) {
                    if (typeof object.handcards[i] !== "object")
                        throw TypeError(".client_proto_ddz.DDZ_S_Reconnect.handcards: object expected");
                    message.handcards[i] = $root.client_proto_ddz.RepeatedInt32.fromObject(object.handcards[i]);
                }
            }
            if (object.backcards) {
                if (!Array.isArray(object.backcards))
                    throw TypeError(".client_proto_ddz.DDZ_S_Reconnect.backcards: array expected");
                message.backcards = [];
                for (var i = 0; i < object.backcards.length; ++i)
                    message.backcards[i] = object.backcards[i] | 0;
            }
            if (object.backtimes != null)
                message.backtimes = object.backtimes | 0;
            if (object.btrusteeship) {
                if (!Array.isArray(object.btrusteeship))
                    throw TypeError(".client_proto_ddz.DDZ_S_Reconnect.btrusteeship: array expected");
                message.btrusteeship = [];
                for (var i = 0; i < object.btrusteeship.length; ++i)
                    message.btrusteeship[i] = Boolean(object.btrusteeship[i]);
            }
            if (object.usememory != null)
                message.usememory = object.usememory | 0;
            if (object.recordindex) {
                if (!Array.isArray(object.recordindex))
                    throw TypeError(".client_proto_ddz.DDZ_S_Reconnect.recordindex: array expected");
                message.recordindex = [];
                for (var i = 0; i < object.recordindex.length; ++i)
                    message.recordindex[i] = object.recordindex[i] | 0;
            }
            if (object.countdown != null)
                message.countdown = object.countdown | 0;
            if (object.bshow) {
                if (!Array.isArray(object.bshow))
                    throw TypeError(".client_proto_ddz.DDZ_S_Reconnect.bshow: array expected");
                message.bshow = [];
                for (var i = 0; i < object.bshow.length; ++i)
                    message.bshow[i] = Boolean(object.bshow[i]);
            }
            if (object.historycall) {
                if (!Array.isArray(object.historycall))
                    throw TypeError(".client_proto_ddz.DDZ_S_Reconnect.historycall: array expected");
                message.historycall = [];
                for (var i = 0; i < object.historycall.length; ++i)
                    message.historycall[i] = object.historycall[i] | 0;
            }
            if (object.historychair) {
                if (!Array.isArray(object.historychair))
                    throw TypeError(".client_proto_ddz.DDZ_S_Reconnect.historychair: array expected");
                message.historychair = [];
                for (var i = 0; i < object.historychair.length; ++i)
                    message.historychair[i] = object.historychair[i] | 0;
            }
            if (object.toppoint != null)
                message.toppoint = object.toppoint | 0;
            if (object.bdouble) {
                if (!Array.isArray(object.bdouble))
                    throw TypeError(".client_proto_ddz.DDZ_S_Reconnect.bdouble: array expected");
                message.bdouble = [];
                for (var i = 0; i < object.bdouble.length; ++i)
                    message.bdouble[i] = Boolean(object.bdouble[i]);
            }
            if (object.doubletimes) {
                if (!Array.isArray(object.doubletimes))
                    throw TypeError(".client_proto_ddz.DDZ_S_Reconnect.doubletimes: array expected");
                message.doubletimes = [];
                for (var i = 0; i < object.doubletimes.length; ++i)
                    message.doubletimes[i] = object.doubletimes[i] | 0;
            }
            if (object.turnwinner != null)
                message.turnwinner = object.turnwinner | 0;
            if (object.turncards) {
                if (!Array.isArray(object.turncards))
                    throw TypeError(".client_proto_ddz.DDZ_S_Reconnect.turncards: array expected");
                message.turncards = [];
                for (var i = 0; i < object.turncards.length; ++i) {
                    if (typeof object.turncards[i] !== "object")
                        throw TypeError(".client_proto_ddz.DDZ_S_Reconnect.turncards: object expected");
                    message.turncards[i] = $root.client_proto_ddz.RepeatedInt32.fromObject(object.turncards[i]);
                }
            }
            if (object.passornull) {
                if (!Array.isArray(object.passornull))
                    throw TypeError(".client_proto_ddz.DDZ_S_Reconnect.passornull: array expected");
                message.passornull = [];
                for (var i = 0; i < object.passornull.length; ++i)
                    message.passornull[i] = Boolean(object.passornull[i]);
            }
            if (object.settleinfo != null) {
                if (typeof object.settleinfo !== "object")
                    throw TypeError(".client_proto_ddz.DDZ_S_Reconnect.settleinfo: object expected");
                message.settleinfo = $root.client_proto_ddz.DDZSettle.fromObject(object.settleinfo);
            }
            return message;
        };

        /**
         * Creates a plain object from a DDZ_S_Reconnect message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @static
         * @param {client_proto_ddz.DDZ_S_Reconnect} message DDZ_S_Reconnect
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_S_Reconnect.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.handcards = [];
                object.backcards = [];
                object.btrusteeship = [];
                object.recordindex = [];
                object.bshow = [];
                object.historycall = [];
                object.historychair = [];
                object.bdouble = [];
                object.doubletimes = [];
                object.turncards = [];
                object.passornull = [];
            }
            if (options.defaults) {
                object.gameInfo = null;
                object.gamestate = 0;
                object.toptimes = 0;
                object.bankerchair = 0;
                object.curchair = 0;
                object.backtimes = 0;
                object.usememory = 0;
                object.countdown = 0;
                object.toppoint = 0;
                object.turnwinner = 0;
                object.settleinfo = null;
            }
            if (message.gameInfo != null && message.hasOwnProperty("gameInfo"))
                object.gameInfo = $root.client_proto_ddz.DDZInfo.toObject(message.gameInfo, options);
            if (message.gamestate != null && message.hasOwnProperty("gamestate"))
                object.gamestate = message.gamestate;
            if (message.toptimes != null && message.hasOwnProperty("toptimes"))
                object.toptimes = message.toptimes;
            if (message.bankerchair != null && message.hasOwnProperty("bankerchair"))
                object.bankerchair = message.bankerchair;
            if (message.curchair != null && message.hasOwnProperty("curchair"))
                object.curchair = message.curchair;
            if (message.handcards && message.handcards.length) {
                object.handcards = [];
                for (var j = 0; j < message.handcards.length; ++j)
                    object.handcards[j] = $root.client_proto_ddz.RepeatedInt32.toObject(message.handcards[j], options);
            }
            if (message.backcards && message.backcards.length) {
                object.backcards = [];
                for (var j = 0; j < message.backcards.length; ++j)
                    object.backcards[j] = message.backcards[j];
            }
            if (message.backtimes != null && message.hasOwnProperty("backtimes"))
                object.backtimes = message.backtimes;
            if (message.btrusteeship && message.btrusteeship.length) {
                object.btrusteeship = [];
                for (var j = 0; j < message.btrusteeship.length; ++j)
                    object.btrusteeship[j] = message.btrusteeship[j];
            }
            if (message.usememory != null && message.hasOwnProperty("usememory"))
                object.usememory = message.usememory;
            if (message.recordindex && message.recordindex.length) {
                object.recordindex = [];
                for (var j = 0; j < message.recordindex.length; ++j)
                    object.recordindex[j] = message.recordindex[j];
            }
            if (message.countdown != null && message.hasOwnProperty("countdown"))
                object.countdown = message.countdown;
            if (message.bshow && message.bshow.length) {
                object.bshow = [];
                for (var j = 0; j < message.bshow.length; ++j)
                    object.bshow[j] = message.bshow[j];
            }
            if (message.historycall && message.historycall.length) {
                object.historycall = [];
                for (var j = 0; j < message.historycall.length; ++j)
                    object.historycall[j] = message.historycall[j];
            }
            if (message.historychair && message.historychair.length) {
                object.historychair = [];
                for (var j = 0; j < message.historychair.length; ++j)
                    object.historychair[j] = message.historychair[j];
            }
            if (message.toppoint != null && message.hasOwnProperty("toppoint"))
                object.toppoint = message.toppoint;
            if (message.bdouble && message.bdouble.length) {
                object.bdouble = [];
                for (var j = 0; j < message.bdouble.length; ++j)
                    object.bdouble[j] = message.bdouble[j];
            }
            if (message.doubletimes && message.doubletimes.length) {
                object.doubletimes = [];
                for (var j = 0; j < message.doubletimes.length; ++j)
                    object.doubletimes[j] = message.doubletimes[j];
            }
            if (message.turnwinner != null && message.hasOwnProperty("turnwinner"))
                object.turnwinner = message.turnwinner;
            if (message.turncards && message.turncards.length) {
                object.turncards = [];
                for (var j = 0; j < message.turncards.length; ++j)
                    object.turncards[j] = $root.client_proto_ddz.RepeatedInt32.toObject(message.turncards[j], options);
            }
            if (message.passornull && message.passornull.length) {
                object.passornull = [];
                for (var j = 0; j < message.passornull.length; ++j)
                    object.passornull[j] = message.passornull[j];
            }
            if (message.settleinfo != null && message.hasOwnProperty("settleinfo"))
                object.settleinfo = $root.client_proto_ddz.DDZSettle.toObject(message.settleinfo, options);
            return object;
        };

        /**
         * Converts this DDZ_S_Reconnect to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_S_Reconnect.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_S_Reconnect
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_S_Reconnect
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_S_Reconnect.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_S_Reconnect";
        };

        return DDZ_S_Reconnect;
    })();

    client_proto_ddz.DDZ_S_GameEnd = (function() {

        /**
         * Properties of a DDZ_S_GameEnd.
         * @memberof client_proto_ddz
         * @interface IDDZ_S_GameEnd
         * @property {Array.<client_proto_ddz.IRepeatedInt32>|null} [handcards] DDZ_S_GameEnd handcards
         * @property {client_proto_ddz.IDDZSettle|null} [settleinfo] DDZ_S_GameEnd settleinfo
         */

        /**
         * Constructs a new DDZ_S_GameEnd.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_S_GameEnd.
         * @implements IDDZ_S_GameEnd
         * @constructor
         * @param {client_proto_ddz.IDDZ_S_GameEnd=} [properties] Properties to set
         */
        function DDZ_S_GameEnd(properties) {
            this.handcards = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_S_GameEnd handcards.
         * @member {Array.<client_proto_ddz.IRepeatedInt32>} handcards
         * @memberof client_proto_ddz.DDZ_S_GameEnd
         * @instance
         */
        DDZ_S_GameEnd.prototype.handcards = $util.emptyArray;

        /**
         * DDZ_S_GameEnd settleinfo.
         * @member {client_proto_ddz.IDDZSettle|null|undefined} settleinfo
         * @memberof client_proto_ddz.DDZ_S_GameEnd
         * @instance
         */
        DDZ_S_GameEnd.prototype.settleinfo = null;

        /**
         * Creates a new DDZ_S_GameEnd instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_S_GameEnd
         * @static
         * @param {client_proto_ddz.IDDZ_S_GameEnd=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_S_GameEnd} DDZ_S_GameEnd instance
         */
        DDZ_S_GameEnd.create = function create(properties) {
            return new DDZ_S_GameEnd(properties);
        };

        /**
         * Encodes the specified DDZ_S_GameEnd message. Does not implicitly {@link client_proto_ddz.DDZ_S_GameEnd.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_S_GameEnd
         * @static
         * @param {client_proto_ddz.IDDZ_S_GameEnd} message DDZ_S_GameEnd message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_GameEnd.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.handcards != null && message.handcards.length)
                for (var i = 0; i < message.handcards.length; ++i)
                    $root.client_proto_ddz.RepeatedInt32.encode(message.handcards[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.settleinfo != null && Object.hasOwnProperty.call(message, "settleinfo"))
                $root.client_proto_ddz.DDZSettle.encode(message.settleinfo, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified DDZ_S_GameEnd message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_GameEnd.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_S_GameEnd
         * @static
         * @param {client_proto_ddz.IDDZ_S_GameEnd} message DDZ_S_GameEnd message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_S_GameEnd.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_S_GameEnd message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_S_GameEnd
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_S_GameEnd} DDZ_S_GameEnd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_GameEnd.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_S_GameEnd();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.handcards && message.handcards.length))
                            message.handcards = [];
                        message.handcards.push($root.client_proto_ddz.RepeatedInt32.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        message.settleinfo = $root.client_proto_ddz.DDZSettle.decode(reader, reader.uint32());
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
         * Decodes a DDZ_S_GameEnd message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_S_GameEnd
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_S_GameEnd} DDZ_S_GameEnd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_S_GameEnd.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_S_GameEnd message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_S_GameEnd
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_S_GameEnd.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.handcards != null && message.hasOwnProperty("handcards")) {
                if (!Array.isArray(message.handcards))
                    return "handcards: array expected";
                for (var i = 0; i < message.handcards.length; ++i) {
                    var error = $root.client_proto_ddz.RepeatedInt32.verify(message.handcards[i]);
                    if (error)
                        return "handcards." + error;
                }
            }
            if (message.settleinfo != null && message.hasOwnProperty("settleinfo")) {
                var error = $root.client_proto_ddz.DDZSettle.verify(message.settleinfo);
                if (error)
                    return "settleinfo." + error;
            }
            return null;
        };

        /**
         * Creates a DDZ_S_GameEnd message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_S_GameEnd
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_S_GameEnd} DDZ_S_GameEnd
         */
        DDZ_S_GameEnd.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_S_GameEnd)
                return object;
            var message = new $root.client_proto_ddz.DDZ_S_GameEnd();
            if (object.handcards) {
                if (!Array.isArray(object.handcards))
                    throw TypeError(".client_proto_ddz.DDZ_S_GameEnd.handcards: array expected");
                message.handcards = [];
                for (var i = 0; i < object.handcards.length; ++i) {
                    if (typeof object.handcards[i] !== "object")
                        throw TypeError(".client_proto_ddz.DDZ_S_GameEnd.handcards: object expected");
                    message.handcards[i] = $root.client_proto_ddz.RepeatedInt32.fromObject(object.handcards[i]);
                }
            }
            if (object.settleinfo != null) {
                if (typeof object.settleinfo !== "object")
                    throw TypeError(".client_proto_ddz.DDZ_S_GameEnd.settleinfo: object expected");
                message.settleinfo = $root.client_proto_ddz.DDZSettle.fromObject(object.settleinfo);
            }
            return message;
        };

        /**
         * Creates a plain object from a DDZ_S_GameEnd message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_S_GameEnd
         * @static
         * @param {client_proto_ddz.DDZ_S_GameEnd} message DDZ_S_GameEnd
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_S_GameEnd.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.handcards = [];
            if (options.defaults)
                object.settleinfo = null;
            if (message.handcards && message.handcards.length) {
                object.handcards = [];
                for (var j = 0; j < message.handcards.length; ++j)
                    object.handcards[j] = $root.client_proto_ddz.RepeatedInt32.toObject(message.handcards[j], options);
            }
            if (message.settleinfo != null && message.hasOwnProperty("settleinfo"))
                object.settleinfo = $root.client_proto_ddz.DDZSettle.toObject(message.settleinfo, options);
            return object;
        };

        /**
         * Converts this DDZ_S_GameEnd to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_S_GameEnd
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_S_GameEnd.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_S_GameEnd
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_S_GameEnd
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_S_GameEnd.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_S_GameEnd";
        };

        return DDZ_S_GameEnd;
    })();

    /**
     * DDZ_SUB_C_MSG_ID enum.
     * @name client_proto_ddz.DDZ_SUB_C_MSG_ID
     * @enum {number}
     * @property {number} DDZ_C_MSG_NULL=0 DDZ_C_MSG_NULL value
     * @property {number} DDZ_C_SHOW_CARDS=1 DDZ_C_SHOW_CARDS value
     * @property {number} DDZ_C_CALL_POINT=2 DDZ_C_CALL_POINT value
     * @property {number} DDZ_C_DOUBLE=3 DDZ_C_DOUBLE value
     * @property {number} DDZ_C_OUT_CARD=4 DDZ_C_OUT_CARD value
     * @property {number} DDZ_C_PASS_CARD=5 DDZ_C_PASS_CARD value
     * @property {number} DDZ_C_TRUSTEESHIP=6 DDZ_C_TRUSTEESHIP value
     * @property {number} DDZ_C_USE_MEMORY=7 DDZ_C_USE_MEMORY value
     * @property {number} DDZ_C_DISMISS=8 DDZ_C_DISMISS value
     */
    client_proto_ddz.DDZ_SUB_C_MSG_ID = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "DDZ_C_MSG_NULL"] = 0;
        values[valuesById[1] = "DDZ_C_SHOW_CARDS"] = 1;
        values[valuesById[2] = "DDZ_C_CALL_POINT"] = 2;
        values[valuesById[3] = "DDZ_C_DOUBLE"] = 3;
        values[valuesById[4] = "DDZ_C_OUT_CARD"] = 4;
        values[valuesById[5] = "DDZ_C_PASS_CARD"] = 5;
        values[valuesById[6] = "DDZ_C_TRUSTEESHIP"] = 6;
        values[valuesById[7] = "DDZ_C_USE_MEMORY"] = 7;
        values[valuesById[8] = "DDZ_C_DISMISS"] = 8;
        return values;
    })();

    client_proto_ddz.DDZ_C_ShowCards = (function() {

        /**
         * Properties of a DDZ_C_ShowCards.
         * @memberof client_proto_ddz
         * @interface IDDZ_C_ShowCards
         * @property {number|null} [times] DDZ_C_ShowCards times
         */

        /**
         * Constructs a new DDZ_C_ShowCards.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_C_ShowCards.
         * @implements IDDZ_C_ShowCards
         * @constructor
         * @param {client_proto_ddz.IDDZ_C_ShowCards=} [properties] Properties to set
         */
        function DDZ_C_ShowCards(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_C_ShowCards times.
         * @member {number} times
         * @memberof client_proto_ddz.DDZ_C_ShowCards
         * @instance
         */
        DDZ_C_ShowCards.prototype.times = 0;

        /**
         * Creates a new DDZ_C_ShowCards instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_C_ShowCards
         * @static
         * @param {client_proto_ddz.IDDZ_C_ShowCards=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_C_ShowCards} DDZ_C_ShowCards instance
         */
        DDZ_C_ShowCards.create = function create(properties) {
            return new DDZ_C_ShowCards(properties);
        };

        /**
         * Encodes the specified DDZ_C_ShowCards message. Does not implicitly {@link client_proto_ddz.DDZ_C_ShowCards.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_C_ShowCards
         * @static
         * @param {client_proto_ddz.IDDZ_C_ShowCards} message DDZ_C_ShowCards message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_C_ShowCards.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.times != null && Object.hasOwnProperty.call(message, "times"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.times);
            return writer;
        };

        /**
         * Encodes the specified DDZ_C_ShowCards message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_C_ShowCards.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_C_ShowCards
         * @static
         * @param {client_proto_ddz.IDDZ_C_ShowCards} message DDZ_C_ShowCards message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_C_ShowCards.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_C_ShowCards message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_C_ShowCards
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_C_ShowCards} DDZ_C_ShowCards
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_C_ShowCards.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_C_ShowCards();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.times = reader.int32();
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
         * Decodes a DDZ_C_ShowCards message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_C_ShowCards
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_C_ShowCards} DDZ_C_ShowCards
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_C_ShowCards.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_C_ShowCards message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_C_ShowCards
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_C_ShowCards.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.times != null && message.hasOwnProperty("times"))
                if (!$util.isInteger(message.times))
                    return "times: integer expected";
            return null;
        };

        /**
         * Creates a DDZ_C_ShowCards message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_C_ShowCards
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_C_ShowCards} DDZ_C_ShowCards
         */
        DDZ_C_ShowCards.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_C_ShowCards)
                return object;
            var message = new $root.client_proto_ddz.DDZ_C_ShowCards();
            if (object.times != null)
                message.times = object.times | 0;
            return message;
        };

        /**
         * Creates a plain object from a DDZ_C_ShowCards message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_C_ShowCards
         * @static
         * @param {client_proto_ddz.DDZ_C_ShowCards} message DDZ_C_ShowCards
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_C_ShowCards.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.times = 0;
            if (message.times != null && message.hasOwnProperty("times"))
                object.times = message.times;
            return object;
        };

        /**
         * Converts this DDZ_C_ShowCards to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_C_ShowCards
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_C_ShowCards.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_C_ShowCards
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_C_ShowCards
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_C_ShowCards.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_C_ShowCards";
        };

        return DDZ_C_ShowCards;
    })();

    client_proto_ddz.DDZ_C_CallPoint = (function() {

        /**
         * Properties of a DDZ_C_CallPoint.
         * @memberof client_proto_ddz
         * @interface IDDZ_C_CallPoint
         * @property {number|null} [point] DDZ_C_CallPoint point
         */

        /**
         * Constructs a new DDZ_C_CallPoint.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_C_CallPoint.
         * @implements IDDZ_C_CallPoint
         * @constructor
         * @param {client_proto_ddz.IDDZ_C_CallPoint=} [properties] Properties to set
         */
        function DDZ_C_CallPoint(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_C_CallPoint point.
         * @member {number} point
         * @memberof client_proto_ddz.DDZ_C_CallPoint
         * @instance
         */
        DDZ_C_CallPoint.prototype.point = 0;

        /**
         * Creates a new DDZ_C_CallPoint instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_C_CallPoint
         * @static
         * @param {client_proto_ddz.IDDZ_C_CallPoint=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_C_CallPoint} DDZ_C_CallPoint instance
         */
        DDZ_C_CallPoint.create = function create(properties) {
            return new DDZ_C_CallPoint(properties);
        };

        /**
         * Encodes the specified DDZ_C_CallPoint message. Does not implicitly {@link client_proto_ddz.DDZ_C_CallPoint.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_C_CallPoint
         * @static
         * @param {client_proto_ddz.IDDZ_C_CallPoint} message DDZ_C_CallPoint message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_C_CallPoint.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.point != null && Object.hasOwnProperty.call(message, "point"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.point);
            return writer;
        };

        /**
         * Encodes the specified DDZ_C_CallPoint message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_C_CallPoint.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_C_CallPoint
         * @static
         * @param {client_proto_ddz.IDDZ_C_CallPoint} message DDZ_C_CallPoint message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_C_CallPoint.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_C_CallPoint message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_C_CallPoint
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_C_CallPoint} DDZ_C_CallPoint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_C_CallPoint.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_C_CallPoint();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.point = reader.int32();
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
         * Decodes a DDZ_C_CallPoint message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_C_CallPoint
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_C_CallPoint} DDZ_C_CallPoint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_C_CallPoint.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_C_CallPoint message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_C_CallPoint
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_C_CallPoint.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.point != null && message.hasOwnProperty("point"))
                if (!$util.isInteger(message.point))
                    return "point: integer expected";
            return null;
        };

        /**
         * Creates a DDZ_C_CallPoint message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_C_CallPoint
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_C_CallPoint} DDZ_C_CallPoint
         */
        DDZ_C_CallPoint.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_C_CallPoint)
                return object;
            var message = new $root.client_proto_ddz.DDZ_C_CallPoint();
            if (object.point != null)
                message.point = object.point | 0;
            return message;
        };

        /**
         * Creates a plain object from a DDZ_C_CallPoint message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_C_CallPoint
         * @static
         * @param {client_proto_ddz.DDZ_C_CallPoint} message DDZ_C_CallPoint
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_C_CallPoint.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.point = 0;
            if (message.point != null && message.hasOwnProperty("point"))
                object.point = message.point;
            return object;
        };

        /**
         * Converts this DDZ_C_CallPoint to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_C_CallPoint
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_C_CallPoint.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_C_CallPoint
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_C_CallPoint
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_C_CallPoint.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_C_CallPoint";
        };

        return DDZ_C_CallPoint;
    })();

    client_proto_ddz.DDZ_C_Double = (function() {

        /**
         * Properties of a DDZ_C_Double.
         * @memberof client_proto_ddz
         * @interface IDDZ_C_Double
         * @property {number|null} [times] DDZ_C_Double times
         */

        /**
         * Constructs a new DDZ_C_Double.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_C_Double.
         * @implements IDDZ_C_Double
         * @constructor
         * @param {client_proto_ddz.IDDZ_C_Double=} [properties] Properties to set
         */
        function DDZ_C_Double(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_C_Double times.
         * @member {number} times
         * @memberof client_proto_ddz.DDZ_C_Double
         * @instance
         */
        DDZ_C_Double.prototype.times = 0;

        /**
         * Creates a new DDZ_C_Double instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_C_Double
         * @static
         * @param {client_proto_ddz.IDDZ_C_Double=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_C_Double} DDZ_C_Double instance
         */
        DDZ_C_Double.create = function create(properties) {
            return new DDZ_C_Double(properties);
        };

        /**
         * Encodes the specified DDZ_C_Double message. Does not implicitly {@link client_proto_ddz.DDZ_C_Double.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_C_Double
         * @static
         * @param {client_proto_ddz.IDDZ_C_Double} message DDZ_C_Double message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_C_Double.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.times != null && Object.hasOwnProperty.call(message, "times"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.times);
            return writer;
        };

        /**
         * Encodes the specified DDZ_C_Double message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_C_Double.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_C_Double
         * @static
         * @param {client_proto_ddz.IDDZ_C_Double} message DDZ_C_Double message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_C_Double.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_C_Double message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_C_Double
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_C_Double} DDZ_C_Double
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_C_Double.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_C_Double();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.times = reader.int32();
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
         * Decodes a DDZ_C_Double message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_C_Double
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_C_Double} DDZ_C_Double
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_C_Double.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_C_Double message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_C_Double
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_C_Double.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.times != null && message.hasOwnProperty("times"))
                if (!$util.isInteger(message.times))
                    return "times: integer expected";
            return null;
        };

        /**
         * Creates a DDZ_C_Double message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_C_Double
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_C_Double} DDZ_C_Double
         */
        DDZ_C_Double.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_C_Double)
                return object;
            var message = new $root.client_proto_ddz.DDZ_C_Double();
            if (object.times != null)
                message.times = object.times | 0;
            return message;
        };

        /**
         * Creates a plain object from a DDZ_C_Double message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_C_Double
         * @static
         * @param {client_proto_ddz.DDZ_C_Double} message DDZ_C_Double
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_C_Double.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.times = 0;
            if (message.times != null && message.hasOwnProperty("times"))
                object.times = message.times;
            return object;
        };

        /**
         * Converts this DDZ_C_Double to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_C_Double
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_C_Double.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_C_Double
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_C_Double
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_C_Double.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_C_Double";
        };

        return DDZ_C_Double;
    })();

    client_proto_ddz.DDZ_C_OutCard = (function() {

        /**
         * Properties of a DDZ_C_OutCard.
         * @memberof client_proto_ddz
         * @interface IDDZ_C_OutCard
         * @property {number|null} [cardtype] DDZ_C_OutCard cardtype
         * @property {Array.<number>|null} [cards] DDZ_C_OutCard cards
         */

        /**
         * Constructs a new DDZ_C_OutCard.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_C_OutCard.
         * @implements IDDZ_C_OutCard
         * @constructor
         * @param {client_proto_ddz.IDDZ_C_OutCard=} [properties] Properties to set
         */
        function DDZ_C_OutCard(properties) {
            this.cards = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_C_OutCard cardtype.
         * @member {number} cardtype
         * @memberof client_proto_ddz.DDZ_C_OutCard
         * @instance
         */
        DDZ_C_OutCard.prototype.cardtype = 0;

        /**
         * DDZ_C_OutCard cards.
         * @member {Array.<number>} cards
         * @memberof client_proto_ddz.DDZ_C_OutCard
         * @instance
         */
        DDZ_C_OutCard.prototype.cards = $util.emptyArray;

        /**
         * Creates a new DDZ_C_OutCard instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_C_OutCard
         * @static
         * @param {client_proto_ddz.IDDZ_C_OutCard=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_C_OutCard} DDZ_C_OutCard instance
         */
        DDZ_C_OutCard.create = function create(properties) {
            return new DDZ_C_OutCard(properties);
        };

        /**
         * Encodes the specified DDZ_C_OutCard message. Does not implicitly {@link client_proto_ddz.DDZ_C_OutCard.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_C_OutCard
         * @static
         * @param {client_proto_ddz.IDDZ_C_OutCard} message DDZ_C_OutCard message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_C_OutCard.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cardtype != null && Object.hasOwnProperty.call(message, "cardtype"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.cardtype);
            if (message.cards != null && message.cards.length) {
                writer.uint32(/* id 2, wireType 2 =*/18).fork();
                for (var i = 0; i < message.cards.length; ++i)
                    writer.int32(message.cards[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified DDZ_C_OutCard message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_C_OutCard.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_C_OutCard
         * @static
         * @param {client_proto_ddz.IDDZ_C_OutCard} message DDZ_C_OutCard message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_C_OutCard.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_C_OutCard message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_C_OutCard
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_C_OutCard} DDZ_C_OutCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_C_OutCard.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_C_OutCard();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.cardtype = reader.int32();
                        break;
                    }
                case 2: {
                        if (!(message.cards && message.cards.length))
                            message.cards = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.cards.push(reader.int32());
                        } else
                            message.cards.push(reader.int32());
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
         * Decodes a DDZ_C_OutCard message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_C_OutCard
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_C_OutCard} DDZ_C_OutCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_C_OutCard.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_C_OutCard message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_C_OutCard
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_C_OutCard.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cardtype != null && message.hasOwnProperty("cardtype"))
                if (!$util.isInteger(message.cardtype))
                    return "cardtype: integer expected";
            if (message.cards != null && message.hasOwnProperty("cards")) {
                if (!Array.isArray(message.cards))
                    return "cards: array expected";
                for (var i = 0; i < message.cards.length; ++i)
                    if (!$util.isInteger(message.cards[i]))
                        return "cards: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a DDZ_C_OutCard message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_C_OutCard
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_C_OutCard} DDZ_C_OutCard
         */
        DDZ_C_OutCard.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_C_OutCard)
                return object;
            var message = new $root.client_proto_ddz.DDZ_C_OutCard();
            if (object.cardtype != null)
                message.cardtype = object.cardtype | 0;
            if (object.cards) {
                if (!Array.isArray(object.cards))
                    throw TypeError(".client_proto_ddz.DDZ_C_OutCard.cards: array expected");
                message.cards = [];
                for (var i = 0; i < object.cards.length; ++i)
                    message.cards[i] = object.cards[i] | 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a DDZ_C_OutCard message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_C_OutCard
         * @static
         * @param {client_proto_ddz.DDZ_C_OutCard} message DDZ_C_OutCard
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_C_OutCard.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.cards = [];
            if (options.defaults)
                object.cardtype = 0;
            if (message.cardtype != null && message.hasOwnProperty("cardtype"))
                object.cardtype = message.cardtype;
            if (message.cards && message.cards.length) {
                object.cards = [];
                for (var j = 0; j < message.cards.length; ++j)
                    object.cards[j] = message.cards[j];
            }
            return object;
        };

        /**
         * Converts this DDZ_C_OutCard to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_C_OutCard
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_C_OutCard.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_C_OutCard
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_C_OutCard
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_C_OutCard.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_C_OutCard";
        };

        return DDZ_C_OutCard;
    })();

    client_proto_ddz.DDZ_C_PassCard = (function() {

        /**
         * Properties of a DDZ_C_PassCard.
         * @memberof client_proto_ddz
         * @interface IDDZ_C_PassCard
         */

        /**
         * Constructs a new DDZ_C_PassCard.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_C_PassCard.
         * @implements IDDZ_C_PassCard
         * @constructor
         * @param {client_proto_ddz.IDDZ_C_PassCard=} [properties] Properties to set
         */
        function DDZ_C_PassCard(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new DDZ_C_PassCard instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_C_PassCard
         * @static
         * @param {client_proto_ddz.IDDZ_C_PassCard=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_C_PassCard} DDZ_C_PassCard instance
         */
        DDZ_C_PassCard.create = function create(properties) {
            return new DDZ_C_PassCard(properties);
        };

        /**
         * Encodes the specified DDZ_C_PassCard message. Does not implicitly {@link client_proto_ddz.DDZ_C_PassCard.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_C_PassCard
         * @static
         * @param {client_proto_ddz.IDDZ_C_PassCard} message DDZ_C_PassCard message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_C_PassCard.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified DDZ_C_PassCard message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_C_PassCard.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_C_PassCard
         * @static
         * @param {client_proto_ddz.IDDZ_C_PassCard} message DDZ_C_PassCard message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_C_PassCard.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_C_PassCard message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_C_PassCard
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_C_PassCard} DDZ_C_PassCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_C_PassCard.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_C_PassCard();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DDZ_C_PassCard message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_C_PassCard
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_C_PassCard} DDZ_C_PassCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_C_PassCard.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_C_PassCard message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_C_PassCard
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_C_PassCard.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a DDZ_C_PassCard message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_C_PassCard
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_C_PassCard} DDZ_C_PassCard
         */
        DDZ_C_PassCard.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_C_PassCard)
                return object;
            return new $root.client_proto_ddz.DDZ_C_PassCard();
        };

        /**
         * Creates a plain object from a DDZ_C_PassCard message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_C_PassCard
         * @static
         * @param {client_proto_ddz.DDZ_C_PassCard} message DDZ_C_PassCard
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_C_PassCard.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this DDZ_C_PassCard to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_C_PassCard
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_C_PassCard.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_C_PassCard
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_C_PassCard
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_C_PassCard.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_C_PassCard";
        };

        return DDZ_C_PassCard;
    })();

    client_proto_ddz.DDZ_C_Trusteeship = (function() {

        /**
         * Properties of a DDZ_C_Trusteeship.
         * @memberof client_proto_ddz
         * @interface IDDZ_C_Trusteeship
         * @property {boolean|null} [btrusteeship] DDZ_C_Trusteeship btrusteeship
         */

        /**
         * Constructs a new DDZ_C_Trusteeship.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_C_Trusteeship.
         * @implements IDDZ_C_Trusteeship
         * @constructor
         * @param {client_proto_ddz.IDDZ_C_Trusteeship=} [properties] Properties to set
         */
        function DDZ_C_Trusteeship(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_C_Trusteeship btrusteeship.
         * @member {boolean} btrusteeship
         * @memberof client_proto_ddz.DDZ_C_Trusteeship
         * @instance
         */
        DDZ_C_Trusteeship.prototype.btrusteeship = false;

        /**
         * Creates a new DDZ_C_Trusteeship instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_C_Trusteeship
         * @static
         * @param {client_proto_ddz.IDDZ_C_Trusteeship=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_C_Trusteeship} DDZ_C_Trusteeship instance
         */
        DDZ_C_Trusteeship.create = function create(properties) {
            return new DDZ_C_Trusteeship(properties);
        };

        /**
         * Encodes the specified DDZ_C_Trusteeship message. Does not implicitly {@link client_proto_ddz.DDZ_C_Trusteeship.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_C_Trusteeship
         * @static
         * @param {client_proto_ddz.IDDZ_C_Trusteeship} message DDZ_C_Trusteeship message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_C_Trusteeship.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.btrusteeship != null && Object.hasOwnProperty.call(message, "btrusteeship"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.btrusteeship);
            return writer;
        };

        /**
         * Encodes the specified DDZ_C_Trusteeship message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_C_Trusteeship.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_C_Trusteeship
         * @static
         * @param {client_proto_ddz.IDDZ_C_Trusteeship} message DDZ_C_Trusteeship message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_C_Trusteeship.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_C_Trusteeship message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_C_Trusteeship
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_C_Trusteeship} DDZ_C_Trusteeship
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_C_Trusteeship.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_C_Trusteeship();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.btrusteeship = reader.bool();
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
         * Decodes a DDZ_C_Trusteeship message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_C_Trusteeship
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_C_Trusteeship} DDZ_C_Trusteeship
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_C_Trusteeship.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_C_Trusteeship message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_C_Trusteeship
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_C_Trusteeship.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.btrusteeship != null && message.hasOwnProperty("btrusteeship"))
                if (typeof message.btrusteeship !== "boolean")
                    return "btrusteeship: boolean expected";
            return null;
        };

        /**
         * Creates a DDZ_C_Trusteeship message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_C_Trusteeship
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_C_Trusteeship} DDZ_C_Trusteeship
         */
        DDZ_C_Trusteeship.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_C_Trusteeship)
                return object;
            var message = new $root.client_proto_ddz.DDZ_C_Trusteeship();
            if (object.btrusteeship != null)
                message.btrusteeship = Boolean(object.btrusteeship);
            return message;
        };

        /**
         * Creates a plain object from a DDZ_C_Trusteeship message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_C_Trusteeship
         * @static
         * @param {client_proto_ddz.DDZ_C_Trusteeship} message DDZ_C_Trusteeship
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_C_Trusteeship.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.btrusteeship = false;
            if (message.btrusteeship != null && message.hasOwnProperty("btrusteeship"))
                object.btrusteeship = message.btrusteeship;
            return object;
        };

        /**
         * Converts this DDZ_C_Trusteeship to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_C_Trusteeship
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_C_Trusteeship.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_C_Trusteeship
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_C_Trusteeship
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_C_Trusteeship.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_C_Trusteeship";
        };

        return DDZ_C_Trusteeship;
    })();

    client_proto_ddz.DDZ_C_UseMomory = (function() {

        /**
         * Properties of a DDZ_C_UseMomory.
         * @memberof client_proto_ddz
         * @interface IDDZ_C_UseMomory
         * @property {boolean|null} [buse] DDZ_C_UseMomory buse
         */

        /**
         * Constructs a new DDZ_C_UseMomory.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_C_UseMomory.
         * @implements IDDZ_C_UseMomory
         * @constructor
         * @param {client_proto_ddz.IDDZ_C_UseMomory=} [properties] Properties to set
         */
        function DDZ_C_UseMomory(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DDZ_C_UseMomory buse.
         * @member {boolean} buse
         * @memberof client_proto_ddz.DDZ_C_UseMomory
         * @instance
         */
        DDZ_C_UseMomory.prototype.buse = false;

        /**
         * Creates a new DDZ_C_UseMomory instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_C_UseMomory
         * @static
         * @param {client_proto_ddz.IDDZ_C_UseMomory=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_C_UseMomory} DDZ_C_UseMomory instance
         */
        DDZ_C_UseMomory.create = function create(properties) {
            return new DDZ_C_UseMomory(properties);
        };

        /**
         * Encodes the specified DDZ_C_UseMomory message. Does not implicitly {@link client_proto_ddz.DDZ_C_UseMomory.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_C_UseMomory
         * @static
         * @param {client_proto_ddz.IDDZ_C_UseMomory} message DDZ_C_UseMomory message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_C_UseMomory.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.buse != null && Object.hasOwnProperty.call(message, "buse"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.buse);
            return writer;
        };

        /**
         * Encodes the specified DDZ_C_UseMomory message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_C_UseMomory.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_C_UseMomory
         * @static
         * @param {client_proto_ddz.IDDZ_C_UseMomory} message DDZ_C_UseMomory message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_C_UseMomory.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_C_UseMomory message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_C_UseMomory
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_C_UseMomory} DDZ_C_UseMomory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_C_UseMomory.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_C_UseMomory();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.buse = reader.bool();
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
         * Decodes a DDZ_C_UseMomory message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_C_UseMomory
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_C_UseMomory} DDZ_C_UseMomory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_C_UseMomory.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_C_UseMomory message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_C_UseMomory
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_C_UseMomory.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.buse != null && message.hasOwnProperty("buse"))
                if (typeof message.buse !== "boolean")
                    return "buse: boolean expected";
            return null;
        };

        /**
         * Creates a DDZ_C_UseMomory message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_C_UseMomory
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_C_UseMomory} DDZ_C_UseMomory
         */
        DDZ_C_UseMomory.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_C_UseMomory)
                return object;
            var message = new $root.client_proto_ddz.DDZ_C_UseMomory();
            if (object.buse != null)
                message.buse = Boolean(object.buse);
            return message;
        };

        /**
         * Creates a plain object from a DDZ_C_UseMomory message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_C_UseMomory
         * @static
         * @param {client_proto_ddz.DDZ_C_UseMomory} message DDZ_C_UseMomory
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_C_UseMomory.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.buse = false;
            if (message.buse != null && message.hasOwnProperty("buse"))
                object.buse = message.buse;
            return object;
        };

        /**
         * Converts this DDZ_C_UseMomory to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_C_UseMomory
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_C_UseMomory.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_C_UseMomory
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_C_UseMomory
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_C_UseMomory.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_C_UseMomory";
        };

        return DDZ_C_UseMomory;
    })();

    client_proto_ddz.DDZ_C_Dismiss = (function() {

        /**
         * Properties of a DDZ_C_Dismiss.
         * @memberof client_proto_ddz
         * @interface IDDZ_C_Dismiss
         */

        /**
         * Constructs a new DDZ_C_Dismiss.
         * @memberof client_proto_ddz
         * @classdesc Represents a DDZ_C_Dismiss.
         * @implements IDDZ_C_Dismiss
         * @constructor
         * @param {client_proto_ddz.IDDZ_C_Dismiss=} [properties] Properties to set
         */
        function DDZ_C_Dismiss(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new DDZ_C_Dismiss instance using the specified properties.
         * @function create
         * @memberof client_proto_ddz.DDZ_C_Dismiss
         * @static
         * @param {client_proto_ddz.IDDZ_C_Dismiss=} [properties] Properties to set
         * @returns {client_proto_ddz.DDZ_C_Dismiss} DDZ_C_Dismiss instance
         */
        DDZ_C_Dismiss.create = function create(properties) {
            return new DDZ_C_Dismiss(properties);
        };

        /**
         * Encodes the specified DDZ_C_Dismiss message. Does not implicitly {@link client_proto_ddz.DDZ_C_Dismiss.verify|verify} messages.
         * @function encode
         * @memberof client_proto_ddz.DDZ_C_Dismiss
         * @static
         * @param {client_proto_ddz.IDDZ_C_Dismiss} message DDZ_C_Dismiss message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_C_Dismiss.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified DDZ_C_Dismiss message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_C_Dismiss.verify|verify} messages.
         * @function encodeDelimited
         * @memberof client_proto_ddz.DDZ_C_Dismiss
         * @static
         * @param {client_proto_ddz.IDDZ_C_Dismiss} message DDZ_C_Dismiss message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DDZ_C_Dismiss.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DDZ_C_Dismiss message from the specified reader or buffer.
         * @function decode
         * @memberof client_proto_ddz.DDZ_C_Dismiss
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {client_proto_ddz.DDZ_C_Dismiss} DDZ_C_Dismiss
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_C_Dismiss.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.client_proto_ddz.DDZ_C_Dismiss();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DDZ_C_Dismiss message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof client_proto_ddz.DDZ_C_Dismiss
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {client_proto_ddz.DDZ_C_Dismiss} DDZ_C_Dismiss
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DDZ_C_Dismiss.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DDZ_C_Dismiss message.
         * @function verify
         * @memberof client_proto_ddz.DDZ_C_Dismiss
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DDZ_C_Dismiss.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a DDZ_C_Dismiss message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof client_proto_ddz.DDZ_C_Dismiss
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {client_proto_ddz.DDZ_C_Dismiss} DDZ_C_Dismiss
         */
        DDZ_C_Dismiss.fromObject = function fromObject(object) {
            if (object instanceof $root.client_proto_ddz.DDZ_C_Dismiss)
                return object;
            return new $root.client_proto_ddz.DDZ_C_Dismiss();
        };

        /**
         * Creates a plain object from a DDZ_C_Dismiss message. Also converts values to other types if specified.
         * @function toObject
         * @memberof client_proto_ddz.DDZ_C_Dismiss
         * @static
         * @param {client_proto_ddz.DDZ_C_Dismiss} message DDZ_C_Dismiss
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DDZ_C_Dismiss.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this DDZ_C_Dismiss to JSON.
         * @function toJSON
         * @memberof client_proto_ddz.DDZ_C_Dismiss
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DDZ_C_Dismiss.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DDZ_C_Dismiss
         * @function getTypeUrl
         * @memberof client_proto_ddz.DDZ_C_Dismiss
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DDZ_C_Dismiss.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/client_proto_ddz.DDZ_C_Dismiss";
        };

        return DDZ_C_Dismiss;
    })();

    return client_proto_ddz;
})();

;

declare namespace proto {
// DO NOT EDIT! This is a generated file. Edit the JSDoc in src/*.js instead and run 'npm run build:types'.

/** Namespace client_proto_ddz. */
export namespace client_proto_ddz {

    /** Properties of a RepeatedInt32. */
    interface IRepeatedInt32 {

        /** RepeatedInt32 data */
        data?: (number[]|null);
    }

    /** Represents a RepeatedInt32. */
    class RepeatedInt32 implements IRepeatedInt32 {

        /**
         * Constructs a new RepeatedInt32.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IRepeatedInt32);

        /** RepeatedInt32 data. */
        public data: number[];

        /**
         * Creates a new RepeatedInt32 instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RepeatedInt32 instance
         */
        public static create(properties?: client_proto_ddz.IRepeatedInt32): client_proto_ddz.RepeatedInt32;

        /**
         * Encodes the specified RepeatedInt32 message. Does not implicitly {@link client_proto_ddz.RepeatedInt32.verify|verify} messages.
         * @param message RepeatedInt32 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IRepeatedInt32, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RepeatedInt32 message, length delimited. Does not implicitly {@link client_proto_ddz.RepeatedInt32.verify|verify} messages.
         * @param message RepeatedInt32 message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IRepeatedInt32, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RepeatedInt32 message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RepeatedInt32
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.RepeatedInt32;

        /**
         * Decodes a RepeatedInt32 message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RepeatedInt32
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.RepeatedInt32;

        /**
         * Verifies a RepeatedInt32 message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RepeatedInt32 message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RepeatedInt32
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.RepeatedInt32;

        /**
         * Creates a plain object from a RepeatedInt32 message. Also converts values to other types if specified.
         * @param message RepeatedInt32
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.RepeatedInt32, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RepeatedInt32 to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for RepeatedInt32
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** DDZ_TIPS enum. */
    enum DDZ_TIPS {
        DDZ_TIPS_NULL = 0,
        DDZ_TIPS_START = 1,
        DDZ_TIPS_SHOW_START = 2,
        DDZ_TIPS_CALL_START = 3,
        DDZ_TIPS_RESTART = 4,
        DDZ_TIPS_DOUBLE_START = 5,
        DDZ_TIPS_OUT_START = 6
    }

    /** DDZ_CALL_STATUS enum. */
    enum DDZ_CALL_STATUS {
        DDZ_CALL_STATUS_NULL = 0,
        DDZ_CALL_STATUS_NO_CALL = 1,
        DDZ_CALL_STATUS_CALL = 2,
        DDZ_CALL_STATUS_NO_ROB = 3,
        DDZ_CALL_STATUS_ROB_1 = 4,
        DDZ_CALL_STATUS_ROB_2 = 5,
        DDZ_CALL_STATUS_ROB_3 = 6
    }

    /** DDZ_SUB_S_MSG_ID enum. */
    enum DDZ_SUB_S_MSG_ID {
        DDZ_S_MSG_NULL = 0,
        DDZ_S_MSG_USER_ENTER = 1,
        DDZ_S_MSG_TIPS = 2,
        DDZ_S_MSG_SEND_CARD = 3,
        DDZ_S_MSG_SHOW_CARD = 4,
        DDZ_S_MSG_CALL_POINT = 5,
        DDZ_S_MSG_CALL_END = 6,
        DDZ_S_MSG_DOUBLE = 7,
        DDZ_S_MSG_OUT_CARD = 8,
        DDZ_S_MSG_PASS_CARD = 9,
        DDZ_S_MSG_USE_MEMORY = 10,
        DDZ_S_MSG_TRUSTEESHIP = 11,
        DDZ_S_MSG_RECONNECT = 12,
        DDZ_S_MSG_GAMEEND = 13
    }

    /** Properties of a DDZInfo. */
    interface IDDZInfo {

        /** DDZInfo score */
        score?: (number|Long|null);

        /** DDZInfo maxTimes */
        maxTimes?: (number|null);

        /** DDZInfo trusteeshipRound */
        trusteeshipRound?: (number|null);

        /** DDZInfo showtimes */
        showtimes?: (number|null);

        /** DDZInfo doubletimes */
        doubletimes?: (number|null);

        /** DDZInfo superdoubletimes */
        superdoubletimes?: (number|null);

        /** DDZInfo superdoubleDiamond */
        superdoubleDiamond?: (number|Long|null);

        /** DDZInfo calltimes */
        calltimes?: (number|null);
    }

    /** Represents a DDZInfo. */
    class DDZInfo implements IDDZInfo {

        /**
         * Constructs a new DDZInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZInfo);

        /** DDZInfo score. */
        public score: (number|Long);

        /** DDZInfo maxTimes. */
        public maxTimes: number;

        /** DDZInfo trusteeshipRound. */
        public trusteeshipRound: number;

        /** DDZInfo showtimes. */
        public showtimes: number;

        /** DDZInfo doubletimes. */
        public doubletimes: number;

        /** DDZInfo superdoubletimes. */
        public superdoubletimes: number;

        /** DDZInfo superdoubleDiamond. */
        public superdoubleDiamond: (number|Long);

        /** DDZInfo calltimes. */
        public calltimes: number;

        /**
         * Creates a new DDZInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZInfo instance
         */
        public static create(properties?: client_proto_ddz.IDDZInfo): client_proto_ddz.DDZInfo;

        /**
         * Encodes the specified DDZInfo message. Does not implicitly {@link client_proto_ddz.DDZInfo.verify|verify} messages.
         * @param message DDZInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZInfo message, length delimited. Does not implicitly {@link client_proto_ddz.DDZInfo.verify|verify} messages.
         * @param message DDZInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZInfo;

        /**
         * Decodes a DDZInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZInfo;

        /**
         * Verifies a DDZInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZInfo
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZInfo;

        /**
         * Creates a plain object from a DDZInfo message. Also converts values to other types if specified.
         * @param message DDZInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_S_UserEnter. */
    interface IDDZ_S_UserEnter {

        /** DDZ_S_UserEnter gameInfo */
        gameInfo?: (client_proto_ddz.IDDZInfo|null);
    }

    /** Represents a DDZ_S_UserEnter. */
    class DDZ_S_UserEnter implements IDDZ_S_UserEnter {

        /**
         * Constructs a new DDZ_S_UserEnter.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_S_UserEnter);

        /** DDZ_S_UserEnter gameInfo. */
        public gameInfo?: (client_proto_ddz.IDDZInfo|null);

        /**
         * Creates a new DDZ_S_UserEnter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_S_UserEnter instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_S_UserEnter): client_proto_ddz.DDZ_S_UserEnter;

        /**
         * Encodes the specified DDZ_S_UserEnter message. Does not implicitly {@link client_proto_ddz.DDZ_S_UserEnter.verify|verify} messages.
         * @param message DDZ_S_UserEnter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_S_UserEnter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_S_UserEnter message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_UserEnter.verify|verify} messages.
         * @param message DDZ_S_UserEnter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_S_UserEnter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_S_UserEnter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_S_UserEnter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_S_UserEnter;

        /**
         * Decodes a DDZ_S_UserEnter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_S_UserEnter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_S_UserEnter;

        /**
         * Verifies a DDZ_S_UserEnter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_S_UserEnter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_S_UserEnter
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_S_UserEnter;

        /**
         * Creates a plain object from a DDZ_S_UserEnter message. Also converts values to other types if specified.
         * @param message DDZ_S_UserEnter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_S_UserEnter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_S_UserEnter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_S_UserEnter
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_S_Tips. */
    interface IDDZ_S_Tips {

        /** DDZ_S_Tips type */
        type?: (number|null);

        /** DDZ_S_Tips countdown */
        countdown?: (number|null);

        /** DDZ_S_Tips curchair */
        curchair?: (number|null);

        /** DDZ_S_Tips bFirst */
        bFirst?: (boolean|null);
    }

    /** Represents a DDZ_S_Tips. */
    class DDZ_S_Tips implements IDDZ_S_Tips {

        /**
         * Constructs a new DDZ_S_Tips.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_S_Tips);

        /** DDZ_S_Tips type. */
        public type: number;

        /** DDZ_S_Tips countdown. */
        public countdown: number;

        /** DDZ_S_Tips curchair. */
        public curchair: number;

        /** DDZ_S_Tips bFirst. */
        public bFirst: boolean;

        /**
         * Creates a new DDZ_S_Tips instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_S_Tips instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_S_Tips): client_proto_ddz.DDZ_S_Tips;

        /**
         * Encodes the specified DDZ_S_Tips message. Does not implicitly {@link client_proto_ddz.DDZ_S_Tips.verify|verify} messages.
         * @param message DDZ_S_Tips message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_S_Tips, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_S_Tips message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_Tips.verify|verify} messages.
         * @param message DDZ_S_Tips message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_S_Tips, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_S_Tips message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_S_Tips
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_S_Tips;

        /**
         * Decodes a DDZ_S_Tips message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_S_Tips
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_S_Tips;

        /**
         * Verifies a DDZ_S_Tips message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_S_Tips message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_S_Tips
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_S_Tips;

        /**
         * Creates a plain object from a DDZ_S_Tips message. Also converts values to other types if specified.
         * @param message DDZ_S_Tips
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_S_Tips, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_S_Tips to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_S_Tips
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_S_SendCard. */
    interface IDDZ_S_SendCard {

        /** DDZ_S_SendCard sendcards */
        sendcards?: (number[]|null);
    }

    /** Represents a DDZ_S_SendCard. */
    class DDZ_S_SendCard implements IDDZ_S_SendCard {

        /**
         * Constructs a new DDZ_S_SendCard.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_S_SendCard);

        /** DDZ_S_SendCard sendcards. */
        public sendcards: number[];

        /**
         * Creates a new DDZ_S_SendCard instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_S_SendCard instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_S_SendCard): client_proto_ddz.DDZ_S_SendCard;

        /**
         * Encodes the specified DDZ_S_SendCard message. Does not implicitly {@link client_proto_ddz.DDZ_S_SendCard.verify|verify} messages.
         * @param message DDZ_S_SendCard message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_S_SendCard, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_S_SendCard message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_SendCard.verify|verify} messages.
         * @param message DDZ_S_SendCard message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_S_SendCard, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_S_SendCard message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_S_SendCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_S_SendCard;

        /**
         * Decodes a DDZ_S_SendCard message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_S_SendCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_S_SendCard;

        /**
         * Verifies a DDZ_S_SendCard message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_S_SendCard message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_S_SendCard
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_S_SendCard;

        /**
         * Creates a plain object from a DDZ_S_SendCard message. Also converts values to other types if specified.
         * @param message DDZ_S_SendCard
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_S_SendCard, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_S_SendCard to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_S_SendCard
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_S_ShowCard. */
    interface IDDZ_S_ShowCard {

        /** DDZ_S_ShowCard showchair */
        showchair?: (number|null);

        /** DDZ_S_ShowCard showcards */
        showcards?: (number[]|null);

        /** DDZ_S_ShowCard toptimes */
        toptimes?: (number|null);
    }

    /** Represents a DDZ_S_ShowCard. */
    class DDZ_S_ShowCard implements IDDZ_S_ShowCard {

        /**
         * Constructs a new DDZ_S_ShowCard.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_S_ShowCard);

        /** DDZ_S_ShowCard showchair. */
        public showchair: number;

        /** DDZ_S_ShowCard showcards. */
        public showcards: number[];

        /** DDZ_S_ShowCard toptimes. */
        public toptimes: number;

        /**
         * Creates a new DDZ_S_ShowCard instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_S_ShowCard instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_S_ShowCard): client_proto_ddz.DDZ_S_ShowCard;

        /**
         * Encodes the specified DDZ_S_ShowCard message. Does not implicitly {@link client_proto_ddz.DDZ_S_ShowCard.verify|verify} messages.
         * @param message DDZ_S_ShowCard message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_S_ShowCard, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_S_ShowCard message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_ShowCard.verify|verify} messages.
         * @param message DDZ_S_ShowCard message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_S_ShowCard, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_S_ShowCard message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_S_ShowCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_S_ShowCard;

        /**
         * Decodes a DDZ_S_ShowCard message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_S_ShowCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_S_ShowCard;

        /**
         * Verifies a DDZ_S_ShowCard message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_S_ShowCard message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_S_ShowCard
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_S_ShowCard;

        /**
         * Creates a plain object from a DDZ_S_ShowCard message. Also converts values to other types if specified.
         * @param message DDZ_S_ShowCard
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_S_ShowCard, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_S_ShowCard to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_S_ShowCard
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_S_CallPoint. */
    interface IDDZ_S_CallPoint {

        /** DDZ_S_CallPoint callchair */
        callchair?: (number|null);

        /** DDZ_S_CallPoint callcode */
        callcode?: (number|null);

        /** DDZ_S_CallPoint toppoint */
        toppoint?: (number|null);

        /** DDZ_S_CallPoint toptimes */
        toptimes?: (number|null);
    }

    /** Represents a DDZ_S_CallPoint. */
    class DDZ_S_CallPoint implements IDDZ_S_CallPoint {

        /**
         * Constructs a new DDZ_S_CallPoint.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_S_CallPoint);

        /** DDZ_S_CallPoint callchair. */
        public callchair: number;

        /** DDZ_S_CallPoint callcode. */
        public callcode: number;

        /** DDZ_S_CallPoint toppoint. */
        public toppoint: number;

        /** DDZ_S_CallPoint toptimes. */
        public toptimes: number;

        /**
         * Creates a new DDZ_S_CallPoint instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_S_CallPoint instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_S_CallPoint): client_proto_ddz.DDZ_S_CallPoint;

        /**
         * Encodes the specified DDZ_S_CallPoint message. Does not implicitly {@link client_proto_ddz.DDZ_S_CallPoint.verify|verify} messages.
         * @param message DDZ_S_CallPoint message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_S_CallPoint, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_S_CallPoint message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_CallPoint.verify|verify} messages.
         * @param message DDZ_S_CallPoint message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_S_CallPoint, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_S_CallPoint message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_S_CallPoint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_S_CallPoint;

        /**
         * Decodes a DDZ_S_CallPoint message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_S_CallPoint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_S_CallPoint;

        /**
         * Verifies a DDZ_S_CallPoint message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_S_CallPoint message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_S_CallPoint
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_S_CallPoint;

        /**
         * Creates a plain object from a DDZ_S_CallPoint message. Also converts values to other types if specified.
         * @param message DDZ_S_CallPoint
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_S_CallPoint, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_S_CallPoint to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_S_CallPoint
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_S_CallEnd. */
    interface IDDZ_S_CallEnd {

        /** DDZ_S_CallEnd bankerchair */
        bankerchair?: (number|null);

        /** DDZ_S_CallEnd backcards */
        backcards?: (number[]|null);

        /** DDZ_S_CallEnd backtimes */
        backtimes?: (number|null);
    }

    /** Represents a DDZ_S_CallEnd. */
    class DDZ_S_CallEnd implements IDDZ_S_CallEnd {

        /**
         * Constructs a new DDZ_S_CallEnd.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_S_CallEnd);

        /** DDZ_S_CallEnd bankerchair. */
        public bankerchair: number;

        /** DDZ_S_CallEnd backcards. */
        public backcards: number[];

        /** DDZ_S_CallEnd backtimes. */
        public backtimes: number;

        /**
         * Creates a new DDZ_S_CallEnd instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_S_CallEnd instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_S_CallEnd): client_proto_ddz.DDZ_S_CallEnd;

        /**
         * Encodes the specified DDZ_S_CallEnd message. Does not implicitly {@link client_proto_ddz.DDZ_S_CallEnd.verify|verify} messages.
         * @param message DDZ_S_CallEnd message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_S_CallEnd, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_S_CallEnd message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_CallEnd.verify|verify} messages.
         * @param message DDZ_S_CallEnd message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_S_CallEnd, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_S_CallEnd message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_S_CallEnd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_S_CallEnd;

        /**
         * Decodes a DDZ_S_CallEnd message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_S_CallEnd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_S_CallEnd;

        /**
         * Verifies a DDZ_S_CallEnd message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_S_CallEnd message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_S_CallEnd
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_S_CallEnd;

        /**
         * Creates a plain object from a DDZ_S_CallEnd message. Also converts values to other types if specified.
         * @param message DDZ_S_CallEnd
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_S_CallEnd, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_S_CallEnd to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_S_CallEnd
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_S_Double. */
    interface IDDZ_S_Double {

        /** DDZ_S_Double opechair */
        opechair?: (number|null);

        /** DDZ_S_Double opetimes */
        opetimes?: (number|null);

        /** DDZ_S_Double toptimes */
        toptimes?: (number|null);
    }

    /** Represents a DDZ_S_Double. */
    class DDZ_S_Double implements IDDZ_S_Double {

        /**
         * Constructs a new DDZ_S_Double.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_S_Double);

        /** DDZ_S_Double opechair. */
        public opechair: number;

        /** DDZ_S_Double opetimes. */
        public opetimes: number;

        /** DDZ_S_Double toptimes. */
        public toptimes: number;

        /**
         * Creates a new DDZ_S_Double instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_S_Double instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_S_Double): client_proto_ddz.DDZ_S_Double;

        /**
         * Encodes the specified DDZ_S_Double message. Does not implicitly {@link client_proto_ddz.DDZ_S_Double.verify|verify} messages.
         * @param message DDZ_S_Double message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_S_Double, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_S_Double message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_Double.verify|verify} messages.
         * @param message DDZ_S_Double message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_S_Double, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_S_Double message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_S_Double
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_S_Double;

        /**
         * Decodes a DDZ_S_Double message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_S_Double
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_S_Double;

        /**
         * Verifies a DDZ_S_Double message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_S_Double message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_S_Double
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_S_Double;

        /**
         * Creates a plain object from a DDZ_S_Double message. Also converts values to other types if specified.
         * @param message DDZ_S_Double
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_S_Double, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_S_Double to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_S_Double
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_S_OutCard. */
    interface IDDZ_S_OutCard {

        /** DDZ_S_OutCard outchair */
        outchair?: (number|null);

        /** DDZ_S_OutCard outcards */
        outcards?: (number[]|null);

        /** DDZ_S_OutCard cardtype */
        cardtype?: (number|null);

        /** DDZ_S_OutCard toptimes */
        toptimes?: (number|null);
    }

    /** Represents a DDZ_S_OutCard. */
    class DDZ_S_OutCard implements IDDZ_S_OutCard {

        /**
         * Constructs a new DDZ_S_OutCard.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_S_OutCard);

        /** DDZ_S_OutCard outchair. */
        public outchair: number;

        /** DDZ_S_OutCard outcards. */
        public outcards: number[];

        /** DDZ_S_OutCard cardtype. */
        public cardtype: number;

        /** DDZ_S_OutCard toptimes. */
        public toptimes: number;

        /**
         * Creates a new DDZ_S_OutCard instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_S_OutCard instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_S_OutCard): client_proto_ddz.DDZ_S_OutCard;

        /**
         * Encodes the specified DDZ_S_OutCard message. Does not implicitly {@link client_proto_ddz.DDZ_S_OutCard.verify|verify} messages.
         * @param message DDZ_S_OutCard message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_S_OutCard, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_S_OutCard message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_OutCard.verify|verify} messages.
         * @param message DDZ_S_OutCard message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_S_OutCard, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_S_OutCard message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_S_OutCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_S_OutCard;

        /**
         * Decodes a DDZ_S_OutCard message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_S_OutCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_S_OutCard;

        /**
         * Verifies a DDZ_S_OutCard message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_S_OutCard message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_S_OutCard
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_S_OutCard;

        /**
         * Creates a plain object from a DDZ_S_OutCard message. Also converts values to other types if specified.
         * @param message DDZ_S_OutCard
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_S_OutCard, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_S_OutCard to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_S_OutCard
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_S_PassCard. */
    interface IDDZ_S_PassCard {

        /** DDZ_S_PassCard passchair */
        passchair?: (number|null);
    }

    /** Represents a DDZ_S_PassCard. */
    class DDZ_S_PassCard implements IDDZ_S_PassCard {

        /**
         * Constructs a new DDZ_S_PassCard.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_S_PassCard);

        /** DDZ_S_PassCard passchair. */
        public passchair: number;

        /**
         * Creates a new DDZ_S_PassCard instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_S_PassCard instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_S_PassCard): client_proto_ddz.DDZ_S_PassCard;

        /**
         * Encodes the specified DDZ_S_PassCard message. Does not implicitly {@link client_proto_ddz.DDZ_S_PassCard.verify|verify} messages.
         * @param message DDZ_S_PassCard message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_S_PassCard, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_S_PassCard message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_PassCard.verify|verify} messages.
         * @param message DDZ_S_PassCard message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_S_PassCard, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_S_PassCard message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_S_PassCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_S_PassCard;

        /**
         * Decodes a DDZ_S_PassCard message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_S_PassCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_S_PassCard;

        /**
         * Verifies a DDZ_S_PassCard message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_S_PassCard message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_S_PassCard
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_S_PassCard;

        /**
         * Creates a plain object from a DDZ_S_PassCard message. Also converts values to other types if specified.
         * @param message DDZ_S_PassCard
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_S_PassCard, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_S_PassCard to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_S_PassCard
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_S_UseMemory. */
    interface IDDZ_S_UseMemory {

        /** DDZ_S_UseMemory recordindex */
        recordindex?: (number[]|null);
    }

    /** Represents a DDZ_S_UseMemory. */
    class DDZ_S_UseMemory implements IDDZ_S_UseMemory {

        /**
         * Constructs a new DDZ_S_UseMemory.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_S_UseMemory);

        /** DDZ_S_UseMemory recordindex. */
        public recordindex: number[];

        /**
         * Creates a new DDZ_S_UseMemory instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_S_UseMemory instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_S_UseMemory): client_proto_ddz.DDZ_S_UseMemory;

        /**
         * Encodes the specified DDZ_S_UseMemory message. Does not implicitly {@link client_proto_ddz.DDZ_S_UseMemory.verify|verify} messages.
         * @param message DDZ_S_UseMemory message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_S_UseMemory, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_S_UseMemory message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_UseMemory.verify|verify} messages.
         * @param message DDZ_S_UseMemory message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_S_UseMemory, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_S_UseMemory message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_S_UseMemory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_S_UseMemory;

        /**
         * Decodes a DDZ_S_UseMemory message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_S_UseMemory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_S_UseMemory;

        /**
         * Verifies a DDZ_S_UseMemory message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_S_UseMemory message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_S_UseMemory
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_S_UseMemory;

        /**
         * Creates a plain object from a DDZ_S_UseMemory message. Also converts values to other types if specified.
         * @param message DDZ_S_UseMemory
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_S_UseMemory, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_S_UseMemory to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_S_UseMemory
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_S_Trusteeship. */
    interface IDDZ_S_Trusteeship {

        /** DDZ_S_Trusteeship chair */
        chair?: (number|null);

        /** DDZ_S_Trusteeship trusteeship */
        trusteeship?: (boolean|null);
    }

    /** Represents a DDZ_S_Trusteeship. */
    class DDZ_S_Trusteeship implements IDDZ_S_Trusteeship {

        /**
         * Constructs a new DDZ_S_Trusteeship.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_S_Trusteeship);

        /** DDZ_S_Trusteeship chair. */
        public chair: number;

        /** DDZ_S_Trusteeship trusteeship. */
        public trusteeship: boolean;

        /**
         * Creates a new DDZ_S_Trusteeship instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_S_Trusteeship instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_S_Trusteeship): client_proto_ddz.DDZ_S_Trusteeship;

        /**
         * Encodes the specified DDZ_S_Trusteeship message. Does not implicitly {@link client_proto_ddz.DDZ_S_Trusteeship.verify|verify} messages.
         * @param message DDZ_S_Trusteeship message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_S_Trusteeship, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_S_Trusteeship message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_Trusteeship.verify|verify} messages.
         * @param message DDZ_S_Trusteeship message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_S_Trusteeship, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_S_Trusteeship message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_S_Trusteeship
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_S_Trusteeship;

        /**
         * Decodes a DDZ_S_Trusteeship message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_S_Trusteeship
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_S_Trusteeship;

        /**
         * Verifies a DDZ_S_Trusteeship message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_S_Trusteeship message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_S_Trusteeship
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_S_Trusteeship;

        /**
         * Creates a plain object from a DDZ_S_Trusteeship message. Also converts values to other types if specified.
         * @param message DDZ_S_Trusteeship
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_S_Trusteeship, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_S_Trusteeship to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_S_Trusteeship
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZSettle. */
    interface IDDZSettle {

        /** DDZSettle toptimes */
        toptimes?: (number[]|null);

        /** DDZSettle golds */
        golds?: ((number|Long)[]|null);

        /** DDZSettle broke */
        broke?: (boolean[]|null);

        /** DDZSettle toplimit */
        toplimit?: (boolean[]|null);

        /** DDZSettle baopei */
        baopei?: (boolean[]|null);

        /** DDZSettle doubletimes */
        doubletimes?: (number[]|null);

        /** DDZSettle flag */
        flag?: (number|null);
    }

    /** Represents a DDZSettle. */
    class DDZSettle implements IDDZSettle {

        /**
         * Constructs a new DDZSettle.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZSettle);

        /** DDZSettle toptimes. */
        public toptimes: number[];

        /** DDZSettle golds. */
        public golds: (number|Long)[];

        /** DDZSettle broke. */
        public broke: boolean[];

        /** DDZSettle toplimit. */
        public toplimit: boolean[];

        /** DDZSettle baopei. */
        public baopei: boolean[];

        /** DDZSettle doubletimes. */
        public doubletimes: number[];

        /** DDZSettle flag. */
        public flag: number;

        /**
         * Creates a new DDZSettle instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZSettle instance
         */
        public static create(properties?: client_proto_ddz.IDDZSettle): client_proto_ddz.DDZSettle;

        /**
         * Encodes the specified DDZSettle message. Does not implicitly {@link client_proto_ddz.DDZSettle.verify|verify} messages.
         * @param message DDZSettle message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZSettle, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZSettle message, length delimited. Does not implicitly {@link client_proto_ddz.DDZSettle.verify|verify} messages.
         * @param message DDZSettle message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZSettle, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZSettle message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZSettle
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZSettle;

        /**
         * Decodes a DDZSettle message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZSettle
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZSettle;

        /**
         * Verifies a DDZSettle message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZSettle message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZSettle
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZSettle;

        /**
         * Creates a plain object from a DDZSettle message. Also converts values to other types if specified.
         * @param message DDZSettle
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZSettle, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZSettle to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZSettle
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_S_Reconnect. */
    interface IDDZ_S_Reconnect {

        /** DDZ_S_Reconnect gameInfo */
        gameInfo?: (client_proto_ddz.IDDZInfo|null);

        /** DDZ_S_Reconnect gamestate */
        gamestate?: (number|null);

        /** DDZ_S_Reconnect toptimes */
        toptimes?: (number|null);

        /** DDZ_S_Reconnect bankerchair */
        bankerchair?: (number|null);

        /** DDZ_S_Reconnect curchair */
        curchair?: (number|null);

        /** DDZ_S_Reconnect handcards */
        handcards?: (client_proto_ddz.IRepeatedInt32[]|null);

        /** DDZ_S_Reconnect backcards */
        backcards?: (number[]|null);

        /** DDZ_S_Reconnect backtimes */
        backtimes?: (number|null);

        /** DDZ_S_Reconnect btrusteeship */
        btrusteeship?: (boolean[]|null);

        /** DDZ_S_Reconnect usememory */
        usememory?: (number|null);

        /** DDZ_S_Reconnect recordindex */
        recordindex?: (number[]|null);

        /** DDZ_S_Reconnect countdown */
        countdown?: (number|null);

        /** DDZ_S_Reconnect bshow */
        bshow?: (boolean[]|null);

        /** DDZ_S_Reconnect historycall */
        historycall?: (number[]|null);

        /** DDZ_S_Reconnect historychair */
        historychair?: (number[]|null);

        /** DDZ_S_Reconnect toppoint */
        toppoint?: (number|null);

        /** DDZ_S_Reconnect bdouble */
        bdouble?: (boolean[]|null);

        /** DDZ_S_Reconnect doubletimes */
        doubletimes?: (number[]|null);

        /** DDZ_S_Reconnect turnwinner */
        turnwinner?: (number|null);

        /** DDZ_S_Reconnect turncards */
        turncards?: (client_proto_ddz.IRepeatedInt32[]|null);

        /** DDZ_S_Reconnect passornull */
        passornull?: (boolean[]|null);

        /** DDZ_S_Reconnect settleinfo */
        settleinfo?: (client_proto_ddz.IDDZSettle|null);
    }

    /** Represents a DDZ_S_Reconnect. */
    class DDZ_S_Reconnect implements IDDZ_S_Reconnect {

        /**
         * Constructs a new DDZ_S_Reconnect.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_S_Reconnect);

        /** DDZ_S_Reconnect gameInfo. */
        public gameInfo?: (client_proto_ddz.IDDZInfo|null);

        /** DDZ_S_Reconnect gamestate. */
        public gamestate: number;

        /** DDZ_S_Reconnect toptimes. */
        public toptimes: number;

        /** DDZ_S_Reconnect bankerchair. */
        public bankerchair: number;

        /** DDZ_S_Reconnect curchair. */
        public curchair: number;

        /** DDZ_S_Reconnect handcards. */
        public handcards: client_proto_ddz.IRepeatedInt32[];

        /** DDZ_S_Reconnect backcards. */
        public backcards: number[];

        /** DDZ_S_Reconnect backtimes. */
        public backtimes: number;

        /** DDZ_S_Reconnect btrusteeship. */
        public btrusteeship: boolean[];

        /** DDZ_S_Reconnect usememory. */
        public usememory: number;

        /** DDZ_S_Reconnect recordindex. */
        public recordindex: number[];

        /** DDZ_S_Reconnect countdown. */
        public countdown: number;

        /** DDZ_S_Reconnect bshow. */
        public bshow: boolean[];

        /** DDZ_S_Reconnect historycall. */
        public historycall: number[];

        /** DDZ_S_Reconnect historychair. */
        public historychair: number[];

        /** DDZ_S_Reconnect toppoint. */
        public toppoint: number;

        /** DDZ_S_Reconnect bdouble. */
        public bdouble: boolean[];

        /** DDZ_S_Reconnect doubletimes. */
        public doubletimes: number[];

        /** DDZ_S_Reconnect turnwinner. */
        public turnwinner: number;

        /** DDZ_S_Reconnect turncards. */
        public turncards: client_proto_ddz.IRepeatedInt32[];

        /** DDZ_S_Reconnect passornull. */
        public passornull: boolean[];

        /** DDZ_S_Reconnect settleinfo. */
        public settleinfo?: (client_proto_ddz.IDDZSettle|null);

        /**
         * Creates a new DDZ_S_Reconnect instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_S_Reconnect instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_S_Reconnect): client_proto_ddz.DDZ_S_Reconnect;

        /**
         * Encodes the specified DDZ_S_Reconnect message. Does not implicitly {@link client_proto_ddz.DDZ_S_Reconnect.verify|verify} messages.
         * @param message DDZ_S_Reconnect message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_S_Reconnect, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_S_Reconnect message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_Reconnect.verify|verify} messages.
         * @param message DDZ_S_Reconnect message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_S_Reconnect, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_S_Reconnect message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_S_Reconnect
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_S_Reconnect;

        /**
         * Decodes a DDZ_S_Reconnect message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_S_Reconnect
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_S_Reconnect;

        /**
         * Verifies a DDZ_S_Reconnect message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_S_Reconnect message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_S_Reconnect
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_S_Reconnect;

        /**
         * Creates a plain object from a DDZ_S_Reconnect message. Also converts values to other types if specified.
         * @param message DDZ_S_Reconnect
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_S_Reconnect, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_S_Reconnect to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_S_Reconnect
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_S_GameEnd. */
    interface IDDZ_S_GameEnd {

        /** DDZ_S_GameEnd handcards */
        handcards?: (client_proto_ddz.IRepeatedInt32[]|null);

        /** DDZ_S_GameEnd settleinfo */
        settleinfo?: (client_proto_ddz.IDDZSettle|null);
    }

    /** Represents a DDZ_S_GameEnd. */
    class DDZ_S_GameEnd implements IDDZ_S_GameEnd {

        /**
         * Constructs a new DDZ_S_GameEnd.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_S_GameEnd);

        /** DDZ_S_GameEnd handcards. */
        public handcards: client_proto_ddz.IRepeatedInt32[];

        /** DDZ_S_GameEnd settleinfo. */
        public settleinfo?: (client_proto_ddz.IDDZSettle|null);

        /**
         * Creates a new DDZ_S_GameEnd instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_S_GameEnd instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_S_GameEnd): client_proto_ddz.DDZ_S_GameEnd;

        /**
         * Encodes the specified DDZ_S_GameEnd message. Does not implicitly {@link client_proto_ddz.DDZ_S_GameEnd.verify|verify} messages.
         * @param message DDZ_S_GameEnd message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_S_GameEnd, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_S_GameEnd message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_S_GameEnd.verify|verify} messages.
         * @param message DDZ_S_GameEnd message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_S_GameEnd, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_S_GameEnd message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_S_GameEnd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_S_GameEnd;

        /**
         * Decodes a DDZ_S_GameEnd message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_S_GameEnd
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_S_GameEnd;

        /**
         * Verifies a DDZ_S_GameEnd message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_S_GameEnd message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_S_GameEnd
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_S_GameEnd;

        /**
         * Creates a plain object from a DDZ_S_GameEnd message. Also converts values to other types if specified.
         * @param message DDZ_S_GameEnd
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_S_GameEnd, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_S_GameEnd to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_S_GameEnd
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** DDZ_SUB_C_MSG_ID enum. */
    enum DDZ_SUB_C_MSG_ID {
        DDZ_C_MSG_NULL = 0,
        DDZ_C_SHOW_CARDS = 1,
        DDZ_C_CALL_POINT = 2,
        DDZ_C_DOUBLE = 3,
        DDZ_C_OUT_CARD = 4,
        DDZ_C_PASS_CARD = 5,
        DDZ_C_TRUSTEESHIP = 6,
        DDZ_C_USE_MEMORY = 7,
        DDZ_C_DISMISS = 8
    }

    /** Properties of a DDZ_C_ShowCards. */
    interface IDDZ_C_ShowCards {

        /** DDZ_C_ShowCards times */
        times?: (number|null);
    }

    /** Represents a DDZ_C_ShowCards. */
    class DDZ_C_ShowCards implements IDDZ_C_ShowCards {

        /**
         * Constructs a new DDZ_C_ShowCards.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_C_ShowCards);

        /** DDZ_C_ShowCards times. */
        public times: number;

        /**
         * Creates a new DDZ_C_ShowCards instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_C_ShowCards instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_C_ShowCards): client_proto_ddz.DDZ_C_ShowCards;

        /**
         * Encodes the specified DDZ_C_ShowCards message. Does not implicitly {@link client_proto_ddz.DDZ_C_ShowCards.verify|verify} messages.
         * @param message DDZ_C_ShowCards message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_C_ShowCards, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_C_ShowCards message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_C_ShowCards.verify|verify} messages.
         * @param message DDZ_C_ShowCards message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_C_ShowCards, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_C_ShowCards message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_C_ShowCards
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_C_ShowCards;

        /**
         * Decodes a DDZ_C_ShowCards message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_C_ShowCards
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_C_ShowCards;

        /**
         * Verifies a DDZ_C_ShowCards message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_C_ShowCards message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_C_ShowCards
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_C_ShowCards;

        /**
         * Creates a plain object from a DDZ_C_ShowCards message. Also converts values to other types if specified.
         * @param message DDZ_C_ShowCards
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_C_ShowCards, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_C_ShowCards to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_C_ShowCards
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_C_CallPoint. */
    interface IDDZ_C_CallPoint {

        /** DDZ_C_CallPoint point */
        point?: (number|null);
    }

    /** Represents a DDZ_C_CallPoint. */
    class DDZ_C_CallPoint implements IDDZ_C_CallPoint {

        /**
         * Constructs a new DDZ_C_CallPoint.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_C_CallPoint);

        /** DDZ_C_CallPoint point. */
        public point: number;

        /**
         * Creates a new DDZ_C_CallPoint instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_C_CallPoint instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_C_CallPoint): client_proto_ddz.DDZ_C_CallPoint;

        /**
         * Encodes the specified DDZ_C_CallPoint message. Does not implicitly {@link client_proto_ddz.DDZ_C_CallPoint.verify|verify} messages.
         * @param message DDZ_C_CallPoint message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_C_CallPoint, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_C_CallPoint message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_C_CallPoint.verify|verify} messages.
         * @param message DDZ_C_CallPoint message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_C_CallPoint, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_C_CallPoint message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_C_CallPoint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_C_CallPoint;

        /**
         * Decodes a DDZ_C_CallPoint message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_C_CallPoint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_C_CallPoint;

        /**
         * Verifies a DDZ_C_CallPoint message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_C_CallPoint message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_C_CallPoint
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_C_CallPoint;

        /**
         * Creates a plain object from a DDZ_C_CallPoint message. Also converts values to other types if specified.
         * @param message DDZ_C_CallPoint
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_C_CallPoint, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_C_CallPoint to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_C_CallPoint
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_C_Double. */
    interface IDDZ_C_Double {

        /** DDZ_C_Double times */
        times?: (number|null);
    }

    /** Represents a DDZ_C_Double. */
    class DDZ_C_Double implements IDDZ_C_Double {

        /**
         * Constructs a new DDZ_C_Double.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_C_Double);

        /** DDZ_C_Double times. */
        public times: number;

        /**
         * Creates a new DDZ_C_Double instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_C_Double instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_C_Double): client_proto_ddz.DDZ_C_Double;

        /**
         * Encodes the specified DDZ_C_Double message. Does not implicitly {@link client_proto_ddz.DDZ_C_Double.verify|verify} messages.
         * @param message DDZ_C_Double message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_C_Double, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_C_Double message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_C_Double.verify|verify} messages.
         * @param message DDZ_C_Double message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_C_Double, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_C_Double message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_C_Double
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_C_Double;

        /**
         * Decodes a DDZ_C_Double message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_C_Double
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_C_Double;

        /**
         * Verifies a DDZ_C_Double message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_C_Double message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_C_Double
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_C_Double;

        /**
         * Creates a plain object from a DDZ_C_Double message. Also converts values to other types if specified.
         * @param message DDZ_C_Double
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_C_Double, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_C_Double to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_C_Double
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_C_OutCard. */
    interface IDDZ_C_OutCard {

        /** DDZ_C_OutCard cardtype */
        cardtype?: (number|null);

        /** DDZ_C_OutCard cards */
        cards?: (number[]|null);
    }

    /** Represents a DDZ_C_OutCard. */
    class DDZ_C_OutCard implements IDDZ_C_OutCard {

        /**
         * Constructs a new DDZ_C_OutCard.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_C_OutCard);

        /** DDZ_C_OutCard cardtype. */
        public cardtype: number;

        /** DDZ_C_OutCard cards. */
        public cards: number[];

        /**
         * Creates a new DDZ_C_OutCard instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_C_OutCard instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_C_OutCard): client_proto_ddz.DDZ_C_OutCard;

        /**
         * Encodes the specified DDZ_C_OutCard message. Does not implicitly {@link client_proto_ddz.DDZ_C_OutCard.verify|verify} messages.
         * @param message DDZ_C_OutCard message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_C_OutCard, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_C_OutCard message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_C_OutCard.verify|verify} messages.
         * @param message DDZ_C_OutCard message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_C_OutCard, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_C_OutCard message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_C_OutCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_C_OutCard;

        /**
         * Decodes a DDZ_C_OutCard message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_C_OutCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_C_OutCard;

        /**
         * Verifies a DDZ_C_OutCard message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_C_OutCard message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_C_OutCard
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_C_OutCard;

        /**
         * Creates a plain object from a DDZ_C_OutCard message. Also converts values to other types if specified.
         * @param message DDZ_C_OutCard
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_C_OutCard, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_C_OutCard to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_C_OutCard
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_C_PassCard. */
    interface IDDZ_C_PassCard {
    }

    /** Represents a DDZ_C_PassCard. */
    class DDZ_C_PassCard implements IDDZ_C_PassCard {

        /**
         * Constructs a new DDZ_C_PassCard.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_C_PassCard);

        /**
         * Creates a new DDZ_C_PassCard instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_C_PassCard instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_C_PassCard): client_proto_ddz.DDZ_C_PassCard;

        /**
         * Encodes the specified DDZ_C_PassCard message. Does not implicitly {@link client_proto_ddz.DDZ_C_PassCard.verify|verify} messages.
         * @param message DDZ_C_PassCard message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_C_PassCard, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_C_PassCard message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_C_PassCard.verify|verify} messages.
         * @param message DDZ_C_PassCard message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_C_PassCard, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_C_PassCard message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_C_PassCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_C_PassCard;

        /**
         * Decodes a DDZ_C_PassCard message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_C_PassCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_C_PassCard;

        /**
         * Verifies a DDZ_C_PassCard message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_C_PassCard message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_C_PassCard
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_C_PassCard;

        /**
         * Creates a plain object from a DDZ_C_PassCard message. Also converts values to other types if specified.
         * @param message DDZ_C_PassCard
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_C_PassCard, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_C_PassCard to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_C_PassCard
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_C_Trusteeship. */
    interface IDDZ_C_Trusteeship {

        /** DDZ_C_Trusteeship btrusteeship */
        btrusteeship?: (boolean|null);
    }

    /** Represents a DDZ_C_Trusteeship. */
    class DDZ_C_Trusteeship implements IDDZ_C_Trusteeship {

        /**
         * Constructs a new DDZ_C_Trusteeship.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_C_Trusteeship);

        /** DDZ_C_Trusteeship btrusteeship. */
        public btrusteeship: boolean;

        /**
         * Creates a new DDZ_C_Trusteeship instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_C_Trusteeship instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_C_Trusteeship): client_proto_ddz.DDZ_C_Trusteeship;

        /**
         * Encodes the specified DDZ_C_Trusteeship message. Does not implicitly {@link client_proto_ddz.DDZ_C_Trusteeship.verify|verify} messages.
         * @param message DDZ_C_Trusteeship message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_C_Trusteeship, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_C_Trusteeship message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_C_Trusteeship.verify|verify} messages.
         * @param message DDZ_C_Trusteeship message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_C_Trusteeship, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_C_Trusteeship message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_C_Trusteeship
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_C_Trusteeship;

        /**
         * Decodes a DDZ_C_Trusteeship message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_C_Trusteeship
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_C_Trusteeship;

        /**
         * Verifies a DDZ_C_Trusteeship message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_C_Trusteeship message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_C_Trusteeship
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_C_Trusteeship;

        /**
         * Creates a plain object from a DDZ_C_Trusteeship message. Also converts values to other types if specified.
         * @param message DDZ_C_Trusteeship
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_C_Trusteeship, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_C_Trusteeship to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_C_Trusteeship
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_C_UseMomory. */
    interface IDDZ_C_UseMomory {

        /** DDZ_C_UseMomory buse */
        buse?: (boolean|null);
    }

    /** Represents a DDZ_C_UseMomory. */
    class DDZ_C_UseMomory implements IDDZ_C_UseMomory {

        /**
         * Constructs a new DDZ_C_UseMomory.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_C_UseMomory);

        /** DDZ_C_UseMomory buse. */
        public buse: boolean;

        /**
         * Creates a new DDZ_C_UseMomory instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_C_UseMomory instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_C_UseMomory): client_proto_ddz.DDZ_C_UseMomory;

        /**
         * Encodes the specified DDZ_C_UseMomory message. Does not implicitly {@link client_proto_ddz.DDZ_C_UseMomory.verify|verify} messages.
         * @param message DDZ_C_UseMomory message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_C_UseMomory, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_C_UseMomory message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_C_UseMomory.verify|verify} messages.
         * @param message DDZ_C_UseMomory message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_C_UseMomory, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_C_UseMomory message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_C_UseMomory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_C_UseMomory;

        /**
         * Decodes a DDZ_C_UseMomory message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_C_UseMomory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_C_UseMomory;

        /**
         * Verifies a DDZ_C_UseMomory message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_C_UseMomory message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_C_UseMomory
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_C_UseMomory;

        /**
         * Creates a plain object from a DDZ_C_UseMomory message. Also converts values to other types if specified.
         * @param message DDZ_C_UseMomory
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_C_UseMomory, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_C_UseMomory to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_C_UseMomory
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DDZ_C_Dismiss. */
    interface IDDZ_C_Dismiss {
    }

    /** Represents a DDZ_C_Dismiss. */
    class DDZ_C_Dismiss implements IDDZ_C_Dismiss {

        /**
         * Constructs a new DDZ_C_Dismiss.
         * @param [properties] Properties to set
         */
        constructor(properties?: client_proto_ddz.IDDZ_C_Dismiss);

        /**
         * Creates a new DDZ_C_Dismiss instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DDZ_C_Dismiss instance
         */
        public static create(properties?: client_proto_ddz.IDDZ_C_Dismiss): client_proto_ddz.DDZ_C_Dismiss;

        /**
         * Encodes the specified DDZ_C_Dismiss message. Does not implicitly {@link client_proto_ddz.DDZ_C_Dismiss.verify|verify} messages.
         * @param message DDZ_C_Dismiss message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: client_proto_ddz.IDDZ_C_Dismiss, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DDZ_C_Dismiss message, length delimited. Does not implicitly {@link client_proto_ddz.DDZ_C_Dismiss.verify|verify} messages.
         * @param message DDZ_C_Dismiss message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: client_proto_ddz.IDDZ_C_Dismiss, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DDZ_C_Dismiss message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DDZ_C_Dismiss
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): client_proto_ddz.DDZ_C_Dismiss;

        /**
         * Decodes a DDZ_C_Dismiss message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DDZ_C_Dismiss
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): client_proto_ddz.DDZ_C_Dismiss;

        /**
         * Verifies a DDZ_C_Dismiss message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DDZ_C_Dismiss message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DDZ_C_Dismiss
         */
        public static fromObject(object: { [k: string]: any }): client_proto_ddz.DDZ_C_Dismiss;

        /**
         * Creates a plain object from a DDZ_C_Dismiss message. Also converts values to other types if specified.
         * @param message DDZ_C_Dismiss
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: client_proto_ddz.DDZ_C_Dismiss, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DDZ_C_Dismiss to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DDZ_C_Dismiss
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}

}
var proto = $root;
export default proto;
