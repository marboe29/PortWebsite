    //Ball object
    
    const canvas = document.getElementById("canvasOne");
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight /2;
    
    const grad = ctx.createLinearGradient(0,0,0,canvas.height);
    grad.addColorStop(0,"#341b2b");
    grad.addColorStop(0.5,"#70676F");

    let noOfBalls = 100;
    const ballsArray = [];

    class Ball {

        constructor(){
        
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = (Math.random() * 5);
        this.speedX = (Math.random() * 1 - 0.5);
        this.speedY =  (Math.random() * 1 - 0.5);
        }

        draw(){
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        }

        update(){
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.speedY = -this.speedY;
            }

            this.draw();
        }

    }

    function init(){

        for(let i = 0; i < noOfBalls; i++){
            ballsArray.push(new Ball());
        }
    }

    function animate(){

        ctx.clearRect(0,0,canvas.width,canvas.height);

        for(let i = 0; i < ballsArray.length; i++){
            ballsArray[i].update();
        }

        requestAnimationFrame(animate);

    }

    init();
    animate();

    window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    })
    