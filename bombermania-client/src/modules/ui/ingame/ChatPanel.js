function ChatPanel( game, context ){
	Phaser.Group.call(this, game);

	this.x = Retoosh.HEIGHT;
	this.panel_padding_left = 37;
	this.panel_padding_top = 80;

	this.bg = new PhaserNineSlice.NineSlice(
        game,           // Phaser.Game
        0,            // x position
        0,            // y position
        'ingame',      // atlas key
        'interface/chat_panel',// Image frame
        Retoosh.WIDTH - Retoosh.HEIGHT,            // expected width
        Retoosh.HEIGHT,            // expected height
        { //And this is the framedata, normally this is passed when preloading. Check README for details
            top: 34,    // Amount of pixels for top
            bottom: 34, // Amount of pixels for bottom
            left: 101,   // Amount of pixels for left
            right: 101   // Amount of pixels for right
        }
	);
	this.add(this.bg);

	//this.bg = this.create(0, 0, 'ingame', "interface/chat_panel");

	//this.bg.width = Retoosh.WIDTH - Retoosh.HEIGHT;
	//this.bg.height = Retoosh.HEIGHT;
	this.bg.smoothed = false;

	game.physics.arcade.enable(this.bg);
	this.bg.body.immovable = true;

	var instruction_label = game.add.text(this.bg.width - 20, 5, "Press the spacebar to enter & Press 'C' to chat - v3", { font: "14px Arial", fill: "#FFFFFF" } );
	instruction_label.anchor.set(1, 0);
	this.add(instruction_label);

	this.previews = [];

	this.addPlayer = function( id, name, serial, frags ){
		var player_preview = new PlayerPreview(game, id, name, serial, frags, context.player_colors[serial] );
		this.previews.push(player_preview);
		this.add(player_preview);

		player_preview.x = this.panel_padding_left;
	}

	this.removePlayer = function( id ){
		var preview = this.getPreviewByID( id );
		if(preview){
			var index = this.previews.indexOf(preview);
			this.previews.splice(index, 1);
			preview.destroy();
		}
	}

	this.setName = function( player_id, name ){
		var preview = this.getPreviewByID( player_id );

		if( preview ) preview.setName( name );
	};

	this.setMessage = function( player_id, message ){
		var preview = this.getPreviewByID( player_id );

		if( preview ) preview.setMessage( message );
	};

	this.setFrags = function( player_id, frags_count ){
		var preview = this.getPreviewByID( player_id );

		if( preview ) preview.setFrags( frags_count );
	}

    this.setColor = function( player_id, color) {
        var preview = this.getPreviewByID( player_id );

        if( preview ) preview.setColor( color );
    }

	this.sortPreviews = function(){
		// calculate priority of each preview
		for( var p = 0; p < this.previews.length; p++ ){
			var preview = this.previews[p];
			preview.priority = preview.frags - (preview.serial) * 0.1;
		}

		// sort array of previews
		this.previews.sort(function(a, b){
			var x = a.priority; var y = b.priority;
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		});

		// change layout according to the preview priorities
		for( var p = 0; p < this.previews.length; p++ ){
			var preview = this.previews[p];
			preview.y = this.panel_padding_top + p * 110;
		}
	}

	game.add.existing(this);
}

ChatPanel.prototype = Object.create(Phaser.Group.prototype);
ChatPanel.prototype.getPreviewByID = function( id ){
	for( var i = 0; i < this.previews.length; i++ ){
		if(this.previews[i].id == id)
			return this.previews[i];
	}
}

function PlayerPreview( game, id, name, serial, frags, color ){
	Phaser.Group.call(this, game);

	this.id = id;
	this.name = name;
	this.serial = serial;
	this.color = color;
	this.frags = frags;

	var bm_body = this.create( 0, 0, 'ingame', "bomberman/body/000" );
	bm_body.width = 64;
	bm_body.scale.y = bm_body.scale.x;

	var bm_tint = this.create( 0, 0, 'ingame', "bomberman/tint/000" );
	bm_tint.width = bm_body.width;
	bm_tint.scale.y = bm_body.scale.y;
	bm_tint.tint = color;

	var font_style = {
		font: "bold 28px Arial",
		fill: "#FFFFFF"
	}

	var name_label = game.add.text(bm_body.width + 10, 0, name, font_style);
	this.add(name_label);

	font_style.fontWeight = "normal";
	font_style.fontSize = 16;
	var points_label = game.add.text(bm_body.width + 11, 30, "POINTS: 0", font_style);
	this.add(points_label);

	font_style.wordWrap = true;
	font_style.wordWrapWidth = Retoosh.WIDTH - Retoosh.HEIGHT - 60;
	var message_label = game.add.text(0, 56, "", font_style);
	this.add(message_label);

	this.setName = function( name ){
		name_label.text = name;
	}

	this.setMessage = function( message ){
		message_label.text = message;
	}

	this.setFrags = function( frags_count ){
		this.frags = frags_count;
		points_label.text = "POINTS: " + frags_count;
	}

    this.setColor = function( color ) {
        points_label.fill = color;
    }
}

PlayerPreview.prototype = Object.create(Phaser.Group.prototype);
