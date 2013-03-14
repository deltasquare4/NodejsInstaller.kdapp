# Main View
class Nodejs.Views.Main extends KDView

  constructor:(options, data)->

    super

    @install = new Nodejs.Views.Install
      cssClass : "nodejs-view-install"

    @console = new KDScrollView
      tagName  : "pre"
      cssClass : "terminal-screen"

  viewAppended:->
    
    super
    
    @addSubView header = new KDHeaderView type : "big", title : "Install/Activate Node.js Versions"
    @addSubView @install
    @addSubView @console
