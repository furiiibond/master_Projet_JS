    var nbpieces=10;
    var nave=navigator.userAgent.toLowerCase(); 
    if (nave.indexOf("firefox") > -1) nave="Firefox"; else nave="Firefox";
    var fenetre = document.getElementById('canvas'); 
    var hh=canvas.getContext('2d');
    hh.canvas.style.border="3px solid #000";
    hh.translate(0.5,0.5);
    var Xs,Ys;
    var Xd=10,Yd=10;
    var ct,xmin=Xd+30,xmax=xmin+6*a,ymin=Yd+30,ymax=ymin+6*a;
    trace();


// commandes ***********************
    function choixRaz(){
    }  
    
    function choixSave(){
    }
    
    function stop(){
    }

    function depart(bt1) {						
    }

    function deplace(bt1) {						
    }

        
//   ******************************************

    function drawLine(xi,yi,xf,yf){
        hh.beginPath();
        hh.moveTo(xi,yi);
        hh.lineTo(xf,yf);
        hh.stroke();} 
    
    function cadre3D(x,y,w,ha){
        hh.strokeStyle="rgb(130,130,133)";            
        drawLine(x,y+1,w-1,y+1);	drawLine(x,y,x,ha);
        drawLine(x+1,y,x+1,ha-1);   drawLine(x,y,w,y);
        hh.strokeStyle="rgb(230,230,230)";  		
        drawLine(x,ha,w,ha);	drawLine(w,y+1,w,ha);
        drawLine(x+1,ha-1,w,ha-1);	drawLine(w-1,y+2,w-1,ha);
    } 

    function affiche(){
	    // exemple d'affichage d'un texte dans la zone canvas
	        hh.fillStyle="red";
            hh.fillText("BIENVENU DANS VOTRE APPLICATION",210,100);
        // exemple d'un tracé d'un objet rectangulaire dans cette surface
            hh.fillStyle="yellow";       
	        hh.fillRect(160,140,100,44);
            hh.fillStyle="lime";       
	        hh.fillRect(160,190,100,44);
            hh.fillStyle="blue";       
	        hh.fillRect(160,240,100,44);

        }	


    function trace(){
        hh.font="bold 16px Arial";
        hh.textAlign="center";
        hh.fillStyle="silver";       
	    hh.fillRect(0,0,440,440);
        hh.fillStyle="black";
        hh.fillRect(Xd+20,Yd+20,370,370);
        hh.fillStyle="silver";
        hh.fillRect(xmin,ymin,350,350);
        hh.fillStyle="silver";	
	hh.fillRect(388,160,12,55);
        hh.fillStyle="red";	
	hh.fillText("out",400,190);
        hh.lineWidth=1; 
        cadre3D(20,20,420,420);
	affiche();
    } 

