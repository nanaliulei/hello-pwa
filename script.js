function show_activaton_type(type) {
    console.log("activation with type of " + type);
    let el = document.getElementById(type);
    if (!el)
        return;

    el.style.display = 'block';
}

function activate_navigate() {
    show_activaton_type("launch");
}

function activate_shared(searchParams) {
    show_activaton_type("share");
    const title = searchParams.get("title");
    const text = searchParams.get("text");
    const url = searchParams.get("url");
    document.getElementById("shared_from").innerHTML += "Title: " + title + "<br>";
    text ? document.getElementById("shared_from").innerHTML += "Text: " + text + "<br>": text;
    url ? document.getElementById("shared_from").innerHTML += "Url: " + url + "<br>" : url;
}

document.addEventListener('DOMContentLoaded', ()=> {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
        .then ((reg) => {
            console.log('service worker is registered successfully, ' + location.href);
        }).catch((e) => {
            console.log('service worker registration failed');
        });
    }

    // document.getElementsByClassName('shared')[0].style.visibility =   'hidden';
    // document.getElementsByClassName('filetype')[0].style.visibility = 'hidden';

    // Web Apps start from start_url from the manifest, which is a hint to
    // check whether it is a Web Apps activation or browser navigation.
    if (location.search.length == 0) {
        show_activaton_type("browser");
        return;
    }

    var searchParams = new URLSearchParams(location.search);
    if (location.search.length == 1) {
        const launch_type = searchParams.get("utm_source");
        if (launch_type == "app") {
            show_activaton_type("launch");
            return;
        }
    }

    const activation_type = searchParams.get("activation");

    if (activation_type == "share") {
        activate_shared(searchParams);
    } else if (activation_type == "file") {
        activate_filehandler(searchParams).then((value) => {
            show_activaton_type("file");
            console.log('file handler: ' + value);
        })
    } else {
        show_activaton_type("browser");
    }
})
