window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        return window.setTimeout(callback, 1000 / 60);
};

var canvas = document.getElementById('canvas'),
    ctx    = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;


/* Customisable map data */

var map = {

    tile_size: 16,

    /*

    Key vairables:

    id       [required] - an integer that corresponds with a tile in the data array.
    colour   [required] - any javascript compatible colour variable.
    solid    [optional] - whether the tile is solid or not, defaults to false.
    bounce   [optional] - how much velocity is preserved upon hitting the tile, 0.5 is half.
    jump     [optional] - whether the player can jump while over the tile, defaults to false.
    friction [optional] - friction of the tile, must have X and Y values (e.g {x:0.5, y:0.5}).
    gravity  [optional] - gravity of the tile, must have X and Y values (e.g {x:0.5, y:0.5}).
    fore     [optional] - whether the tile is drawn in front of the player, defaults to false.
    script   [optional] - refers to a script in the scripts section, executed if it is touched.

    */

    keys: [
        {id: 0,colour: '#333', solid: 0},
        {id: 1,colour: '#888', solid: 0, gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}, fore: 1},
        {id: 2,colour: '#555',solid: 1,bounce: 0},
        {id: 3,colour: 'rgba(121, 220, 242, 0.4)',friction: {x: 0.9,y: 0.9},gravity: {x: 0,y: 0.2},jump: 1,fore: 1},
        {id: 4,colour: '#777', gravity: {x: 0,y: -1}},
        {id: 5,colour: '#E373FA',solid: 1,bounce: 1.1},
        {id: 6,colour: '#777', gravity: {x: 0,y: 1}},
        {id: 7,colour: '#73C6FA',solid: 0, script: 'bed', gravity: {x: 0,y: 0}, friction: {x: 0.8,y: 0.8}},
        {id: 8,colour: '#fff',solid: 0, script: 'bed', gravity: {x: 0,y: 0}, friction: {x: 0.8,y: 0.8}},
        {id: 9,colour: '#888',solid: 0,script: 'return_script', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}}, // 감싸주는 애

        {id: 10,colour: '#888', script: 'mcdonalds_person0' , gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 11,colour: '#888', script: 'mcdonalds_person1', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 12,colour: '#888', script: 'mcdonalds_person2' , gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 13,colour: '#888', script: 'mcdonalds_person3', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 14,colour: '#888', script: 'google_person0' , gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 15,colour: '#888', script: 'google_person1', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 16,colour: '#888', script: 'google_person2' , gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 17,colour: '#888', script: 'google_person3', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 18,colour: '#888', script: 'apple_person0' , gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 19,colour: '#888', script: 'apple_person1', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 20,colour: '#888', script: 'apple_person2' , gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 21,colour: '#888', script: 'apple_person3', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 22,colour: '#888', script: 'cocacola_person0' , gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 23,colour: '#888', script: 'cocacola_person1', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 24,colour: '#888', script: 'cocacola_person2' , gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 25,colour: '#888', script: 'cocacola_person3', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 26,colour: '#888', script: 'pepsi_person0' , gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 27,colour: '#888', script: 'pepsi_person1', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 28,colour: '#888', script: 'pepsi_person2' , gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 29,colour: '#888', script: 'pepsi_person3', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},

        {id: 30,colour: '#ABC'},
        {id: 31,colour: '#777', gravity: {x: 0,y: 0}},
        {id: 32,colour: '#0FF',solid: 0,script: 'hotel_info', gravity: {x: 0,y: 0}, friction: {x: 0.5,y: 0.7}},
        {id: 33,colour: '#795548',solid: 1,script: 'hotel_door', gravity: {x: 0,y: 0}, friction: {x: 0.8,y: 0.8}},
        {id: 34,colour: '#333',solid: 0, script: 'hotel_bed', gravity: {x: 0,y: 0}, friction: {x: 0.8,y: 0.8}},
        {id: 35,colour: '#333',solid: 0, script: 'hotel_bed', gravity: {x: 0,y: 0}, friction: {x: 0.8,y: 0.8}},
        {id: 36,colour: '#888',solid: 0, script: 'hotel_out', gravity: {x: 0,y: 0}, friction: {x: 0.8,y: 0.8}},
        {id: 37,colour: '#333',solid: 0, script: 'hotel_floor', gravity: {x: 0,y: 0}, friction: {x: 0.8,y: 0.8}},
        {id: 39,colour: 'rgb(79,89,97)', script: 'airport', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 40,colour: 'white', script: 'airport', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 41,colour: '#0FF',solid: 0,script: 'airport_info', gravity: {x: 0,y: 0}, friction: {x: 0.5,y: 0.7}},
        {id: 42,colour: '#ABC'},
        {id: 43,colour: '#ABC'},
        {id: 44,colour: '#0FF',solid: 0,script: 'info_1', gravity: {x: 0,y: 0}, friction: {x: 0.3,y: 0.5}},
        {id: 45,colour: '#0FF',solid: 0,script: 'info_2', gravity: {x: 0,y: 0}, friction: {x: 0.3,y: 0.5}},
        {id: 46,colour: '#0FF',solid: 0,script: 'mcdonalds_info', gravity: {x: 0,y: 0}, friction: {x: 0.3,y: 0.5}},
        {id: 47,colour: '#ABC'},
        {id: 48,colour: '#ABC'},
        {id: 49,colour: '#ABC'},


        {id: 50,colour: 'rgb(184, 8, 30)',script: 'mcdonalds', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 51,colour: 'rgb(252, 198, 71)',script: 'mcdonalds', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 52,colour: '#4285f4', script: 'google', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 53,colour: '#0f9058', script: 'google', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 54,colour: '#f48400', script: 'google', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 55,colour: '#db4437', script: 'google', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 56,colour: 'rgb(184, 8, 30)', script: 'apple', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 57,colour: '#0f9058', script: 'apple', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 58,colour: '#000', script: 'cocacola', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 59,colour: '#f40000', script: 'cocacola',gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 60,colour: '#000', script: 'pepsi', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}},
        {id: 61,colour: 'rgb(14, 106, 168)', script: 'pepsi', gravity: {x: 0,y: 0}, friction: {x: 0.9,y: 0.9}}

    ],

    /* An array representing the map tiles. Each number corresponds to a key */
    data: [
        [ 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [ 2, 8, 8, 8, 7, 7, 7, 7, 2],
        [ 2, 8, 7, 8, 7, 7, 7, 7, 2],
        [ 2, 8, 7, 8, 7, 7, 7, 7, 2],
        [ 2, 8, 8, 8, 7, 7, 7, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [ 2, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 9,45, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9,44, 9, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9,10, 9, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9,19, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 9,51,50,51, 9, 1, 9, 9, 9, 1, 1, 1, 1, 1, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 9,50,51,50, 9, 1, 9,46, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 9,51,50,51, 9, 1, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 9,14, 9, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 9, 9, 9, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 9,18, 9, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 9, 9, 9, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9,57, 9, 9, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 9,56,56,56, 9, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 9,56,56, 9, 9, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 9, 9, 9, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 9,56,56,56, 9, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 9,16, 9, 1, 1, 1, 2,35,35,35,34,34,34,34,37,37,37,37,37,34,34,34,34,35,35,35, 2, 4, 2, 6, 1, 1, 1, 9, 9, 9, 9, 9, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 9, 9, 9, 1, 1, 1, 2,35,34,35,34,34,34,34,37,37,37,37,37,34,34,34,34,35,34,35, 2, 4, 2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,35,34,35,34,34,34,34,37,37,37,37,37,34,34,34,34,35,34,35, 2, 4, 2, 6, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,35,35,35,34,34,34,34,37,37,37,37,37,34,34,34,34,35,35,35, 2, 4, 2, 6, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37, 2, 4, 2, 6, 2],
        [ 2, 1, 1, 9, 9, 9, 9, 9, 1, 1, 1, 1, 2,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37, 2, 4, 2, 6, 2],
        [ 2, 1, 1, 9,54,55,55, 9, 1, 1, 1, 1, 2,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37, 2, 4, 2, 6, 2],
        [ 2, 1, 1, 9,54,52,52, 9, 1, 1, 1, 1, 2,35,35,35,34,34,34,34,37,37,37,37,37,34,34,34,34,35,35,35, 2, 4, 2, 6, 2],
        [ 2, 1, 1, 9,53,53,52, 9, 1, 1, 1, 1, 2,35,34,35,34,34,34,34,37,37,37,37,37,34,34,34,34,35,34,35, 2, 4, 2, 6, 2],
        [ 2, 1, 1, 9, 9, 9, 9, 9, 1, 1, 1, 1, 2,35,34,35,34,34,34,34,37,37,37,37,37,34,34,34,34,35,34,35, 2, 4, 2, 6, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,35,35,35,34,34,34,34,37,37,37,37,37,34,34,34,34,35,35,35, 2, 4, 2, 6, 2],
        [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2,33,33,33, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 6, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 9, 9, 9, 1, 1, 1, 1,36,36,36, 9,32, 9, 1, 1, 1, 1, 1, 2, 4, 2, 6, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 9, 9,59, 9, 9, 1, 1, 1, 1, 1, 1, 9, 9, 9, 1, 1, 1, 1, 1, 2, 4, 2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [ 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 9,58,58,58, 9, 1, 1, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2],
        [ 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 9,59,59,59, 9, 1, 1, 9,11, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2],
        [ 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 1, 2, 9,58,58,58, 9, 1, 1, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2],
        [ 2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2],
        [ 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,31, 2],
        [ 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2,31, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2,10, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2,31, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9,17, 9, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2,31, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2,31, 2, 2, 2, 2, 2, 2, 2, 2],
        [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2,31, 2, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2,31, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2],
        [ 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 6, 6, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 2, 2, 2, 1, 1, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [ 2, 1, 1, 2, 2, 1, 1, 9, 9,61, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 2, 1, 1, 1, 9,60,60,60, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 9,61,61,61, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 9,60,60,60, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 5, 5, 2, 1, 1, 1, 1, 1, 9,13, 9, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 1, 1, 1, 1, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 9, 9, 9, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9,12, 9, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2],
        [ 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2],
        [ 2, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2],
        [ 2,39,39,39,39,39, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2],
        [ 2,40,40,40,40,39, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 1, 1, 1, 1, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2],
        [ 2,39,39,39,40,39, 9,41, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9,15, 9, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
        [ 2,40,40,39,40,39, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 9, 9, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
        [ 2,39,40,39,40,39, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
        [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    ],

    /* Default gravity of the map */

    gravity: {
        x: 0,
        y: 0.3
    },

    /* Velocity limits */

    vel_limit: {
        x: 3.5,
        y: 3.5
    },

    /* Movement speed when the key is pressed */

    movement_speed: {
        jump: 6,
        left: 0.5,
        right: 0.5
    },

    /* The coordinates at which the player spawns and the colour of the player */

    player: {
        x: 5,
        y: 5,
        colour: '#FF9900'
    },

    /* scripts refered to by the "script" variable in the tile keys */

    scripts: {
        change_colour: 'this.player.colour = "#"+(Math.random()*0xFFFFFF<<0).toString(16);',
        /* you could load a new map variable here */
        next_level: 'alert("Yay! You won! Reloading map.");this.load_map(map);',
        death: 'alert("You died!");this.load_map(map);',
        unlock: 'this.current_map.keys[10].solid = 0;this.current_map.keys[10].colour = "#888";',
        bed: 'health_dec_rate=-0.2;',
        info_1: 'message_0("This is a <b>person</b>. <br> He is going to tell you something important, but it is up to you whether or not you believe it.");if(!people_effect[0][0]){this.current_map.keys[10].colour="#FFEB3B";people_on[0][0] = true;map.keys[10+(i*4)+j].friction = {x: 0.3,y: 0.5};}',
        info_2: 'message_0("Hello! I am an INFO box. <br> This is your <strong>Bed</strong>.");',
        mcdonalds_info: 'message_0("This is McDonalds. You can buy and sell McDonalds stock.");',
        mcdonalds: 'message_stock("Hello, this is McDonalds. What would you like to do?",0);',
        google: 'message_stock("Hello, this is Google. What would you like to do?",1);',
        apple: 'apple_func();',
        cocacola: 'message_stock("Hi this is CocaCola! What would you like to do?",3);',
        pepsi: 'message_stock("Hi this is Pepsi! What would you like to do?",4);',
        hotel_info: 'message_2("Welcome to Marriot Hotel. <br> $15 per night");other_button("Enter",2);',
        return_script: 'health_dec_rate=HEALTH_DEC; restore_el();',
        hotel_door:  'this.current_map.keys[34].colour= "#73C6FA"; this.current_map.keys[35].colour= "#fff";this.current_map.keys[37].colour= "#888";this.current_map.keys[42].colour="#888";',
        hotel_out: 'this.current_map.keys[42].colour="#333";this.current_map.keys[34].colour="#333"; this.current_map.keys[35].colour="#333";this.current_map.keys[37].colour= "#333";',
        hotel_floor: 'health_dec_rate=HEALTH_DEC;hotel_locked();',
        hotel_bed: 'health_dec_rate = -0.02;',
        airport: 'message_2("Hawaii one way ticket : $ 1000");other_button("Buy the ticket and leave!",1);',
        airport_info: 'message_0("Airport!!!");',
        mcdonalds_person0: 'message_person("I heard that McDonalds got caught using fake ketchup.",10,0,0,0.5);',
        mcdonalds_person1: 'message_person("McDonalds just released a new burger and people are loving it!",11,0,1,2);',
        mcdonalds_person2: 'message_person("Shake Shack and In-N-Out are gaining more and more popularity.",12,0,2,0.7);',
        mcdonalds_person3: 'message_person("McDonalds burgers are much smaller than advertised. Ugh! ",13,0,3,1);',
        google_person0: 'message_person("I heard that one of Google X project just got completed.",14,1,0,2);',
        google_person1: 'message_person("Google Pixel is such a disaster. It\'s specs are worse than the other smart phones already out.",15,1,1,0.6);',
        google_person2: 'message_person("Google shouldn\'t be giving out lunches for free to visitors. It\'s such a waste of money!",16,1,2,1);',
        google_person3: 'message_person("Google\'s self driving car has gone 2 years now with absolutely no accidents",17,1,3,2);',
        apple_person0: 'message_person("Apple\'s Spaceship campus is going to be complete in a few days! I\'m so excited!",18,2,0,1.4)',
        apple_person1: 'message_person("MacBooks with no usb ports, iPhones with no earphone jacks... Apple is taking a big risk!",19,2,1,2)',
        apple_person2: 'message_person("The iPhone 8 apparently has no fingerprint sensor. It also isn\'n using LCD anymore...",20,2,2,0.6)',
        apple_person3: 'message_person("Apple is too confidential. They don\'t let anyone come into their campus.",21,2,3,0.9)'
    }
};
