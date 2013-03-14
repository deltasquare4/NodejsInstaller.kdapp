app = null

do ->
  try
    appView.addSubView app = new Nodejs.Views.Main
      cssClass  : "nodejs-installer"

  catch error
    new KDNotificationView
      title: error
