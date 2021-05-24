
let startButton = document.querySelector('#start button');

let block = document.getElementById("block");
let hole = document.getElementById("hole");
let character = document.getElementById("circle");
let jumping = 0;
let counter = 0;

hole.addEventListener("animationiteration", () => {
    let random = Math.random() * 3;
    let top = (random*100)+150;
    hole.style.top = -(top) + "px";
    counter++;
});


function openCvReady() {
    cv['onRuntimeInitialized'] = () => {
        startButton.onclick = function() {
            startButton.style.display = "none";

            let video = document.getElementById("cam_input"); // video is the id of video tag
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then(function (stream) {
                    video.srcObject = stream;
                    video.play();
                })
                .catch(function (err) {
                    console.log("An error occurred! " + err);
                });
            let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
            let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
            let gray = new cv.Mat();
            let cap = new cv.VideoCapture(cam_input);
            let faces = new cv.RectVector();
            let classifier = new cv.CascadeClassifier();
            let utils = new Utils('errorMessage');
            let faceCascadeFile = 'haarcascade_frontalface_default.xml'; // path to xml
            utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
                classifier.load(faceCascadeFile); // in the callback, load the cascade from file 
            });
            const FPS = 500;
            function processVideo() {
                cap.read(src);
                src.copyTo(dst);
                cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
                try {
                    classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
                } catch (err) {
                    console.log(err);
                }
    
                for (let i = 0; i < faces.size(); ++i) {
                    
                    let face = faces.get(i);
                    let posXcircle = face.x + face.width/2;
                    let posYcircle = face.y + face.height/2;
                    circle.style.left = posXcircle + 'px';
                    circle.style.top = posYcircle + 'px';
                
                }
                cv.imshow("canvas_output", dst);
                // schedule next one.
                setTimeout(processVideo, 0);
            }
            // schedule first one.
            setTimeout(processVideo, 0);

            setInterval(function() {
                let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
                let characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
                let blockleft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
                let holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));
                let cTop = -(500 - characterTop);
            
                if((characterTop > 480) || 
                (((characterLeft - 20 > blockleft) && (characterLeft < blockleft + 60)) && 
                ((cTop < holeTop) || (cTop > holeTop + 130)))) {
                    alert("Game over. Score: " + counter);
                    character.style.top = 100 + "px";
                    counter = 0;
                }
            }, 1);
        }
    };
}