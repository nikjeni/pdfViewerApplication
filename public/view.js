// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
// var url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
// var url;
// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

var pagesCount;
console.log(window.location.href);
if (window.location.href === 'http://localhost:3000/upload') {
    async function fetchData() {
        var pdfDoc = await fetch('/fetchpdf', { method: "POST" }).then((res) => res.arrayBuffer());
        var docs = await pdfjsLib.getDocument(pdfDoc);

        pages();
        async function pages() {
            // page count of the PDF
            pagesCount = await docs.promise;
            URL
            for (let i = 1; i <= pagesCount.numPages; i++) {
                // Appending div elements along with canvas tag dynamically
                var iDiv = document.createElement('div');
                iDiv.id = 'imageNo' + '' + i;
                iDiv.className = 'listitemClass';
                document.getElementById('imageListId').appendChild(iDiv);
                var innerDiv = document.createElement('canvas');
                innerDiv.id = 'the-canvas' + '-' + i;
                iDiv.appendChild(innerDiv);
            }

            for (let i = 1; i <= pagesCount.numPages; i++) {

                docs.promise.then(function (pdf) {

                    // Fetch the first page
                    var pageNumber = i;
                    pdf.getPage(pageNumber).then(function (page) {
                        console.log('Page loaded');

                        var scale = 0.5;
                        var viewport = page.getViewport({ scale: scale });

                        // Prepare canvas using PDF page dimensions
                        var canvas = document.getElementById(`the-canvas-${i}`);
                        var context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        // Render PDF page into canvas context
                        var renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        var renderTask = page.render(renderContext);
                        renderTask.promise.then(function () {
                            console.log('Page rendered');
                        });
                    });
                }, function (reason) {
                    // PDF loading error
                    console.error(reason);
                });
            }
        }

    }
    fetchData();
}



