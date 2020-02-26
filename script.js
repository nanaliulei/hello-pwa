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
            console.log('service worker is registered successfully,' + location.href); 
        }).catch((e) => { 
            console.log('service worker registration failed'); 
        }); 
    }

    // document.getElementsByClassName('shared')[0].style.visibility = 'hidden';
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
        if (launch_type != "app") {
            show_activaton_type("browser");
            return;
        }
    }

    activation_type = searchParams.get("activation");
    if (activation_type == "sharedtarget") {
        activate_shared(searchParams);
    } else {
        activate_filehandler(searchParams).then((file_activate) => {
            if (!file_activate) {
                show_activaton_type("launch");
            }
        })
    }
})

// var global_images = [
//     "images/48d2dd553a5439471a4fb69646eec530ef67b3e8.png",
//     "images/3c57d1db08b92f11a11bc0d4efc86cc8f4cbdbb4.png",
//     "images/4d42396538e42737cd645596762291f2f32f8d83.png",
//     "images/4e4890e3a88cd8321c3c00ab4b75a9e28c0e606f.png",
//     "images/7399df245b73a9501e894e7ee4f6a5dd525340ba.png",
//     "images/96a3b7e63f3f285355ae0403cd41afadbf593633.png",
//     "images/98c37ebe646f725b4d27876f237113ef9acfc940.png",
//     "images/9e1cb03b8302945c8215ef701e185ea47c29d642.png",
//     "images/9ffc233c7a730414475ece1ad8edbea4bc35a5df.png",
//     "images/ac59d84710a164cd31611a4b15ff0b439a980ff5.png",
//     "images/c526266504939bae7c907a3e0d1d2222f207e273.png",
//     "images/e2320cc098a376354c995e41c4785ca9ecc007d4.png",
//     "images/e573740b08597927ae2b9c85bcdcbcac346a2324.png",
//     "images/c953f9b7762b3f88147bcb1d30b6fca0d78a9f0d.png",
// ]

