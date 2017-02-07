polarity.export = PolarityComponent.extend({
    extract: function(){

        if(typeof(this.get("block.data.details.body[2][0]")) == "undefined"){
            return "";
        }

        var e = this.get("block.data.details.body[2][0]");
        var shortentedText = e.match(/^.{1,340}[^\.]*/)+".";

        return shortentedText;
    }.property("block.data.details.extract")
});
