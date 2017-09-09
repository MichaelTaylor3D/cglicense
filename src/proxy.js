/**
 * @module Proxy
 */
(function (exports) {
	var RpcClient = (function () {
		try {
			return require('json-ws/client');
		} catch (e) {
			return exports.RpcClient;
		}
	}());
	var inherits = RpcClient.ports.inherits;
	var EventEmitter = RpcClient.ports.EventEmitter;
	var RpcTunnel = RpcClient.tunnel;

	/**
	 * @constructor
	 * @alias module:Proxy.Proxy
	 */
	var Proxy = exports.Proxy = function Proxy(url, sslSettings) {
		if (!this instanceof Proxy) {
			return new Proxy(url);
		}
		if (!url || typeof url !== 'string') {
			throw new Error('Invalid proxy URL');
		}
		var self = this;
		this.defaultTransport = 'http';
		this.rpc = new RpcTunnel(url, sslSettings);
		this.rpc.on('event', function(e) {
			self.emit(e.name, e.data);
		});
		function rebind(obj) {
			var result = {};
			for (var i in obj) {
				var prop = obj[i];
				if (typeof prop === 'function') {
					result[i] = prop.bind(self);
				} else if (typeof prop === 'object') {
					result[i] = rebind(prop);
				}
			}
			return result;
		}
		for (var i in this) {
			if (this[i] && this[i]._ns) {
				this[i] = rebind(this[i]);
			}
		}
	};
	inherits(Proxy, EventEmitter);
	Object.defineProperty(Proxy, 'VERSION', { value: '1.0'});

	Proxy.prototype.useHTTP = function() {
		this.defaultTransport = 'http';
		return this;
	};

	Proxy.prototype.useWS = function() {
		this.defaultTransport = 'ws';
		return this;
	};

	Proxy.prototype.close = function() {
		this.rpc.close();
	};

	Proxy.prototype.on = Proxy.prototype.addListener = function(type, listener) {
		if (this.listeners(type).length == 0) {
			this.rpc.call({ method: 'rpc.on', params: [type], transport: 'ws' });
		}
		EventEmitter.prototype.addListener.call(this, type, listener);
	};

	Proxy.prototype.removeListener = function(type, listener) {
		EventEmitter.prototype.removeListener.call(this, type, listener);
		if (this.listeners(type).length == 0) {
			this.rpc.call({ method: 'rpc.off', params: [type], transport: 'ws' });
		}
	};

	Proxy.prototype.removeAllListeners = function(type) {
		EventEmitter.prototype.removeAllListeners.call(this, type);
		this.rpc.call({ method: 'rpc.off', params: [type], transport: 'ws' });
	};

	/** 
	 * Parameters to use when querying for render time. Current version provides time interval specification only. 
	 * @typedef {Object} module:Proxy.Proxy.QueryParameters
	 * @property {date} from First day to include in query results.
	 * @property {date} to Last day to include in query results.
	 */


	/** 
	 * Represents a user account that can render on behalf of the primary SSO account. 
	 * @typedef {Object} module:Proxy.Proxy.Account
	 * @property {string} username Username of the account. Must be less than 32 bytes.
	 * @property {boolean} enabled Flag indicating whether the user account has access to the primary SSO account licenses.
	 * @property {number} renderTimeLimit Render time limit (in thread/hours). 0 (default) means no limit.
	 * @property {number} currentRenderTime Accumulated render time since last "setUsage" or "reduceUsage" call (in thread/hours).
	 */


	/** 
	 * Render time information, aggregated over the specified query parameters and grouped by user account and product. 
	 * @typedef {Object} module:Proxy.Proxy.QueryResult
	 * @property {module:Proxy.Proxy.QueryParameters} parameters Query parameters used to obtain the result.
	 * @property {string} username User account that consumed the render time. Not set in "getTotalTime" queries.
	 * @property {number} renderTime Aggregated render time (in thread/hours).
	 * @property {string} product Product used to render, typically a Render Node.
	 */


	/**
	 * Returns a list of all user accounts under the primary SSO account.
	 * @function
	 * @name module:Proxy.Proxy#list
	 * @returns {module:Proxy.Proxy.Account[]}
	 */
	Proxy.prototype.list = function() {
		var args = Array.prototype.slice.call(arguments);
		var callback = null;
		if (args.length && typeof args[args.length - 1] === 'function') {
			callback = args.pop();
		}
		args.length = 0;
		return this.rpc.call({
			method: 'list',
			params: args,
			expectReturn: true,
			transport: this.defaultTransport
		}, callback);
	};

	/**
	 * Returns a user account by username.
	 * @function
	 * @name module:Proxy.Proxy#get
	 * @param {string} username User account username.
	 * @returns {module:Proxy.Proxy.Account}
	 */
	Proxy.prototype.get = function(username) {
		var args = Array.prototype.slice.call(arguments);
		var callback = null;
		if (args.length && typeof args[args.length - 1] === 'function') {
			callback = args.pop();
		}
		args.length = Math.min(1, args.length);
		return this.rpc.call({
			method: 'get',
			params: args,
			expectReturn: true,
			transport: this.defaultTransport
		}, callback);
	};

	/**
	 * Checks if username and password match. Returns a flag indicating whether the password matches.
	 * @function
	 * @name module:Proxy.Proxy#validate
	 * @param {string} username User account username.
	 * @param {string} password User account password.
	 * @returns {boolean}
	 */
	Proxy.prototype.validate = function(username, password) {
		var args = Array.prototype.slice.call(arguments);
		var callback = null;
		if (args.length && typeof args[args.length - 1] === 'function') {
			callback = args.pop();
		}
		args.length = Math.min(2, args.length);
		return this.rpc.call({
			method: 'validate',
			params: args,
			expectReturn: true,
			transport: this.defaultTransport
		}, callback);
	};

	/**
	 * Creates a user account under the primary SSO account. Returns a flag indicating whether the operation succeeded.
	 * @function
	 * @name module:Proxy.Proxy#create
	 * @param {module:Proxy.Proxy.Account} account Account settings to use, only username is required.
	 * @param {string} password User account password. Must be less than 64 bytes.
	 * @returns {boolean}
	 */
	Proxy.prototype.create = function(account, password) {
		var args = Array.prototype.slice.call(arguments);
		var callback = null;
		if (args.length && typeof args[args.length - 1] === 'function') {
			callback = args.pop();
		}
		args.length = Math.min(2, args.length);
		return this.rpc.call({
			method: 'create',
			params: args,
			expectReturn: true,
			transport: this.defaultTransport
		}, callback);
	};

	/**
	 * Enables a user account. Returns a flag indicating whether the operation succeeded.
	 * @function
	 * @name module:Proxy.Proxy#enable
	 * @param {string} username User account username.
	 * @returns {boolean}
	 */
	Proxy.prototype.enable = function(username) {
		var args = Array.prototype.slice.call(arguments);
		var callback = null;
		if (args.length && typeof args[args.length - 1] === 'function') {
			callback = args.pop();
		}
		args.length = Math.min(1, args.length);
		return this.rpc.call({
			method: 'enable',
			params: args,
			expectReturn: true,
			transport: this.defaultTransport
		}, callback);
	};

	/**
	 * Disables a user account.Returns a flag indicating whether the operation succeeded.
	 * @function
	 * @name module:Proxy.Proxy#disable
	 * @param {string} username User account username.
	 * @returns {boolean}
	 */
	Proxy.prototype.disable = function(username) {
		var args = Array.prototype.slice.call(arguments);
		var callback = null;
		if (args.length && typeof args[args.length - 1] === 'function') {
			callback = args.pop();
		}
		args.length = Math.min(1, args.length);
		return this.rpc.call({
			method: 'disable',
			params: args,
			expectReturn: true,
			transport: this.defaultTransport
		}, callback);
	};

	/**
	 * Changes user account password. The previous one is not verified so &#34;validate&#34; method should be called in advance.
	 * @function
	 * @name module:Proxy.Proxy#changePassword
	 * @param {string} username User account username.
	 * @param {string} password New user account password. Must be less than 64 bytes.
	 * @returns {boolean}
	 */
	Proxy.prototype.changePassword = function(username, password) {
		var args = Array.prototype.slice.call(arguments);
		var callback = null;
		if (args.length && typeof args[args.length - 1] === 'function') {
			callback = args.pop();
		}
		args.length = Math.min(2, args.length);
		return this.rpc.call({
			method: 'changePassword',
			params: args,
			expectReturn: true,
			transport: this.defaultTransport
		}, callback);
	};

	/**
	 * Sets current usage to the specified value, overwriting any potential updates that may have happened since the value was last read.Returns a flag indicating whether the operation succeeded.
	 * @function
	 * @name module:Proxy.Proxy#setUsage
	 * @param {string} username User account username.
	 * @param {number} usage Render time usage (in thread/hours).
	 * @returns {boolean}
	 */
	Proxy.prototype.setUsage = function(username, usage) {
		var args = Array.prototype.slice.call(arguments);
		var callback = null;
		if (args.length && typeof args[args.length - 1] === 'function') {
			callback = args.pop();
		}
		args.length = Math.min(2, args.length);
		return this.rpc.call({
			method: 'setUsage',
			params: args,
			expectReturn: true,
			transport: this.defaultTransport
		}, callback);
	};

	/**
	 * Atomically reduces current usage with the specified amount.Returns a flag indicating whether the operation succeeded.
	 * @function
	 * @name module:Proxy.Proxy#reduceUsage
	 * @param {string} username User account username.
	 * @param {number} amount Render time to subtract (in thread/hours).
	 * @returns {boolean}
	 */
	Proxy.prototype.reduceUsage = function(username, amount) {
		var args = Array.prototype.slice.call(arguments);
		var callback = null;
		if (args.length && typeof args[args.length - 1] === 'function') {
			callback = args.pop();
		}
		args.length = Math.min(2, args.length);
		return this.rpc.call({
			method: 'reduceUsage',
			params: args,
			expectReturn: true,
			transport: this.defaultTransport
		}, callback);
	};

	/**
	 * Sets usage limit to the specified value. 0 (default) means no limit.Returns a flag indicating whether the operation succeeded.
	 * @function
	 * @name module:Proxy.Proxy#setLimit
	 * @param {string} username User account username.
	 * @param {number} [limit] Render time limit (in thread/hours).
	 * @returns {boolean}
	 */
	Proxy.prototype.setLimit = function(username, limit) {
		var args = Array.prototype.slice.call(arguments);
		var callback = null;
		if (args.length && typeof args[args.length - 1] === 'function') {
			callback = args.pop();
		}
		args.length = Math.min(2, args.length);
		return this.rpc.call({
			method: 'setLimit',
			params: args,
			expectReturn: true,
			transport: this.defaultTransport
		}, callback);
	};

	/**
	 * Returns the total rendering time for the primary SSO account for the specified query parameters.
	 * @function
	 * @name module:Proxy.Proxy#getTotalTime
	 * @param {module:Proxy.Proxy.QueryParameters} parameters Query parameters.
	 * @returns {module:Proxy.Proxy.QueryResult[]}
	 */
	Proxy.prototype.getTotalTime = function(parameters) {
		var args = Array.prototype.slice.call(arguments);
		var callback = null;
		if (args.length && typeof args[args.length - 1] === 'function') {
			callback = args.pop();
		}
		args.length = Math.min(1, args.length);
		return this.rpc.call({
			method: 'getTotalTime',
			params: args,
			expectReturn: true,
			transport: this.defaultTransport
		}, callback);
	};

	/**
	 * Returns the total rendering time for the specified user account and query parameters.
	 * @function
	 * @name module:Proxy.Proxy#getAccountTime
	 * @param {module:Proxy.Proxy.QueryParameters} parameters Query parameters.
	 * @param {string} username User account username.
	 * @returns {module:Proxy.Proxy.QueryResult[]}
	 */
	Proxy.prototype.getAccountTime = function(parameters, username) {
		var args = Array.prototype.slice.call(arguments);
		var callback = null;
		if (args.length && typeof args[args.length - 1] === 'function') {
			callback = args.pop();
		}
		args.length = Math.min(2, args.length);
		return this.rpc.call({
			method: 'getAccountTime',
			params: args,
			expectReturn: true,
			transport: this.defaultTransport
		}, callback);
	};

}(typeof module !== 'undefined' ? module.exports : window));