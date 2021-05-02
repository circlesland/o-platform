import { userDB } from './userdb.js';

export let labelFor = function(id) {
    let user = userDB[id.toLowerCase()];
    if (user && user.username)
        return user.username;
    else
        return id.substr(0, 8);
};

export let createNodeContents = function(id) {
    let user = userDB[id.toLowerCase()];
    let node = {id: id, label: labelFor(id)};
    if (user && user.avatarUrl) {
        node['shape'] = 'circularImage';
        node['image'] = user.avatarUrl;
    }
    return node;
}
