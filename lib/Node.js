(function() {
    'use strict';


    var   Class         = require('ee-class')
        , type          = require('ee-types')
        , log           = require('ee-log')
        , LinkedList    = require('linkd')
        ;





    module.exports = new Class({
        inherits: LinkedList.Node


        , init: function init(hash, value, previousNode, nextNode) {

            // set my creation timestamp
            this.created = Date.now();


            // you should call the super contructor
            init.super.call(this, hash, value, previousNode, nextNode);
        }




        /**
         * check if the node has expired
         */
        , hasExpired: function(ttl) {
            return this.created < (Date.now()-ttl);
        }



        /**
         * returns the time in ms until this node expires
         */
        , expiresIn: function(ttl) {
            return this.created-Date.now()+ttl;
        }
    });
})();
