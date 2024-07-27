const tile_size = 20;
var game_window = undefined;
var game_width = undefined;
var game_height = undefined;
var game_started = false; 
var game_tiles = [];
var tile_numbers = undefined;
var mine_numbers = undefined;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function add_bomb(ignore_tiles, row, column) {
    for (let i = 0; i < 9; i++) {
        if (i == 4)
            continue;
        if (ignore_tiles.includes(i))
            continue;

        test_row = row + (Math.floor(i/3)-1);
        test_column = column + ((i%3)-1);

        if (game_tiles[test_row][test_column] != "M")
            game_tiles[test_row][test_column] = (parseInt(game_tiles[test_row][test_column])+1).toString()
    }
}

function start_game() {
    mine_numbers = tile_numbers/10;

    for (let row = 0; row < (game_height/tile_size); row++) {
        row_array = [];
        for (let column = 0; column < (game_width/tile_size); column++) {
            row_array.push("0");
        }
        game_tiles.push(row_array);
    }
    
    for (let i = 0; i < mine_numbers; i++) {
        let found = false;
        while (!found) {
            let random_column = getRandomInt(game_width/20);
            let random_row = getRandomInt(game_height/20);

            if (game_tiles[random_row][random_column] != "M") {
                game_tiles[random_row][random_column] = "M";
                found = true
            }
        }
    }

    for (let row = 0; row < (game_height/tile_size); row++) {
        for (let column = 0; column < (game_width/tile_size); column++) {
            current_tile = game_tiles[row][column];

            if (current_tile != "M")
                continue

            if (row != 0 && column != 0 && row != (game_height/tile_size)-1 && column != (game_width/tile_size)-1) {
                add_bomb([], row, column);
            } else {
                if (row == 0) {
                    if (column == 0) {
                        add_bomb([0, 1, 2, 3, 4, 6], row, column);
                    } else if (column == (game_width/tile_size)-1) {
                        add_bomb([0, 1, 2, 4, 5, 8], row, column);
                    } else {
                        add_bomb([0, 1, 2, 4], row, column);
                    }
                } else if (row == (game_height/tile_size)-1) {
                    if (column == 0) {
                        add_bomb([0, 3, 4, 6, 7, 8], row, column);
                    } else if (column == (game_width/tile_size)-1) {
                        add_bomb([2, 4, 5, 6, 7, 8], row, column);
                    } else {
                        add_bomb([4, 6, 7, 8], row, column);
                    }
                }
                if (column == 0) {
                    if (row != 0 && row != (game_height/tile_size)-1) {
                        add_bomb([0, 3, 4, 6], row, column);
                    }
                } else if (column == (game_width/tile_size)-1) {
                    if (row != 0 && row != (game_height/tile_size)-1) {
                        add_bomb([2, 4, 5, 8], row, column);
                    }
                }
            }
        }
    }
}

function tile_clicked(id) {
    if (!game_started) {
        game_started = true;
        start_game();
    } else {
        current_tile = document.getElementById(id);
        current_tile.classList.remove("tile");
    
        discover_row = Math.floor(id/(game_width/tile_size));
        discover_column = id%(game_width/tile_size);
        discovered_tile = game_tiles[discover_row][discover_column];

        if (discovered_tile != "0") {
            current_tile.classList.add("revealed");
            current_tile.innerText = discovered_tile;
        } else {
            current_tile.classList.add("number-0");
        }
    }
}

function generate_tiles() {
    game_width = game_window.offsetWidth;
    game_height = game_window.offsetHeight;
    tile_numbers = (game_width/tile_size) * (game_height/tile_size);
    
    console.log(game_width, game_height, tile_numbers)

    for (let tile = 0; tile < tile_numbers; tile++) {
        let new_tile = document.createElement("button");

        new_tile.classList.add("tile");
        new_tile.id = tile;
        new_tile.onclick = function() {tile_clicked(tile)};

        game_window.appendChild(new_tile);
    }
}

window.onload = function() {
    game_window = document.querySelector(".game");
    
    generate_tiles();
}