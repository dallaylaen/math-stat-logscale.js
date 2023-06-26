    /* Utility functions */

    function download(filename, content, ctype) {
        if (!ctype)
            ctype = 'application/octet-stream';
        // TODO also add charset=utf-8 unless binary

        // Shamelessly stolen from https://stackoverflow.com/a/30800715/280449
        const dataStr = 'data:'+ctype+','+encodeURIComponent( content );
        const aHref = window.document.createElement('a');
        aHref.setAttribute("href",     dataStr);
        aHref.setAttribute("download", filename);
        window.document.body.appendChild(aHref); // required for firefox
        aHref.click();
        aHref.remove();
    }

    function upload(done) {
        const inputFile = window.document.createElement('input');
        inputFile.setAttribute('type',   'file');
        inputFile.setAttribute('style',  'display: none');
        inputFile.oninput = function() {
            this.files[0].text().then( result => {
                inputFile.remove();
                done( result );
            });
        };
        window.document.body.appendChild(inputFile); // required for firefox
        inputFile.click();
    }

    function toggle(elem, visible) {
        if (typeof elem === 'string')
            elem = document.getElementById(elem);
        if (visible) {
            elem.classList.remove('hidden');
        } else {
            elem.classList.add('hidden');
        }
    }

    function num(val) {
        const x = Number.parseFloat(val);
        return Number.isNaN(x) ? undefined : x;
    }
