
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

function typed_text(text, k) {
    console.log(text, k);
    if (k >= text.length) {
        return text;
    }
    let text_no_br = text.replaceAll('<br>', '%');
    let part1 = text_no_br.slice(0, k);
    let part2 = text_no_br.slice(k);
    let resp = part1 +
            '<span class="hidden">' +
            part2 +
            '</span>';
    console.log(text_no_br);
    console.log(resp);
    // console.log(part1, '#', part2);
    return resp.replaceAll('%', '<br>');
}

function type_step() {

    let typed_elems = document.getElementsByClassName('typed');

    for (let i = 0; i < typed_elems.length; i++) {
        let elem = typed_elems[i];
        if (has_class(elem, window.step_classes[window.cur_lvl])) {
            elem.innerHTML = typed_text(window.textes[elem.id], window.cur_len);
        }
    }

    if (window.cur_len == 0) {
        let r = document.querySelector(':root');
        r.style.setProperty('--visible', 'visible');
    }

    window.cur_len++;
}

window.step_speed = [0.14, 0.1, 0.02, 0.01];

// may be list of class on each
window.step_classes = [
    ["title"],
    ["project_title_link"],
    ["views_cnt"],
    ["description", "last_line"]
];

window.max_lvl = 4;

// element.classList.contains(class);
function has_class(element, class_list) {
    for (const class_nm of class_list) {
        if (element.classList.contains(class_nm)) {
            return true;
        }
    }
    return false;
}

var step_pause = 0.08;

function try_step() {
    let t = Date.now();
    let dt = t - window.last_step_t;
    if (dt > 1000 * step_pause) {
        window.last_step_t = t;
        if (window.cur_len <= window.max_len) {
            step_pause = Math.random() * window.step_speed[window.cur_lvl] + 0.02;
            type_step();
        }
    }
    console.log(window.cur_len, window.max_len);
    if (window.cur_len <= window.max_len) {
        console.log("REQ ANIM FRAME!!");
        requestAnimationFrame(try_step);
    } else {
        window.cur_lvl++;
        if (window.cur_lvl < window.max_lvl) {
            start_type_lvl(window.cur_lvl);
        }
    }
}

window.textes = {};

function start_type_lvl(lvl=0) {
    try {
        let cur_id = 0;
        window.cur_lvl = lvl;

        window.cur_len = 0;
        window.max_len = 0;
        window.last_step_t = Date.now();

        let typed_elems = document.getElementsByClassName('typed');
        for (let i = 0; i < typed_elems.length; i++) {
            let elem = typed_elems[i];
            console.log(window.step_classes[window.cur_lvl]);
            console.log(elem.classList);

            if (lvl == 0) {
                elem.id = 'typed_' + cur_id;
                cur_id++;

                console.log(elem.id);
                console.log(elem.innerHTML);

                window.textes[elem.id] = elem.innerHTML;

                console.log(elem.innerHTML);

                console.log(typed_text(window.textes[elem.id], 0));
                elem.innerHTML = typed_text(window.textes[elem.id], 0);
            }

            if (has_class(elem, window.step_classes[window.cur_lvl])) {
                let cur_len = window.textes[elem.id].length;
                if (cur_len > window.max_len) {
                    console.log("maxlen:", cur_len, elem.innerHTML);
                    window.max_len = cur_len;
                }
            }

        }
        requestAnimationFrame(try_step);
    } catch(err) {
        console.log(err.message);
        console.log(err.stack);
    }
}

// async function onstart() {
//     try {
//         let cur_id = 0;
//         window.textes = {};
//         window.cur_lvl = 0;

//         window.cur_len = 0;
//         window.max_len = 0;
//         window.last_step_t = Date.now();

//         let typed_elems = document.getElementsByClassName('typed');
//         for (let i = 0; i < typed_elems.length; i++) {
//             let elem = typed_elems[i];
//             console.log(elem.innerHTML);
//             elem.id = 'typed_' + cur_id;
//             cur_id++
//             window.textes[elem.id] = elem.innerHTML;
//             if (elem.innerHTML.length > window.max_len) {
//                 window.max_len = elem.innerHTML.length;
//             }
//         }
//         requestAnimationFrame(try_step);
//     } catch(err) {
//         console.log(err.message);
//         console.log(err.stack);
//     }
// }

start_type_lvl();
