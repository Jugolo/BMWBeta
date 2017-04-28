function LoginContent( game, content_width, content_height ){
	Phaser.Group.call(this, game);

	var font_style = { font: "28px CooperBlack", fill: "#FFFFFF" };

	var login_lbl = game.add.text(0, 0, "User Name", font_style);
	login_lbl.x = ( content_width - login_lbl.width ) * 0.5;
	login_lbl.y = content_height * 0.1;
	this.add(login_lbl);

	var login_tf = game.add.inputField(10, 90, {
	    font: '23px CooperBlack',
	    fill: '#FFFFFF',
		backgroundColor: "#575957",
		cursorColor: "#FFFFFF",
	    width: content_width * 0.65,
	    padding: 9,
		borderWidth: 0,
		borderColor: "#575957",
	    borderRadius: 100
	});
	login_tf.x = ( content_width - login_tf.width ) * 0.5;
	login_tf.y = login_lbl.y + content_height * 0.07;
	this.add(login_tf);

	var password_lbl = game.add.text(0, 0, "Password", font_style);
	password_lbl.x = ( content_width - password_lbl.width ) * 0.5;
	password_lbl.y = content_height * 0.30;
	this.add(password_lbl);

	var password_tf = game.add.inputField(10, 90, {
	    font: '23px CooperBlack',
	    fill: '#FFFFFF',
		backgroundColor: "#575957",
		cursorColor: "#FFFFFF",
	    width: content_width * 0.65,
	    padding: 9,
		borderWidth: 0,
		borderColor: "#575957",
	    borderRadius: 100,
		type: PhaserInput.InputType.password
	});
	password_tf.x = ( content_width - password_tf.width ) * 0.5;
	password_tf.y = password_lbl.y + content_height * 0.07;
	this.add(password_tf);

	var signin_button = new UIButton( game, 140, 45, 0x7CC576, "LOG IN");
	signin_button.x = ( content_width - signin_button.width ) * 0.5;
	signin_button.y = content_height * 0.54;
	this.add(signin_button);
	var _this = this;

    var font_style = { font: "23px", fill: "#FFFFFF" };
    var result_lbl = game.add.text(0, 0, "", font_style);
    result_lbl.x = ( content_width - result_lbl.width ) * 0.5;
    result_lbl.y = content_height * 0.7;
    this.add(result_lbl);

    SOCKET.on('login result', function(data) {
        var json = JSON.parse(data);
        //console.log("login result:", json['status']);
        if (json['status'] == 0) {
            result_lbl.text = "The current account is invalid.";
            result_lbl.x = ( content_width - result_lbl.width ) * 0.5;
        } else if(json['status'] == 1) {
            var nickname = json['nickname'];
            window.sessionStorage["nickname"] = nickname;
            SOCKET.emit("room request", {name: nickname});
            //result_lbl.text = json['nickname'];
            //result_lbl.x = ( content_width - result_lbl.width ) * 0.5;
        } else if(json['status'] == 2) {
            result_lbl.text = "Your account wasn't still allowed.";
            result_lbl.x = ( content_width - result_lbl.width ) * 0.5;
        } else if(json['status'] == 3) {
            result_lbl.text = "The current password is invalid.\n           Please input again.";
            result_lbl.x = ( content_width - result_lbl.width ) * 0.5;
        }
        
    });

	signin_button.onPress = function(){
        if (login_tf.value == "") {
            login_tf.startFocus();
            result_lbl.text = "Please input user name.";
            result_lbl.x = ( content_width - result_lbl.width ) * 0.5;
            return;
        } else if(password_tf.value == "") {
            password_tf.startFocus();
            result_lbl.text = "Please input password.";
            result_lbl.x = ( content_width - result_lbl.width ) * 0.5;
            return;
        }
        
        SOCKET.emit("web login", {status:'client_login', name: login_tf.value, pwd:password_tf.value});
        
	}
    
    game.input.keyboard.addCallbacks(this, null, function(data) {
        if (data.keyCode == 9 || data.keyCode == 13) {
            if(login_tf.focus) {
                if (login_tf.value != "") {
                    login_tf.endFocus();
                    password_tf.startFocus();    
                }
            } else {
                if (login_tf.value == "") {
                    login_tf.startFocus();
                    result_lbl.text = "Please input user name.";
                    result_lbl.x = ( content_width - result_lbl.width ) * 0.5;
                    return;
                } else if(password_tf.value == "") {
                    password_tf.startFocus();
                    result_lbl.text = "Please input password.";
                    result_lbl.x = ( content_width - result_lbl.width ) * 0.5;
                    return;
                }
                
                SOCKET.emit("web login", {status:'client_login', name: login_tf.value, pwd:password_tf.value});
            }
        }
    }, null);
    
	// var or_lbl = game.add.text(0, 0, "OR", font_style);
	// or_lbl.x = ( content_width - or_lbl.width ) * 0.5;
	// or_lbl.y = content_height * 0.7;
	// this.add(or_lbl);
	//
	// var facebook_button = new UIButton( game, 320, 45, 0x0072BC, "SIGN IN VIA FACEBOOK");
	// facebook_button.x = ( content_width - facebook_button.width ) * 0.5;
	// facebook_button.y = content_height * 0.83;
	// this.add(facebook_button);
	//
	var context = this;
	// facebook_button.onPress = function(){
	// 	webAuth.popup.authorize({
	// 		connection: 'facebook',
	// 		responseType: 'token'
	// 	},
	//
	// 	function(error, result){
	// 		if(error){
	// 			console.log(error);
	// 		}
	// 		else{
	// 			console.log(result);
	//
	// 			var xmlHttp = new XMLHttpRequest();
	// 		    xmlHttp.onreadystatechange = function() {
	// 		        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
	// 					context.onFacebookLogin( JSON.parse(xmlHttp.responseText) );
	// 		    }
	// 		    xmlHttp.open("GET", "https://flint0.auth0.com/userinfo", true); // true for asynchronous
	// 			xmlHttp.setRequestHeader("Authorization", "Bearer "+result.accessToken)
	// 		    xmlHttp.send(null);
	// 		}
	// 	});
	// }

	// this.onFacebookLogin = function( user_data ){};
	this.onRegularLogin = function( user_data ) {
    };
}

LoginContent.prototype = Object.create(Phaser.Group.prototype);
