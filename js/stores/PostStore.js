var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var PostConstants = require('../constants/PostConstants');
var assign = require('object-assign');

var Posts = require('../constants/Posts');

var CHANGE_EVENT = 'change';

var state = Posts;
var find = true;

function getPosts(param) {
console.log(param);
    if (param === "") {
        state = Posts;
        PostStore.emitChange();
        return;
    }

    var result = [];
    var parts = param.split(" ... ");
    if (parts.length === 2) {
        var action = parts[0];
        var subject = parts[1];
        for (var i = 0; i < Posts.length; ++i) {
            if (Posts[i]["action"] === action && Posts[i]["subject"] === subject) {
                result.push(Posts[i]);
            }
        }
        state = result;
    } else {
        state = [];
    }
    PostStore.emitChange();
}

function getRandomId() {
    var result = "";
    for (var i = 0; i < 6; ++i) {
        result += (Math.floor(Math.random() * 10)).toString();
    }
    return result;
}

function createPost(params) {
    Posts.push({action: params["action"],
                subject: params["subject"],
                tags: [],
                content: params["content"],
                upvotes: 0,
                downvotes: 0,
                id: getRandomId()});
    find = true;
    PostStore.emitChange();
}

function upvote(id) {
    for (var i = 0; i < state.length; ++i) {
        if (state[i]["id"] === id) {
            state[i]["upvotes"] = state[i]["upvotes"] + 1;
            break;
        }
    }
    PostStore.emitChange();
}

function downvote(id) {
    for (var i = 0; i < state.length; ++i) {
        if (state[i]["id"] === id) {
            state[i]["downvotes"] = state[i]["downvotes"] + 1;
            break;
        }
    }
    PostStore.emitChange();
}

function gotoCreate() {
    find = false;
    state = [];
    PostStore.emitChange();
}


var PostStore = assign({}, EventEmitter.prototype, {

    getState: function() {
        return state;
    },

    getAllPosts: function() {
        return Posts;
    },

    find: function() {
        return find;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {

    switch(action.actionType) {
        case PostConstants.GET_POSTS:
            getPosts(action.param);
            break;
        case PostConstants.CREATE_POST:
            createPost(action.params);
            break;
        case PostConstants.UPVOTE:
            upvote(action.id);
            break;
        case PostConstants.DOWNVOTE:
            downvote(action.id);
            break;
        case PostConstants.GOTO_CREATE:
            gotoCreate();
            break;
        default:
    }
});

module.exports = PostStore;
