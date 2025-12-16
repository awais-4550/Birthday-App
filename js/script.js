// Falling Leaves Animation
function createLeaf() {
    const leaf = document.createElement('div');
    leaf.innerText = Math.random() > 0.5 ? '🍁' : '🍂';
    leaf.classList.add('leaf');
    leaf.style.left = Math.random() * 100 + 'vw';
    leaf.style.animationDuration = Math.random() * 5 + 5 + 's'; // 5-10s
    leaf.style.fontSize = Math.random() * 20 + 20 + 'px'; // 20-40px
    document.body.appendChild(leaf);

    setTimeout(() => {
        leaf.remove();
    }, 10000); // Remove after animation
}

setInterval(createLeaf, 300); // Create a leaf every 300ms

var url_string = window.location.href; //window.location.href
var url = new URL(url_string);
var c = url.searchParams.get("name");
console.log(c);
if (c != null) {
    document.getElementById("name").innerHTML = c;
    document.getElementById("nae").innerHTML = c;
}
$(".main").fadeOut(1);
let canBlow = false;

$('#play').click(function () {
    $(".loader").fadeOut(1500);
    $(".main").fadeIn("slow");
    // Removed sf.destroy() as snowflakes are removed
    // Removed balloon-border animation
    var audio = $('.song')[0];
    audio.play();

    // Initialize microphone immediately on user gesture
    initMicrophone();

    // Enable blow detection after 8 seconds
    setTimeout(function () {
        $('#next-screen-btn').text("Blow the candles now! 🎂").removeClass('hidden').fadeIn();
        canBlow = true;
    }, 8000);
});

const quotes = [
    { text: "There is no charm equal to tenderness of heart.", author: "Jane Austen" },
    { text: "The person, be it gentleman or lady, who has not pleasure in a good novel, must be intolerably stupid.", author: "Northanger Abbey" },
    { text: "I declare after all there is no enjoyment like reading!", author: "Pride and Prejudice" },
    { text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.", author: "Pride and Prejudice" },
    { text: "My heart is, and always will be, yours.", author: "Sense and Sensibility" }
];

let quoteIndex = 0;
let audioContext;
let microphone;
let analyser;
let javascriptNode;

function initMicrophone() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(function (stream) {
            audioContext = new AudioContext(); // Created on user interaction (Start button)
            analyser = audioContext.createAnalyser();
            microphone = audioContext.createMediaStreamSource(stream);
            javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;

            microphone.connect(analyser);
            analyser.connect(javascriptNode);
            javascriptNode.connect(audioContext.destination);

            javascriptNode.onaudioprocess = function () {
                if (!canBlow) return; // Wait for the right moment

                var array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                var values = 0;
                var length = array.length;
                for (var i = 0; i < length; i++) {
                    values += (array[i]);
                }
                var average = values / length;

                if (average > 40) {
                    transitionToFinalScreen();
                }
            }
        })
        .catch(function (err) {
            console.log("Mic error: " + err);
            $('#next-screen-btn').text("Click here to proceed (Mic denied)");
        });
}

// Fallback click handler
$('#next-screen-btn').click(function () {
    transitionToFinalScreen();
});

function transitionToFinalScreen() {
    canBlow = false; // Stop listening
    if (audioContext) {
        // audioContext.close(); // Optional: keep it or close it. Closing is cleaner.
        // audioContext = null;
    }

    // Switch Music Tracks
    var audio1 = $('.song')[0];
    var audio2 = $('.song2')[0];

    // Stop the first song (Birthday music)
    audio1.pause();
    audio1.currentTime = 0;

    // Start the second song (Taylor Swift)
    audio2.play().catch(e => console.log("Audio2 play error:", e));

    $('#next-screen-btn').fadeOut();
    $('.main').fadeOut("slow", function () {
        $('#final-screen').removeClass('hidden').addClass('visible');
        startQuoteRotation();
    });
}

function startQuoteRotation() {
    setInterval(() => {
        quoteIndex = (quoteIndex + 1) % quotes.length;
        $('#quote-text').fadeOut(500, function () {
            $(this).text('"' + quotes[quoteIndex].text + '"').fadeIn(500);
        });
        $('#quote-author').fadeOut(500, function () {
            $(this).text("- " + quotes[quoteIndex].author).fadeIn(500);
        });
    }, 5000);
    startMusicPlayerUI(); // Call the music player UI function
}

// Heart Animation Logic
$('#letter-btn').click(function () {
    $('#final-screen').fadeOut(500, function () {
        $('#heart-canvas').removeClass('hidden');
        initHeartAnimation();
    });
});

$('#quiz-btn').click(function() {
    $('#message-screen').removeClass('visible').addClass('hidden'); // Or fadeOut
    $('#message-screen').fadeOut(500, function() {
        $('#quiz-screen').removeClass('hidden').addClass('visible');
    });
});

$('#submit-quiz-btn').click(function() {
    // Optional: Check if all questions are answered?
    // For now, just proceed for the smooth experience
    $('#quiz-screen').removeClass('visible').fadeOut(500, function() {
       $('#quiz-screen').addClass('hidden');
       $('#closing-screen').removeClass('hidden').addClass('visible');
    });
});


function initHeartAnimation() {
    const canvas = document.getElementById('heart-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 4000; // Increased for dense fill

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            targetX: 0,
            targetY: 0,
            size: Math.random() * 2 + 1,
            color: '#800000', // Maroon
            speed: Math.random() * 0.05 + 0.02
        });
    }

    let animationId;
    let time = 0;

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Trails
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = Math.min(canvas.width, canvas.height) / 35; // Scale heart to fit

        particles.forEach(p => {
            if (!p.t) p.t = Math.random() * Math.PI * 2;

            // Equation
            const hx = 16 * Math.pow(Math.sin(p.t), 3);
            const hy = -(13 * Math.cos(p.t) - 5 * Math.cos(2 * p.t) - 2 * Math.cos(3 * p.t) - Math.cos(4 * p.t));

            // Fill logic: Random scale from 0 to 1
            // Power of 0.3 pushes points slightly outwards to ensure edges are defined but center is filled
            const spread = Math.pow(Math.random(), 0.3);

            p.targetX = centerX + hx * scale * spread;
            p.targetY = centerY + hy * scale * spread;

            p.x += (p.targetX - p.x) * p.speed;
            p.y += (p.targetY - p.y) * p.speed;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });

        time++;
        // Stop after 6 seconds approx
        if (time < 360) {
            animationId = requestAnimationFrame(animate);
        } else {
            setTimeout(() => {
                $('#heart-canvas').fadeOut(1000);
                $('#message-screen').removeClass('hidden').addClass('visible');
            }, 1000);
        }
    }

    animate();
}

const songs = ["Enchanted", "Love Story", "Wildest Dreams", "Cardigan", "Lover"];
let songIndex = 0;

function startMusicPlayerUI() {
    setInterval(() => {
        songIndex = (songIndex + 1) % songs.length;
        $('#song-title').fadeOut(500, function () {
            $(this).text(songs[songIndex]).fadeIn(500);
        });
    }, 20000); // Change song title every 20 seconds (simulated)
}
var typed = new Typed("#typed", {
    stringsElement: '#typed-strings',
    typeSpeed: 30,
    backSpeed: 10,
    loop: true
});
var retina = window.devicePixelRatio,

    // Math shorthands
    PI = Math.PI,
    sqrt = Math.sqrt,
    round = Math.round,
    random = Math.random,
    cos = Math.cos,
    sin = Math.sin,

    // Local WindowAnimationTiming interface
    rAF = window.requestAnimationFrame,
    cAF = window.cancelAnimationFrame || window.cancelRequestAnimationFrame,
    _now = Date.now || function () {
        return new Date().getTime();
    };

// Local WindowAnimationTiming interface polyfill
(function (w) {
    /**
     * Fallback implementation.
     */
    var prev = _now();

    function fallback(fn) {
        var curr = _now();
        var ms = Math.max(0, 16 - (curr - prev));
        var req = setTimeout(fn, ms);
        prev = curr;
        return req;
    }

    /**
     * Cancel.
     */
    var cancel = w.cancelAnimationFrame ||
        w.webkitCancelAnimationFrame ||
        w.clearTimeout;

    rAF = w.requestAnimationFrame ||
        w.webkitRequestAnimationFrame ||
        fallback;

    cAF = function (id) {
        cancel.call(w, id);
    };
}(window));

document.addEventListener("DOMContentLoaded", function () {
    var speed = 50,
        duration = (1.0 / speed),
        confettiRibbonCount = 10,
        ribbonPaperCount = 15,
        ribbonPaperDist = 8.0,
        ribbonPaperThick = 8.0,
        confettiPaperCount = 10,
        DEG_TO_RAD = PI / 180,
        RAD_TO_DEG = 180 / PI,
        colors = [
            ["#df0049", "#660671"],
            ["#00e857", "#005291"],
            ["#2bebbc", "#05798a"],
            ["#ffd200", "#b06c00"]
        ];

    function Vector2(_x, _y) {
        this.x = _x, this.y = _y;
        this.Length = function () {
            return sqrt(this.SqrLength());
        }
        this.SqrLength = function () {
            return this.x * this.x + this.y * this.y;
        }
        this.Add = function (_vec) {
            this.x += _vec.x;
            this.y += _vec.y;
        }
        this.Sub = function (_vec) {
            this.x -= _vec.x;
            this.y -= _vec.y;
        }
        this.Div = function (_f) {
            this.x /= _f;
            this.y /= _f;
        }
        this.Mul = function (_f) {
            this.x *= _f;
            this.y *= _f;
        }
        this.Normalize = function () {
            var sqrLen = this.SqrLength();
            if (sqrLen != 0) {
                var factor = 1.0 / sqrt(sqrLen);
                this.x *= factor;
                this.y *= factor;
            }
        }
        this.Normalized = function () {
            var sqrLen = this.SqrLength();
            if (sqrLen != 0) {
                var factor = 1.0 / sqrt(sqrLen);
                return new Vector2(this.x * factor, this.y * factor);
            }
            return new Vector2(0, 0);
        }
    }
    Vector2.Lerp = function (_vec0, _vec1, _t) {
        return new Vector2((_vec1.x - _vec0.x) * _t + _vec0.x, (_vec1.y - _vec0.y) * _t + _vec0.y);
    }
    Vector2.Distance = function (_vec0, _vec1) {
        return sqrt(Vector2.SqrDistance(_vec0, _vec1));
    }
    Vector2.SqrDistance = function (_vec0, _vec1) {
        var x = _vec0.x - _vec1.x;
        var y = _vec0.y - _vec1.y;
        return (x * x + y * y + z * z);
    }
    Vector2.Scale = function (_vec0, _vec1) {
        return new Vector2(_vec0.x * _vec1.x, _vec0.y * _vec1.y);
    }
    Vector2.Min = function (_vec0, _vec1) {
        return new Vector2(Math.min(_vec0.x, _vec1.x), Math.min(_vec0.y, _vec1.y));
    }
    Vector2.Max = function (_vec0, _vec1) {
        return new Vector2(Math.max(_vec0.x, _vec1.x), Math.max(_vec0.y, _vec1.y));
    }
    Vector2.ClampMagnitude = function (_vec0, _len) {
        var vecNorm = _vec0.Normalized;
        return new Vector2(vecNorm.x * _len, vecNorm.y * _len);
    }
    Vector2.Sub = function (_vec0, _vec1) {
        return new Vector2(_vec0.x - _vec1.x, _vec0.y - _vec1.y, _vec0.z - _vec1.z);
    }

    function EulerMass(_x, _y, _mass, _drag) {
        this.position = new Vector2(_x, _y);
        this.mass = _mass;
        this.drag = _drag;
        this.force = new Vector2(0, 0);
        this.velocity = new Vector2(0, 0);
        this.AddForce = function (_f) {
            this.force.Add(_f);
        }
        this.Integrate = function (_dt) {
            var acc = this.CurrentForce(this.position);
            acc.Div(this.mass);
            var posDelta = new Vector2(this.velocity.x, this.velocity.y);
            posDelta.Mul(_dt);
            this.position.Add(posDelta);
            acc.Mul(_dt);
            this.velocity.Add(acc);
            this.force = new Vector2(0, 0);
        }
        this.CurrentForce = function (_pos, _vel) {
            var totalForce = new Vector2(this.force.x, this.force.y);
            var speed = this.velocity.Length();
            var dragVel = new Vector2(this.velocity.x, this.velocity.y);
            dragVel.Mul(this.drag * this.mass * speed);
            totalForce.Sub(dragVel);
            return totalForce;
        }
    }

    function ConfettiPaper(_x, _y) {
        this.pos = new Vector2(_x, _y);
        this.rotationSpeed = (random() * 600 + 800);
        this.angle = DEG_TO_RAD * random() * 360;
        this.rotation = DEG_TO_RAD * random() * 360;
        this.cosA = 1.0;
        this.size = 5.0;
        this.oscillationSpeed = (random() * 1.5 + 0.5);
        this.xSpeed = 40.0;
        this.ySpeed = (random() * 60 + 50.0);
        this.corners = new Array();
        this.time = random();
        var ci = round(random() * (colors.length - 1));
        this.frontColor = colors[ci][0];
        this.backColor = colors[ci][1];
        for (var i = 0; i < 4; i++) {
            var dx = cos(this.angle + DEG_TO_RAD * (i * 90 + 45));
            var dy = sin(this.angle + DEG_TO_RAD * (i * 90 + 45));
            this.corners[i] = new Vector2(dx, dy);
        }
        this.Update = function (_dt) {
            this.time += _dt;
            this.rotation += this.rotationSpeed * _dt;
            this.cosA = cos(DEG_TO_RAD * this.rotation);
            this.pos.x += cos(this.time * this.oscillationSpeed) * this.xSpeed * _dt
            this.pos.y += this.ySpeed * _dt;
            if (this.pos.y > ConfettiPaper.bounds.y) {
                this.pos.x = random() * ConfettiPaper.bounds.x;
                this.pos.y = 0;
            }
        }
        this.Draw = function (_g) {
            if (this.cosA > 0) {
                _g.fillStyle = this.frontColor;
            } else {
                _g.fillStyle = this.backColor;
            }
            _g.beginPath();
            _g.moveTo((this.pos.x + this.corners[0].x * this.size) * retina, (this.pos.y + this.corners[0].y * this.size * this.cosA) * retina);
            for (var i = 1; i < 4; i++) {
                _g.lineTo((this.pos.x + this.corners[i].x * this.size) * retina, (this.pos.y + this.corners[i].y * this.size * this.cosA) * retina);
            }
            _g.closePath();
            _g.fill();
        }
    }
    ConfettiPaper.bounds = new Vector2(0, 0);

    function ConfettiRibbon(_x, _y, _count, _dist, _thickness, _angle, _mass, _drag) {
        this.particleDist = _dist;
        this.particleCount = _count;
        this.particleMass = _mass;
        this.particleDrag = _drag;
        this.particles = new Array();
        var ci = round(random() * (colors.length - 1));
        this.frontColor = colors[ci][0];
        this.backColor = colors[ci][1];
        this.xOff = (cos(DEG_TO_RAD * _angle) * _thickness);
        this.yOff = (sin(DEG_TO_RAD * _angle) * _thickness);
        this.position = new Vector2(_x, _y);
        this.prevPosition = new Vector2(_x, _y);
        this.velocityInherit = (random() * 2 + 4);
        this.time = random() * 100;
        this.oscillationSpeed = (random() * 2 + 2);
        this.oscillationDistance = (random() * 40 + 40);
        this.ySpeed = (random() * 40 + 80);
        for (var i = 0; i < this.particleCount; i++) {
            this.particles[i] = new EulerMass(_x, _y - i * this.particleDist, this.particleMass, this.particleDrag);
        }
        this.Update = function (_dt) {
            var i = 0;
            this.time += _dt * this.oscillationSpeed;
            this.position.y += this.ySpeed * _dt;
            this.position.x += cos(this.time) * this.oscillationDistance * _dt;
            this.particles[0].position = this.position;
            var dX = this.prevPosition.x - this.position.x;
            var dY = this.prevPosition.y - this.position.y;
            var delta = sqrt(dX * dX + dY * dY);
            this.prevPosition = new Vector2(this.position.x, this.position.y);
            for (i = 1; i < this.particleCount; i++) {
                var dirP = Vector2.Sub(this.particles[i - 1].position, this.particles[i].position);
                dirP.Normalize();
                dirP.Mul((delta / _dt) * this.velocityInherit);
                this.particles[i].AddForce(dirP);
            }
            for (i = 1; i < this.particleCount; i++) {
                this.particles[i].Integrate(_dt);
            }
            for (i = 1; i < this.particleCount; i++) {
                var rp2 = new Vector2(this.particles[i].position.x, this.particles[i].position.y);
                rp2.Sub(this.particles[i - 1].position);
                rp2.Normalize();
                rp2.Mul(this.particleDist);
                rp2.Add(this.particles[i - 1].position);
                this.particles[i].position = rp2;
            }
            if (this.position.y > ConfettiRibbon.bounds.y + this.particleDist * this.particleCount) {
                this.Reset();
            }
        }
        this.Reset = function () {
            this.position.y = -random() * ConfettiRibbon.bounds.y;
            this.position.x = random() * ConfettiRibbon.bounds.x;
            this.prevPosition = new Vector2(this.position.x, this.position.y);
            this.velocityInherit = random() * 2 + 4;
            this.time = random() * 100;
            this.oscillationSpeed = random() * 2.0 + 1.5;
            this.oscillationDistance = (random() * 40 + 40);
            this.ySpeed = random() * 40 + 80;
            var ci = round(random() * (colors.length - 1));
            this.frontColor = colors[ci][0];
            this.backColor = colors[ci][1];
            this.particles = new Array();
            for (var i = 0; i < this.particleCount; i++) {
                this.particles[i] = new EulerMass(this.position.x, this.position.y - i * this.particleDist, this.particleMass, this.particleDrag);
            }
        };
        this.Draw = function (_g) {
            for (var i = 0; i < this.particleCount - 1; i++) {
                var p0 = new Vector2(this.particles[i].position.x + this.xOff, this.particles[i].position.y + this.yOff);
                var p1 = new Vector2(this.particles[i + 1].position.x + this.xOff, this.particles[i + 1].position.y + this.yOff);
                if (this.Side(this.particles[i].position.x, this.particles[i].position.y, this.particles[i + 1].position.x, this.particles[i + 1].position.y, p1.x, p1.y) < 0) {
                    _g.fillStyle = this.frontColor;
                    _g.strokeStyle = this.frontColor;
                } else {
                    _g.fillStyle = this.backColor;
                    _g.strokeStyle = this.backColor;
                }
                if (i == 0) {
                    _g.beginPath();
                    _g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina);
                    _g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina);
                    _g.lineTo(((this.particles[i + 1].position.x + p1.x) * 0.5) * retina, ((this.particles[i + 1].position.y + p1.y) * 0.5) * retina);
                    _g.closePath();
                    _g.stroke();
                    _g.fill();
                    _g.beginPath();
                    _g.moveTo(p1.x * retina, p1.y * retina);
                    _g.lineTo(p0.x * retina, p0.y * retina);
                    _g.lineTo(((this.particles[i + 1].position.x + p1.x) * 0.5) * retina, ((this.particles[i + 1].position.y + p1.y) * 0.5) * retina);
                    _g.closePath();
                    _g.stroke();
                    _g.fill();
                } else if (i == this.particleCount - 2) {
                    _g.beginPath();
                    _g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina);
                    _g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina);
                    _g.lineTo(((this.particles[i].position.x + p0.x) * 0.5) * retina, ((this.particles[i].position.y + p0.y) * 0.5) * retina);
                    _g.closePath();
                    _g.stroke();
                    _g.fill();
                    _g.beginPath();
                    _g.moveTo(p1.x * retina, p1.y * retina);
                    _g.lineTo(p0.x * retina, p0.y * retina);
                    _g.lineTo(((this.particles[i].position.x + p0.x) * 0.5) * retina, ((this.particles[i].position.y + p0.y) * 0.5) * retina);
                    _g.closePath();
                    _g.stroke();
                    _g.fill();
                } else {
                    _g.beginPath();
                    _g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina);
                    _g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina);
                    _g.lineTo(p1.x * retina, p1.y * retina);
                    _g.lineTo(p0.x * retina, p0.y * retina);
                    _g.closePath();
                    _g.stroke();
                    _g.fill();
                }
            }
        }
        this.Side = function (x1, y1, x2, y2, x3, y3) {
            return ((x1 - x2) * (y3 - y2) - (y1 - y2) * (x3 - x2));
        }
    }
    ConfettiRibbon.bounds = new Vector2(0, 0);
    confetti = {};
    confetti.Context = function (id) {
        var i = 0;
        var canvas = document.getElementById(id);
        var canvasParent = canvas.parentNode;
        var canvasWidth = canvasParent.offsetWidth;
        var canvasHeight = canvasParent.offsetHeight;
        canvas.width = canvasWidth * retina;
        canvas.height = canvasHeight * retina;
        var context = canvas.getContext('2d');
        var interval = null;
        var confettiRibbons = new Array();
        ConfettiRibbon.bounds = new Vector2(canvasWidth, canvasHeight);
        for (i = 0; i < confettiRibbonCount; i++) {
            confettiRibbons[i] = new ConfettiRibbon(random() * canvasWidth, -random() * canvasHeight * 2, ribbonPaperCount, ribbonPaperDist, ribbonPaperThick, 45, 1, 0.05);
        }
        var confettiPapers = new Array();
        ConfettiPaper.bounds = new Vector2(canvasWidth, canvasHeight);
        for (i = 0; i < confettiPaperCount; i++) {
            confettiPapers[i] = new ConfettiPaper(random() * canvasWidth, random() * canvasHeight);
        }
        this.resize = function () {
            canvasWidth = canvasParent.offsetWidth;
            canvasHeight = canvasParent.offsetHeight;
            canvas.width = canvasWidth * retina;
            canvas.height = canvasHeight * retina;
            ConfettiPaper.bounds = new Vector2(canvasWidth, canvasHeight);
            ConfettiRibbon.bounds = new Vector2(canvasWidth, canvasHeight);
        }
        this.start = function () {
            this.stop()
            var context = this;
            this.update();
        }
        this.stop = function () {
            cAF(this.interval);
        }
        this.update = function () {
            var i = 0;
            context.clearRect(0, 0, canvas.width, canvas.height);
            for (i = 0; i < confettiPaperCount; i++) {
                confettiPapers[i].Update(duration);
                confettiPapers[i].Draw(context);
            }
            for (i = 0; i < confettiRibbonCount; i++) {
                confettiRibbons[i].Update(duration);
                confettiRibbons[i].Draw(context);
            }
            this.interval = rAF(function () {
                confetti.update();
            });
        }
    };
    var confetti = new confetti.Context('confetti');
    confetti.start();
    window.addEventListener('resize', function (event) {
        confetti.resize();
    });
});