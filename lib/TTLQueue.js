(function() {
	'use strict';


	var   Class 		= require('ee-class')
		, type 			= require('ee-types')
		, log 			= require('ee-log')
		, EventEmitter 	= require('ee-event-emitter')
		, LinkedList 	= require('linkd')
		, MemoryManager	= require('memory-manager')
		, Node 			= require('./Node')
		;





	module.exports = new Class({
		inherits: EventEmitter


		// maximum number oif items
		// default: 0 -> will crash the process if too many itemsa are added
		, max: 0



		// time to live for each item
		// deault: 0 -> items will never expire
		, ttl: 0



		// the counter used for the smybold
		, _id: 1
		, id: {
			get: function() {
				if (this._id > 100000000) this._id = 1;
				return Symbol(this._id++);
			}
		}



		// returns the length of the queue
		, length: {
			get: function() {return this.list.length;}
		}





		/**
		 * class constructor
		 */
		, init: function(options) {

			// make sure we're not filling the memmory
			this.memoryManager = new MemoryManager();


			// the queue is a linked list
			this.list = new LinkedList(Node);


			// maybe we got options
			if (options) {
				if (type.number(options.max)) this.max = options.max;
				if (type.number(options.ttl)) this.ttl = options.ttl;
			}
		}





		/**
		 * returns the oldest item
		 */
		, get: function() {
			var item = (this.length > 0) ? this.list.shift() : null;

			if (this.length === 0) this.emit('drain');

			return item;
		}





		/**
		 * adds a new item
		 */
		, add: function(item) {
			return this.queue(item);
		}




		/**
		 * adds a new item
		 */
		, push: function(item) {
			return this.queue(item);
		}



		/**
		 * adds a new item
		 *
		 * @param {*} item of any type
		 *
		 * @returns {Symbol} id of the added item, can be uesd to remove it
		 */
		, queue: function(item) {
			let id = this.id;


			// add only stuff if there is space
			if (this.max === 0 || this.length < this.max) {

				// check if there is enough memory
				if (this.memoryManager.hasMemory()) {

					// queue item
					this.list.push(id, item);
					
					// let the timeout thingiy do its thing
					if (this.ttl > 0 && !this.ttlTimer) this.checkTimeouts();

					return id;
				}
				else this.emit('overflow', item, new Error('The queue cannot accept more items because the memory is too full!'));
			}
			else this.emit('overflow', item, new Error('The queue holds currently «'+this.length+'» items which is the configured maximum!'));

			return false;
		}





		/**
		 * removes an item from the queue
		 *
		 * @param {Symbol} id the symbol returned by the queue method
		 *
		 * @returns {*} the removed item or undefined
		 */
		, remove: function(id) {
			var removedItem = this.list.remove(id);

			// restart the timeout check
			if (this.ttl) {
				if (this.ttlTimer) clearTimeout(this.ttlTimer);

				this.checkTimeouts();
			}

			return removedItem;
		}





		/**
		 * checks for ttl timeouts
		 */
		, checkTimeouts: function() {
			if (this.list.length) {
				while (this.list.length && this.list.getLastNode().hasExpired(this.ttl)) {
					this.emit('timeout', this.list.shift());
				}


				if (this.list.length) {

					// set a timer that will match the lasts node timeout
					this.ttlTimer = setTimeout(() => {
						delete this.ttlTimer;

						// start checking again
						this.checkTimeouts();
					}, this.list.getLastNode().expiresIn(this.ttl));
				}
				else this.emit('drain');
			}
		}
	});
})();
