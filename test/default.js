(function() {
    'use strict';


    var   Class         = require('ee-class')
        , log           = require('ee-log')
        , assert        = require('assert');



    var TTLQueue = require('../')



    describe('The TTLQueue', function() {
        it('should not crash', function() {
            new TTLQueue();
        });

        it('should store items', function() {
            let q = new TTLQueue();

            q.push(1);

            assert(q.get());
            assert(!q.get());
        });



        it('should remove items', function() {
            let q = new TTLQueue();

            q.push(1);
            q.push(2);
            let removed = q.push(3);
            q.push(4);

            assert(q.remove(removed) === 3);

            assert(q.get() === 1);
            assert(q.get() === 2);
            assert(q.get() === 4);
            assert(!q.get());
        });



        it('should timeout items', function(done) {
            let q = new TTLQueue({ttl:3});

            q.push(1);

            setTimeout(()  => {
                assert(!q.get());
                done();
            }, 30);
        });


        it('should emit the timeout event', function(done) {
            let q = new TTLQueue({ttl:3});

            q.push(1);

            q.on('timeout', (item) => {
                assert(item);
                done();
            });
        });


        it('should emit the drain event', function(done) {
            let q = new TTLQueue({ttl:3});

            q.push(1);

            q.on('drain', () => {
                done();
            });
        });


        it('should fail to add too much items', function() {
            let q = new TTLQueue({max:3});

            q.on()

            assert(q.push(1));
            assert(q.push(2));
            assert(q.push(3));
            assert(!q.push(4));
        });


        it('should emit the overflow event', function(done) {
            let q = new TTLQueue({max:3});
            
            q.on('overflow', (item) => {
                assert(item === 4)
                done();
            });

            q.push(1);
            q.push(2);
            q.push(3);
            q.push(4);
        });
    });    
})();
