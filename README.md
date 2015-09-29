# ee-ttl-queue

A queue wich holds items not longer than a specified amount of time. It Wwll never fill your memmory thanks to the [ttl-queue](https://www.npmjs.com/package/ttl-queue).

[![npm](https://img.shields.io/npm/dm/ttl-queue.svg?style=flat-square)](https://www.npmjs.com/package/ttl-queue)
[![Travis](https://img.shields.io/travis/eventEmitter/ttl-queue.svg?style=flat-square)](https://travis-ci.org/eventEmitter/ttl-queue)
[![node](https://img.shields.io/node/v/ttl-queue.svg?style=flat-square)](https://nodejs.org/)


## API

You may specify a maximum of items items that may be stored aas well as a ttl value.

	var TTLQueue = require('ttl-queue');

	let q = new TTLQueue();

or 

	let q = new TTLQueue({
		  ttl: 3000 // 3 seconds, defaults to unlimited
		, max: 1000 // max 1'000 items in the queue, defaults to unlimited
	});




#### Adding Items

When adding items you will get an unique id returned that later can bve used to remove 
items again. If the method returns the value false the item could not be added because 
the queue is full or the memory is full.


	let itemId = q.push(myItem);


	if (itemId === false) {
		// the item could not be queued
	}



#### Removing Items


You may remove items using the id returned by the push method

	let itemId = q.push(myItem);
	let item = q.remove(itemId);



#### Drain Event

The drain event is emitted as soon there is no item left in the queue

	q.on('drain', () => {

	});


#### Overflow Event

This event is emitted if an item could not be added because the queue or the memory is full

	q.on('overflow', (item, error) => {

	});


#### Timeout event

This event is emitted if an item times out because of the ttl value set


	q.on('timeout', (item) => {

	});