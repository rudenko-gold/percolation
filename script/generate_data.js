function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

generate_btn = document.getElementById("generate_btn");
size_changer = document.getElementById("size_range");
speed_changer = document.getElementById("speed_range");
check_dsu_show = document.getElementById("dsu_show");

size_text = document.getElementById("amount");

var validNumber = new RegExp(/^\d*\.?\d*$/);

var last_valid = "10";
size = 10;
blocked = 100;
size_changer.oninput = function() {
    size = Number(size_changer.value);
    size_text.value = size_changer.value;
	last_valid = size_text.value;
    blocked = size * size;
	    step = 0;
	data_history.length = 0;
    change_step();
    isPlay = false;
    generate_view();
	    document.getElementById("play").style.backgroundImage = "url(image/icons/media_play.png)";
}

size_text.onchange = function() {

    if(size_text.value == "") {
        size_text.value = 10;
    }
    if((size_text.value) > 100) {
        size_text.value = 100;
    }
    if((size_text.value) < 5) {
        size_text.value = 5;
    }
	    if(!validNumber.test(size_text.value)) {
        size_text.value = last_valid;
    }

    size_changer.value = size_text.value;
    size = Number(size_changer.value);

    blocked = size * size;
    step = 0;
    data_history.length = 0;
    change_step();
    isPlay = false;
    generate_view();
    document.getElementById("play").style.backgroundImage = "url(image/icons/media_play.png)";
}

var parent;
var rank;
var data;

var parent_history = new Array();
var rank_history = new Array();
var data_history = new Array();

window_size = 720;
/*
function add_to_set (v) {
	parent[v] = v;
	rank[v] = 0;
}

function make_set (len) {
    parent = new Array(len);
    rank = new Array(len);
    for(var i = 0; i < len; ++i) {
        add_to_set(i);
    }
}

function find_set (v) {
	if (v == parent[v])
		return v;
	return parent[v] = find_set (parent[v]);
}

function find_set_step (v, i) {
	if (v == parent_history[i][v])
		return v;
	return parent_history[i][v] = find_set_step (parent_history[i][v], i);
}
 
function union_sets (a, b) {
	a = find_set (a);
	b = find_set (b);
	if (a != b) {
		if (rank[a] < rank[b]) {
            var t = a;
            a = b;
            b = t;
        }
		parent[b] = a;
		if (rank[a] == rank[b])
			++rank[a];
	}
}
*/
var id;
var rank;
var count;

function __init__(N) {
    count = N;
    id = new Array(N);
    rank = new Array(N);
    for(var i = 0; i < N; i++) {
        id[i] = i;
        rank[i] = 1;
    }
}

function connected(p, q) {
    return find(p) == find(q);
}
function count() {
    return count;
}

function find(p) {
    while (p != id[p]) {
        p = id[p];
    }
    return p;
}

function find_set_step(p, i) {
    while (p != parent_history[i][p]) {
        p = parent_history[i][p];
    }
    return p;
}

function get(p) {
    return id[p];
}
function union(p, q) {
    rootP = find(p);
    rootQ = find(q);
    if (rootP == rootQ) return;

    if (size[rootP] < size[rootQ]) {
        id[rootP] = rootQ;
        rank[rootQ] += rank[rootP];
    } else {
        id[rootQ] = rootP;
        rank[rootP] += rank[rootQ];
    }
    count -= 1
}

function change_step () {
    document.getElementById("site_amount").innerHTML = step;
}

function generate_view() {
    document.getElementById("maze").remove();
    cell_size = Math.ceil(window_size / size) - 2;

    var maze = document.createElement("div");
    maze.className = "maze";
    maze.id = "maze";

    for(var i = 1; i <= size; i++) {
        var row = document.createElement("div");
        row.className = "row";
        row.id = "" + i;
        row.style.height = size;
        for(var j = 1; j <= size; j++) {
            var cell = document.createElement("div");
            cell.className = "cell";
            cell.id = i + "." + j;

            cell.style.width = cell_size + "px";
            cell.style.height = cell_size + "px";
            
            if(size <= 20) {
                cell.style.borderRadius = "10px";
            } else if(size <= 30) {
                cell.style.borderRadius = "5px";
            } else if(size <= 40) {
                cell.style.borderRadius = "3px";
            } else {
                cell.style.borderRadius = "2px";
            }

            row.appendChild(cell);
        }
        maze.appendChild(row);
    }

    document.getElementById("main").appendChild(maze);
}

function percolate(v, size) {
    var check = false;
    for (var i = size * size; i > size * size - size; i--) {
        check = check || connected(v, i);
    }
    return check;
}

function generate_percolation() {
    //make_set(size * size + 2);
    size = Number(size_changer.value);
    __init__(size * size + 2);
    blocked = size * size;
    var data = new Array(size); // 0 - block, 1 - empty, 2 - percolated
    
    data_history = new Array();
    parent_history = new Array();
    rank_history = new Array();

    for (var i = 0; i < size; ++i) {
        data[i] = new Array(size);
        for (var j = 0; j < size; ++j) {
            data[i][j] = 0;
        }
    }

    for (var i = 1; i <= size; ++i) {
        //union_sets(0, i);
        union(0, i);
    }

    var t_data = new Array(size);
    for(var i = 0; i < size; i++) {
        t_data[i] = new Array(size);
        for(var j = 0; j < size; j++) {
            t_data[i][j] = data[i][j];
        }
    }
    data_history.push(t_data);
    
    t_data = new Array(size * size * 2);

    for(var i = 0; i < size* size * 2; i++) {
        //t_data[i] = parent[i];
        t_data[i] = id[i];
    }
    parent_history.push(t_data);
    
    t_data = new Array(size * size * 2);
    for(var i = 0; i < size* size * 2; i++) {
        //t_data[i] = rank[i];
        t_data[i] = rank[i];
    }
    rank_history.push(t_data);

    while (!percolate(0, size)) {
        var rand, rand_i, rand_j;
        rand = Math.floor(Math.random() * (size * size)) + 1;
        rand_i = Math.floor(rand / size);

        if (rand % size == 0) {
            rand_i--;
        }
        rand_j = (rand % size) - 1;
        if (rand_j == -1) {
            rand_j = size - 1;
        }

        var i = rand_i;
        var j = rand_j;

        if (data[rand_i][rand_j] != 0) {
            continue;
        }
        /*
        for (int i = 0; i < 5; i++) {
            for (int j = 0; j < 5; j++) {
                cout << data[i][j] << " ";
            }
            cout << std::endl;
        }*/
        /*
        for (int i = 1; i < 26; i++) {
            if ((i - 1) % size == 0)
                cout << std::endl;
            cout << parent[i] << " ";
        }*/
        //cout << std::endl;
        //cout << rand_i << " " << rand_j << " "<<  int(find_set(0) == find_set(size * size + 1)) << std::endl;
        data[rand_i][rand_j] = 1;

        if (rand_i == 0) {
            if (rand_j == 0) {
                if (data[i][j + 1] != 0) {
                    //union_sets(rand, rand + 1);
                    union(rand, rand + 1);
                }
                if (data[i + 1][j] != 0) {
                    //union_sets(rand, rand + size);
                    union(rand, rand + size);
                }
            }
            else if (rand_j == size - 1) {
                if (data[i][j - 1] != 0) {
                    //union_sets(rand, rand - 1);
                    union(rand, rand - 1);
                }
                if (data[i + 1][j] != 0) {
                    //union_sets(rand, rand + size);
                    union(rand, rand + size);
                }
            }
            else {
                if (data[i][j + 1] != 0) {
                    //union_sets(rand, rand + 1);
                    union(rand, rand + 1);
                }
                if (data[i][j - 1] != 0) {
                    //union_sets(rand, rand - 1);
                    union(rand, rand - 1);
                }
                if (data[i + 1][j] != 0) {
                    //union_sets(rand, rand + size);
                    union(rand, rand + size);
                }
            }
        }
        else if (rand_i == size - 1) {
            if (rand_j == 0) {
                if (data[i - 1][j] != 0) {
                    //union_sets(rand, rand - size);
                    union(rand, rand - size);
                }
                if (data[i][j + 1] != 0) {
                    //union_sets(rand, rand + 1);
                    union(rand, rand + 1);
                }
            }
            else if (rand_j == size - 1) {
                if (data[i - 1][j] != 0) {
                    //union_sets(rand, rand - size);
                    union(rand, rand - size);
                }
                if (data[i][j - 1] != 0) {
                    //union_sets(rand, rand - 1);
                    union(rand, rand - 1);
                }
            }
            else {
                if (data[i - 1][j] != 0) {
                    //union_sets(rand, rand - size);
                    union(rand, rand - size);
                }
                if (data[i][j - 1] != 0) {
                    //union_sets(rand, rand - 1);
                    union(rand, rand - 1);
                }
                if (data[i][j + 1] != 0) {
                    //union_sets(rand, rand + 1);
                    union(rand, rand + 1);
                }
            }
        }
        else {
            if (rand_j == 0) {
                if (data[i][j + 1] != 0) {
                    //union_sets(rand, rand + 1);
                    union(rand, rand + 1);
                }
                if (data[i - 1][j] != 0) {
                    //union_sets(rand, rand - size);
                    union(rand, rand - size);
                }
                if (data[i + 1][j] != 0) {
                    //union_sets(rand, rand + size);
                    union(rand, rand + size);
                }
            }
            else if (rand_j == size - 1) {
                if (data[i][j - 1] != 0) {
                    //union_sets(rand, rand - 1);
                    union(rand, rand - 1);
                }
                if (data[i - 1][j] != 0) {
                    //union_sets(rand, rand - size);
                    union(rand, rand - size);
                }
                if (data[i + 1][j] != 0) {
                    //union_sets(rand, rand + size);
                    union(rand, rand + size);
                }
            }
            else {
                if (data[i][j - 1] != 0) {
                    //union_sets(rand, rand - 1);
                    union(rand, rand - 1);
                }
                if (data[i - 1][j] != 0) {
                    //union_sets(rand, rand - size);
                    union(rand, rand - size);
                }
                if (data[i][j + 1] != 0) {
                    //union_sets(rand, rand + 1);
                    union(rand, rand + 1);
                }
                if (data[i + 1][j] != 0) {
                    //union_sets(rand, rand + size);
                    union(rand, rand + size);
                }
            }
        }
        var t_data = new Array(size);
        for(var i = 0; i < size; i++) {
            t_data[i] = new Array(size);
            for(var j = 0; j < size; j++) {
                t_data[i][j] = data[i][j];
            }
        }
        data_history.push(t_data);t_data = new Array;

        t_data = new Array(size * size * 2);
        for(var i = 0; i < size* size * 2; i++) {
            //t_data[i] = parent[i];
            t_data[i] = id[i];
        }
        parent_history.push(t_data);
        
        t_data = new Array(size * size * 2);
        for(var i = 0; i < size* size * 2; i++) {
            t_data[i] = rank[i];
        }
        rank_history.push(t_data);
    }
}

function view(t) {
    change_step();
    if(t >= data_history.length) {
        t = data_history.length - 1;
    }
    var v_data = data_history[t];
    for(var i = 0; i < size; i++) {
        for(var j = 0; j < size; j++) {
            var id = "" + (i + 1) + "." + (j + 1);
            //alert(id);
            if(v_data[i][j] == 0) {
                document.getElementById(id).style.backgroundColor = "#2ba950";
            } else if(v_data[i][j] == 1) {
                var s = i * size;
                s += j + 1;
                if(find_set_step(s, t) == find_set_step(0, t) && (check_dsu_show.checked || t == data_history.length - 1)) {
                    document.getElementById(id).style.backgroundColor = "#36d7d9";
                    check_dsu_show.checked = true;
                }
                else 
                    document.getElementById(id).style.backgroundColor = "#84a0a4";
            } else {
                    document.getElementById(id).style.backgroundColor = "#36d7d9";
            }
        }
    }
    if(t == data_history.length - 1) {
        isPlay = false;
        document.getElementById("play").style.backgroundImage = "url(image/icons/media_play.png)";
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}  
var step = 0;
async function demo_view() {
    for(; step < data_history.length; ++step) {
        if(!isPlay) {
            break;
        }
        view(step);
        var delay = 500;
        switch(Number(speed_changer.value)) {
            case 1:
                delay = 2000;
            break;
            case 2:
                delay = 1000;
            break;
            case 3:
                delay = 500;
            break;
            case 4:
                delay = 300;
            break;
            case 5:
                delay = 100;
            break;
        }
        await sleep(delay - size + 20);
    }
}

document.getElementById("next").onclick = function() {
    if(step < data_history.length - 1) {
        step++;
    }
step = Math.min(step, data_history.length - 1);
	step = Math.max(step, 0);
    change_step();
    view(step);
}

document.getElementById("prev").onclick = function() {
    step = Math.min(step, data_history.length - 1);
	step = Math.max(step, 0);
    if(step > 0) {
        step--;
    }
    change_step();
    view(step);
}

document.getElementById("first").onclick = function() {
    step = 0;
    change_step();
    view(step);
}

document.getElementById("last").onclick = function() {
    step = data_history.length - 1;
	step = Math.max(step, 0);
    change_step();
    view(step);
}

var isPlay = false;

function play() {
    if(isPlay) {
        isPlay = false;
        document.getElementById("play").style.backgroundImage = "url(image/icons/media_play.png)";
    } else {
        if(step == data_history.length || data_history.length == 0) {
            return;
        }
        isPlay = true;
        document.getElementById("play").style.backgroundImage = "url(image/icons/media_pause.png)";
        demo_view();
    }
}

document.getElementById("play").onclick = function() {
    play();
}

generate_btn.onclick = function() {
    step = 0;
    change_step();
    isPlay = false;
    generate_view();
    generate_percolation();
    play();
}

check_dsu_show.onchange = async function() {
	    step = Math.min(step, data_history.length - 1);
	step = Math.max(step, 0);
    view(step);
}

document.getElementById("example1").onclick = function() {
    size = 5;
    size_changer.value = "5";
    size_text.value = "5";
    step = 0;
    isPlay = false;
    generate_view();
    generate_percolation();
    step = data_history.length - 1;
    change_step();
    play();
}

document.getElementById("example2").onclick = function() {
    size = 25;
    size_changer.value = "25";
    size_text.value = "25";
    step = 0;
    isPlay = false;
    generate_view();
    generate_percolation();
    step = data_history.length - 1;
    change_step();
    play();
}

document.getElementById("example3").onclick = function() {
    size = 75;
    size_changer.value = "75";
    size_text.value = "75";
    step = 0;
    change_step();
    isPlay = false;
    generate_view();
    generate_percolation();
    step = data_history.length - 1;
    play();
}

