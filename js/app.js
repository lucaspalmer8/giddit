var ReactDOM = require('react-dom');
var React = require('react');

//var Website = require('./components/Website.react');
var Posts = require('./components/Posts.react');
var Find = require('./components/Find.react');
var Giddit = require('./components/Giddit.react');

ReactDOM.render(
    <Giddit />,
    document.getElementById('website')
);
