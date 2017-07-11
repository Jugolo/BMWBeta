Retoosh.Guest = function(game){
  this.game = game;
};

Retoosh.Guest.prototype = {
  create : function(){
    var group = this.game.add.group();
    var self = this;
    SOCKET.on("room found", function(data){
      self.onRoomFound(data);
    });
    var background = this.game.add.sprite(0,0,"bguest");
    background.width = Retoosh.WIDTH;
    background.height = Retoosh.HEIGHT;
    group.add(background);
    this.input = this.game.add.inputField(15,270,{
      height : 30,
      width  : 380,
      font   : "23px CooperBlack"
    });
    this.input.startFocus();//set the input to be foces from start becuse it is the main goal of this site
    this.input.keyListener = function(evt){
      this.value = this.domElement.value;
      if (evt.keyCode === 13) {
          if (this.focusOutOnEnter) {
              this.endFocus();
          }

          if(this.value.trim()){
            USERNAME = "Guest*"+this.value;
            console.log(USERNAME);
            SOCKET.emit("room request", {name: USERNAME});
            return;
          }
      }
      this.updateText();
      this.updateCursor();
      this.updateSelection();
      evt.preventDefault();
    };
    group.add(this.input);
  },

  onRoomFound: function( data ){
    this.input.destroy();
    console.log("room found and guest nick is saved for now");
    game.state.start('Game', true, false, data);
  }
};
