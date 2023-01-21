window.addEventListener("resize", resizeCanvas, false);
        window.addEventListener("DOMContentLoaded", onLoad, false);
        
        window.requestAnimationFrame = 
            window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function (callback) {
                window.setTimeout(callback, 1000/60);
            };
        
        var canvas, ctx, w, h, particles = [], probability = 0.04,
            xPoint, yPoint;
        
        var text='';
       
        
        function onLoad() {
            canvas = document.getElementById("canvas");
            ctx = canvas.getContext("2d");
            resizeCanvas();

		audio.play();
		audio.volume=1;
            
            window.requestAnimationFrame(updateWorld);
        } 
        
        function resizeCanvas() {
            if (!!canvas) {
                w = canvas.width = window.innerWidth;
                h = canvas.height = window.innerHeight;
            }
        } 
        
        function updateWorld() {
            update();
            paint();
            window.requestAnimationFrame(updateWorld);
        } 
        
        function update() {
            if (particles.length < 500 && Math.random() < probability) {
                createFirework();
            }
            var alive = [];
            for (var i=0; i<particles.length; i++) {
                if (particles[i].move()) {
                    alive.push(particles[i]);
                }
            }
            particles = alive;
        } 
        
        function paint() {
		//ctx.font = "30px Comic Sans MS";
		//ctx.fillText("Chúc Mừng Năm Mới 2023", canvas.width/2, canvas.height/1.3);
		//ctx.fillText("", canvas.width/3, canvas.height/1.23);
		//ctx.fillText("", canvas.width/2, canvas.height/1.18);
		//ctx.fillText("", canvas.width/2, canvas.height/1.13);

		rectangledText(canvas.width/2,50,150,text,12,'30px Comic Sans MS');		

            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter';
            for (var i=0; i<particles.length; i++) {
                particles[i].draw(ctx);
            }
        } 

	

	function rectangledText(x,y,width,text,fontsize,fontface){

	  ctx.fillStyle = "white";

	  var height=wrapText(x,y,text,fontsize,fontface,width)

	  ctx.strokeRect(x,y,width,height);

	}

	function wrapText(x,y,text,fontsize,fontface,maxwidth){
	  var startingY=y;
	  var words = text.split(' ');
	  var line = '';
	  var space='';
	  var lineHeight = fontsize*1.286;
	  ctx.font = fontsize + "px " + fontface;
	  ctx.textAlign='left';
	  ctx.textBaseline='top'
	  for (var n=0; n<words.length; n++) {
	    var testLine = line + space + words[n];
	    space=' ';
	    if (ctx.measureText(testLine).width > maxwidth) {
	      ctx.fillText(line,x,y);
	      line = words[n] + ' ';
	      y += lineHeight;
	      space='';
	    } else {
      	line = testLine;
	    }
	  }
	  ctx.fillText(line, x,y);
	  return(y+lineHeight-startingY);
	}
	 
        
        function createFirework() {
            xPoint = Math.random()*(w-200)+100;
            yPoint = Math.random()*(h-200)+100;
            var nFire = Math.random()*50+100;
            var c = "rgb("+(~~(Math.random()*200+55))+","
                 +(~~(Math.random()*200+55))+","+(~~(Math.random()*200+55))+")";
            for (var i=0; i<nFire; i++) {
                var particle = new Particle();
                particle.color = c;
                var vy = Math.sqrt(25-particle.vx*particle.vx);
                if (Math.abs(particle.vy) > vy) {
                    particle.vy = particle.vy>0 ? vy: -vy;
                }
                particles.push(particle);
            }
        } 
        
        function Particle() {
            this.w = this.h = Math.random()*4+1;
            
            this.x = xPoint-this.w/2;
            this.y = yPoint-this.h/2;
            
            this.vx = (Math.random()-0.5)*10;
            this.vy = (Math.random()-0.5)*10;
            
            this.alpha = Math.random()*.5+.5;
            
            this.color;
        } 
        
        Particle.prototype = {
            gravity: 0.05,
            move: function () {
                this.x += this.vx;
                this.vy += this.gravity;
                this.y += this.vy;
                this.alpha -= 0.01;
                if (this.x <= -this.w || this.x >= screen.width ||
                    this.y >= screen.height ||
                    this.alpha <= 0) {
                        return false;
                }
                return true;
            },
            draw: function (c) {
                c.save();
                c.beginPath();
                
                c.translate(this.x+this.w/2, this.y+this.h/2);
                c.arc(0, 0, this.w, 0, Math.PI*2);
                c.fillStyle = this.color;
                c.globalAlpha = this.alpha;
                
                c.closePath();
                c.fill();
                c.restore();
            }
        }